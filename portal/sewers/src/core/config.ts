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

  return { taskList, taskTypes, availableModels }
})