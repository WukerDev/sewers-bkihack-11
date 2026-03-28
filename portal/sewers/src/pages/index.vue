<template>
  <v-container fluid class="pa-0 bg-grey-darken-4">
    <v-row class="bg-grey-darken-4 text-white py-16 text-center" align="center" justify="center">
      <v-col cols="12" md="8" class="px-6">
        <h1 class="text-h2 font-weight-black mb-6 mt-10">Zarabiaj na uśpionej mocy. Trenuj AI za ułamek ceny.</h1>
        <p class="text-h5 mb-10 text-grey-lighten-1">Pierwsza zdecentralizowana sieć GPU. Łączymy firmy szukające taniej mocy obliczeniowej z właścicielami potężnych stacji roboczych.</p>

        <div class="d-flex justify-center gap-6 flex-wrap">
          <v-btn color="success" size="x-large" elevation="8" class="text-body-1 font-weight-bold px-8">
            Chcę wytrenować model
          </v-btn>
          <v-btn color="info" size="x-large" variant="outlined" class="text-body-1 font-weight-bold px-8 bg-black">
            Chcę udostępnić sprzęt
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-container class="py-16 mt-8">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="aero-glass h-100 rounded-xl" elevation="0" border>
            <v-card-text class="text-center pa-8">
              <v-icon size="72" color="success" class="mb-6">mdi-rocket-launch-outline</v-icon>
              <h3 class="text-h5 font-weight-bold mb-4 text-white">Nawet 70% taniej niż AWS</h3>
              <p class="text-body-1 text-grey-lighten-1">Wykorzystujemy uśpioną moc uczelni i software house'ów, drastycznie tnąc koszty treningu modeli LoRA i renderingu 3D.</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="aero-glass h-100 rounded-xl" elevation="0" border>
            <v-card-text class="text-center pa-8">
              <v-icon size="72" color="info" class="mb-6">mdi-server-network</v-icon>
              <h3 class="text-h5 font-weight-bold mb-4 text-white">Zdecentralizowany Mesh</h3>
              <p class="text-body-1 text-grey-lighten-1">Setki zweryfikowanych węzłów w Polsce i Europie. Zdecyduj suwakiem, czy priorytetem jest budżet, czy prędkość przetwarzania.</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="aero-glass h-100 rounded-xl" elevation="0" border>
            <v-card-text class="text-center pa-8">
              <v-icon size="72" color="warning" class="mb-6">mdi-cash-fast</v-icon>
              <h3 class="text-h5 font-weight-bold mb-4 text-white">Zyskuj pasywnie</h3>
              <p class="text-body-1 text-grey-lighten-1">Masz w firmie wydajne GPU? Podłącz węzeł jedną komendą Dockera i generuj przychód, gdy sprzęt stoi bezczynnie po godzinach pracy.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-row class="bg-grey-darken-4 text-white py-16 mt-16" align="center" justify="center">
      <v-col cols="12" md="8" class="text-center px-6">
        <h2 class="text-h3 font-weight-black mb-4">Kalkulator korzyści dla dostawców</h2>
        <p class="text-h6 mb-10 text-grey-lighten-1">Sprawdź, ile możesz zarobić na uśpionej mocy obliczeniowej w swojej firmie.</p>

        <v-card class="aero-glass pa-8 rounded-xl" elevation="10" border color="grey-darken-3">
          <h3 class="text-h4 mb-6 text-white font-weight-bold">
            Posiadam: <span class="text-info">{{ gpuCount }}</span> x <span class="text-info">{{ selectedGpu.title }}</span>
          </h3>

          <v-select
            v-model="selectedGpu"
            :items="gpuOptions"
            item-title="title"
            return-object
            label="Model karty graficznej"
            variant="outlined"
            color="success"
            bg-color="grey-darken-4"
            class="mb-6"
          ></v-select>

          <v-slider
            v-model="gpuCount"
            min="1"
            max="100"
            step="1"
            color="success"
            track-color="grey-darken-1"
            thumb-label="always"
            class="mb-6"
          ></v-slider>

          <v-divider class="my-6 border-opacity-50" color="grey-lighten-1"></v-divider>


            <p class="text-h1 text-grey-lighten-1 mb-2">Szacowany zysk miesięczny:</p>
            <p class="text-h2 font-weight-black text-success">{{ monthlyProfit.toLocaleString('pl-PL') }} PLN</p>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useHomeStore } from './store'
import { onMounted, ref, computed } from 'vue'

const homeStore = useHomeStore()

const gpuCount = ref(1)

const gpuOptions = [
  { title: 'NVIDIA RTX 3090 (24GB)', profit: 800 },
  { title: 'NVIDIA RTX 4090 (24GB)', profit: 1500 },
  { title: 'NVIDIA A100 (80GB)', profit: 4500 },
  { title: 'NVIDIA H100 (80GB)', profit: 9000 }
]

const selectedGpu = ref(gpuOptions[1])

const monthlyProfit = computed(() => gpuCount.value * selectedGpu.value.profit)

onMounted(() => {
  homeStore.fetchItems()
})
</script>

<style scoped>
.aero-glass {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.aero-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}
</style>