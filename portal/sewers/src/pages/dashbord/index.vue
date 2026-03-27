<template>
  <v-container fluid class="vista-background min-vh-100">
    <v-row class="mb-4">
      <v-col v-for="(value, key, index) in metricsConfig" :key="index" cols="12" sm="6" md="2" class="flex-grow-1">
        <v-card class="aero-glass">
          <div class="aero-title-bar">{{ value.label }}</div>
          <v-card-text class="text-center pb-2">
            <div class="text-h4 font-weight-bold text-white text-glow">
              {{ store.metrics[key as keyof typeof store.metrics] }}
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
            <div v-for="cluster in store.clusters" :key="cluster.id" class="mb-2 px-2">
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
                  <span class="text-white font-weight-bold">{{ cluster.name }}</span>
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
                    <span class="text-grey-lighten-2 text-body-2">{{ company.name }}</span>
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
import { useMainStore } from './store'
import ServerDetailsModal from './ServerDetailsModal.vue'

const store = useMainStore()

const metricsConfig = {
  onlineNodes: { label: 'Węzłów online' },
  totalVram: { label: 'Całkowity VRAM' },
  queuedTasks: { label: 'Zadań w kolejce' },
  companies: { label: 'Firm w sieci' },
  gpus: { label: 'Kart graficznych' }
}

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

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  renderMarkers()
}

function renderMarkers() {
  markersMap.forEach(marker => marker.remove())
  markersMap.clear()

  store.clusters.forEach(cluster => {
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
    const cluster = store.clusters.find(c => c.id === clusterId)
    if (cluster && map) {
      map.flyTo([cluster.lat, cluster.lng], 9, { duration: 1 })
    }
  }
}

// Zamiast starego watch na selectedCompanyId, dajemy na openedClusterId
watch(() => store.openedClusterId, () => {
  renderMarkers()
})

// Reakcja na kliknięcie z menu LUB z mapy
function handleMenuClick(id: string) {
  store.selectCompany(id)
  const company = store.companies.find(c => c.id === id)
  if (company && map) {
    map.flyTo([company.lat, company.lng], 9, { duration: 1 })
  }
}

// Odśwież widok markerów na mapie gdy zmieni się wybrana firma
watch(() => store.selectedCompanyId, () => {
  renderMarkers()
})
</script>

<style scoped>
/* VISTA / AERO GLASS STYLES */
.vista-background { background: radial-gradient(circle at 50% 0%, #1a3a4c 0%, #0d1117 70%); min-height: 100vh; }
.aero-glass { background: rgba(18, 25, 33, 0.45) !important; backdrop-filter: blur(12px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.15) !important; border-top: 1px solid rgba(255, 255, 255, 0.4) !important; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important; border-radius: 8px !important; color: white !important; }
.aero-title-bar { background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 49%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%); padding: 6px 16px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.3); }

/* --- MAPA I KLASTRY --- */
.node-dot-wrapper { position: relative; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center; }
.node-dot { width: 14px; height: 14px; border-radius: 50%; transition: all 0.3s ease; }
.dot-available { background-color: #00ff00; box-shadow: 0 0 10px #00ff00; animation: pulse-green 1.5s infinite alternate; }
.dot-busy { background-color: transparent; border: 3px solid #ffeb3b; border-top-color: #f57f17; animation: spin-yellow 1s linear infinite; }
.dot-selected { transform: scale(1.8); background-color: #2196f3; box-shadow: 0 0 20px #2196f3; animation: none !important; border: none; z-index: 1000; }

.node-tooltip { position: absolute; top: 25px; background: rgba(0,0,0,0.9); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.2s; color: white; text-shadow: none; pointer-events: none; }
.node-dot-wrapper:hover .node-tooltip { opacity: 1; visibility: visible; }

/* Kropki w Menu bocznym */
.menu-dot-available { width: 12px; height: 12px; border-radius: 50%; background-color: #00ff00; box-shadow: 0 0 8px #00ff00; }
.menu-dot-busy { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #ffeb3b; border-top-color: transparent; animation: spin-yellow 1.5s linear infinite; }

/* LISTA */
.aero-list-item { transition: all 0.2s; border: 1px solid transparent; cursor: pointer; }
.aero-list-item:hover { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
.aero-list-item-selected { background: linear-gradient(90deg, rgba(33, 150, 243, 0.3) 0%, transparent 100%) !important; border-left: 4px solid #2196f3 !important; }

/* KARTY SERWERÓW */
.server-card { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; padding: 12px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
.status-badge.available { background: rgba(76, 175, 80, 0.2); color: #81c784; border: 1px solid #4caf50; }
.status-badge.busy { background: rgba(255, 193, 7, 0.2); color: #ffd54f; border: 1px solid #ffc107; }

/* VISTA PROGRESS BAR */
.vista-progress-container { height: 20px; background: #111; border-radius: 4px; border: 1px solid #333; box-shadow: inset 0 2px 5px rgba(0,0,0,0.8); position: relative; overflow: hidden; }
.vista-progress-bar { height: 100%; border-radius: 3px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.5); transition: width 0.5s ease; }
.bar-free { background: linear-gradient(180deg, #66bb6a 0%, #43a047 49%, #2e7d32 50%, #1b5e20 100%); }
.bar-busy { background: linear-gradient(180deg, #ffa726 0%, #fb8c00 49%, #ef6c00 50%, #e65100 100%); }
.progress-text { position: absolute; width: 100%; text-align: center; top: 0; left: 0; font-size: 0.75rem; line-height: 20px; color: white; text-shadow: 1px 1px 2px black; font-weight: bold; }

@keyframes pulse-green {
  0% { transform: scale(0.9); box-shadow: 0 0 5px #00ff00; }
  100% { transform: scale(1.2); box-shadow: 0 0 15px #00ff00; }
}
@keyframes spin-yellow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- MAPA I KLASTRY (NOWE, WIĘKSZE IKONY ZE STATUSEM) --- */
.cluster-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 160px;
  transition: transform 0.2s ease;
}

.marker-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Pozycjonowanie kropki statusu w prawym górnym rogu dużej ikony */
.map-status-dot {
  position: absolute;
  top: -2px;
  right: -8px;
  width: 16px !important;
  height: 16px !important;
  z-index: 2;
}

/* Wielka ikona serwera */
.cluster-marker i {
  font-size: 42px; /* ZNACZNE POWIĘKSZENIE */
  line-height: 42px;
  filter: drop-shadow(0 0 8px currentColor);
  transition: all 0.3s ease;
  cursor: pointer;
}

.cluster-label {
  margin-top: 6px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0,0,0,0.6);
  pointer-events: none;
}

/* Stan zaznaczenia klikniętego klastra */
.marker-selected {
  transform: scale(1.15);
  z-index: 1000 !important;
}

.marker-selected i {
  color: #2196f3 !important;
  filter: drop-shadow(0 0 20px #2196f3);
}

.marker-selected .cluster-label {
  background: #2196f3;
  border-color: #64b5f6;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* --- DRZEWKO FIRM (TREEVIEW) --- */
.cluster-tree-header {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  transition: all 0.3s ease;
}
.cluster-tree-header:hover {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.cluster-open {
  background: linear-gradient(90deg, rgba(33, 150, 243, 0.2) 0%, transparent 100%);
  border-left: 3px solid #2196f3;
}
.transition-transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.company-list-wrapper {
  margin-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.company-tree-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.company-tree-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
.company-selected {
  background: rgba(33, 150, 243, 0.3) !important;
  color: white !important;
}

/* --- KROPKI MENU (ZOSTAJĄ BEZ ZMIAN) --- */
.menu-dot-available { width: 12px; height: 12px; border-radius: 50%; background-color: #00ff00; box-shadow: 0 0 8px #00ff00; animation: pulse-green 1.5s infinite alternate; }
.menu-dot-busy { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #ffeb3b; border-top-color: transparent; animation: spin-yellow 1.5s linear infinite; }

@keyframes pulse-green {
  0% { transform: scale(0.9); box-shadow: 0 0 5px #00ff00; }
  100% { transform: scale(1.2); box-shadow: 0 0 15px #00ff00; }
}
@keyframes spin-yellow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>