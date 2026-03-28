<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/core/notifications'

const notificationStore = useNotificationStore()
const activeTab = ref('dashboard')

// --- LOKALNY STAN (zamiast zewnętrznego Store'a) ---
const monthlyEarnings = ref<number>(12450.75)
const providerToken = ref<string>('sk-prov-9876543210abcdef')

const nodes = ref([
  {
    id: 'node-01',
    name: 'Politechnika - Lab AI (RTX 4090)',
    uptime: '14 dni, 6 godz.',
    powerUsage: '340W',
    vramUsage: '18.5GB / 24GB',
    gpuTemp: '68°C',
    cpuUsage: '12%',
    netLatency: '5ms',
    status: 'online'
  },
  {
    id: 'node-02',
    name: 'Politechnika - Lab AI (RTX 3090)',
    uptime: '5 dni, 12 godz.',
    powerUsage: '290W',
    vramUsage: '10GB / 24GB',
    gpuTemp: '74°C',
    cpuUsage: '18%',
    netLatency: '7ms',
    status: 'online'
  },
  {
    id: 'node-03',
    name: 'Serwerownia Wydziałowa (A100)',
    uptime: '-',
    powerUsage: '0W',
    vramUsage: '0GB / 40GB',
    gpuTemp: '-',
    cpuUsage: '0%',
    netLatency: '-',
    status: 'offline'
  },
  {
    id: 'node-04',
    name: 'Dyrektoriat (H100 NVLink)',
    uptime: '62 dni, 1 godz.',
    powerUsage: '450W',
    vramUsage: '38GB / 80GB',
    gpuTemp: '65°C',
    cpuUsage: '25%',
    netLatency: '2ms',
    status: 'maintenance'
  }
])

// --- MOCK DANYCH DO WYKRESÓW ---
const historicalEarnings = Array.from({ length: 7 }, (_, i) => ({ day: i+1, amount: monthlyEarnings.value * (1 + (Math.random() - 0.5) * 0.1) }))
const historicalLatency = Array.from({ length: 7 }, (_, i) => ({ day: i+1, latency: 4 + (Math.random() * 4) }))
const powerUsageData = [850, 890, 1020, 1050, 980, 1080, 1150, 1080] // w Watach
const vramUtilizationData = [45, 55, 78, 85, 90, 82, 65, 75] // w %

const formattedEarnings = computed(() => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(monthlyEarnings.value)
})

const dockerCommand = computed(() => {
  return `docker run -d --gpus all --name aero-node \\
  -e API_TOKEN="${providerToken.value}" \\
  -e PROVIDER_MODE="true" \\
  aero-network/worker:latest`
})

function generateNewToken() {
  const randomChars = Math.random().toString(36).substring(2, 15)
  providerToken.value = `sk-prov-${randomChars}`
}

// --- LOGIKA WIDOKU ---
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    notificationStore.showSnackbar('Skopiowano do schowka!', 'success')
  } catch (err) {
    notificationStore.showSnackbar('Nie udało się skopiować', 'error')
  }
}

function handleRegenerateToken() {
  notificationStore.showDialog({
    title: 'Uwaga',
    text: 'Wygenerowanie nowego tokenu spowoduje odłączenie obecnie działających węzłów używających starego klucza. Kontynuować?',
    confirmText: 'Generuj nowy',
    cancelText: 'Anuluj',
    onConfirm: () => {
      generateNewToken()
      notificationStore.showSnackbar('Wygenerowano nowy token API.', 'success')
    },
    onCancel: () => {}
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online': return 'success'
    case 'offline': return 'error'
    case 'maintenance': return 'warning'
    default: return 'info'
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="aero-glass pa-4 mb-6 d-flex align-center flex-wrap">
          <v-avatar color="transparent" size="large" class="mr-4">
            <v-icon color="primary" size="x-large">mdi-office-building</v-icon>
          </v-avatar>
          <div>
            <v-card-title class="text-h4 font-weight-bold aero-title-text mb-0">
              Panel Dostawcy
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 pb-2">
              Zarządzaj i monitoruj swoje maszyny obliczeniowe.
            </v-card-subtitle>
          </div>
          <v-spacer></v-spacer>
          <div class="aero-panel pa-3 d-flex flex-wrap ga-2 align-center">
            <v-chip color="primary" label><v-icon start>mdi-server-network</v-icon> Węzły: 4</v-chip>
            <v-chip color="success" label><v-icon start>mdi-brain</v-icon> Całkowita moc: ~22 TFLOPS</v-chip>
            <v-chip color="info" label><v-icon start>mdi-memory</v-icon> Zużycie VRAM: 14.2 GB</v-chip>
          </div>
        </v-card>

        <v-row>
          <v-col cols="12" md="7">
            <v-card class="vista-frame pa-1 text-center earnings-card h-100 w-100 d-flex">
              <div class="aero-window-content pa-6 d-flex flex-column justify-center align-center flex-grow-1">
                <v-icon size="56" color="primary" class="mb-4">mdi-cash-multiple</v-icon>
                <h2 class="text-h6 text-grey-darken-1 mb-2">Przychód w tym miesiącu</h2>
                <div class="text-h2 font-weight-black text-success earnings-text mb-4">
                  {{ formattedEarnings }}
                </div>
                <div class="d-flex justify-center align-center flex-wrap ga-4 mt-2 w-100">
                  <div class="aero-panel pa-2 text-center flex-grow-1" style="max-width: 200px;">
                    <div class="text-caption">Przewidywane (miesiąc)</div>
                    <div class="font-weight-bold text-success">~14 000 PLN</div>
                  </div>
                  <div class="aero-panel pa-2 text-center flex-grow-1" style="max-width: 200px;">
                    <div class="text-caption">Średni przychód/węzeł</div>
                    <div class="font-weight-bold text-success">~4 150 PLN</div>
                  </div>
                </div>

                <div class="aero-panel pa-4 mt-6 w-100">
                  <v-card-subtitle class="text-grey mb-2 px-0 text-center">Trend zarobków (ostatnie 7 dni)</v-card-subtitle>
                  <div class="aero-panel pa-2">
                    <v-sparkline
                      :model-value="historicalEarnings.map(d => d.amount / 30)"
                      color="success"
                      height="70"
                      padding="16"
                      stroke-linecap="round"
                      smooth="10"
                      fill
                      line-width="2"
                      auto-draw
                    >
                      <template v-slot:label="item">
                        {{ Math.round(item.value) }} zł
                      </template>
                    </v-sparkline>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
             <v-card class="aero-glass pa-4 h-100 d-flex flex-column">
                <v-card-title class="aero-title-text px-0"><v-icon start color="warning">mdi-alert-decagram</v-icon> Alerty i Wydajność</v-card-title>
                <v-card-text class="px-0 flex-grow-1 d-flex flex-column">
                    <div class="ga-4 d-flex flex-column mb-auto">
                        <v-alert type="warning" variant="tonal" border="start" density="compact">
                            RTX 4090: Wysoka temperatura (72°C) - Monitoruj
                        </v-alert>
                        <v-alert type="error" variant="tonal" border="start" density="compact">
                            A100: Rozpoczęto konserwację (planowaną)
                        </v-alert>
                    </div>
                    <div class="aero-panel pa-4 mt-6">
                        <v-card-subtitle class="text-grey mb-2 px-0">Średnie opóźnienie sieciowe (7 dni)</v-card-subtitle>
                        <div class="mock-chart-container latency-chart">
                            <v-sparkline :model-value="historicalLatency.map(d => d.latency)" :labels="historicalLatency.map(d => `${d.latency.toFixed(1)}ms`)" color="info" height="40" smooth line-width="2" padding="10" label-size="8"></v-sparkline>
                        </div>
                    </div>
                </v-card-text>
             </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <v-card class="aero-glass pa-4 h-100">
              <v-card-title class="aero-title-text px-0 pb-1">
                <v-icon start color="warning">mdi-lightning-bolt</v-icon> Sumaryczny Pobór Mocy
              </v-card-title>
              <v-card-subtitle class="px-0 pb-4">Ostatnie 8 godzin (w Watach)</v-card-subtitle>
              <div class="aero-panel pa-2">
                <v-sparkline
                  :model-value="powerUsageData"
                  color="warning"
                  height="60"
                  padding="10"
                  stroke-linecap="round"
                  smooth
                  fill
                  line-width="2"
                  auto-draw
                >
                  <template v-slot:label="item">
                    {{ item.value }}W
                  </template>
                </v-sparkline>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="aero-glass pa-4 h-100">
              <v-card-title class="aero-title-text px-0 pb-1">
                <v-icon start color="info">mdi-memory</v-icon> Utylizacja Pamięci VRAM
              </v-card-title>
              <v-card-subtitle class="px-0 pb-4">Średnie obciążenie (% całkowitej pojemności)</v-card-subtitle>
              <div class="aero-panel pa-2">
                 <v-sparkline
                  :model-value="vramUtilizationData"
                  color="info"
                  height="60"
                  padding="10"
                  stroke-linecap="round"
                  smooth
                  line-width="2"
                  auto-draw
                >
                  <template v-slot:label="item">
                    {{ item.value }}%
                  </template>
                </v-sparkline>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="aero-glass mt-6">
          <v-tabs v-model="activeTab" bg-color="transparent" color="primary">
            <v-tab value="dashboard">
              <v-icon start>mdi-server-network</v-icon>
              Status Węzłów
            </v-tab>
            <v-tab value="add-node">
              <v-icon start>mdi-plus-box-multiple</v-icon>
              Dodaj Węzeł
            </v-tab>
          </v-tabs>

          <v-card-text class="pt-6">
            <v-window v-model="activeTab" class="overflow-visible">

              <v-window-item value="dashboard" class="pa-1">
                <v-row>
                  <v-col cols="12" md="6" lg="4" v-for="node in nodes" :key="node.id">
                    <v-card class="aero-panel pa-5 h-100 d-flex flex-column">

                      <div class="d-flex justify-space-between align-center mb-4">
                        <div class="font-weight-bold text-subtitle-1 aero-title-text">{{ node.name }}</div>
                        <v-chip :color="getStatusColor(node.status)" size="small" variant="flat" class="font-weight-bold">
                          {{ node.status.toUpperCase() }}
                        </v-chip>
                      </div>

                      <v-divider class="mb-4"></v-divider>

                      <div class="d-flex flex-wrap ga-y-4">
                        <div class="w-50 d-flex align-center pr-2">
                          <v-icon color="primary" size="small" class="mr-2">mdi-clock-outline</v-icon>
                          <span class="text-body-2"><strong>Uptime:</strong> {{ node.uptime }}</span>
                        </div>
                        <div class="w-50 d-flex align-center">
                          <v-icon color="warning" size="small" class="mr-2">mdi-flash</v-icon>
                          <span class="text-body-2"><strong>Pobór:</strong> {{ node.powerUsage }}</span>
                        </div>

                        <div class="w-100">
                          <div class="aero-window-content pa-3">
                            <div class="d-flex align-center mb-1">
                              <v-icon color="info" size="small" class="mr-2">mdi-memory</v-icon>
                              <span class="text-body-2 font-weight-bold">VRAM:</span>
                            </div>
                            <v-progress-linear :model-value="parseFloat(node.vramUsage)" max="80" color="info" height="8" rounded></v-progress-linear>
                            <div class="text-caption mt-1 text-grey-darken-1">{{ node.vramUsage }}</div>
                          </div>
                        </div>

                        <div class="w-50 d-flex align-center pr-2">
                          <v-icon color="error" size="small" class="mr-2">mdi-thermometer</v-icon>
                          <span class="text-body-2"><strong>Temp. GPU:</strong> {{ node.gpuTemp }}</span>
                        </div>
                         <div class="w-50 d-flex align-center">
                          <v-icon color="success" size="small" class="mr-2">mdi-cpu-64-bit</v-icon>
                          <span class="text-body-2"><strong>CPU:</strong> {{ node.cpuUsage }}</span>
                        </div>

                         <div class="w-100 d-flex align-center mt-2">
                          <v-icon color="primary" size="small" class="mr-2">mdi-network-outline</v-icon>
                          <span class="text-body-2"><strong>Opóźnienie:</strong> {{ node.netLatency }}</span>
                        </div>
                      </div>

                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="add-node">
                <v-card class="aero-panel pa-6">
                  <h3 class="text-h5 font-weight-bold mb-4 aero-title-text">Instrukcja podłączenia</h3>
                  <p class="mb-6">
                    Aby podłączyć nową maszynę do sieci, upewnij się, że masz zainstalowane sterowniki NVIDIA oraz
                    <strong>Docker</strong> z obsługą kontenerów GPU. Uruchom poniższą komendę w terminalu swojej maszyny.
                  </p>

                  <div class="code-block-container position-relative mb-6">
                    <div class="d-flex justify-space-between align-center code-header px-4 py-2">
                      <span class="font-weight-bold text-caption"><v-icon start size="small">mdi-docker</v-icon>Docker CLI</span>
                      <v-btn size="small" variant="text" icon="mdi-content-copy" @click="copyToClipboard(dockerCommand)"></v-btn>
                    </div>
                    <pre class="code-block pa-4 text-body-2">{{ dockerCommand }}</pre>
                  </div>

                  <div class="d-flex align-center justify-space-between flex-wrap ga-4">
                    <div>
                      <div class="text-caption text-grey-darken-1 mb-1">Twój aktualny token API:</div>
                      <v-chip class="font-weight-bold" color="primary" variant="tonal">
                        {{ providerToken }}
                      </v-chip>
                    </div>

                    <v-btn class="aero-submit-btn-shiny" prepend-icon="mdi-refresh" @click="handleRegenerateToken">
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
.earnings-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.earnings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(74, 222, 128, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.1);
}

.earnings-text {
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8), 2px 2px 5px rgba(74, 222, 128, 0.3);
  letter-spacing: -1px;
}

.code-block-container {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  color: #e2e8f0;
}

.code-header {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-block {
  margin: 0;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;
}

.v-theme--dark .code-block-container {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mock-chart-container {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.earnings-trend-chart {
  height: 60px;
}

.latency-chart {
  height: 100px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}
</style>