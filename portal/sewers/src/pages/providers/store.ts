import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface NodeMetrics {
  id: string
  name: string
  uptime: string
  powerUsage: string
  vramUsage: string
  gpuTemp: string
  status: 'online' | 'offline' | 'maintenance'
}

export const useProvidersStore = defineStore('providers', () => {
  // --- State ---
  const monthlyEarnings = ref<number>(12450.75)
  const providerToken = ref<string>('sk-prov-9876543210abcdef')



  // --- Getters ---
  const formattedEarnings = computed(() => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(monthlyEarnings.value)
  })

  const dockerCommand = computed(() => {
    return `docker run -d --gpus all --name aero-node \\
  -e API_TOKEN="${providerToken.value}" \\
  -e PROVIDER_MODE="true" \\
  aero-network/worker:latest`
  })

  // --- Actions ---
  function generateNewToken() {
    const randomChars = Math.random().toString(36).substring(2, 15)
    providerToken.value = `sk-prov-${randomChars}`
  }

  return {
    monthlyEarnings,
    formattedEarnings,
    providerToken,
    dockerCommand,
    generateNewToken
  }
})