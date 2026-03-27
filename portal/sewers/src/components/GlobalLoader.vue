<template>
  <v-overlay v-model="store.isLoading" class="align-center justify-center" persistent z-index="9999">
    <div class="aero-glass pa-8 vista-loader-container">
      <div class="text-subtitle-1 mb-2 vista-text">Trwa ładowanie...</div>
      <div class="vista-progress-track">
        <div class="vista-progress-bar"></div>
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { useLoaderStore } from '../core/loader'
const store = useLoaderStore()
</script>

<style scoped>
.vista-loader-container {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(0, 163, 232, 0.4);
  text-align: center;
}

.vista-text {
  color: #000;
  text-shadow: 0 0 5px white;
  font-weight: bold;
}

.v-theme--dark .vista-text {
  color: #fff;
  text-shadow: 0 0 5px black;
}

.vista-progress-track {
  height: 22px;
  background: #e0e0e0;
  border: 1px solid #999;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.vista-progress-bar {
  height: 100%;
  width: 40%;
  position: absolute;
  /* Charakterystyczny zielony gradient Visty */
  background: linear-gradient(180deg,
    #b3efb2 0%,
    #4ccf4a 45%,
    #21ad21 50%,
    #4ccf4a 55%,
    #b3efb2 100%);
  border-radius: 2px;
  animation: vista-slide 1.5s infinite linear;
  box-shadow: 0 0 10px rgba(76, 207, 74, 0.5);
}

.vista-progress-bar::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%);
}

@keyframes vista-slide {
  from { left: -50%; }
  to { left: 110%; }
}

.v-theme--dark .vista-progress-track {
  background: #333;
  border-color: #555;
}
</style>