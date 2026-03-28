import { defineStore } from 'pinia'
import {computed, ref} from 'vue'
import {
  ConfigResponse,
  GetTasksResponse,
  Task,
  TaskType,
  Cluster,
  Metrics,
  User,
  Invoice,
  GetBillingResponse
} from '../proto/main'
import type {Agent} from "../pages/agents/store.ts";
import type {NodeMetrics} from "../pages/providers/store.ts";

const API_URL = 'http://localhost/api'

export const useConfigStore = defineStore('config', () => {

    const MOCK_BILLING: GetBillingResponse = {
    invoices: [
      { id: "INV-2026-02", date: "2026-02-28", amount: 1420.0, status: "Opłacona" },
      { id: "INV-2026-01", date: "2026-01-31", amount: 1150.2, status: "Opłacona" }
    ],
    currentMonthSpending: 502.5,
    hourlyRate: 4.25,
    dailySpending: [42, 38, 45, 50, 48, 60, 55, 62, 58, 65],
    resourceUsage: [85, 72, 90]
  }

  const invoices = ref<Invoice[]>([])
  const currentMonthSpending = ref(0)
  const hourlyRate = ref(0)
  const dailySpending = ref<number[]>([])
  const resourceUsage = ref<number[]>([])

  async function fetchBillingData() {
    try {
      const response = await fetch(`${API_URL}/BillingService/GetBilling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (!response.ok) throw new Error()

      const data: GetBillingResponse = await response.json()

      invoices.value = data.invoices
      currentMonthSpending.value = data.currentMonthSpending
      hourlyRate.value = data.hourlyRate
      dailySpending.value = data.dailySpending
      resourceUsage.value = data.resourceUsage
    } catch (e) {
      invoices.value = MOCK_BILLING.invoices
      currentMonthSpending.value = MOCK_BILLING.currentMonthSpending
      hourlyRate.value = MOCK_BILLING.hourlyRate
      dailySpending.value = MOCK_BILLING.dailySpending
      resourceUsage.value = MOCK_BILLING.resourceUsage
    }
  }

const MOCK_CONFIG: ConfigResponse = {
  metrics: {
    onlineNodes: 128,
    totalVram: '3.2 TB',
    queuedTasks: 15,
    companies: 12,
    gpus: 500
  },
  currentUser: {
    id: 'u-782',
    name: 'Admin',
    avatar: 'https://9611ebabdd7aa7a3c429-608cd691ca2791bf39ae82b0c902da1a.ssl.cf1.rackcdn.com/0-Betsy_redo_3.jpg',
    role: 'admin',
    balance: 1450.50,
    currency: 'PLN'
  },
  taskTypes: [
    { value: "finetuning", label: "Fine-tuning modelu (LoRA)", icon: "mdi-auto-fix", description: "Dotrenowanie modelu na Twoich danych." },
    { value: "inference", label: "Przetwarzanie wsadowe (Inference)", icon: "mdi-database-export", description: "Masowe generowanie odpowiedzi/predykcji." },
    { value: "embeddings", label: "Generowanie Embeddingów (RAG)", icon: "mdi-vector-selection", description: "Przygotowanie bazy wiedzy dla agentów AI." },
    { value: "automl", label: "Strojenie hiperparametrów (AutoML)", icon: "mdi-tune-vertical", description: "Optymalizacja parametrów modelu." },
    { value: "pretraining", label: "Trening od zera (Pre-training)", icon: "mdi-fountain-pen-tip", description: "Zarezerwowane dla węzłów o potężnej mocy." },
    { value: "rendering", label: "Rozproszona farma renderująca (3D)", icon: "mdi-video-3d", description: "Blender, Cinema4D, Maya." },
    { value: "upscaling", label: "Transkodowanie i upscaling wideo", icon: "mdi-movie-filter", description: "Poprawa jakości materiałów przez AI." },
    { value: "datascience", label: "Akcelerowana analiza danych", icon: "mdi-chart-scatter-plot", description: "Przetwarzanie baz danych na GPU (RAPIDS)." },
    { value: "simulations", label: "Symulacje inżynieryjne (CAE)", icon: "mdi-molecule", description: "Dynamika płynów i badania naukowe." }
  ],
  availableModels: ["Bielik-11B", "Llama-3-8B", "Mistral-7B", "Mixtral-8x7B"],
  clusters: [
    {
      id: 'cl1', name: 'Warszawa', lat: 52.2297, lng: 21.0122, status: 'available',
      companies: [
        { id: 'c1', name: 'TechCore Data', status: 'available', servers: [
          { id: 's1', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.15, load: 10, status: 'available', availability: '24/7' },
          { id: 's2', gpu: 'RTX 3090', vram: '24 GB', ram: '64 GB', cpuThreads: 32, pricePerTflops: 0.10, load: 95, status: 'busy', availability: '08:00 - 20:00' }
        ]},
        { id: 'c2', name: 'CyberAI Warsaw', status: 'deploying', servers: [
          { id: 's3', gpu: 'A100', vram: '80 GB', ram: '256 GB', cpuThreads: 128, pricePerTflops: 0.45, load: 100, status: 'deploying', availability: '24/7' }
        ]}
      ]
    },
    {
      id: 'cl2', name: 'Kraków', lat: 50.0647, lng: 19.9450, status: 'busy',
      companies: [
        { id: 'c3', name: 'Vistula Render', status: 'busy', servers: [
          { id: 's4', gpu: 'RTX 4080', vram: '16 GB', ram: '64 GB', cpuThreads: 32, pricePerTflops: 0.12, load: 90, status: 'busy', availability: 'Weekend' }
        ]}
      ]
    },
    {
      id: 'cl3', name: 'Szczecin', lat: 53.4285, lng: 14.8528, status: 'available',
      companies: [
        { id: 'c4', name: 'Pomerania Compute', status: 'available', servers: [
          { id: 's5', gpu: 'A6000', vram: '48 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.30, load: 20, status: 'available', availability: '24/7' }
        ]},
        { id: 'c5', name: 'Szczecin AI', status: 'available', servers: [
          { id: 's6', gpu: 'RTX 3080', vram: '10 GB', ram: '32 GB', cpuThreads: 16, pricePerTflops: 0.08, load: 5, status: 'available', availability: '24/7' }
        ]},
        { id: 'c6', name: 'DeepNode', status: 'offline', servers: [
          { id: 's7', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.16, load: 0, status: 'offline', availability: '24/7' }
        ]}
      ]
    },
      {
    id: 'cl4', name: 'Wrocław', lat: 51.1079, lng: 17.0385, status: 'deploying',
    companies: [
      { id: 'c7', name: 'Odra Machine Learning', status: 'deploying', servers: [
        { id: 's8', gpu: 'H100', vram: '80 GB', ram: '256 GB', cpuThreads: 128, pricePerTflops: 0.85, load: 0, status: 'deploying', availability: '24/7' },
        { id: 's9', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.16, load: 0, status: 'deploying', availability: '24/7' }
      ]},
      { id: 'c8', name: 'Wrocław Tech Compute', status: 'busy', servers: [
        { id: 's10', gpu: 'RTX 3090', vram: '24 GB', ram: '64 GB', cpuThreads: 32, pricePerTflops: 0.10, load: 98, status: 'busy', availability: 'Noce i Weekendy' }
      ]}
    ]
  },
  {
    id: 'cl5', name: 'Poznań', lat: 52.4064, lng: 16.9252, status: 'available',
    companies: [
      { id: 'c9', name: 'Warta AI Labs', status: 'available', servers: [
        { id: 's11', gpu: 'A100', vram: '40 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.40, load: 60, status: 'available', availability: '24/7' }
      ]},
      { id: 'c10', name: 'PyraRender', status: 'busy', servers: [
        { id: 's12', gpu: 'RTX 4080', vram: '16 GB', ram: '64 GB', cpuThreads: 24, pricePerTflops: 0.11, load: 100, status: 'busy', availability: '24/7' },
        { id: 's13', gpu: 'RTX 4080', vram: '16 GB', ram: '64 GB', cpuThreads: 24, pricePerTflops: 0.11, load: 90, status: 'busy', availability: '24/7' }
      ]}
    ]
  },
  {
    id: 'cl6', name: 'Gdańsk', lat: 54.3520, lng: 18.6466, status: 'offline',
    companies: [
      { id: 'c11', name: 'Tricity Cloud', status: 'offline', servers: [
        { id: 's14', gpu: 'L40S', vram: '48 GB', ram: '256 GB', cpuThreads: 64, pricePerTflops: 0.50, load: 0, status: 'offline', availability: '24/7' }
      ]},
      { id: 'c12', name: 'Baltic Node', status: 'offline', servers: [
        { id: 's15', gpu: 'RTX 3090', vram: '24 GB', ram: '128 GB', cpuThreads: 32, pricePerTflops: 0.09, load: 0, status: 'offline', availability: '18:00 - 06:00' }
      ]}
    ]
  },
  {
    id: 'cl7', name: 'Łódź', lat: 51.7592, lng: 19.4560, status: 'available',
    companies: [
      { id: 'c13', name: 'Industrial Compute', status: 'available', servers: [
        { id: 's16', gpu: 'A6000 Ada', vram: '48 GB', ram: '256 GB', cpuThreads: 64, pricePerTflops: 0.35, load: 10, status: 'available', availability: '24/7' },
        { id: 's17', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.15, load: 30, status: 'available', availability: '24/7' }
      ]}
    ]
  },
  {
    id: 'cl8', name: 'Katowice', lat: 50.2649, lng: 19.0238, status: 'available',
    companies: [
      { id: 'c14', name: 'Silesia Data Center', status: 'available', servers: [
        { id: 's18', gpu: 'H100 NVL', vram: '188 GB', ram: '512 GB', cpuThreads: 128, pricePerTflops: 1.20, load: 50, status: 'available', availability: '24/7' }
      ]},
      { id: 'c15', name: 'KatoRender', status: 'busy', servers: [
        { id: 's19', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 64, pricePerTflops: 0.14, load: 100, status: 'busy', availability: 'Weekendy' }
      ]}
    ]
  },
  {
    id: 'cl9', name: 'Lublin', lat: 51.2465, lng: 22.5684, status: 'available',
    companies: [
      { id: 'c16', name: 'East Node', status: 'available', servers: [
        { id: 's20', gpu: 'V100', vram: '32 GB', ram: '128 GB', cpuThreads: 32, pricePerTflops: 0.25, load: 5, status: 'available', availability: '24/7' }
      ]}
    ]
  },
      {
    id: 'cl10', name: 'Bydgoszcz', lat: 53.1235, lng: 18.0084, status: 'available',
    companies: [
      { id: 'c17', name: 'Brda AI Compute', status: 'available', servers: [
        { id: 's21', gpu: 'A40', vram: '48 GB', ram: '256 GB', cpuThreads: 64, pricePerTflops: 0.28, load: 35, status: 'available', availability: '24/7' },
        { id: 's22', gpu: 'RTX 4090', vram: '24 GB', ram: '128 GB', cpuThreads: 32, pricePerTflops: 0.15, load: 12, status: 'available', availability: 'Weekendy' }
      ]},
      { id: 'c18', name: 'Bydgoszcz Tech Hub', status: 'offline', servers: [
        { id: 's23', gpu: 'RTX 3080 Ti', vram: '12 GB', ram: '64 GB', cpuThreads: 16, pricePerTflops: 0.08, load: 0, status: 'offline', availability: '24/7' }
      ]}
    ]
  },
  {
    id: 'cl11', name: 'Toruń', lat: 53.0138, lng: 18.5984, status: 'deploying',
    companies: [
      { id: 'c19', name: 'Copernicus Node', status: 'deploying', servers: [
        { id: 's24', gpu: 'H100', vram: '80 GB', ram: '512 GB', cpuThreads: 128, pricePerTflops: 0.88, load: 0, status: 'deploying', availability: '24/7' },
        { id: 's25', gpu: 'A100', vram: '40 GB', ram: '256 GB', cpuThreads: 64, pricePerTflops: 0.42, load: 0, status: 'deploying', availability: 'Noce' }
      ]}
    ]
  }
  ]
}

 const deployedAgents = ref<Agent[]>([
    {
      id: "A-01",
      name: "Aero-Analyst",
      specialization: "Analiza Umów",
      status: "Online",
      monthlyCost: 450,
      node: "Warsaw-Alpha",
      avatar: "mdi-robot-vacuum",
    },
    {
      id: "A-02",
      name: "Nexus-Shield",
      specialization: "Cybersecurity",
      status: "Processing",
      monthlyCost: 890,
      node: "Berlin-Beta",
      avatar: "mdi-shield-check",
    },
    {
      id: "A-03",
      name: "Flow-Master",
      specialization: "Optymalizacja Mesh",
      status: "Online",
      monthlyCost: 320,
      node: "Prague-Gamma",
      avatar: "mdi-waves",
    },
  ]);

  const agentTemplates = ref([
    { name: "Prawnik AI", spec: "Analiza Umów", cost: 600, icon: "mdi-gavel" },
    {
      name: "Kodujący Bot",
      spec: "Debugowanie Python",
      cost: 400,
      icon: "mdi-xml",
    },
    {
      name: "Social Media Pro",
      spec: "Generowanie treści",
      cost: 300,
      icon: "mdi-share-variant",
    },
    {
      name: "Analityk Finansowy",
      spec: "Prognozy rynkowe",
      cost: 750,
      icon: "mdi-chart-line",
    },
  ]);

  const MOCK_TASKS: GetTasksResponse = {
    tasks: [
      { id: 1, name: "Trening asystenta medycznego", type: "Fine-tuning (LoRA)", model: "Bielik-11B", status: "W trakcie", progress: 65 },
      { id: 2, name: "Analiza logów systemowych Q3", type: "Inference", model: "Llama-3-8B", status: "Zakończone", progress: 100 }
    ]
  }

  const metrics = ref<Metrics>(MOCK_CONFIG.metrics!)
  const clusters = ref<Cluster[]>([])
  const currentUser = ref<User>(MOCK_CONFIG.currentUser!)
  const taskTypes = ref<TaskType[]>([])
  const availableModels = ref<string[]>([])
  const taskList = ref<Task[]>([])

  const metricsConfig = {
    onlineNodes: { label: 'Węzłów online' },
    totalVram: { label: 'Całkowity VRAM' },
    queuedTasks: { label: 'Zadań w kolejce' },
    companies: { label: 'Firm w sieci' },
    gpus: { label: 'Kart graficznych' }
  }

  async function fetchConfigData() {
    try {
      const response = await fetch(`${API_URL}/DashboardService/GetConfig`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Pusty GetConfigRequest
      })
      if (!response.ok) throw new Error('Network response was not ok')

      const data: ConfigResponse = await response.json()

      metrics.value = data.metrics!
      clusters.value = data.clusters
      currentUser.value = data.currentUser!
      taskTypes.value = data.taskTypes
      availableModels.value = data.availableModels

    } catch (e) {
      console.warn("⚠️ Błąd połączenia z serwerem gRPC. Ładowanie mocków (Config)...")
      metrics.value = MOCK_CONFIG.metrics!
      clusters.value = MOCK_CONFIG.clusters
      currentUser.value = MOCK_CONFIG.currentUser!
      taskTypes.value = MOCK_CONFIG.taskTypes
      availableModels.value = MOCK_CONFIG.availableModels
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_URL}/TaskService/GetTasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (!response.ok) throw new Error('Network response was not ok')

      const data: GetTasksResponse = await response.json()
      taskList.value = data.tasks

    } catch (e) {
      console.warn("⚠️ Błąd połączenia z serwerem gRPC. Ładowanie mocków (Tasks)...")
      taskList.value = MOCK_TASKS.tasks
    }
  }

  async function removeTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/TaskService/RemoveTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error()
      taskList.value = taskList.value.filter(t => t.id !== id)
    } catch (e) {
      console.warn(`🛠️ MOCK: Usuwanie zadania o ID=${id}`)
      taskList.value = taskList.value.filter(t => t.id !== id)
    }
  }

  async function pauseTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/TaskService/PauseTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error()
      const data = await response.json()

      const idx = taskList.value.findIndex(t => t.id === id)
      if (idx !== -1 && data.task) taskList.value[idx] = data.task
    } catch (e) {
      console.warn(`🛠️ MOCK: Pauzowanie zadania o ID=${id}`)
      const task = taskList.value.find(t => t.id === id)
      if (task && task.status === "W trakcie") task.status = "Wstrzymane"
    }
  }

  async function stopTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/TaskService/StopTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error()
      const data = await response.json()

      const idx = taskList.value.findIndex(t => t.id === id)
      if (idx !== -1 && data.task) taskList.value[idx] = data.task
    } catch (e) {
      console.warn(`🛠️ MOCK: Zatrzymywanie zadania o ID=${id}`)
      const task = taskList.value.find(t => t.id === id)
      if (task && task.status !== "Zakończone") task.status = "Zatrzymane"
    }
  }

  async function editTask(id: number, updatedData: Partial<Task>) {
    try {
      const response = await fetch(`${API_URL}/TaskService/EditTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      })
      if (!response.ok) throw new Error()
      const data = await response.json()

      const idx = taskList.value.findIndex(t => t.id === id)
      if (idx !== -1 && data.task) taskList.value[idx] = data.task
    } catch (e) {
      console.warn(`🛠️ MOCK: Edycja zadania o ID=${id}`, updatedData)
      const task = taskList.value.find(t => t.id === id)
      if (task) {
        if (updatedData.name) task.name = updatedData.name
        if (updatedData.type) task.type = updatedData.type
        if (updatedData.model) task.model = updatedData.model
      }
    }
  }
    const apiKeys = ref([
    { id: '1', name: 'Main Backend App', key: 'sk-gniazdo-7cc1-4b82-9d3f', createdAt: '2026-03-15' },
    { id: '2', name: 'Mobile Integration', key: 'sk-gniazdo-9aa2-11e3-8b22', createdAt: '2026-03-20' }
  ])

    const nodes = ref([
  {
    id: 'node-01',
    name: 'Politechnika - Lab AI (RTX 4090)',
    uptime: '14 dni, 6 godz.',
    powerUsage: '340W',
    vramUsage: '18.5GB / 24GB',
    gpuTemp: '68°C',
    cpuUsage: '12%',
    netLatency: '5ms',
    status: 'online'
  },
  {
    id: 'node-02',
    name: 'Politechnika - Lab AI (RTX 3090)',
    uptime: '5 dni, 12 godz.',
    powerUsage: '290W',
    vramUsage: '10GB / 24GB',
    gpuTemp: '74°C',
    cpuUsage: '18%',
    netLatency: '7ms',
    status: 'online'
  },
  {
    id: 'node-03',
    name: 'Serwerownia Wydziałowa (A100)',
    uptime: '-',
    powerUsage: '0W',
    vramUsage: '0GB / 40GB',
    gpuTemp: '-',
    cpuUsage: '0%',
    netLatency: '-',
    status: 'offline'
  },
  {
    id: 'node-04',
    name: 'Dyrektoriat (H100 NVLink)',
    uptime: '62 dni, 1 godz.',
    powerUsage: '450W',
    vramUsage: '38GB / 80GB',
    gpuTemp: '65°C',
    cpuUsage: '25%',
    netLatency: '2ms',
    status: 'maintenance'
  }
])
const providerToken = ref<string>('sk-prov-9876543210abcdef')
const monthlyEarnings = ref<number>(12450.75)

const historicalEarnings = Array.from({ length: 7 }, (_, i) => ({ day: i+1, amount: monthlyEarnings.value * (1 + (Math.random() - 0.5) * 0.1) }))
const historicalLatency = Array.from({ length: 7 }, (_, i) => ({ day: i+1, latency: 4 + (Math.random() * 4) }))
const powerUsageData = [850, 890, 1020, 1050, 980, 1080, 1150, 1080] // w Watach
const vramUtilizationData = [45, 55, 78, 85, 90, 82, 65, 75] // w %
      const nodesProvided = ref<NodeMetrics[]>([
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



  fetchConfigData()
  fetchTasks()
  fetchBillingData()

  return {
    metrics,
    metricsConfig,
    clusters,
    currentUser,
    taskTypes,
    availableModels,
    taskList,
      nodes,
      deployedAgents,
      powerUsageData,
      agentTemplates,
      apiKeys,
      providerToken,
      historicalEarnings,
      historicalLatency,
      vramUtilizationData,
    fetchConfigData,
    fetchTasks,
      monthlyEarnings,
      nodesProvided,
    removeTask,
    pauseTask,
    stopTask,
    editTask,
      invoices,
      currentMonthSpending,
      hourlyRate,
      dailySpending,
      resourceUsage

  }
})