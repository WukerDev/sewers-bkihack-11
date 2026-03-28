import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ConfigResponse,
  GetTasksResponse,
  Task,
  TaskType,
  Cluster,
  Metrics,
  User
} from '../proto/main'

const API_URL = 'http://localhost:8080/api'

export const useConfigStore = defineStore('config', () => {
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
        id: 'cl3', name: 'Szczecin Data', lat: 53.4285, lng: 14.8528, status: 'available',
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
    ]
  }

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

    const invoices = ref([
    {
      id: "INV-2026-02",
      date: "2026-02-28",
      amount: 1420.0,
      status: "Opłacona",
    },
    {
      id: "INV-2026-01",
      date: "2026-01-31",
      amount: 1150.2,
      status: "Opłacona",
    },
  ]);

    const currentMonthSpending = ref(502.5);
  const hourlyRate = ref(4.25); // Ile wydajemy na godzinę (PLN/h)

  const dailySpending = ref([42, 38, 45, 50, 48, 60, 55, 62, 58, 65]);
  const resourceUsage = ref([85, 72, 90]); // CPU, GPU, RAM w %

  // Inicjalizacja przy załadowaniu Store'a
  fetchConfigData()
  fetchTasks()

  return {
    metrics,
    metricsConfig,
    clusters,
    currentUser,
    taskTypes,
    availableModels,
    taskList,
    fetchConfigData,
    fetchTasks,
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