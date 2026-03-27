/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

export default createVuetify({
theme: {
  defaultTheme: 'light',
  themes: {
    light: {
      dark: false,
      colors: {
        primary: '#00A3E8',
        secondary: '#8CC63F',
        background: '#E6F2FF',
        surface: '#FFFFFF',
        accent: '#00D1FF',
        error: '#FF3366',
        info: '#00C0FF',
        success: '#32CD32',
        warning: '#FFB900'
      }
    },
    dark: {
      dark: true,
      colors: {
        primary: '#00BFFF',
        secondary: '#00FF7F',
        background: '#051024',
        surface: '#1A2B4C',
        accent: '#00FFFF',
        error: '#FF4D4D',
        info: '#4AC8FA',
        success: '#4CAF50',
        warning: '#FFD700'
      }
    }
  }
}
})
