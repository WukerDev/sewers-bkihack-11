/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";
// Styles
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#0284c7", // Główny błękit przycisków
          secondary: "#034d77", // Ciemny granat do tekstów
          background: "#E6F2FF", // Tło aplikacji
          surface: "#FFFFFF", // Powierzchnia kart
          accent: "#00D1FF",
          error: "#FF3366",
          info: "#38bdf8", // Jasny błękit (Sky)
          success: "#16a34a", // Zielony (Aero Green)
          warning: "#ea580c", // Pomarańczowy (Aero Orange)

          // Specyficzne kolory dla stylu Aero
          "aero-navy": "#034d77",
          "aero-blue-light": "#bae6fd",
          "aero-border": "#bae6fd",
          "aero-glass": "rgba(255, 255, 255, 0.4)",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#00BFFF",
          secondary: "#00FF7F",
          background: "#051024",
          surface: "#1A2B4C",
          accent: "#00FFFF",
          error: "#FF4D4D",
          info: "#4AC8FA",
          success: "#4CAF50",
          warning: "#FFD700",
        },
      },
    },
  },
});
