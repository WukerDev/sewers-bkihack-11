import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  ConfigResponse,
  GetTasksResponse,
  Task,
  TaskType,
  Cluster,
  Metrics,
  User,
  Invoice,
  GetBillingResponse,
} from "../proto/main";
import type { Agent } from "../pages/agents/store.ts";
import type { NodeMetrics } from "../pages/providers/store.ts";
/*
import {
  DashboardServiceClientImpl,
  TaskServiceClientImpl,
  BillingServiceClientImpl,
  ApiServiceClientImpl,
  ProviderServiceClientImpl,
  AgentServiceClientImpl,
  GrpcWebImpl
} from '../proto/main'

const rpc = new GrpcWebImpl('http://localhost:8080', { debug: false })

const dashboardClient = new DashboardServiceClientImpl(rpc)
const taskClient = new TaskServiceClientImpl(rpc)
const billingClient = new BillingServiceClientImpl(rpc)
const apiClient = new ApiServiceClientImpl(rpc)
const providerClient = new ProviderServiceClientImpl(rpc)
const agentClient = new AgentServiceClientImpl(rpc)
*/

const dashboardClient = {
  GetConfig: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
const taskClient = {
  GetTasks: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
  RemoveTask: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
  PauseTask: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
  StopTask: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
  EditTask: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
const billingClient = {
  GetBilling: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
const apiClient = {
  GetApiKeys: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
const providerClient = {
  GetNodes: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
const agentClient = {
  GetAgents: async (req: any) => {
    throw new Error("Wymuszony mock");
  },
} as any;
export const useConfigStore = defineStore("config", () => {
  const MOCK_BILLING: GetBillingResponse = {
    invoices: [
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
    ],
    currentMonthSpending: 502.5,
    hourlyRate: 4.25,
    dailySpending: [42, 38, 45, 50, 48, 60, 55, 62, 58, 65],
    resourceUsage: [85, 72, 90],
  };

  const invoices = ref<Invoice[]>([]);
  const currentMonthSpending = ref(0);
  const hourlyRate = ref(0);
  const dailySpending = ref<number[]>([]);
  const resourceUsage = ref<number[]>([]);

  async function fetchBillingData() {
    try {
      const data: GetBillingResponse = await billingClient.GetBilling({});

      invoices.value = data.invoices;
      currentMonthSpending.value = data.currentMonthSpending;
      hourlyRate.value = data.hourlyRate;
      dailySpending.value = data.dailySpending;
      resourceUsage.value = data.resourceUsage;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetBilling. Ładowanie mocków...");
      invoices.value = MOCK_BILLING.invoices;
      currentMonthSpending.value = MOCK_BILLING.currentMonthSpending;
      hourlyRate.value = MOCK_BILLING.hourlyRate;
      dailySpending.value = MOCK_BILLING.dailySpending;
      resourceUsage.value = MOCK_BILLING.resourceUsage;
    }
  }

  const MOCK_CONFIG: ConfigResponse = {
    metrics: {
      onlineNodes: 128,
      totalVram: "3.2 TB",
      queuedTasks: 15,
      companies: 12,
      gpus: 500,
    },

    currentUser: {
      id: "u-782",
      name: "Admin",
      avatar:
        "https://9611ebabdd7aa7a3c429-608cd691ca2791bf39ae82b0c902da1a.ssl.cf1.rackcdn.com/0-Betsy_redo_3.jpg",
      role: "admin",
      balance: 1450.5,
      currency: "PLN",
    },
    taskTypes: [
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
    ],
    availableModels: ["Bielik-11B", "Llama-3-8B", "Mistral-7B", "Mixtral-8x7B"],
    clusters: [
      {
        id: "cl1",
        name: "Warszawa",
        lat: 52.2297,
        lng: 21.0122,
        status: "available",
        companies: [
          {
            id: "c1",
            name: "TechCore Data",
            status: "available",
            manholes: [
              {
                id: "s1",
                name: "Server Alpha 1",
                ownerId: "c1",
                owner: undefined,
                ram: 128,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 21.0122,
                cityLatitude: 52.2297,
                address: "Złota 44, 00-120 Warszawa",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s1",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 45,
                    threadsUsage: 10,
                  },
                ],
                gpus: [
                  {
                    id: "g-s1",
                    model: "RTX 4090",
                    vram: 24,
                    gpuId: 1,
                    temperature: 65,
                    vramUsage: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl2",
        name: "Kraków",
        lat: 50.0647,
        lng: 19.945,
        status: "busy",
        companies: [
          {
            id: "c3",
            name: "Vistula Render",
            status: "busy",
            manholes: [
              {
                id: "s4",
                name: "Render Node K1",
                ownerId: "c3",
                owner: undefined,
                ram: 64,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 19.945,
                cityLatitude: 50.0647,
                address: "Pawia 5, 31-154 Kraków",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 28800, nanos: 0 },
                    windowEnd: { seconds: 57600, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 28800, nanos: 0 },
                    windowEnd: { seconds: 57600, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 28800, nanos: 0 },
                    windowEnd: { seconds: 57600, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 28800, nanos: 0 },
                    windowEnd: { seconds: 57600, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 28800, nanos: 0 },
                    windowEnd: { seconds: 57600, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 0, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 0, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s4",
                    model: "AMD Threadripper",
                    threads: 32,
                    cpuId: 1,
                    temperature: 60,
                    threadsUsage: 90,
                  },
                ],
                gpus: [
                  {
                    id: "g-s4",
                    model: "RTX 4080",
                    vram: 16,
                    gpuId: 1,
                    temperature: 75,
                    vramUsage: 90,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl3",
        name: "Szczecin",
        lat: 53.4285,
        lng: 14.8528,
        status: "available",
        companies: [
          {
            id: "c4",
            name: "Pomerania Compute",
            status: "available",
            manholes: [
              {
                id: "s5",
                name: "Deep Sea Node",
                ownerId: "c4",
                owner: undefined,
                ram: 128,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 14.8528,
                cityLatitude: 53.4285,
                address: "Niemierzyńska 17, 71-441 Szczecin",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s5",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 50,
                    threadsUsage: 20,
                  },
                ],
                gpus: [
                  {
                    id: "g-s5",
                    model: "A6000",
                    vram: 48,
                    gpuId: 1,
                    temperature: 60,
                    vramUsage: 20,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl4",
        name: "Wrocław",
        lat: 51.1079,
        lng: 17.0385,
        status: "deploying",
        companies: [
          {
            id: "c7",
            name: "Odra Machine Learning",
            status: "deploying",
            manholes: [
              {
                id: "s8",
                name: "Odra H100 Cluster",
                ownerId: "c7",
                owner: undefined,
                ram: 256,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 17.0385,
                cityLatitude: 51.1079,
                address: "Plac Grunwaldzki 22, 50-363 Wrocław",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s8",
                    model: "AMD EPYC",
                    threads: 128,
                    cpuId: 1,
                    temperature: 30,
                    threadsUsage: 0,
                  },
                ],
                gpus: [
                  {
                    id: "g-s8",
                    model: "H100",
                    vram: 80,
                    gpuId: 1,
                    temperature: 35,
                    vramUsage: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl5",
        name: "Poznań",
        lat: 52.4064,
        lng: 16.9252,
        status: "available",
        companies: [
          {
            id: "c9",
            name: "Warta AI Labs",
            status: "available",
            manholes: [
              {
                id: "s11",
                name: "Warta Alpha",
                ownerId: "c9",
                owner: undefined,
                ram: 128,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 16.9252,
                cityLatitude: 52.4064,
                address: "Półwiejska 32, 61-888 Poznań",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s11",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 50,
                    threadsUsage: 60,
                  },
                ],
                gpus: [
                  {
                    id: "g-s11",
                    model: "A100",
                    vram: 40,
                    gpuId: 1,
                    temperature: 65,
                    vramUsage: 60,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl6",
        name: "Gdańsk",
        lat: 54.352,
        lng: 18.6466,
        status: "offline",
        companies: [
          {
            id: "c11",
            name: "Tricity Cloud",
            status: "offline",
            manholes: [
              {
                id: "s14",
                name: "Baltic Server",
                ownerId: "c11",
                owner: undefined,
                ram: 256,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 18.6466,
                cityLatitude: 54.352,
                address: "Grunwaldzka 141, 80-264 Gdańsk",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s14",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 0,
                    threadsUsage: 0,
                  },
                ],
                gpus: [
                  {
                    id: "g-s14",
                    model: "L40S",
                    vram: 48,
                    gpuId: 1,
                    temperature: 0,
                    vramUsage: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl7",
        name: "Łódź",
        lat: 51.7592,
        lng: 19.456,
        status: "available",
        companies: [
          {
            id: "c13",
            name: "Industrial Compute",
            status: "available",
            manholes: [
              {
                id: "s16",
                name: "Factory Node",
                ownerId: "c13",
                owner: undefined,
                ram: 256,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 19.456,
                cityLatitude: 51.7592,
                address: "Piotrkowska 104, 90-006 Łódź",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s16",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 45,
                    threadsUsage: 10,
                  },
                ],
                gpus: [
                  {
                    id: "g-s16",
                    model: "A6000 Ada",
                    vram: 48,
                    gpuId: 1,
                    temperature: 55,
                    vramUsage: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl8",
        name: "Katowice",
        lat: 50.2649,
        lng: 19.0238,
        status: "available",
        companies: [
          {
            id: "c14",
            name: "Silesia Data Center",
            status: "available",
            manholes: [
              {
                id: "s18",
                name: "Silesia H100",
                ownerId: "c14",
                owner: undefined,
                ram: 512,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 19.0238,
                cityLatitude: 50.2649,
                address: "Chorzowska 50, 40-101 Katowice",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s18",
                    model: "AMD EPYC",
                    threads: 128,
                    cpuId: 1,
                    temperature: 48,
                    threadsUsage: 50,
                  },
                ],
                gpus: [
                  {
                    id: "g-s18",
                    model: "H100 NVL",
                    vram: 188,
                    gpuId: 1,
                    temperature: 68,
                    vramUsage: 50,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl9",
        name: "Lublin",
        lat: 51.2465,
        lng: 22.5684,
        status: "available",
        companies: [
          {
            id: "c16",
            name: "East Node",
            status: "available",
            manholes: [
              {
                id: "s20",
                name: "East Server 1",
                ownerId: "c16",
                owner: undefined,
                ram: 128,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 22.5684,
                cityLatitude: 51.2465,
                address: "Zana 39, 20-601 Lublin",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s20",
                    model: "Intel Xeon",
                    threads: 32,
                    cpuId: 1,
                    temperature: 40,
                    threadsUsage: 5,
                  },
                ],
                gpus: [
                  {
                    id: "g-s20",
                    model: "V100",
                    vram: 32,
                    gpuId: 1,
                    temperature: 50,
                    vramUsage: 5,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl10",
        name: "Bydgoszcz",
        lat: 53.1235,
        lng: 18.0084,
        status: "available",
        companies: [
          {
            id: "c17",
            name: "Brda AI Compute",
            status: "available",
            manholes: [
              {
                id: "s21",
                name: "Brda Machine",
                ownerId: "c17",
                owner: undefined,
                ram: 256,
                get pricePerTeraflopDay() { return Number((0.004 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 18.0084,
                cityLatitude: 53.1235,
                address: "Fordońska 2, 85-085 Bydgoszcz",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s21",
                    model: "AMD EPYC",
                    threads: 64,
                    cpuId: 1,
                    temperature: 50,
                    threadsUsage: 35,
                  },
                ],
                gpus: [
                  {
                    id: "g-s21",
                    model: "A40",
                    vram: 48,
                    gpuId: 1,
                    temperature: 65,
                    vramUsage: 35,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cl11",
        name: "Toruń",
        lat: 53.0138,
        lng: 18.5984,
        status: "deploying",
        companies: [
          {
            id: "c19",
            name: "Copernicus Node",
            status: "deploying",
            manholes: [
              {
                id: "s24",
                name: "Copernicus Star",
                ownerId: "c19",
                owner: undefined,
                ram: 512,
                get pricePerTeraflopDay() { return Number((0.004 * 2.5 * powerConfig.value.dayPrice).toFixed(5)); },
                get pricePerTeraflopNight() { return Number((0.004 * 2.5 * powerConfig.value.nightPrice).toFixed(5)); },
                cityLongitude: 18.5984,
                cityLatitude: 53.0138,
                address: "Szeroka 35, 87-100 Toruń",
                windowSchedule: {
                  monday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  tuesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  wednesday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  thursday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  friday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  saturday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                  sunday: {
                    windowStart: { seconds: 0, nanos: 0 },
                    windowEnd: { seconds: 86400, nanos: 0 },
                  },
                },
                cpus: [
                  {
                    id: "c-s24",
                    model: "AMD EPYC",
                    threads: 128,
                    cpuId: 1,
                    temperature: 30,
                    threadsUsage: 0,
                  },
                ],
                gpus: [
                  {
                    id: "g-s24",
                    model: "H100",
                    vram: 80,
                    gpuId: 1,
                    temperature: 35,
                    vramUsage: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

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
    ],
  };

  const metrics = ref<Metrics>(MOCK_CONFIG.metrics!);
  const clusters = ref<Cluster[]>([]);
  const currentUser = ref<User>(MOCK_CONFIG.currentUser!);
  const taskTypes = ref<TaskType[]>([]);
  const availableModels = ref<string[]>([]);
  const taskList = ref<Task[]>([]);

  const metricsConfig = {
    onlineNodes: { label: "Węzłów online" },
    totalVram: { label: "Całkowity VRAM" },
    queuedTasks: { label: "Zadań w kolejce" },
    companies: { label: "Firm w sieci" },
    gpus: { label: "Kart graficznych" },
  };

  async function fetchConfigData() {
    try {
      const data: ConfigResponse = await dashboardClient.GetConfig({});

      metrics.value = data.metrics!;
      clusters.value = data.clusters;
      currentUser.value = data.currentUser!;
      taskTypes.value = data.taskTypes;
      availableModels.value = data.availableModels;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetConfig. Ładowanie mocków...");
      metrics.value = MOCK_CONFIG.metrics!;
      clusters.value = MOCK_CONFIG.clusters;
      currentUser.value = MOCK_CONFIG.currentUser!;
      taskTypes.value = MOCK_CONFIG.taskTypes;
      availableModels.value = MOCK_CONFIG.availableModels;
    }
  }

  async function fetchApiKeys() {
    try {
      const data = await apiClient.GetApiKeys({});
      apiKeys.value = data.keys;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetApiKeys. Użyto mocków.");
    }
  }

  async function fetchNodes() {
    try {
      const data = await providerClient.GetNodes({});
      nodes.value = data.nodes;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetNodes. Użyto mocków.");
    }
  }

  async function fetchAgents() {
    try {
      const data = await agentClient.GetAgents({});
      deployedAgents.value = data.agents;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetAgents. Użyto mocków.");
    }
  }

  async function fetchTasks() {
    try {
      const data: GetTasksResponse = await taskClient.GetTasks({});
      taskList.value = data.tasks;
    } catch (e) {
      console.warn("⚠️ gRPC: Błąd GetTasks. Ładowanie mocków...");
      taskList.value = MOCK_TASKS.tasks;
    }
  }

  async function removeTask(id: number) {
    try {
      await taskClient.RemoveTask({ id });
      taskList.value = taskList.value.filter((t) => t.id !== id);
    } catch (e) {
      console.warn(`🛠️ MOCK: Usuwanie zadania o ID=${id}`);
      taskList.value = taskList.value.filter((t) => t.id !== id);
    }
  }

  async function pauseTask(id: number) {
    try {
      const data = await taskClient.PauseTask({ id });
      const idx = taskList.value.findIndex((t) => t.id === id);
      if (idx !== -1 && data.task) taskList.value[idx] = data.task;
    } catch (e) {
      console.warn(`🛠️ MOCK: Pauzowanie zadania o ID=${id}`);
      const task = taskList.value.find((t) => t.id === id);
      if (task && task.status === "W trakcie") task.status = "Wstrzymane";
    }
  }

  async function stopTask(id: number) {
    try {
      const data = await taskClient.StopTask({ id });
      const idx = taskList.value.findIndex((t) => t.id === id);
      if (idx !== -1 && data.task) taskList.value[idx] = data.task;
    } catch (e) {
      console.warn(`🛠️ MOCK: Zatrzymywanie zadania o ID=${id}`);
      const task = taskList.value.find((t) => t.id === id);
      if (task && task.status !== "Zakończone") task.status = "Zatrzymane";
    }
  }

  async function editTask(id: number, updatedData: Partial<Task>) {
    try {
      const data = await taskClient.EditTask({ id, ...updatedData });
      const idx = taskList.value.findIndex((t) => t.id === id);
      if (idx !== -1 && data.task) taskList.value[idx] = data.task;
    } catch (e) {
      console.warn(`🛠️ MOCK: Edycja zadania o ID=${id}`, updatedData);
      const task = taskList.value.find((t) => t.id === id);
      if (task) {
        if (updatedData.name) task.name = updatedData.name;
        if (updatedData.type) task.type = updatedData.type;
        if (updatedData.model) task.model = updatedData.model;
      }
    }
  }

  const apiKeys = ref([
    {
      id: "1",
      name: "Main Backend App",
      key: "sk-gniazdo-7cc1-4b82-9d3f",
      createdAt: "2026-03-15",
    },
    {
      id: "2",
      name: "Mobile Integration",
      key: "sk-gniazdo-9aa2-11e3-8b22",
      createdAt: "2026-03-20",
    },
  ]);

  const nodes = ref([
    {
      id: "node-01",
      name: "Politechnika - Lab AI (RTX 4090)",
      uptime: "14 dni, 6 godz.",
      powerUsage: "340W",
      vramUsage: "18.5GB / 24GB",
      gpuTemp: "68°C",
      cpuUsage: "12%",
      netLatency: "5ms",
      status: "online",
    },
    {
      id: "node-02",
      name: "Politechnika - Lab AI (RTX 3090)",
      uptime: "5 dni, 12 godz.",
      powerUsage: "290W",
      vramUsage: "10GB / 24GB",
      gpuTemp: "74°C",
      cpuUsage: "18%",
      netLatency: "7ms",
      status: "online",
    },
    {
      id: "node-03",
      name: "Serwerownia Wydziałowa (A100)",
      uptime: "-",
      powerUsage: "0W",
      vramUsage: "0GB / 40GB",
      gpuTemp: "-",
      cpuUsage: "0%",
      netLatency: "-",
      status: "offline",
    },
    {
      id: "node-04",
      name: "Dyrektoriat (H100 NVLink)",
      uptime: "62 dni, 1 godz.",
      powerUsage: "450W",
      vramUsage: "38GB / 80GB",
      gpuTemp: "65°C",
      cpuUsage: "25%",
      netLatency: "2ms",
      status: "maintenance",
    },
  ]);
  const providerToken = ref<string>("sk-prov-9876543210abcdef");
  const monthlyEarnings = ref<number>(12450.75);

  const historicalEarnings = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    amount: monthlyEarnings.value * (1 + (Math.random() - 0.5) * 0.1),
  }));
  const historicalLatency = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    latency: 4 + Math.random() * 4,
  }));
  const powerUsageData = [850, 890, 1020, 1050, 980, 1080, 1150, 1080]; // w Watach
  const vramUtilizationData = [45, 55, 78, 85, 90, 82, 65, 75]; // w %

  const powerConfig = ref({
    dayPrice: 1.85,
    nightPrice: 0.85,
    gpuDayPower: 6,
    gpuNightPower: 20,
    cpuDayPower: 3,
    cpuNightPower: 16,
  });
  const nodesProvided = ref<NodeMetrics[]>([
    {
      id: "node-01",
      name: "Politechnika - Lab AI (RTX 4090)",
      uptime: "14 dni, 6 godz.",
      powerUsage: "340W",
      vramUsage: "18.5GB / 24GB",
      gpuTemp: "68°C",
      cpuUsage: "12%",
      netLatency: "5ms",
      status: "online",
    },
    {
      id: "node-02",
      name: "Politechnika - Lab AI (RTX 3090)",
      uptime: "5 dni, 12 godz.",
      powerUsage: "290W",
      vramUsage: "10GB / 24GB",
      gpuTemp: "74°C",
      cpuUsage: "18%",
      netLatency: "7ms",
      status: "online",
    },
    {
      id: "node-03",
      name: "Serwerownia Wydziałowa (A100)",
      uptime: "-",
      powerUsage: "0W",
      vramUsage: "0GB / 40GB",
      gpuTemp: "-",
      cpuUsage: "-",
      netLatency: "-",
      status: "offline",
    },
  ]);
  fetchConfigData();
  fetchTasks();
  fetchBillingData();
  fetchApiKeys();
  fetchNodes();
  fetchAgents();

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
    powerConfig,
    agentTemplates,
    apiKeys,
    providerToken,
    historicalEarnings,
    historicalLatency,
    vramUtilizationData,
    fetchConfigData,
    fetchApiKeys,
    fetchNodes,
    fetchAgents,
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
    resourceUsage,
  };
});