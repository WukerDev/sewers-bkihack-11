<template>
  <v-container fluid class="aero-main-container pa-4 d-flex flex-column">
    <v-row class="flex-grow-0 mb-4 px-2 justify-space-between">
      <v-col
        v-for="(value, key, index) in config.metricsConfig"
        :key="index"
        cols="12"
        sm="4"
        md="2"
      >
        <v-card class="aero-stat-card">
          <div class="aero-glass-shine"></div>
          <div class="pa-3 text-center relative-content">
            <div class="aero-label">{{ value.label }}</div>
            <div class="text-headline-large font-weight-black aero-text-blue">
              {{ config.metrics[key as keyof typeof config.metrics] }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="flex-grow-1 overflow-hidden">
      <v-col cols="12" md="8" class="h-100 d-flex flex-column">
        <v-card class="aero-window-frame flex-grow-1 d-flex flex-column">
          <div class="aero-window-header">
            <v-icon size="small" color="primary" class="mr-2"
              >mdi-map-search</v-icon
            >
            <span>Mapa Klastrów Obliczeniowych (Polska)</span>
            <v-spacer></v-spacer>
            <div class="window-controls">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div id="osm-map" class="map-viewport flex-grow-1"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="h-100 d-flex flex-column">
        <v-card class="aero-window-frame flex-grow-1 d-flex flex-column">
          <div class="aero-window-header">
            <v-icon size="small" color="primary" class="mr-2"
              >mdi-format-list-bulleted-type</v-icon
            >
            <span>Katalog Dostawców</span>
          </div>

          <div class="flex-grow-1 overflow-y-auto pa-3 aero-list-bg">
            <div
              v-for="cluster in config.clusters"
              :key="cluster.id"
              class="mb-3"
            >
              <div
                class="aero-tree-node"
                :class="{
                  'aero-node-active': store.openedClusterId === cluster.id,
                }"
                @click="handleClusterClick(cluster.id)"
              >
                <v-icon
                  size="18"
                  class="mr-1 transition-transform"
                  :style="{
                    transform:
                      store.openedClusterId === cluster.id
                        ? 'rotate(90deg)'
                        : 'rotate(0deg)',
                  }"
                  >mdi-play</v-icon
                >
                <div
                  :class="getStatusStyle(cluster.status).dot"
                  class="mr-2"
                ></div>
                <span class="font-weight-bold">{{ cluster.name }}</span>
                <v-spacer></v-spacer>
                <span class="text-caption opacity-70"
                  >{{ cluster.companies.length }} węzłów</span
                >
              </div>

              <v-expand-transition>
                <div
                  v-if="store.openedClusterId === cluster.id"
                  class="aero-sub-list"
                >
                  <div
                    v-for="company in cluster.companies"
                    :key="company.id"
                    class="aero-sub-item"
                    :class="{
                      'aero-item-selected':
                        store.selectedCompanyId === company.id,
                    }"
                    @click="store.selectCompany(company.id)"
                  >
                    <div
                      :class="getStatusStyle(company.status).dot"
                      class="mr-3 scale-70"
                    ></div>
                    <span>{{ company.name }}</span>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <ServerDetailsModal />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMainStore } from "./store.ts";
import ServerDetailsModal from "./ServerDetailsModal.vue";
import { useConfigStore } from "../../core/config.ts";

const store = useMainStore();
const config = useConfigStore();

let map: L.Map | null = null;
const markersMap = new Map<string, L.Marker>();

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

function initMap() {
  const polandBounds = L.latLngBounds([48.8, 14.0], [54.9, 24.5]);

  map = L.map("osm-map", {
    center: [52.0, 19.2],
    zoom: 5.5,
    minZoom: 5,
    maxZoom: 14,
    maxBounds: polandBounds,
    maxBoundsViscosity: 1.0,
    zoomSnap: 0.5,
  });

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap",
    },
  ).addTo(map);
  renderMarkers();
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 100);
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "available":
      return { dot: "menu-dot-available", icon: "text-success" };
    case "busy":
      return { dot: "menu-dot-busy", icon: "text-warning" };
    case "deploying":
      return { dot: "menu-dot-deploying", icon: "text-info" };
    case "offline":
      return { dot: "menu-dot-offline", icon: "text-error" };
    default:
      return { dot: "menu-dot-offline", icon: "text-grey" };
  }
};

function renderMarkers() {
  if (!map) return;

  markersMap.forEach((marker) => marker.remove());
  markersMap.clear();
  if (!config.clusters || config.clusters.length === 0) return;

  config.clusters.forEach((cluster) => {
    const isOpened = store.openedClusterId === cluster.id;
    const openedClass = isOpened ? "marker-selected" : "";
    const baseIconSize = 34;
    const companiesCount = cluster.companies?.length || 0;
    const calculatedIconSize = baseIconSize + companiesCount * 8;

    const styles = getStatusStyle(cluster.status);

    const htmlIcon = `
      <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; pointer-events: none;">
        <div class="cluster-marker ${openedClass}" style="position: relative; pointer-events: auto; cursor: pointer;">
          <div class="${styles.dot} map-status-dot"></div>
          <i class="mdi mdi-server-network ${styles.icon}" style="font-size: ${calculatedIconSize}px; line-height: ${calculatedIconSize}px;"></i>
        </div>
        <div style="white-space: nowrap; width: max-content; background: rgba(255, 255, 255, 0.95); color: #0d3b66; border: 1px solid #0056b3; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: -5px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); pointer-events: auto;">
          ${cluster.name}
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: htmlIcon,
      className: "clear-leaflet-marker",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const marker = L.marker([cluster.lat, cluster.lng], {
      icon: customIcon,
    }).addTo(map!);
    markersMap.set(cluster.id, marker);

    marker.on("click", () => {
      handleClusterClick(cluster.id);
    });
  });
}

function handleClusterClick(clusterId: string) {
  store.toggleCluster(clusterId);
  if (store.openedClusterId === clusterId) {
    const cluster = config.clusters.find((c) => c.id === clusterId);
    if (cluster && map) {
      map.flyTo([cluster.lat, cluster.lng], 9, { duration: 1 });
    }
  }
}

watch(
  () => store.openedClusterId,
  () => {
    renderMarkers();
  },
);
watch(
  () => store.selectedCompanyId,
  () => {
    renderMarkers();
  },
);

watch(
  () => config.clusters,
  () => {
    renderMarkers();
  },
  { deep: true },
);
</script>

<style scoped>
/* BACKGROUND GŁÓWNY */
.aero-main-container {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  height: 100vh;
}

/* KARTY STATYSTYK */
.aero-stat-card {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 15px rgba(0, 120, 215, 0.1) !important;
  position: relative;
  overflow: hidden;
}

.aero-glass-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.aero-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #0369a1;
  letter-spacing: 1px;
}

.aero-text-blue {
  background: linear-gradient(to bottom, #034d77, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* OKNO AERO */
.aero-window-frame {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 12px !important;
  box-shadow: 0 15px 35px rgba(0, 50, 100, 0.15) !important;
  overflow: hidden;
}

.aero-window-header {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(219, 234, 254, 0.8) 50%,
    rgba(191, 219, 254, 0.8) 100%
  );
  padding: 10px 16px;
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #1e3a8a;
  border-bottom: 1px solid rgba(30, 58, 138, 0.1);
}

/* LISTA I TREE VIEW */
.aero-list-bg {
  background: rgba(255, 255, 255, 0.2);
}

.aero-tree-node {
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.aero-tree-node:hover {
  background: rgba(14, 165, 233, 0.1);
  border-color: #0ea5e9;
}

.aero-node-active {
  background: linear-gradient(
    to right,
    rgba(14, 165, 233, 0.2),
    transparent
  ) !important;
  border-left: 4px solid #0ea5e9 !important;
  color: #0369a1;
}

.aero-sub-list {
  margin-left: 12px;
  border-left: 1px dashed rgba(2, 132, 199, 0.3);
  padding-left: 8px;
  margin-top: 4px;
}

.aero-sub-item {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.aero-sub-item:hover {
  background: rgba(14, 165, 233, 0.05);
}

.aero-item-selected {
  background: #0ea5e9 !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
}

/* DOTS / STATUS */
[class^="menu-dot-"] {
  width: 12px !important;
  height: 12px !important;
  border-radius: 50% !important;
  display: inline-block;
  position: relative;
  /* Delikatny efekt 3D (cień wewnętrzny) */
  box-shadow:
    inset -1px -1px 2px rgba(0, 0, 0, 0.2),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.menu-dot-available {
  background: radial-gradient(circle at 30% 30%, #4ade80, #16a34a) !important;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6) !important;
}

.menu-dot-busy {
  /* Busy robimy jako "pusty" pierścień lub pomarańczową diodę */
  background: radial-gradient(circle at 30% 30%, #fbbf24, #d97706) !important;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5) !important;
}

.menu-dot-deploying {
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7) !important;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.6) !important;
  /* Opcjonalnie: pulsowanie dla statusu "deploying" */
  animation: aero-pulse 2s infinite ease-in-out;
}

.menu-dot-offline {
  background: radial-gradient(circle at 30% 30%, #f87171, #dc2626) !important;
  box-shadow: 0 0 5px rgba(239, 68, 68, 0.4) !important;
}

.scale-70 {
  transform: scale(0.7);
}

/* MAP VIEWPORT */
.map-viewport {
  border-radius: 0 0 12px 12px;
  filter: saturate(1.2) contrast(1.1); /* Podkręcenie kolorów mapy pod styl Frutiger */
}
</style>
