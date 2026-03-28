import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const useBillingStore = defineStore("billing", () => {
  // Stan wydatków
  const currentMonthSpending = ref(502.5);
  const hourlyRate = ref(4.25); // Ile wydajemy na godzinę (PLN/h)

  const dailySpending = ref([42, 38, 45, 50, 48, 60, 55, 62, 58, 65]);
  const resourceUsage = ref([85, 72, 90]); // CPU, GPU, RAM w %

  // Lista faktur
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

  const startLiveCounter = () => {
    const increment = hourlyRate.value / 3600 / 10;
    setInterval(() => {
      currentMonthSpending.value += increment;
    }, 100);
  };
  setInterval(() => {
    resourceUsage.value = resourceUsage.value.map((v) =>
      Math.max(10, Math.min(100, v + (Math.random() > 0.5 ? 4 : -4))),
    );
  }, 2000);

  return {
    currentMonthSpending,
    hourlyRate,
    dailySpending,
    resourceUsage,
    invoices,
    startLiveCounter,
  };
});
