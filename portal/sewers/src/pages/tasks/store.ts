import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { useConfigStore } from "../../core/config";

export const useTaskStore = defineStore("task", () => {
  const config = useConfigStore();
  const newTask = reactive({
    name: "",
    type: "finetuning",
    configFile: null,
    datasetLink: "",
    baseModel: "Bielik-11B",
    priority: 50,
  });
  const estimatedCost = computed(
    () => 40 + Math.round((newTask.priority / 100) * 260)
  );
  const estimatedTime = computed(() =>
    (24 - (newTask.priority / 100) * 22).toFixed(1)
  );
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Zakończone": return "success";
      case "W trakcie": return "primary";
      case "Oczekujące": return "info";
      case "Wstrzymane": return "warning";
      case "Zatrzymane": return "error";
      default: return "grey";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Zakończone": return "mdi-check-circle";
      case "W trakcie": return "mdi-cog-play";
      case "Oczekujące": return "mdi-clock-outline";
      case "Wstrzymane": return "mdi-pause-circle";
      case "Zatrzymane": return "mdi-stop-circle";
      default: return "mdi-help-circle";
    }
  };
  const addTask = async () => {
    const label = config.taskTypes.find((t: any) => t.value === newTask.type)?.label || "Inne";
    const createdTask = {
      id: Date.now(),
      name: newTask.name || "Nowe zadanie (Bez nazwy)",
      type: label,
      model: newTask.baseModel,
      status: "Oczekujące",
      progress: 0,
    };

    config.taskList.unshift(createdTask);
    newTask.name = "";
    newTask.datasetLink = "";
    newTask.configFile = null;
    newTask.priority = 50;
  };

  return {
    newTask,
    estimatedCost,
    estimatedTime,
    getStatusColor,
    getStatusIcon,
    addTask,
  };
});