<template>
  <v-container fluid class="pa-0 aero-main-bg">
    <div class="aero-bubble b1"></div>
    <div class="aero-bubble b2"></div>

    <v-row
      class="hero-gradient text-white py-16 text-center relative-top"
      align="center"
      justify="center"
    >
      <v-col cols="12" md="8" class="px-6 py-12">
        <h1 class="text-h2 font-weight-black mb-6 mt-10 aero-title">
          Zarabiaj na uśpionej mocy. <br />
          <span class="text-highlight">Trenuj AI za ułamek ceny.</span>
        </h1>
        <p class="text-h5 mb-10 text-white opacity-90 font-weight-medium">
          Pierwsza zdecentralizowana sieć GPU. Łączymy firmy szukające taniej
          mocy z właścicielami potężnych stacji roboczych.
        </p>

        <div class="d-flex justify-center gap-6 flex-wrap pb-10">
          <v-btn class="aero-btn green-gloss px-10" size="x-large" rounded="xl">
            Chcę wytrenować model
          </v-btn>
          <v-btn
            class="aero-btn blue-gloss px-10 ml-0 ml-md-8"
            size="x-large"
            rounded="xl"
            variant="elevated"
          >
            Chcę udostępnić sprzęt
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-container class="py-16 relative-top">
      <v-row>
        <v-col v-for="(feature, i) in features" :key="i" cols="12" md="4">
          <v-card class="frutiger-card h-100 pa-4">
            <div class="gloss-overlay"></div>
            <v-card-text class="text-center pa-6 relative-content">
              <div class="icon-sphere mb-6" :class="feature.color">
                <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="text-h5 font-weight-black mb-4 text-blue-darken-4">
                {{ feature.title }}
              </h3>
              <p class="text-body-1 text-blue-grey-darken-2 font-weight-medium">
                {{ feature.desc }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-row class="pb-16 pb-16 relative-top" align="center" justify="center">
      <v-col cols="12" md="8" class="text-center px-6">
        <h2 class="text-h3 font-weight-black mb-4 text-blue-darken-4">
          Kalkulator korzyści
        </h2>

        <v-card class="frutiger-card pa-8 mt-8 overflow-visible">
          <div class="gloss-overlay"></div>
          <div class="relative-content">
            <h3 class="text-h4 mb-8 text-blue-darken-3 font-weight-bold">
              Posiadam: <span class="text-primary">{{ gpuCount }}</span> x
              <span class="text-primary">{{ selectedGpu.title }}</span>
            </h3>

            <v-select
              v-model="selectedGpu"
              :items="gpuOptions"
              item-title="title"
              return-object
              variant="solo"
              flat
              class="aero-select mb-6"
            ></v-select>

            <v-slider
              v-model="gpuCount"
              min="1"
              max="100"
              step="1"
              color="primary"
              track-color="blue-lighten-4"
              thumb-label="always"
              class="mt-10"
            ></v-slider>

            <v-divider class="my-8 opacity-20"></v-divider>

            <p class="text-h5 text-blue-grey-darken-1 mb-2 font-weight-bold">
              Szacowany zysk miesięczny:
            </p>
            <p
              class="text-h2 font-weight-black text-green-darken-1 profit-text"
            >
              {{ monthlyProfit.toLocaleString("pl-PL") }} PLN
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.aero-main-bg {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-gradient {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%);
  opacity: 0.9;
  border-bottom: 5px solid #0ea5e9;
  position: relative;
}

/* BĄBELKI TŁA */
.aero-bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.6),
    rgba(2, 132, 199, 0.05)
  );
  z-index: 1;
}
.b1 {
  width: 500px;
  height: 500px;
  top: -100px;
  right: -100px;
}
.b2 {
  width: 300px;
  height: 300px;
  bottom: 100px;
  left: -50px;
  opacity: 0.5;
}

.relative-top {
  position: relative;
  z-index: 2;
}

.frutiger-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.6) 100%
  ) !important;
  backdrop-filter: blur(15px);
  border: 1px solid white !important;
  border-radius: 30px !important;
  box-shadow:
    0 20px 40px rgba(0, 77, 122, 0.1),
    inset 0 0 15px white !important;
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

.aero-btn {
  font-weight: 900 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.green-gloss {
  background: linear-gradient(
    to bottom,
    #4ade80 0%,
    #16a34a 50%,
    #15803d 100%
  ) !important;
  color: white !important;
}

.blue-gloss {
  background: linear-gradient(
    to bottom,
    #38bdf8 0%,
    #0ea5e9 50%,
    #0284c7 100%
  ) !important;
  color: white !important;
}

.icon-sphere {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  /* Core sphere lighting */
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 10%,
    rgba(180, 180, 180, 0.6) 25%,
    rgba(80, 80, 80, 0.7) 60%,
    rgba(20, 20, 20, 1) 100%
  );

  /* Glow + depth */
  box-shadow:
    0 0 15px rgba(255, 255, 255, 0.6),
    /* tight glow */ 0 0 40px rgba(255, 255, 255, 0.4),
    /* medium glow */ 0 0 80px rgba(255, 255, 255, 0.25),
    /* outer glow */ inset 0 -15px 20px rgba(0, 0, 0, 0.6),
    inset 0 8px 15px rgba(255, 255, 255, 0.6);
}
.icon-sphere::after {
  content: "";
  position: absolute;
  top: 8%;
  left: 18%;
  width: 45%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.4) 60%,
    transparent 100%
  );
  filter: blur(3px);
}
.bg-green {
  background: radial-gradient(circle at 30% 30%, #4ade80, #16a34a);
}
.bg-blue {
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0ea5e9);
}
.bg-orange {
  background: radial-gradient(circle at 30% 30%, #fbbf24, #d97706);
}

/* TEKST */
.aero-title {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  line-height: 1.1;
}

.text-highlight {
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.profit-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: linear-gradient(to bottom, #16a34a, #15803d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* INPUTY */
:deep(.aero-select .v-field) {
  border-radius: 15px !important;
  background: white !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e2e8f0 !important;
}
</style>
<script setup lang="ts">
import { ref, computed } from "vue";

const gpuCount = ref(1);
const gpuOptions = [
  { title: "NVIDIA RTX 3090 (24GB)", profit: 800 },
  { title: "NVIDIA RTX 4090 (24GB)", profit: 1500 },
  { title: "NVIDIA A100 (80GB)", profit: 4500 },
  { title: "NVIDIA H100 (80GB)", profit: 9000 },
];
const selectedGpu = ref(gpuOptions[1]);
const monthlyProfit = computed(() => gpuCount.value * selectedGpu.value.profit);

const features = [
  {
    title: "Znacznie taniej niż AWS",
    icon: "mdi-rocket-launch",
    color: "bg-green",
    desc: "Wykorzystujemy uśpioną moc uczelni i software house'ów.",
  },
  {
    title: "Zdecentralizowany Mesh",
    icon: "mdi-web",
    color: "bg-blue",
    desc: "Setki zweryfikowanych węzłów w Polsce i Europie.",
  },
  {
    title: "Zyskuj pasywnie",
    icon: "mdi-currency-usd",
    color: "bg-orange",
    desc: "Podłącz węzeł jedną komendą Dockera i generuj przychód.",
  },
];
</script>
