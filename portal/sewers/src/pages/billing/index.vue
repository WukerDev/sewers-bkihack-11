<script setup lang="ts">
import { onMounted } from "vue";
import { useBillingStore } from "./store";

const store = useBillingStore();

onMounted(() => {
  store.startLiveCounter();
});
</script>
<template>
  <v-container class="py-8 aero-wrapper" style="max-width: 1000px">
    <v-row class="mb-6 relative-top" align="stretch">
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="frutiger-card pa-6 d-flex flex-column h-100 w-100">
          <div class="gloss-overlay"></div>
          <div
            class="relative-content d-flex flex-column justify-center flex-grow-1"
          >
            <div class="section-label text-headline-large">
              Stan Konta Bilingowego
            </div>
            <div class="d-flex align-center justify-space-between">
              <div
                class="text-headline-small font-weight-black aero-text-gradient"
              >
                {{ store.currentMonthSpending.toFixed(2) }}
                <span class="text-h4">PLN</span>
              </div>
              <v-icon
                size="70"
                color="rgba(2, 132, 199, 0.2)"
                class="aero-icon-reflect"
                >mdi-finance</v-icon
              >
            </div>
            <div
              class="text-caption text-secondary font-weight-bold d-flex align-center mt-2"
            >
              Aktualne tempo: {{ store.hourlyRate }} PLN / h
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <v-card class="frutiger-card pa-6 d-flex flex-column h-100 w-100">
          <div class="gloss-overlay"></div>
          <div
            class="relative-content flex-grow-1 d-flex flex-column justify-center"
          >
            <div class="section-label text-headline-large mb-4">
              Użycie Zasobów
            </div>
            <div
              v-for="(val, i) in ['CPU', 'GPU', 'RAM']"
              :key="i"
              class="mb-3"
            >
              <div
                class="d-flex justify-space-between text-caption font-weight-black mb-1"
              >
                <span>{{ val }}</span>
                <span class="text-primary">{{ store.resourceUsage[i] }}%</span>
              </div>
              <div class="aero-progress-container">
                <div
                  class="aero-progress-bar"
                  :style="{ width: store.resourceUsage[i] + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="frutiger-card mb-6 pa-6">
      <div class="gloss-overlay"></div>
      <div class="section-label mb-4">Trend Wydatków</div>
      <v-sparkline
        :model-value="store.dailySpending"
        color="#0078d4"
        height="80"
        padding="20"
        stroke-linecap="round"
        smooth
        line-width="4"
        fill
      >
        <template v-slot:label="item"> {{ item.value }}zł </template>
      </v-sparkline>
    </v-card>

    <v-card class="frutiger-card overflow-hidden">
      <v-table class="aero-table">
        <thead>
          <tr class="aero-table-header">
            <th>Faktura</th>
            <th>Data</th>
            <th>Kwota</th>
            <th class="text-center">Pobierz</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in store.invoices"
            :key="invoice.id"
            class="aero-tr"
          >
            <td class="font-weight-bold">{{ invoice.id }}</td>
            <td>{{ invoice.date }}</td>
            <td class="text-primary font-weight-black">
              {{ invoice.amount.toFixed(2) }} PLN
            </td>
            <td class="text-center">
              <v-btn
                icon="mdi-download-circle"
                variant="text"
                color="primary"
                class="aero-btn-glow"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<style scoped>
/* BACKGROUND ELEMENTS */
.aero-wrapper {
  position: relative;
  overflow: visible;
}
.relative-top {
  position: relative;
  z-index: 2;
}

/* THE FRUTIGER CARD */
.frutiger-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(186, 230, 253, 0.4) 100%
  ) !important;
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 28px !important;
  box-shadow:
    0 15px 35px rgba(0, 100, 200, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.6) !important;
  position: relative;
  overflow: hidden;
}

.gloss-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.relative-content {
  position: relative;
  z-index: 2;
}

/* PROGRESS BARS (SKEUOMORPHIC) */
.aero-progress-container {
  background: rgba(0, 0, 0, 0.08);
  height: 14px;
  border-radius: 20px;
  padding: 2px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.aero-progress-bar {
  height: 100%;
  background: linear-gradient(
    to bottom,
    #4ade80 0%,
    #22c55e 45%,
    #15803d 50%,
    #166534 100%
  );
  border-radius: 20px;
  position: relative;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* TYPOGRAPHY */
.aero-text-gradient {
  background: linear-gradient(to bottom, #034d77, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.section-label {
  font-weight: 900;
  color: #034d77;
  letter-spacing: 1.5px;
}

.aero-icon-reflect {
  filter: drop-shadow(0 0 10px rgba(2, 132, 199, 0.3));
  transform: scaleY(-1); /* Odbicie lustrzane ikony */
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>
