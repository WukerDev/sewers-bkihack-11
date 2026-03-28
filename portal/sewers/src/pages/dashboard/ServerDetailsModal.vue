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
            <span class="company-name-highlight">{{ store.selectedCompany.name }}</span>
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
              <div class="relative-content pa-5 flex-grow-1 d-flex flex-column">

                <div class="d-flex justify-space-between align-start mb-4">
                  <div>
                    <div
                      class="text-h5 font-weight-black text-blue-darken-4 mb-1"
                      style="line-height: 1.1; letter-spacing: -0.5px;"
                    >
                      {{ server.gpus && server.gpus.length > 0 ? server.gpus[0].model : 'Brak GPU' }}
                    </div>
                    <div class="text-caption font-weight-bold text-blue-grey-darken-1 text-uppercase tracking-wide">
                      Węzeł Obliczeniowy
                    </div>
                  </div>
                  <div :class="['aero-status-pill', getStatus(server.gpus?.[0]?.vramUsage).class]">
                      <div class="status-dot"></div>
                      {{ getStatus(server.gpus?.[0]?.vramUsage).text }}
                  </div>
                </div>

                <div class="spec-grid mb-5 text-blue-grey-darken-3">
                  <div class="spec-item truncate-wrapper d-flex align-center">
                    <v-icon size="16" color="blue-grey-lighten-1" class="mr-2">mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="top">Dzisiaj: {{ getTodaySchedule(server) }}</v-tooltip>
                    <div class="text-truncate">
                      <strong>Dostępność:</strong> {{ getTodaySchedule(server) }}
                    </div>
                  </div>

                  <div class="spec-item d-flex align-center">
                    <v-icon size="16" color="blue-grey-lighten-1" class="mr-2">mdi-memory</v-icon>
                    <div class="text-truncate">
                      <strong>RAM:</strong> {{ server.ram }} GB
                    </div>
                  </div>

                  <div class="spec-item d-flex align-center">
                    <v-icon size="16" color="blue-grey-lighten-1" class="mr-2">mdi-cpu-64-bit</v-icon>
                    <div class="text-truncate">
                      <strong>CPU:</strong> {{ server.cpus && server.cpus.length > 0 ? server.cpus[0].threads : '-' }} Rdzeni
                    </div>
                  </div>
                </div>

                <div class="price-comparison-box pa-4 mb-4">
                    <div class="d-flex justify-space-between align-end mb-2">
                      <div class="price-yours-container">
                        <div class="label-with-icon text-success mb-1 d-flex align-center text-caption font-weight-bold">
                          <v-icon size="16" color="success" class="mr-1">mdi-piggy-bank</v-icon>
                          <span>Twoja Cena:</span>
                        </div>
                        <div class="d-flex align-baseline">
                          <span class="price-val-hero text-h4 font-weight-black text-blue-darken-4">
                            {{ formatMonthlyPLN(server.pricePerTeraflopDay*5) }}
                          </span>
                          <span class="price-unit-hero text-subtitle-2 text-grey-darken-1 ml-1">/dzień</span>
                        </div>
                      </div>

                      <div class="price-usd-badge text-caption text-grey-darken-1 font-weight-medium bg-white px-2 py-1 rounded-lg border">
                        ${{ formatMonthlyUSD(server.pricePerTeraflopDay*5) }}/dzień
                      </div>
                    </div>

                    <v-divider class="my-3 opacity-20"></v-divider>

                    <div class="d-flex justify-space-between align-center mb-3">
                      <div class="price-aws-container">
                        <div class="label-with-icon muted d-flex align-center text-caption">
                          <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-cloud</v-icon>
                          <strong class="text-grey-darken-2 mr-1">AWS:</strong>
                          <span class="aws-old-val text-decoration-line-through text-grey-darken-1">
                            {{ AWS_PRICE_USD*24 }} pln /dzień
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                <div class="gel-progress-wrapper mt-auto pt-2">
                   <div class="d-flex justify-space-between text-caption font-weight-black mb-1 px-1">
                    <span class="text-blue-grey-darken-2">Użycie Głównego VRAM</span>
                    <span class="text-blue-darken-3">{{ server.gpus && server.gpus.length > 0 ? server.gpus[0].vramUsage : 0 }}%</span>
                  </div>
                  <div class="gel-progress-container">
                    <div :class="[
                        'gel-progress-bar',
                        server.gpus?.[0]?.vramUsage > 90 ? 'gel-red' : (server.gpus?.[0]?.vramUsage > 70 ? 'gel-orange' : 'gel-green')
                      ]"
                      :style="{ width: (server.gpus?.[0]?.vramUsage || 0) + '%' }"
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

// --- KONFIGURACJA ---
// Używamy stawki 6.94$/h, by osiągnąć cel ~5000$/mc za referencyjną chmurę AWS
const USD_RATE = 3.95; // Zbliżony do realnego kursu
const AWS_PRICE_USD = 28; // 6.94$ * 720h = 4996.8$ (około 5000$)
const HOURS_IN_MONTH = 720;

// 1. Cena w PLN (Zoptymalizowana pod prezentację ogromnych oszczędności miesięcznych)
const formatMonthlyPLN = (hourlyPriceUsd: number) => {
  const total = hourlyPriceUsd * HOURS_IN_MONTH * USD_RATE;
  return total.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  });
};

// 2. Cena w USD miesięcznie
const formatMonthlyUSD = (hourlyPriceUsd: number) => {
  const total = hourlyPriceUsd * HOURS_IN_MONTH;
  return Math.round(total).toLocaleString('en-US');
};

// 3. Oszczędności w PLN miesięcznie
const calculateMonthlySavings = (hourlyUsd: number) => {
  const savings = (AWS_PRICE_USD - hourlyUsd) * HOURS_IN_MONTH * USD_RATE;
  return savings.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  });
};

// 4. Procenty
const calculatePercent = (hourlyUsd: number) => {
  const diff = ((AWS_PRICE_USD - hourlyUsd) / AWS_PRICE_USD) * 100;
  return Math.round(diff);
};

// --- LOGIKA STATUSÓW I HARMONOGRAMU ---
const getTodaySchedule = (server: any) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const schedule = server.windowSchedule?.[today];

  if (!schedule || (schedule.windowStart.seconds === 0 && schedule.windowEnd.seconds === 0)) return "Zamknięte";
  if (schedule.windowStart.seconds === 0 && schedule.windowEnd.seconds === 86400) return "24/7";

  const format = (s: number) => new Date(s * 1000).toISOString().substr(11, 5);
  return `${format(schedule.windowStart.seconds)} - ${format(schedule.windowEnd.seconds)}`;
};

const getStatus = (usage: number = 0) => {
  if (usage > 90) return { class: 'busy', text: 'Obciążony' };
  if (usage > 70) return { class: 'warning', text: 'Wysokie użycie' };
  return { class: 'available', text: 'Gotowy' };
};
</script>

<style scoped>
/* RAMA MODALA - GŁĘBOKIE SZKŁO */
.aero-modal-frame {
  background: rgba(240, 248, 255, 0.7) !important;
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
    rgba(255, 255, 255, 0.95) 0%,
    rgba(186, 230, 253, 0.9) 50%,
    rgba(125, 211, 252, 0.9) 100%
  );
  padding: 12px 20px;
  border-bottom: 1px solid #0284c7;
}

.aero-title-text {
  font-weight: 800;
  color: #034d77;
  font-size: 1.05rem;
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
    rgba(255, 255, 255, 0.95) 0%,
    rgba(235, 248, 255, 0.8) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 60, 120, 0.08), inset 0 0 10px rgba(255,255,255,0.5) !important;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.aero-server-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 120, 215, 0.15), inset 0 0 10px rgba(255,255,255,0.8) !important;
}

.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 0.85rem;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

/* --- NOWE STYLE DLA SEKCJI CENOWEJ --- */
.price-comparison-box {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 249, 255, 0.5) 100%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.8), 0 2px 10px rgba(0, 0, 0, 0.02);
}

.opacity-20 {
  opacity: 0.2;
}

.savings-glow-tag {
  background: linear-gradient(to right, #dcfce7, #bbf7d0);
  color: #166534;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #86efac;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.2);
  display: flex;
  align-items: center;
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
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 1px 3px rgba(255,255,255,0.5);
}
.aero-status-pill.available {
  background: linear-gradient(to bottom, #dcfce7, #bbf7d0);
  color: #166534;
  border-color: #86efac;
}
.aero-status-pill.warning {
  background: linear-gradient(to bottom, #fef9c3, #fef08a);
  color: #854d0e;
  border-color: #fde047;
}
.aero-status-pill.busy {
  background: linear-gradient(to bottom, #ffedd5, #fed7aa);
  color: #9a3412;
  border-color: #fdba74;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

/* GEL PROGRESS BAR */
.gel-progress-container {
  height: 18px;
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

.gel-green { background: linear-gradient(to bottom, #4ade80 0%, #22c55e 50%, #16a34a 100%); }
.gel-orange { background: linear-gradient(to bottom, #fbbf24 0%, #f59e0b 50%, #d97706 100%); }
.gel-red { background: linear-gradient(to bottom, #f87171 0%, #ef4444 50%, #b91c1c 100%); }

.gel-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 8px 8px 0 0;
}

/* PRZYCISK ZAMKNIJ */
.aero-close-btn {
  background: linear-gradient(to bottom, #f87171, #dc2626) !important;
  color: white !important;
  border: 1px solid #991b1b !important;
  box-shadow: 0 2px 5px rgba(220, 38, 38, 0.3), inset 0 1px 2px rgba(255,255,255,0.4) !important;
}

.gloss-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  border-radius: 16px 16px 0 0;
}
</style>