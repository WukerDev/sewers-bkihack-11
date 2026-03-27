<template>
  <v-app>
    <v-main>
      <v-container class="w-75">
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
              v-for="task in taskStore.taskList"
              :key="task.id"
              class="task-row d-flex align-center mb-3 pa-3"
            >
              <v-icon
                :color="taskStore.getStatusColor(task.status)"
                size="32"
                class="mr-4"
                >{{ taskStore.getStatusIcon(task.status) }}</v-icon
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
                  :style="{ color: taskStore.getStatusColor(task.status) }"
                >
                  {{ task.status }}
                </div>
                <div class="text-caption font-weight-bold text-secondary">
                  Postęp: {{ task.progress }}%
                </div>
              </div>
              <v-progress-circular
                :model-value="task.progress"
                :color="taskStore.getStatusColor(task.status)"
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
                <div class="section-label">1. Nazwa Projektu</div>
                <v-text-field
                  v-model="taskStore.newTask.name"
                  label="Wprowadź unikalną nazwę zadania"
                  variant="solo"
                  class="aero-input"
                  prepend-inner-icon="mdi-tag-outline"
                  placeholder="np. MedAssistant-v2-Beta"
                  hide-details
                  flat
                ></v-text-field>
              </div>
              <div class="form-section mb-6">
                <div class="section-label">2. Typ zadania</div>
                <v-select
                  v-model="taskStore.newTask.type"
                  :items="taskStore.taskTypes"
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
                        <span class="text-caption">{{ item.description }}</span>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>

              <div class="form-section mb-6">
                <div class="section-label">3. Konfiguracja i Dane</div>
                <v-file-input
                  v-model="taskStore.newTask.configFile"
                  label="Wgraj plik .yaml"
                  variant="solo"
                  class="aero-input mb-3"
                  prepend-inner-icon="mdi-file-cog"
                  prepend-icon=""
                  hide-details
                  flat
                ></v-file-input>
                <v-text-field
                  v-model="taskStore.newTask.datasetLink"
                  label="Link do datasetu"
                  variant="solo"
                  class="aero-input"
                  prepend-inner-icon="mdi-link"
                  hide-details
                  flat
                ></v-text-field>
              </div>

              <div class="form-section mb-6">
                <div class="section-label">4. Model Bazowy</div>
                <v-select
                  v-model="taskStore.newTask.baseModel"
                  :items="taskStore.availableModels"
                  label="Wybierz model"
                  variant="solo"
                  class="aero-input"
                  prepend-inner-icon="mdi-brain"
                  hide-details
                  flat
                ></v-select>
              </div>

              <div class="form-section mb-2">
                <div class="section-label">5. Priorytet i Estymacja</div>
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
                  v-model="taskStore.newTask.priority"
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
                    <div class="text-success">
                      {{ taskStore.estimatedCost }} PLN
                    </div>
                  </div>
                  <div class="est-divider"></div>
                  <div class="text-center">
                    <div class="est-title">Szacowany Czas</div>
                    <div class="text-warning">
                      {{ taskStore.estimatedTime }} h
                    </div>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "./store";
import { useNotificationStore } from "../../core/notifications";

const taskStore = useTaskStore();
const notificationStore = useNotificationStore();
const isWizardOpen = ref(false);

const submitTask = () => {
  taskStore.addTask();
  notificationStore.showSnackbar(
    "Zadanie zostało dodane do kolejki",
    "success",
  );
  isWizardOpen.value = false;
};
</script>

<style scoped>
.task-row {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.6)
  );
  border: 1px solid white;
  border-radius: 12px;
}

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

:deep(.aero-input .v-field) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgb(var(--v-theme-aero-border)) !important;
  border-radius: 10px !important;
}

:deep(.v-label) {
  color: rgb(var(--v-theme-secondary)) !important;
  opacity: 1 !important;
}

:deep(.v-overlay__content .v-list) {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgb(var(--v-theme-aero-border));
}

.estimation-box {
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    rgb(var(--v-theme-background)) 100%
  );
  border: 2px solid rgb(var(--v-theme-aero-border));
  border-radius: 15px;
}
</style>
