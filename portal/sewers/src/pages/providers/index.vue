<script setup lang="ts">
import { ref, computed } from "vue";
import { useNotificationStore } from "../../core/notifications";
import { useConfigStore } from "../../core/config.ts";

const notificationStore = useNotificationStore();
const activeTab = ref("dashboard");

const config = useConfigStore();

const formattedEarnings = computed(() => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(config.monthlyEarnings);
});

const dockerCommand = computed(() => {
  return `docker run -d --gpus all --name aero-node \\
  -e API_TOKEN="${config.providerToken}" \\
  -e PROVIDER_MODE="true" \\
  aero-network/worker:latest`;
});

function generateNewToken() {
  const randomChars = Math.random().toString(36).substring(2, 15);
  config.providerToken = `sk-prov-${randomChars}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    notificationStore.showSnackbar("Skopiowano do schowka!", "success");
  } catch (err) {
    notificationStore.showSnackbar("Nie udało się skopiować", "error");
  }
}

function handleRegenerateToken() {
  notificationStore.showDialog({
    title: "Uwaga",
    text: "Wygenerowanie nowego tokenu spowoduje odłączenie obecnie działających węzłów używających starego klucza. Kontynuować?",
    confirmText: "Generuj nowy",
    cancelText: "Anuluj",
    onConfirm: () => {
      generateNewToken();
      notificationStore.showSnackbar("Wygenerowano nowy token API.", "success");
    },
    onCancel: () => {},
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "online":
      return "success";
    case "offline":
      return "error";
    case "maintenance":
      return "warning";
    default:
      return "info";
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="aero-glass pa-4 mb-6 d-flex align-center flex-wrap">
          <v-avatar color="transparent" size="large" class="mr-4">
            <v-icon color="primary" size="x-large">mdi-office-building</v-icon>
          </v-avatar>
          <div>
            <v-card-title class="text-h4 font-weight-bold mb-0">
              Panel Dostawcy
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 pb-2">
              Zarządzaj i monitoruj swoje maszyny obliczeniowe.
            </v-card-subtitle>
          </div>
          <v-spacer></v-spacer>
          <div class="aero-panel pa-3 d-flex flex-wrap ga-2 align-center">
            <v-chip color="primary" label variant="flat" class="aero-chip"
              ><v-icon start>mdi-server-network</v-icon> Węzły: 4</v-chip
            >
            <v-chip color="success" label variant="flat" class="aero-chip"
              ><v-icon start>mdi-brain</v-icon> Moc: ~22 TFLOPS</v-chip
            >
            <v-chip color="info" label variant="flat" class="aero-chip"
              ><v-icon start>mdi-memory</v-icon> VRAM: 14.2 GB</v-chip
            >
          </div>
        </v-card>

        <v-row>
          <v-col cols="12" md="7">
            <v-card
              class="vista-frame pa-1 text-center earnings-card h-100 w-100 d-flex"
            >
              <div
                class="aero-window-content pa-6 d-flex flex-column justify-center align-center flex-grow-1"
              >
                <v-icon size="56" color="primary" class="mb-4"
                  >mdi-cash-multiple</v-icon
                >
                <h2 class="text-h6 text-grey-darken-1 mb-2">
                  Przychód w tym miesiącu
                </h2>
                <div class="text-h2 font-weight-black earnings-text mb-4">
                  {{ formattedEarnings }}
                </div>

                <div
                  class="d-flex justify-center align-center flex-wrap ga-4 mt-2 w-100"
                >
                  <div
                    class="aero-panel pa-2 text-center flex-grow-1"
                    style="max-width: 200px"
                  >
                    <div class="text-caption">Przewidywane (miesiąc)</div>
                    <div class="font-weight-bold text-success">~14 000 PLN</div>
                  </div>
                  <div
                    class="aero-panel pa-2 text-center flex-grow-1"
                    style="max-width: 200px"
                  >
                    <div class="text-caption">Średni przychód/węzeł</div>
                    <div class="font-weight-bold text-success">~4 150 PLN</div>
                  </div>
                </div>

                <div class="aero-panel pa-4 mt-6 w-100">
                  <v-card-subtitle
                    class="text-primary font-weight-bold mb-2 px-0 text-center"
                    >Trend zarobków (7 dni)</v-card-subtitle
                  >
                  <div class="aero-chart-box">
                    <v-sparkline
                      :model-value="
                        config.historicalEarnings.map((d) => d.amount / 30)
                      "
                      :labels="
                        config.historicalEarnings.map(
                          (d) => `${Math.round(d.amount / 30)}zł`,
                        )
                      "
                      color="#16a34a"
                      height="80"
                      padding="20"
                      line-width="3"
                      label-size="7"
                      smooth
                      fill
                    ></v-sparkline>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="aero-glass h-100 d-flex flex-column">
              <div class="aero-window-header-simple">System Health Monitor</div>
              <v-card-text class="pa-5 flex-grow-1 d-flex flex-column">
                <div class="ga-4 d-flex flex-column mb-auto">
                  <v-alert class="aero-alert-warning" density="compact">
                    <template v-slot:prepend
                      ><div class="alert-icon-dot warning"></div
                    ></template>
                    RTX 4090: Wysoka temperatura (72°C)
                  </v-alert>
                  <v-alert class="aero-alert-error" density="compact">
                    <template v-slot:prepend
                      ><div class="alert-icon-dot error"></div
                    ></template>
                    A100: Konserwacja systemowa
                  </v-alert>
                </div>

                <v-spacer></v-spacer>

                <div class="aero-panel-inset pa-4 mt-6">
                  <div
                    class="text-caption font-weight-bold mb-1 text-grey-darken-2"
                  >
                    Opóźnienie Sieci (ms)
                  </div>
                  <v-sparkline
                    :model-value="
                      config.historicalLatency.map((d) => d.latency)
                    "
                    :labels="
                      config.historicalLatency.map(
                        (d) => `${d.latency.toFixed(0)}ms`,
                      )
                    "
                    color="#0284c7"
                    height="60"
                    smooth
                    line-width="3"
                    padding="18"
                    label-size="8"
                  ></v-sparkline>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-card class="aero-panel pa-4 h-100">
              <v-card-title class="aero-title-text px-0 pb-1">
                <v-icon start color="warning">mdi-lightning-bolt</v-icon>
                Sumaryczny Pobór Mocy
              </v-card-title>
              <v-card-subtitle
                class="px-0 pb-4 text-grey-darken-1 font-weight-bold"
                >Ostatnie 8 godzin (W)</v-card-subtitle
              >
              <div class="aero-panel-inset pa-2">
                <v-sparkline
                  :model-value="config.powerUsageData"
                  :labels="config.powerUsageData.map((v) => `${v}W`)"
                  color="#d97706"
                  height="70"
                  padding="20"
                  smooth
                  fill
                  line-width="3"
                  label-size="7"
                ></v-sparkline>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="aero-panel pa-4 h-100">
              <v-card-title class="aero-title-text px-0 pb-1">
                <v-icon start color="info">mdi-memory</v-icon> Utylizacja
                Pamięci VRAM
              </v-card-title>
              <v-card-subtitle
                class="px-0 pb-4 text-grey-darken-1 font-weight-bold"
                >Obciążenie (%)</v-card-subtitle
              >
              <div class="aero-panel-inset pa-2">
                <v-sparkline
                  :model-value="config.vramUtilizationData"
                  :labels="config.vramUtilizationData.map((v) => `${v}%`)"
                  color="#0284c7"
                  height="70"
                  padding="20"
                  smooth
                  line-width="3"
                  label-size="7"
                ></v-sparkline>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="aero-panel mt-8 shadow-lg">
          <v-tabs
            v-model="activeTab"
            bg-color="transparent"
            color="primary"
            class="aero-tabs"
          >
            <v-tab value="dashboard"
              ><v-icon start>mdi-server-network</v-icon>Status Węzłów</v-tab
            >
            <v-tab value="add-node"
              ><v-icon start>mdi-plus-box-multiple</v-icon>Dodaj Węzeł</v-tab
            >
          </v-tabs>

          <v-card-text class="pt-6">
            <v-window v-model="activeTab" class="overflow-visible">
              <v-window-item value="dashboard" class="pa-1">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-for="node in config.nodesProvided"
                    :key="node.id"
                  >
                    <v-card
                      class="aero-panel pa-5 h-100 d-flex flex-column aero-node-card"
                    >
                      <div
                        class="d-flex justify-space-between align-center mb-4"
                      >
                        <div
                          class="font-weight-bold text-subtitle-1 aero-title-text"
                        >
                          {{ node.name }}
                        </div>
                        <v-chip
                          :color="getStatusColor(node.status)"
                          size="small"
                          variant="flat"
                          class="font-weight-black shadow-sm"
                        >
                          {{ node.status.toUpperCase() }}
                        </v-chip>
                      </div>

                      <v-divider class="mb-4 opacity-20"></v-divider>

                      <div class="d-flex flex-wrap ga-y-4">
                        <div class="w-50 d-flex align-center">
                          <v-icon color="primary" size="small" class="mr-2"
                            >mdi-clock-outline</v-icon
                          >
                          <span class="text-body-2"
                            ><strong>Uptime:</strong> {{ node.uptime }}</span
                          >
                        </div>
                        <div class="w-50 d-flex align-center">
                          <v-icon color="warning" size="small" class="mr-2"
                            >mdi-flash</v-icon
                          >
                          <span class="text-body-2"
                            ><strong>Pobór:</strong> {{ node.powerUsage }}</span
                          >
                        </div>
                        <div class="w-100 mt-2">
                          <div class="aero-window-content-inset pa-3">
                            <div class="d-flex align-center mb-1">
                              <v-icon color="info" size="small" class="mr-2"
                                >mdi-memory</v-icon
                              >
                              <span class="text-body-2 font-weight-bold"
                                >VRAM Usage:</span
                              >
                            </div>
                            <v-progress-linear
                              :model-value="parseFloat(node.vramUsage)"
                              max="80"
                              color="info"
                              height="10"
                              rounded
                              class="aero-progress"
                            ></v-progress-linear>
                            <div
                              class="text-caption mt-1 text-right font-weight-bold"
                            >
                              {{ node.vramUsage }}
                            </div>
                          </div>
                        </div>
                        <div class="w-50 d-flex align-center mt-2">
                          <v-icon color="error" size="small" class="mr-2"
                            >mdi-thermometer</v-icon
                          >
                          <span class="text-body-2"
                            ><strong>GPU:</strong> {{ node.gpuTemp }}</span
                          >
                        </div>
                        <div class="w-50 d-flex align-center mt-2">
                          <v-icon color="success" size="small" class="mr-2"
                            >mdi-cpu-64-bit</v-icon
                          >
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="add-node">
                <v-card class="aero-panel pa-6">
                  <h3 class="text-h5 font-weight-bold mb-4 aero-title-text">
                    Instrukcja podłączenia
                  </h3>
                  <p class="mb-6">
                    Uruchom poniższą komendę w terminalu maszyny z Dockerem i
                    sterownikami NVIDIA.
                  </p>

                  <div class="code-block-container position-relative mb-6">
                    <div
                      class="d-flex justify-space-between align-center code-header px-4 py-2"
                    >
                      <span class="font-weight-bold text-caption text-white"
                        ><v-icon start size="small">mdi-docker</v-icon>Docker
                        CLI</span
                      >
                      <v-btn
                        size="small"
                        variant="text"
                        color="white"
                        icon="mdi-content-copy"
                        @click="copyToClipboard(dockerCommand)"
                      ></v-btn>
                    </div>
                    <pre class="code-block pa-4 text-body-2">{{
                      dockerCommand
                    }}</pre>
                  </div>

                  <div
                    class="d-flex align-center justify-space-between flex-wrap ga-4"
                  >
                    <div>
                      <div
                        class="text-caption text-grey-darken-2 font-weight-bold mb-1"
                      >
                        Twój aktywny token API:
                      </div>
                      <v-chip
                        class="font-weight-black aero-chip-token"
                        color="primary"
                        variant="flat"
                      >
                        {{ config.providerToken }}
                      </v-chip>
                    </div>
                    <v-btn
                      class="aero-submit-btn-shiny"
                      prepend-icon="mdi-refresh"
                      @click="handleRegenerateToken"
                    >
                      Generuj nowy token
                    </v-btn>
                  </div>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* --- CORE AERO DESIGN --- */
.aero-bg {
  background: radial-gradient(circle at 50% -20%, #e0f2fe 0%, #f0fdf4 100%);
  min-height: 100vh;
}

.aero-glass {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 16px !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
}

.aero-window-header-simple {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(224, 242, 254, 0.8) 100%
  );
  padding: 10px 16px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(2, 132, 199, 0.2);
  border-radius: 16px 16px 0 0;
}

.vista-frame {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    /* Zmniejszona opozycja z 0.9 */ rgba(200, 230, 255, 0.2) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8) !important; /* Subtelna krawędź zamiast flary */
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}
/* Wewnętrzny kontener - musi być przezroczysty */
.aero-window-content {
  background: transparent !important;
}

/* Usunięcie domyślnej nakładki Vuetify, która często tworzy biały blask */
.v-card.vista-frame::before {
  display: none !important;
}

.aero-panel {
  background: rgba(255, 255, 255, 0.6) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03) !important;
}

.aero-panel-inset {
  background: rgba(0, 0, 0, 0.03) !important;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* --- COMPONENTS --- */
.aero-title-text {
  color: #0369a1 !important;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
}

.earnings-text {
  background: linear-gradient(to bottom, #16a34a 0%, #15803d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 2px rgba(34, 197, 94, 0.2));
}

.aero-submit-btn-shiny {
  background: linear-gradient(
    to bottom,
    #38bdf8 0%,
    #0284c7 50%,
    #0369a1 100%
  ) !important;
  color: white !important;
  border-radius: 50px !important;
  font-weight: 900 !important;
  text-transform: none !important;
  box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

/* --- CHARTS & ALERTS --- */
:deep(svg text) {
  fill: #0369a1 !important;
  font-weight: 800 !important;
  font-family: "Segoe UI", sans-serif;
}
.aero-chart-box {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.02);
  padding: 10px;
}

/* Etykiety wykresu - teraz bardziej kontrastowe na ciemniejszym szkle */
:deep(.v-sparkline text) {
  fill: #0369a1 !important;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}
.aero-alert-warning {
  background: rgba(255, 247, 237, 0.7) !important;
  border: 1px solid #fb923c !important;
  color: #9a3412 !important;
  font-weight: 700;
}

.aero-alert-error {
  background: rgba(254, 242, 242, 0.7) !important;
  border: 1px solid #f87171 !important;
  color: #991b1b !important;
  font-weight: 700;
}

.alert-icon-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
.alert-icon-dot.warning {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}
.alert-icon-dot.error {
  background: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

/* --- CODE BLOCK --- */
.code-block-container {
  background: rgba(15, 23, 42, 0.8) !important;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.5);
}
.code-block {
  color: #38bdf8;
  font-family: "Consolas", monospace;
}

/* --- PROGRESS BAR GELS --- */
.aero-progress {
  background: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
:deep(.v-progress-linear__determinate) {
  background: linear-gradient(to right, #0ea5e9, #38bdf8) !important;
}
</style>
