import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import {useConfigStore} from "../../core/config.ts";

export const useTaskStore = defineStore("task", () => {
    const config = useConfigStore();
  // Stan (State)
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
    const label = config.taskTypes.find((t: any) => t.value === newTask.type)?.label || "Inne";

    config.taskList.unshift({
      id: Date.now(),
      name: newTask.name || "Bez nazwy",
      type: label,
      model: newTask.baseModel,
      status: "Oczekujące",
      progress: 0,
    });

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
