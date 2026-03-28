<template>
  <v-dialog
    :model-value="!!store.selectedCompany"
    @update:model-value="(val) => { if (!val) store.selectCompany(null) }"
    max-width="1000px"
    transition="dialog-bottom-transition"
  >
    <v-card class="aero-glass" v-if="store.selectedCompany" flat>
      <div class="aero-title-bar d-flex justify-space-between align-center">
        <span class="text-black">
          💻 Dostępne serwery: <strong>{{ store.selectedCompany.name }}</strong>
        </span>
        <v-btn icon="mdi-close" size="small" color="black" variant="text" @click="store.selectCompany(null)"></v-btn>
      </div>

      <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto;">
        <v-row>
          <v-col v-for="server in store.selectedCompany.servers" :key="server.id" cols="12" md="6">
            <div class="server-card p-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-h6 font-weight-bold d-flex align-center" style="color: #000;">
                  <v-icon color="primary" class="mr-2">mdi-expansion-card-variant</v-icon>
                  {{ server.gpu }}
                </div>
                <div class="status-badge" :class="server.status">
                  {{ server.status === 'available' ? 'Dostępny' : 'Zajęty' }}
                </div>
              </div>

              <v-row dense class="text-black text-body-2 mb-2" style="font-weight: 500;">
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
// PRZYWRÓCONO TWOJĄ ORYGINALNĄ ŚCIEŻKĘ
import { useMainStore } from './store.ts'

const store = useMainStore()
</script>

<style scoped>
/* VISTA / AERO GLASS LIGHT MODE - FROSTED AZURE */
.aero-glass {
  background: rgba(225, 235, 250, 0.75) !important;
  backdrop-filter: blur(20px) saturate(170%);
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 15px 45px rgba(0, 40, 80, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  color: #000 !important; /* Wszystkie teksty czarne */
}

.aero-title-bar {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(210, 230, 255, 0.6) 100%);
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 800;
  color: #000;
  border-bottom: 1px solid rgba(0, 80, 150, 0.15);
  border-radius: 12px 12px 0 0;
}

/* KARTY SERWERÓW - JASNE */
.server-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* ODZNAKI STATUSU */
.status-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.status-badge.available { background: #e8f5e9; color: #1b5e20; border: 1px solid #a5d6a7; }
.status-badge.busy { background: #fffde7; color: #e65100; border: 1px solid #fff59d; }

/* VISTA PROGRESS BAR LIGHT */
.vista-progress-container {
  height: 22px;
  background: #d1d9e6;
  border-radius: 11px;
  border: 1px solid #a0aec0;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.vista-progress-bar {
  height: 100%;
  border-radius: 10px;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);
  transition: width 0.5s ease;
}

.bar-free { background: linear-gradient(180deg, #68d391 0%, #38a169 100%); }
.bar-busy { background: linear-gradient(180deg, #f6ad55 0%, #dd6b20 100%); }

.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 0; left: 0;
  font-size: 0.75rem;
  line-height: 22px;
  color: #000;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(255,255,255,0.9);
}
</style>