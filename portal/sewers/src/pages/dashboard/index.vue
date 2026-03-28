<template>
  <v-container fluid class="vista-background d-flex flex-column pa-4" style="height: 85vh">
    <v-row class="flex-grow-0 mb-4">
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

    <v-row class="flex-grow-1 mb-0 pb-0">
      <v-col cols="12" md="8" class="h-100 pb-0">
        <v-card class="aero-glass h-100 d-flex flex-column">
          <div class="aero-title-bar flex-grow-0">Mapa Klastrów (Polska)</div>
          <div id="osm-map" class="flex-grow-1" style="height: 100%; border-radius: 0 0 8px 8px; z-index: 1;"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="h-100 pb-0">
        <v-card class="aero-glass h-100 d-flex flex-column">
          <div class="aero-title-bar flex-grow-0">Katalog Dostawców</div>
          <div class="flex-grow-1 overflow-y-auto pt-2 pb-2" style="height: 0;">
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
                  <div :class="getStatusStyle(cluster.status).dot" class="mr-3"></div>
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
                    <div :class="getStatusStyle(company.status).dot" class="mr-2" style="transform: scale(0.7);"></div>
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
import { onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMainStore } from './store.ts'
import ServerDetailsModal from './ServerDetailsModal.vue'
import {useConfigStore} from "../../core/config.ts"

const store = useMainStore()
const config = useConfigStore()

let map: L.Map | null = null
const markersMap = new Map<string, L.Marker>()

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

function initMap() {
  const polandBounds = L.latLngBounds([48.8, 14.0], [54.9, 24.5])

  map = L.map('osm-map', {
    center: [52.0, 19.2],
    zoom: 5.5,
    minZoom: 5,
    maxZoom: 14,
    maxBounds: polandBounds,
    maxBoundsViscosity: 1.0,
    zoomSnap: 0.5
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)
  renderMarkers()
  setTimeout(() => {
    if(map) map.invalidateSize()
  }, 100)
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'available': return { dot: 'menu-dot-available', icon: 'text-success' }
    case 'busy': return { dot: 'menu-dot-busy', icon: 'text-warning' }
    case 'deploying': return { dot: 'menu-dot-deploying', icon: 'text-info' }
    case 'offline': return { dot: 'menu-dot-offline', icon: 'text-error' }
    default: return { dot: 'menu-dot-offline', icon: 'text-grey' }
  }
}

function renderMarkers() {
  if (!map) return

  markersMap.forEach(marker => marker.remove())
  markersMap.clear()
  if (!config.clusters || config.clusters.length === 0) return

  config.clusters.forEach(cluster => {
    const isOpened = store.openedClusterId === cluster.id
    const openedClass = isOpened ? 'marker-selected' : ''
    const baseIconSize = 34
    const companiesCount = cluster.companies?.length || 0
    const calculatedIconSize = baseIconSize + (companiesCount * 8)

    const styles = getStatusStyle(cluster.status)

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
    `

    const customIcon = L.divIcon({
      html: htmlIcon,
      className: 'clear-leaflet-marker',
      iconSize: [0, 0],
      iconAnchor: [0, 0]
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

watch(() => config.clusters, () => {
  renderMarkers()
}, { deep: true })
</script>

<style scoped>
.aero-glass {
  background: rgba(210, 225, 240, 0.5) !important;
  backdrop-filter: blur(15px) saturate(140%);
  -webkit-backdrop-filter: blur(15px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 10px 40px rgba(0, 50, 100, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  color: #102a43 !important;
}

.aero-title-bar {
  background: linear-gradient(180deg, rgba(220,235,255,0.8) 0%, rgba(180,210,240,0.6) 100%);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0d3b66;
  border-bottom: 1px solid rgba(0, 80, 150, 0.15);
  border-radius: 12px 12px 0 0;
}

.cluster-tree-header {
  background: rgba(255, 255, 255, 0.2);
  color: #102a43;
  border: 1px solid rgba(0, 120, 215, 0.1);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}
.cluster-tree-header:hover {
  background: rgba(0, 120, 215, 0.15);
}
.cluster-open {
  background: rgba(0, 120, 215, 0.1);
  border-left: 4px solid #0056b3;
  color: #004085;
}

.company-tree-item {
  color: #243b53;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.company-tree-item:hover { background: rgba(0, 120, 215, 0.1); }
.company-selected {
  background: rgba(0, 120, 215, 0.25) !important;
  color: #004085 !important;
  font-weight: bold;
}

.menu-dot-available {
  width: 8px; height: 8px; border-radius: 50%;
  background-color: #38a169;
  box-shadow: 0 0 8px rgba(56, 161, 105, 0.4);
}
.menu-dot-busy {
  width: 8px; height: 8px; border-radius: 50%;
  background-color: transparent;
  border: 2px solid #dd6b20;
}
.menu-dot-deploying {
  width: 8px; height: 8px; border-radius: 50%;
  background-color: #00a2ff;
  box-shadow: 0 0 8px rgba(0, 162, 255, 0.6);
}
.menu-dot-offline {
  width: 8px; height: 8px; border-radius: 50%;
  background-color: #e53e3e;
  box-shadow: 0 0 8px rgba(229, 62, 62, 0.6);
}

.clear-leaflet-marker {
  background: transparent;
  border: none;
}

.map-status-dot {
  position: absolute;
  top: 0; right: 0;
  z-index: 2;
}
</style>