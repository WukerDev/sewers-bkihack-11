<template>
  <v-dialog
    :model-value="!!store.selectedCompany"
    @update:model-value="(val) => { if (!val) store.selectCompany(null) }"
    max-width="1000px"
    transition="dialog-bottom-transition"
  >
    <v-card class="aero-glass" v-if="store.selectedCompany">
      <div class="aero-title-bar d-flex justify-space-between align-center">
        <span>
          💻 Dostępne serwery: <strong>{{ store.selectedCompany.name }}</strong>
        </span>
        <v-btn icon="mdi-close" size="small" color="white" variant="text" @click="store.selectCompany(null)"></v-btn>
      </div>

      <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto;">
        <v-row>
          <v-col v-for="server in store.selectedCompany.servers" :key="server.id" cols="12" md="6">
            <div class="server-card p-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-h6 text-white d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-expansion-card-variant</v-icon>
                  {{ server.gpu }}
                </div>
                <div class="status-badge" :class="server.status">
                  {{ server.status === 'available' ? 'Dostępny' : 'Zajęty' }}
                </div>
              </div>
              <v-row dense class="text-grey-lighten-2 text-body-2 mb-2">
                <v-col cols="6">⏱ Dostępność: {{ server.availability }}</v-col>
                <v-col cols="6">💰 Cena: ${{ server.pricePerTflops }} / TFLOPS/h</v-col>
                <v-col cols="4">💾 VRAM: {{ server.vram }}</v-col>
                <v-col cols="4">🧠 RAM: {{ server.ram }}</v-col>
                <v-col cols="4">⚙️ Wątki: {{ server.cpuThreads }}</v-col>
              </v-row>
              <div class="vista-progress-container mt-2">
                <div class="vista-progress-bar" :class="{'bar-busy': server.status === 'busy', 'bar-free': server.status === 'available'}" :style="{ width: server.load + '%' }"></div>
                <span class="progress-text">Obciążenie: {{ server.load }}%</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useMainStore } from './store' // Upewnij się, że ścieżka do store'a jest prawidłowa

// Podpinamy store, aby modal sam wiedział, czy ma się wyświetlić
const store = useMainStore()
</script>

<style scoped>
/* VISTA / AERO GLASS (dla głównego okna) */
.aero-glass { background: rgba(18, 25, 33, 0.45) !important; backdrop-filter: blur(12px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.15) !important; border-top: 1px solid rgba(255, 255, 255, 0.4) !important; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important; border-radius: 8px !important; color: white !important; }
.aero-title-bar { background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 49%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%); padding: 6px 16px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.3); }

/* KARTY SERWERÓW W MODALU */
.server-card { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
.status-badge.available { background: rgba(76, 175, 80, 0.2); color: #81c784; border: 1px solid #4caf50; }
.status-badge.busy { background: rgba(255, 193, 7, 0.2); color: #ffd54f; border: 1px solid #ffc107; }

/* VISTA PROGRESS BAR */
.vista-progress-container { height: 20px; background: #111; border-radius: 4px; border: 1px solid #333; box-shadow: inset 0 2px 5px rgba(0,0,0,0.8); position: relative; overflow: hidden; }
.vista-progress-bar { height: 100%; border-radius: 3px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.5); transition: width 0.5s ease; }
.bar-free { background: linear-gradient(180deg, #66bb6a 0%, #43a047 49%, #2e7d32 50%, #1b5e20 100%); }
.bar-busy { background: linear-gradient(180deg, #ffa726 0%, #fb8c00 49%, #ef6c00 50%, #e65100 100%); }
.progress-text { position: absolute; width: 100%; text-align: center; top: 0; left: 0; font-size: 0.75rem; line-height: 20px; color: white; text-shadow: 1px 1px 2px black; font-weight: bold; }
</style>