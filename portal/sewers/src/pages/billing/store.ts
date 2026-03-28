import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import {useConfigStore} from "../../core/config";

export const useBillingStore = defineStore("billing", () => {
    const config=useConfigStore();




  const startLiveCounter = () => {
    const increment = config.hourlyRate / 3600 / 10;
    setInterval(() => {
      config.currentMonthSpending += increment;
    }, 100);
  };
  setInterval(() => {
    config.resourceUsage = config.resourceUsage.map((v) =>
      Math.max(10, Math.min(100, v + (Math.random() > 0.5 ? 4 : -4))),
    );
  }, 2000);

  return {
    startLiveCounter,
  };
});
