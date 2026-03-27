import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const metrics = ref({
    onlineNodes: 128,
    totalVram: '3.2 TB',
    queuedTasks: 15,
    companies: 12,
    gpus: 500
  })

  // Stan UI
  const openedClusterId = ref<string | null>(null) // Który klaster jest rozwinięty
  const selectedCompanyId = ref<string | null>(null) // Która firma jest kliknięta (do pokazania sprzętu)

  // Zagnieżdżona struktura danych: Klastry (Miasta) -> Firmy -> Serwery
  const clusters = ref([
    {
      id: 'cl1', name: 'Warsaw Core', lat: 52.2297, lng: 21.0122, status: 'available',
      companies: [
        { id: 'c1', name: 'TechCore Data', status: 'available', servers: [
          { id: 's1', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.15, load: 10, status: 'available', availability: '24/7' },
          { id: 's2', gpu: 'RTX 3090', vram: '24 GB', ram: '64 GB', cpuThreads: 32, pricePerTflops: 0.10, load: 95, status: 'busy', availability: '08:00 - 20:00' }
        ]},
        { id: 'c2', name: 'CyberAI Warsaw', status: 'busy', servers: [
          { id: 's3', gpu: 'A100', vram: '80 GB', ram: '256 GB', cpuThreads: 128, pricePerTflops: 0.45, load: 100, status: 'busy', availability: '24/7' }
        ]}
      ]
    },
    {
      id: 'cl2', name: 'Cracow AI Grid', lat: 50.0647, lng: 19.9450, status: 'busy',
      companies: [
        { id: 'c3', name: 'Vistula Render', status: 'busy', servers: [
          { id: 's4', gpu: 'RTX 4080', vram: '16 GB', ram: '64 GB', cpuThreads: 32, pricePerTflops: 0.12, load: 90, status: 'busy', availability: 'Weekend' }
        ]}
      ]
    },
    {
      id: 'cl3', name: 'Szczecin Data', lat: 53.4285, lng: 14.8528, status: 'available', // Prawidłowa lokacja głębiej w PL
      companies: [
        { id: 'c4', name: 'Pomerania Compute', status: 'available', servers: [
          { id: 's5', gpu: 'A6000', vram: '48 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.30, load: 20, status: 'available', availability: '24/7' }
        ]},
        { id: 'c5', name: 'Szczecin AI', status: 'available', servers: [
          { id: 's6', gpu: 'RTX 3080', vram: '10 GB', ram: '32 GB', cpuThreads: 16, pricePerTflops: 0.08, load: 5, status: 'available', availability: '24/7' }
        ]},
        { id: 'c6', name: 'DeepNode', status: 'busy', servers: [
          { id: 's7', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.16, load: 99, status: 'busy', availability: '24/7' }
        ]}
      ]
    }
  ])

  // Computed: zwraca dane wybranej firmy do sekcji dolnej
  const selectedCompany = computed(() => {
    if (!selectedCompanyId.value) return null;
    for (const cluster of clusters.value) {
      const company = cluster.companies.find(c => c.id === selectedCompanyId.value)
      if (company) return { clusterName: cluster.name, ...company }
    }
    return null
  })

  // Akcje
  function toggleCluster(clusterId: string) {
    // Jeśli klikniemy w otwarty klaster, to go zamknij. Jeśli w inny, otwórz ten inny.
    openedClusterId.value = openedClusterId.value === clusterId ? null : clusterId
  }

  function selectCompany(companyId: string | null) {
    selectedCompanyId.value = companyId
  }

  return {
    metrics,
    clusters,
    openedClusterId,
    selectedCompanyId,
    selectedCompany,
    toggleCluster,
    selectCompany
  }
})