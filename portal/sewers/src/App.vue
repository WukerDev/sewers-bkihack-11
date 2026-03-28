<template>
  <v-app class="aero-root">
    <v-app-bar class="crystal-bar" elevation="0" height="85" fixed>
      <div class="aurora-layer"></div>

      <div class="bubble-container">
        <div v-for="n in 12" :key="n" class="bubble"></div>
      </div>

      <div class="glass-reflection"></div>

      <v-container fluid class="d-flex align-center px-10 content-layer">
        <v-app-bar-title class="aero-brand">
          <span class="logo-text">SEWERS</span>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <div class="nav-links-container d-none d-md-flex ga-2">
          <v-btn
            v-for="link in links"
            :key="link.title"
            :to="link.to"
            variant="text"
            class="crystal-btn"
            rounded="xl"
          >
            {{ link.title }}
          </v-btn>
        </div>

        <v-menu offset="15" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon class="avatar-crystal ml-6">
              <v-avatar size="44" class="inner-glow">
                <v-img
                  src="https://png.pngtree.com/png-vector/20240724/ourmid/pngtree-mouse-aero-png-image_12883749.png"
                  alt="Avatar"
                ></v-img>
              </v-avatar>
            </v-btn>
          </template>

          <v-list class="crystal-dropdown mt-2">
            <v-list-item
              v-for="item in profileMenu"
              :key="item.title"
              @click="item.action"
              class="crystal-item"
              :prepend-icon="item.icon"
            >
              <v-list-item-title class="font-weight-bold">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main class="main-viewport">
      <v-container fluid class="fill-height pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>

    <GlobalNotifications />
    <GlobalLoader />
    <GlobalContextMenu />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Opcjonalnie: Importuj swoje komponenty, jeśli ich używasz
// import GlobalNotifications from "./components/GlobalNotifications.vue";

const links = ref([
  { title: "Platforma", to: "/" },
  { title: "Widok Główny", to: "/dashboard" },
  { title: "Zadania", to: "/tasks" },
  { title: "Agenci AI", to: "/agents" },
  { title: "Finansowanie", to: "/billing" },
  { title: "Dla Dostawców", to: "/providers" },
  { title: "Klucze Dostępu", to: "/api" },
]);

const profileMenu = ref([
  {
    title: "Ustawienia",
    icon: "mdi-cog-outline",
    action: () => console.log("Settings"),
  },
  {
    title: "Wyloguj",
    icon: "mdi-logout-variant",
    action: () => console.log("Logout"),
  },
]);
</script>

<style scoped>
/* --- TŁO CAŁEJ APLIKACJI (ZORZA) --- */
.aero-root {
  background: url("https://static.wikitide.net/windowswallpaperwiki/thumb/2/2b/Img24_%28Windows_Vista%29.jpg/1280px-Img24_%28Windows_Vista%29.jpg")
    no-repeat center center fixed !important;
  background-size: cover !important;
}

/* --- KRYSZTAŁOWY PASEK (STRUKTURA) --- */
.crystal-bar {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(18px) saturate(220%) brightness(1.1) !important;
  -webkit-backdrop-filter: blur(18px) saturate(220%) brightness(1.1);

  /* Krawędzie tafli szkła */
  border-top: 2px solid rgba(255, 255, 255, 0.7) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
}

/* WARSTWA 1: Obrazek tła wewnątrz paska */
.aurora-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0.6; /* Przezroczystość grafiki wewnątrz paska */
  z-index: 1;
}

/* WARSTWA 2: Bąbelki 3D */
.bubble-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: overlay; /* Reagują na kolory Aurory */
}

.bubble {
  position: absolute;
  border-radius: 50%;
  bottom: -60px;
  background: radial-gradient(
    circle at 35% 35%,
    #fff 0%,
    rgba(56, 189, 248, 0.6) 40%,
    rgba(3, 105, 161, 0.8) 100%
  );
  border: 1px solid rgba(3, 105, 161, 0.3);
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.7),
    0 0 15px rgba(14, 165, 233, 0.4);
  animation: floatUp linear infinite;
}

/* WARSTWA 3: Połysk szkła */
.glass-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 3;
  pointer-events: none;
}

/* WARSTWA 4: Interfejs */
.content-layer {
  position: relative;
  z-index: 10;
}

/* --- ANIMACJE BĄBELKÓW --- */
@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: translateY(-50px) translateX(20px) scale(1.1);
  }
  100% {
    transform: translateY(-160px) translateX(-10px) scale(1.3);
    opacity: 0;
  }
}

/* Konfiguracja bąbelków */
.bubble:nth-child(1) {
  width: 28px;
  height: 28px;
  left: 10%;
  animation-duration: 7s;
}
.bubble:nth-child(2) {
  width: 16px;
  height: 16px;
  left: 25%;
  animation-duration: 5s;
  animation-delay: 2s;
}
.bubble:nth-child(3) {
  width: 34px;
  height: 34px;
  left: 40%;
  animation-duration: 9s;
  animation-delay: 1s;
}
.bubble:nth-child(4) {
  width: 20px;
  height: 20px;
  left: 55%;
  animation-duration: 8s;
  animation-delay: 3s;
}
.bubble:nth-child(5) {
  width: 30px;
  height: 30px;
  left: 70%;
  animation-duration: 11s;
}
.bubble:nth-child(6) {
  width: 18px;
  height: 18px;
  left: 85%;
  animation-duration: 6s;
  animation-delay: 4s;
}

/* --- ELEMENTY UI --- */
.aero-brand {
  font-weight: 950;
  font-size: 1.6rem;
  letter-spacing: 2px;
}
.logo-text {
  color: #ffffff;
}
.logo-suffix {
  color: #0ea5e9;
}

.crystal-btn {
  color: #0f172a !important;
  font-weight: 900 !important;
  text-transform: none !important;
  transition: all 0.3s ease;
}

.crystal-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-2px);
}

.avatar-crystal {
  background: rgba(255, 255, 255, 0.3) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.crystal-dropdown {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border-radius: 16px !important;
  border: 1px solid white !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1) !important;
}

.crystal-item:hover {
  background: #0284c7 !important;
  color: white !important;
}
</style>
