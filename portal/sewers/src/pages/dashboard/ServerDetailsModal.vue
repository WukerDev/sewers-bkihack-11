<template>
  <v-dialog
    :model-value="!!store.selectedCompany"
    @update:model-value="
      (val) => {
        if (!val) store.selectCompany(null);
      }
    "
    max-width="900px"
    transition="scale-transition"
  >
    <v-card class="aero-modal-frame" v-if="store.selectedCompany">
      <div class="aero-window-header d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <div class="header-icon-sphere mr-3">
            <v-icon size="18" color="white">mdi-server-network</v-icon>
          </div>
          <span class="aero-title-text">
            Dostępne zasoby:
            <span class="company-name-highlight">{{
              store.selectedCompany.name
            }}</span>
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          size="small"
          class="aero-close-btn"
          variant="flat"
          @click="store.selectCompany(null)"
        ></v-btn>
      </div>

      <v-card-text
        class="pa-6 aero-content-bg"
        style="max-height: 75vh; overflow-y: auto"
      >
        <v-row>
          <v-col
            v-for="server in store.selectedCompany.manholes"
            :key="server.id"
            cols="12"
            md="6"
          >
            <v-card class="aero-server-item h-100 d-flex flex-column">
              <div class="gloss-overlay"></div>
              <div class="relative-content pa-4 flex-grow-1 d-flex flex-column">
                <div class="d-flex justify-space-between align-start mb-3">
                  <div>
                    <div
                      class="text-h6 font-weight-black text-blue-darken-4 mb-0"
                      style="line-height: 1.2"
                    >
                      {{ server.gpus && server.gpus.length > 0 ? server.gpus[0].model : 'Brak GPU' }}
                    </div>
                    <div
                      class="text-caption font-weight-bold text-primary text-uppercase"
                    >
                      Węzeł Obliczeniowy
                    </div>
                  </div>
                  <div class="aero-status-pill available">
                    <div class="status-dot"></div>
                      Gotowy
                  </div>
                </div>

                <div class="spec-grid mb-4">
                  <div class="spec-item truncate-wrapper">
                    <v-tooltip activator="parent" location="top">Harmonogram pracy: 24/7</v-tooltip>
                    <div class="text-truncate">
                      <strong>⏱ Dostępność:</strong> Zależne od Okienka
                    </div>
                  </div>

                  <div class="spec-item">
                    <div class="text-truncate">
                      <strong>💰 Cena:</strong> ${{ server.pricePerTeraflop }}/h
                    </div>
                  </div>

                  <div class="spec-item">
                    <div class="text-truncate">
                      <strong>🧠 RAM:</strong> {{ server.ram }} GB
                    </div>
                  </div>

                  <div class="spec-item">
                    <div class="text-truncate">
                      <strong>⚙️ CPU:</strong> {{ server.cpus && server.cpus.length > 0 ? server.cpus[0].threads : '-' }} Rdzeni
                    </div>
                  </div>
                </div>

                <div class="gel-progress-wrapper mt-auto pt-4 border-top-light">
                   <div
                    class="d-flex justify-space-between text-caption font-weight-black mb-1 px-1"
                  >
                    <span class="text-blue-grey-darken-3"
                      >Użycie Głównego VRAM</span
                    >
                    <span class="text-blue-darken-3">{{ server.gpus && server.gpus.length > 0 ? server.gpus[0].vramUsage : 0 }}%</span>
                  </div>
                  <div class="gel-progress-container">
                    <div
                      class="gel-progress-bar gel-green"
                      :style="{ width: (server.gpus && server.gpus.length > 0 ? server.gpus[0].vramUsage : 0) + '%' }"
                    >
                      <div class="gel-shine"></div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useMainStore } from "./store.ts";

const store = useMainStore();
</script>

<style scoped>
/* RAMA MODALA - GŁĘBOKIE SZKŁO */
.aero-modal-frame {
  background: rgba(240, 248, 255, 0.6) !important;
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 20px !important;
  box-shadow:
    0 25px 50px rgba(0, 70, 150, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.5) !important;
  overflow: hidden;
}

/* NAGŁÓWEK OKNA */
.aero-window-header {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(186, 230, 253, 0.8) 50%,
    rgba(125, 211, 252, 0.8) 100%
  );
  padding: 12px 20px;
  border-bottom: 1px solid #0284c7;
}

.aero-title-text {
  font-weight: 800;
  color: #034d77;
  font-size: 1rem;
}

.company-name-highlight {
  color: #0284c7;
  text-decoration: underline;
}

.header-icon-sphere {
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
}

/* KARTY SERWERÓW W ŚRODKU */
.aero-server-item {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(224, 242, 254, 0.5) 100%
  ) !important;
  border: 1px solid white !important;
  border-radius: 15px !important;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}

.aero-server-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 120, 215, 0.15) !important;
}

.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 0.85rem;
}

.border-top-light {
    border-top: 1px solid rgba(0,0,0, 0.05);
}

/* STATUS PILL */
.aero-status-pill {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.aero-status-pill.available {
  background: #dcfce7;
  color: #166534;
}
.aero-status-pill.busy {
  background: #ffedd5;
  color: #9a3412;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: currentColor;
  box-shadow: 0 0 5px currentColor;
}

/* GEL PROGRESS BAR */
.gel-progress-container {
  height: 20px;
  background: #e2e8f0;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.gel-progress-bar {
  height: 100%;
  border-radius: 8px;
  position: relative;
  transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gel-green {
  background: linear-gradient(to bottom, #4ade80 0%, #22c55e 50%, #16a34a 100%);
}
.gel-orange {
  background: linear-gradient(to bottom, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
}

.gel-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 8px 8px 0 0;
}

/* PRZYCISK ZAMKNIJ */
.aero-close-btn {
  background: linear-gradient(to bottom, #f87171, #dc2626) !important;
  color: white !important;
  border: 1px solid #991b1b !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

.gloss-overlay {
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
</style>