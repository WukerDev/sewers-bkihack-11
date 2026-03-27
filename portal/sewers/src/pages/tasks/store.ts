import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

export const useTaskStore = defineStore("task", () => {
  // Stan (State)
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
  const newTask = reactive({
    name: "",
    type: "finetuning",
    configFile: null,
    datasetLink: "",
    baseModel: "Bielik-11B",
    priority: 50,
  });

  // Getters (Computed)
  const estimatedCost = computed(
    () => 40 + Math.round((newTask.priority / 100) * 260),
  );
  const estimatedTime = computed(() =>
    (24 - (newTask.priority / 100) * 22).toFixed(1),
  );

  // Akcje (Actions)
  const getStatusColor = (s: string) =>
    s === "Zakończone" ? "success" : s === "W trakcie" ? "primary" : "warning";

  const getStatusIcon = (s: string) =>
    s === "Zakończone"
      ? "mdi-check-circle"
      : s === "W trakcie"
        ? "mdi-cog-play"
        : "mdi-clock-outline";

  const addTask = () => {
    const label =
      taskTypes.find((t) => t.value === newTask.type)?.label || "Inne";
    taskList.value.unshift({
      id: Date.now(),
      name: newTask.name,
      type: label,
      model: newTask.baseModel,
      status: "Oczekujące",
      progress: 0,
    });
    // Reset formularza po dodaniu
    newTask.datasetLink = "";
    newTask.configFile = null;
  };

  return {
    availableModels,
    taskList,
    taskTypes,
    newTask,
    estimatedCost,
    estimatedTime,
    getStatusColor,
    getStatusIcon,
    addTask,
  };
});
