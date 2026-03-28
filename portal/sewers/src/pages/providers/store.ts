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

  const nodes = ref<NodeMetrics[]>([
    {
      id: 'node-01',
      name: 'Politechnika - Lab AI (RTX 4090)',
      uptime: '14 dni, 6 godz.',
      powerUsage: '340W',
      vramUsage: '18.5GB / 24GB',
      gpuTemp: '68°C',
      status: 'online'
    },
    {
      id: 'node-02',
      name: 'Politechnika - Lab AI (RTX 3090)',
      uptime: '5 dni, 12 godz.',
      powerUsage: '290W',
      vramUsage: '10GB / 24GB',
      gpuTemp: '74°C',
      status: 'online'
    },
    {
      id: 'node-03',
      name: 'Serwerownia Wydziałowa (A100)',
      uptime: '-',
      powerUsage: '0W',
      vramUsage: '0GB / 40GB',
      gpuTemp: '-',
      status: 'offline'
    }
  ])

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
    nodes,
    dockerCommand,
    generateNewToken
  }
})