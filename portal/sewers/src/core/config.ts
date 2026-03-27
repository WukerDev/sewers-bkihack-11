import { defineStore } from 'pinia'
import {ref, computed, reactive} from 'vue'

export const useConfigStore = defineStore('config', () => {
  const taskList = ref([
    {
      id: 1,
      name: "Trening asystenta medycznego",
      type: "Fine-tuning (LoRA)",
      model: "Bielik-11B",
      status: "W trakcie",
      progress: 65,
    },
    {
      id: 2,
      name: "Analiza logów systemowych Q3",
      type: "Inference",
      model: "Llama-3-8B",
      status: "Zakończone",
      progress: 100,
    },
  ]);

  const taskTypes = [
    {
      value: "finetuning",
      label: "Fine-tuning modelu (LoRA)",
      icon: "mdi-auto-fix",
      description: "Dotrenowanie modelu na Twoich danych.",
    },
    {
      value: "inference",
      label: "Przetwarzanie wsadowe (Inference)",
      icon: "mdi-database-export",
      description: "Masowe generowanie odpowiedzi/predykcji.",
    },
    {
      value: "embeddings",
      label: "Generowanie Embeddingów (RAG)",
      icon: "mdi-vector-selection",
      description: "Przygotowanie bazy wiedzy dla agentów AI.",
    },
    {
      value: "automl",
      label: "Strojenie hiperparametrów (AutoML)",
      icon: "mdi-tune-vertical",
      description: "Optymalizacja parametrów modelu.",
    },
    {
      value: "pretraining",
      label: "Trening od zera (Pre-training)",
      icon: "mdi-fountain-pen-tip",
      description: "Zarezerwowane dla węzłów o potężnej mocy.",
    },
    {
      value: "rendering",
      label: "Rozproszona farma renderująca (3D)",
      icon: "mdi-video-3d",
      description: "Blender, Cinema4D, Maya.",
    },
    {
      value: "upscaling",
      label: "Transkodowanie i upscaling wideo",
      icon: "mdi-movie-filter",
      description: "Poprawa jakości materiałów przez AI.",
    },
    {
      value: "datascience",
      label: "Akcelerowana analiza danych",
      icon: "mdi-chart-scatter-plot",
      description: "Przetwarzanie baz danych na GPU (RAPIDS).",
    },
    {
      value: "simulations",
      label: "Symulacje inżynieryjne (CAE)",
      icon: "mdi-molecule",
      description: "Dynamika płynów i badania naukowe.",
    },
  ];
  const availableModels = [
    "Bielik-11B",
    "Llama-3-8B",
    "Mistral-7B",
    "Mixtral-8x7B",
  ];

    const metrics = ref({
    onlineNodes: 128,
    totalVram: '3.2 TB',
    queuedTasks: 15,
    companies: 12,
    gpus: 500
  })

    const metricsConfig = {
  onlineNodes: { label: 'Węzłów online' },
  totalVram: { label: 'Całkowity VRAM' },
  queuedTasks: { label: 'Zadań w kolejce' },
  companies: { label: 'Firm w sieci' },
  gpus: { label: 'Kart graficznych' }
}

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


  return { taskList, taskTypes, availableModels, metrics, metricsConfig, clusters }
})