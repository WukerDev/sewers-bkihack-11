<template>
  <div class="frutiger-desktop-wrapper">
    <v-app class="frutiger-app">
      <v-main>
        <v-container class="aero-container">
          <div class="aero-header d-flex align-center mb-6">
            <v-icon size="48" color="primary" class="mr-4 aero-icon-shadow"
              >mdi-server-network</v-icon
            >
            <h1 class="text-h4 font-weight-bold aero-title-text">
              Zarządzanie Zadaniami
            </h1>
            <v-spacer></v-spacer>
            <button class="aero-action-btn" @click="isWizardOpen = true">
              <v-icon left size="small">mdi-plus-circle</v-icon>
              DODAJ TASKA
            </button>
          </div>

          <v-card class="aero-panel mb-4" elevation="0">
            <v-card-title class="panel-title text-black"
              >Aktywne Zlecenia</v-card-title
            >
            <v-card-text class="pt-4">
              <div
                v-for="task in taskList"
                :key="task.id"
                class="task-row d-flex align-center mb-3 pa-3"
              >
                <v-icon
                  :color="getStatusColor(task.status)"
                  size="32"
                  class="mr-4"
                  >{{ getStatusIcon(task.status) }}</v-icon
                >
                <div class="flex-grow-1">
                  <div class="text-secondary font-weight-bold">
                    {{ task.name }}
                  </div>
                  <div class="text-info font-weight-medium">
                    Typ: {{ task.type }} | Model: {{ task.model }}
                  </div>
                </div>
                <div class="text-right mr-4">
                  <div
                    class="status-label"
                    :style="{ color: getStatusColor(task.status) }"
                  >
                    {{ task.status }}
                  </div>
                  <div class="text-caption font-weight-bold text-secondary">
                    Postęp: {{ task.progress }}%
                  </div>
                </div>
                <v-progress-circular
                  :model-value="task.progress"
                  :color="getStatusColor(task.status)"
                  size="40"
                  width="5"
                ></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>

          <v-dialog v-model="isWizardOpen" max-width="700px" persistent>
            <v-card class="aero-modal" elevation="24">
              <v-card-title class="modal-header d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-rocket-launch</v-icon>
                <span>Kreator Nowego Zadania</span>
                <v-spacer></v-spacer>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  color="white"
                  @click="isWizardOpen = false"
                ></v-btn>
              </v-card-title>

              <v-card-text class="pa-6 modal-body-bg">
                <div class="form-section mb-6">
                  <div class="section-label">1. Typ zadania</div>
                  <v-select
                    v-model="newTask.type"
                    :items="taskTypes"
                    item-title="label"
                    item-value="value"
                    label="Wybierz rodzaj operacji"
                    variant="solo"
                    class="aero-input"
                    hide-details
                    flat
                  >
                    <template v-slot:selection="{ item }">
                      <v-icon
                        :icon="item.icon"
                        color="primary"
                        class="mr-2"
                      ></v-icon>
                      <span class="radio-label">{{ item.label }}</span>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :title="item.label">
                        <template v-slot:prepend>
                          <v-icon :icon="item.icon" color="primary"></v-icon>
                        </template>
                        <template v-slot:subtitle>
                          <span class="text-caption">{{
                            item.description
                          }}</span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>

                <div class="form-section mb-6">
                  <div class="section-label">2. Konfiguracja i Dane</div>
                  <v-file-input
                    v-model="newTask.configFile"
                    label="Wgraj plik .yaml"
                    variant="solo"
                    class="aero-input mb-3"
                    prepend-inner-icon="mdi-file-cog"
                    prepend-icon=""
                    hide-details
                    flat
                  ></v-file-input>
                  <v-text-field
                    v-model="newTask.datasetLink"
                    label="Link do datasetu"
                    variant="solo"
                    class="aero-input"
                    prepend-inner-icon="mdi-link"
                    hide-details
                    flat
                  ></v-text-field>
                </div>

                <div class="form-section mb-6">
                  <div class="section-label">3. Model Bazowy</div>
                  <v-select
                    v-model="newTask.baseModel"
                    :items="availableModels"
                    label="Wybierz model"
                    variant="solo"
                    class="aero-input"
                    prepend-inner-icon="mdi-brain"
                    hide-details
                    flat
                  ></v-select>
                </div>

                <div class="form-section mb-2">
                  <div class="section-label">4. Priorytet i Estymacja</div>
                  <div class="d-flex justify-space-between slider-labels mb-2">
                    <span
                      ><v-icon size="x-small" color="success"
                        >mdi-piggy-bank</v-icon
                      >
                      NISKI KOSZT</span
                    >
                    <span
                      >MAX PRĘDKOŚĆ
                      <v-icon size="x-small" color="warning"
                        >mdi-lightning-bolt</v-icon
                      ></span
                    >
                  </div>
                  <v-slider
                    v-model="newTask.priority"
                    :min="0"
                    :max="100"
                    color="primary"
                    track-color="aero-blue-light"
                    hide-details
                  ></v-slider>

                  <div
                    class="estimation-box mt-4 pa-4 d-flex justify-space-around align-center"
                  >
                    <div class="text-center">
                      <div class="est-title">Szacowany Koszt</div>
                      <div class="est-value cost">{{ estimatedCost }} PLN</div>
                    </div>
                    <div class="est-divider"></div>
                    <div class="text-center">
                      <div class="est-title">Szacowany Czas</div>
                      <div class="est-value time">{{ estimatedTime }} h</div>
                    </div>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4 modal-footer">
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  color="secondary"
                  class="font-weight-bold"
                  @click="isWizardOpen = false"
                  >Anuluj</v-btn
                >
                <button class="aero-submit-btn-shiny ml-2" @click="submitTask">
                  ZLEĆ ZADANIE
                </button>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

const isWizardOpen = ref(false);
const availableModels = [
  "Bielik-11B",
  "Llama-3-8B",
  "Mistral-7B",
  "Mixtral-8x7B",
];

const taskList = ref([
  {
    id: 1,
    name: "Trening asystenta medycznego",
    type: "Fine-tuning",
    model: "Bielik-11B",
    status: "W trakcie",
    progress: 65,
  },
  {
    id: 2,
    name: "Analiza logów systemowych Q3",
    type: "Wsadowe",
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

const newTask = reactive({
  type: "finetuning",
  configFile: null,
  datasetLink: "",
  baseModel: "Bielik-11B",
  priority: 50,
});

const estimatedCost = computed(
  () => 40 + Math.round((newTask.priority / 100) * 260),
);
const estimatedTime = computed(() =>
  (24 - (newTask.priority / 100) * 22).toFixed(1),
);

const getStatusColor = (s: string) =>
  s === "Zakończone" ? "success" : s === "W trakcie" ? "primary" : "warning";
const getStatusIcon = (s: string) =>
  s === "Zakończone"
    ? "mdi-check-circle"
    : s === "W trakcie"
      ? "mdi-cog-play"
      : "mdi-clock-outline";

const submitTask = () => {
  taskList.value.unshift({
    id: Date.now(),
    name: `Zadanie ${newTask.baseModel}`,
    type: taskTypes.find((t) => t.value === newTask.type)?.label || "Inne",
    model: newTask.baseModel,
    status: "Oczekujące",
    progress: 0,
  });
  isWizardOpen.value = false;
};
</script>

<style scoped>
/* FUNDAMENTY */
.frutiger-desktop-wrapper {
  background-color: #1a1a1a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frutiger-app {
  width: 950px !important;
  max-width: 950px !important;
  height: 850px;
  border-radius: 20px;
  /* Gradient tła wykorzystuje kolor background i success z motywu */
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-background)) 0%,
    #bae6fd 50%,
    #dcfce7 100%
  ) !important;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.task-row {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.6)
  );
  border: 1px solid white;
  border-radius: 12px;
}

/* PRZYCISKI */

.aero-submit-btn-shiny {
  background: linear-gradient(
    to bottom,
    #4ade80 0%,
    rgb(var(--v-theme-success)) 50%,
    #15803d 100%
  );
  color: white;
  padding: 10px 30px;
  border-radius: 20px;
  font-weight: 900;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 5px 15px rgba(var(--v-theme-success), 0.4);
}

/* MODAL */
.modal-header {
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-info)),
    rgb(var(--v-theme-primary))
  );
}

.modal-footer {
  background: rgba(var(--v-theme-background), 0.5);
  border-top: 1px solid rgb(var(--v-theme-aero-border));
}

.section-label {
  color: rgb(var(--v-theme-secondary));
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* INPUTY */
:deep(.aero-input .v-field) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgb(var(--v-theme-aero-border)) !important;
  border-radius: 10px !important;
}

:deep(.v-label) {
  color: rgb(var(--v-theme-secondary)) !important;
  opacity: 1 !important;
}

/* DROPDOWN MENU AERO */
:deep(.v-overlay__content .v-list) {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgb(var(--v-theme-aero-border));
}

/* KALKULATOR */
.estimation-box {
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    rgb(var(--v-theme-background)) 100%
  );
  border: 2px solid rgb(var(--v-theme-aero-border));
  border-radius: 15px;
}

.est-value.cost {
  color: rgb(var(--v-theme-success));
}
.est-value.time {
  color: rgb(var(--v-theme-warning));
}
.est-divider {
  width: 2px;
  height: 40px;
  background: rgb(var(--v-theme-aero-border));
}
</style>
