<template>
  <v-container fluid class="vista-background min-vh-100">
    <v-row class="mb-4">
      <v-col v-for="(value, key, index) in config.metricsConfig" :key="index" cols="12" sm="6" md="2" class="flex-grow-1">
        <v-card class="aero-glass">
          <div class="aero-title-bar">{{ value.label }}</div>
          <v-card-text class="text-center pb-2">
            <div class="text-h4 font-weight-bold text-black text-glow">
              {{ config.metrics[key as keyof typeof config.metrics] }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="aero-glass h-100 d-flex flex-column">
          <div class="aero-title-bar">Mapa Klastrów (Polska)</div>
          <div id="osm-map" class="flex-grow-1" style="min-height: 450px; border-radius: 0 0 8px 8px; z-index: 1;"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="aero-glass h-100 d-flex flex-column">
          <div class="aero-title-bar">Katalog Dostawców</div>
          <div class="flex-grow-1 overflow-y-auto pt-2 pb-2" style="max-height: 450px;">
            <div v-for="cluster in config.clusters" :key="cluster.id" class="mb-2 px-2">
              <div
                class="cluster-tree-header"
                :class="{ 'cluster-open': store.openedClusterId === cluster.id }"
                @click="handleClusterClick(cluster.id)"
              >
                <div class="d-flex align-center">
                  <v-icon
                    size="small" color="grey-lighten-1" class="mr-2 transition-transform"
                    :style="{ transform: store.openedClusterId === cluster.id ? 'rotate(90deg)' : 'rotate(0deg)' }"
                  >mdi-chevron-right</v-icon>
                  <div :class="cluster.status === 'available' ? 'menu-dot-available' : 'menu-dot-busy'" class="mr-3"></div>
                  <span class="text-black font-weight-bold">{{ cluster.name }}</span>
                  <v-chip size="x-small" color="primary" variant="outlined" class="ml-auto">
                    Firm: {{ cluster.companies.length }}
                  </v-chip>
                </div>
              </div>

              <v-expand-transition>
                <div v-if="store.openedClusterId === cluster.id" class="company-list-wrapper">
                  <div
                    v-for="company in cluster.companies" :key="company.id"
                    class="company-tree-item"
                    :class="{ 'company-selected': store.selectedCompanyId === company.id }"
                    @click="store.selectCompany(company.id)"
                  >
                    <div :class="company.status === 'available' ? 'menu-dot-available' : 'menu-dot-busy'" class="mr-2" style="transform: scale(0.7);"></div>
                    <span class="text-black text-body-2">{{ company.name }}</span>
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
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMainStore } from './store.ts'
import ServerDetailsModal from './ServerDetailsModal.vue'
import {useConfigStore} from "../../core/config.ts";

const store = useMainStore()
const config = useConfigStore();


let map: L.Map | null = null
const markersMap = new Map<string, L.Marker>()

onMounted(() => {
  initMap()
})

function initMap() {
  const polandBounds = L.latLngBounds([48.8, 14.0], [54.9, 24.5])

  map = L.map('osm-map', {
    center: [52.0, 19.2],
    zoom: 6,
    minZoom: 6,
    maxZoom: 14,
    maxBounds: polandBounds,
    maxBoundsViscosity: 1.0
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  renderMarkers()
}

function renderMarkers() {
  markersMap.forEach(marker => marker.remove())
  markersMap.clear()

  config.clusters.forEach(cluster => {
    const isOpened = store.openedClusterId === cluster.id
    const openedClass = isOpened ? 'marker-selected' : ''

    // Dynamiczny rozmiar ikony: Baza 34px + 8px za każdą firmę w klastrze
    const baseIconSize = 34
    const calculatedIconSize = baseIconSize + (cluster.companies.length * 8)
    const containerWidth = calculatedIconSize + 120

    const dotClass = cluster.status === 'available' ? 'menu-dot-available' : 'menu-dot-busy'
    const iconColorClass = cluster.status === 'available' ? 'text-success' : 'text-warning'

    const htmlIcon = `
      <div class="cluster-marker ${openedClass}" style="width: ${containerWidth}px;">
        <div class="marker-icon-wrapper">
          <div class="${dotClass} map-status-dot"></div>
          <i class="mdi mdi-server-network ${iconColorClass}" style="font-size: ${calculatedIconSize}px; line-height: ${calculatedIconSize}px;"></i>
        </div>
        <div class="cluster-label">${cluster.name}</div>
      </div>
    `

    const customIcon = L.divIcon({
      html: htmlIcon,
      className: '',
      iconSize: [containerWidth, calculatedIconSize + 40],
      iconAnchor: [containerWidth / 2, (calculatedIconSize + 40) / 2]
    })

    const marker = L.marker([cluster.lat, cluster.lng], { icon: customIcon }).addTo(map!)
    markersMap.set(cluster.id, marker)

    marker.on('click', () => {
      handleClusterClick(cluster.id)
    })
  })
}

function handleClusterClick(clusterId: string) {
  store.toggleCluster(clusterId)
  if (store.openedClusterId === clusterId) {
    const cluster = config.clusters.find(c => c.id === clusterId)
    if (cluster && map) {
      map.flyTo([cluster.lat, cluster.lng], 9, { duration: 1 })
    }
  }
}

watch(() => store.openedClusterId, () => {
  renderMarkers()
})
watch(() => store.selectedCompanyId, () => {
  renderMarkers()
})
</script>

<style scoped>

.aero-glass {
  /* Zamiana bieli na mrożony błękitny szary */
  background: rgba(210, 225, 240, 0.5) !important;
  backdrop-filter: blur(15px) saturate(140%);
  -webkit-backdrop-filter: blur(15px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.7) !important;
  /* Mocniejszy cień zewnętrzny, by karty "odcięły się" od tła */
  box-shadow: 0 10px 40px rgba(0, 50, 100, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  /* Bardzo ciemny błękit dla tekstu */
  color: #102a43 !important;
}

.aero-title-bar {
  /* Ciemniejszy gradient paska tytułu dla lepszej struktury */
  background: linear-gradient(180deg, rgba(220,235,255,0.8) 0%, rgba(180,210,240,0.6) 100%);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0d3b66; /* Głęboki granat */
  border-bottom: 1px solid rgba(0, 80, 150, 0.15);
  border-radius: 12px 12px 0 0;
}

/* --- KATALOG I DRZEWKO (Poprawa kontrastu) --- */
.cluster-tree-header {
  background: rgba(255, 255, 255, 0.2);
  color: #102a43;
  border: 1px solid rgba(0, 120, 215, 0.1);
}
.cluster-tree-header:hover {
  background: rgba(0, 120, 215, 0.15);
}
.cluster-open {
  background: rgba(0, 120, 215, 0.1);
  border-left: 4px solid #0056b3;
  color: #004085;
}

.company-tree-item { color: #243b53; }
.company-tree-item:hover { background: rgba(0, 120, 215, 0.1); }
.company-selected {
  background: rgba(0, 120, 215, 0.25) !important;
  color: #004085 !important;
  font-weight: bold;
}

/* --- KARTY SERWERÓW W MODALU --- */
.server-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #102a43;
}

/* VISTA PROGRESS BAR (Mniej agresywne kolory) */
.vista-progress-container {
  background: #cbd5e0;
  border: 1px solid #a0aec0;
}
.bar-free { background: linear-gradient(180deg, #68d391 0%, #38a169 100%); }
.bar-busy { background: linear-gradient(180deg, #f6ad55 0%, #dd6b20 100%); }
.progress-text { color: #102a43; text-shadow: 0 1px 0 rgba(255,255,255,0.8); }

/* Marker Mapy (Etykiety) */
.cluster-label {
  background: rgba(255, 255, 255, 0.95);
  color: #0d3b66;
  border: 1px solid #0056b3;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Pozostałe animacje i kropki (zostają z wersji Light, ale z lepszym kontrastem) */
.menu-dot-available { background-color: #38a169; box-shadow: 0 0 8px rgba(56, 161, 105, 0.4); }
.menu-dot-busy { border-color: #dd6b20; }
</style>