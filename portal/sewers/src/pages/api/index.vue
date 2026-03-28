<script setup lang="ts">
import { ref } from "vue";
import { useApiStore } from "./store.ts";
import { useConfigStore } from "../../core/config.ts";
import { useNotificationStore } from "../../core/notifications";

const config = useConfigStore();
const apiStore = useApiStore();
const notificationStore = useNotificationStore();

const tab = ref("keys");
const showAddKey = ref(false);
const newKeyName = ref("");

const handleCreateKey = () => {
  if (!newKeyName.value) return;
  apiStore.createKey(newKeyName.value);
  newKeyName.value = "";
  showAddKey.value = false;
  notificationStore.showSnackbar("Wygenerowano nowy klucz API", "success");
};

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    notificationStore.showSnackbar("Skopiowano do schowka!", "success");
  } catch (err) {
    notificationStore.showSnackbar("Błąd kopiowania", "error");
  }
};
</script>

<template>
  <v-container fluid class="aero-main-container pa-0 d-flex">
    <v-row justify="center" class="mt-8 w-100">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
        class="d-flex flex-column align-center"
      >
        <h1 class="text-h4 font-weight-bold mb-8 aero-title-text text-center">
          API & Integracje
        </h1>

        <v-card
          class="vista-frame shadow-aero d-flex flex-column overflow-hidden w-100"
        >
          <v-tabs
            v-model="tab"
            bg-color="rgba(255, 255, 255, 0.4)"
            color="primary"
            class="aero-tabs-border flex-grow-0"
            align-tabs="start"
          >
            <v-tab value="keys">
              <v-icon start size="small">mdi-key-chain</v-icon>Klucze API
            </v-tab>
            <v-tab value="docs">
              <v-icon start size="small">mdi-file-code</v-icon>Dokumentacja
            </v-tab>
          </v-tabs>

          <v-window v-model="tab" class="flex-grow-1">
            <v-window-item value="keys" class="pa-8">
              <div
                class="d-flex justify-space-between align-center mb-8 flex-wrap ga-4"
              >
                <div
                  class="text-subtitle-1 text-grey-darken-2 font-weight-medium"
                >
                  Zarządzaj kluczami uwierzytelniającymi dla Twoich aplikacji.
                </div>
                <v-btn
                  class="aero-submit-btn-shiny px-6"
                  prepend-icon="mdi-plus"
                  @click="showAddKey = true"
                >
                  Generuj klucz
                </v-btn>
              </div>

              <div class="aero-panel-inset overflow-hidden">
                <v-table class="bg-transparent aero-table">
                  <thead>
                    <tr>
                      <th class="label-header">Nazwa</th>
                      <th class="label-header">Klucz</th>
                      <th class="label-header">Utworzono</th>
                      <th class="label-header text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in config.apiKeys"
                      :key="item.id"
                      class="aero-tr"
                    >
                      <td class="font-weight-bold cell-align">
                        {{ item.name }}
                      </td>
                      <td class="cell-align">
                        <code class="aero-code-inline">{{ item.key }}</code>
                      </td>
                      <td class="text-grey-darken-1 cell-align">
                        {{ item.createdAt }}
                      </td>
                      <td class="text-right cell-align">
                        <v-btn
                          icon="mdi-content-copy"
                          variant="text"
                          size="small"
                          color="primary"
                          class="mr-2"
                          @click="copy(item.key)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete-outline"
                          variant="text"
                          size="small"
                          color="error"
                        ></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-window-item>

            <v-window-item value="docs" class="pa-8">
              <div class="aero-panel pa-6">
                <div class="d-flex align-center mb-4">
                  <v-chip
                    color="success"
                    label
                    variant="flat"
                    class="mr-4 font-weight-black"
                    >POST</v-chip
                  >
                  <code class="text-h6 font-weight-bold text-primary"
                    >/api/v1/tasks/train</code
                  >
                </div>
                <div class="code-block-container pa-4">
                  <pre class="code-block">
Authorization: Bearer sk-your-key</pre
                  >
                </div>
                <div
                  class="text-subtitle-2 mt-4 text-grey-darken-2 font-weight-bold uppercase-label"
                >
                  Body (JSON):
                </div>
                <div class="code-block-container">
                  <pre class="code-block pa-4 text-body-2">
{
  "model": "Llama-3-8B",
  "dataset_url": "https://data.example.com/set.zip",
  "priority": "speed",
  "config": { "epochs": 3, "lr": 0.0001 }
}</pre
                  >
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddKey" max-width="450">
      <v-card class="aero-glass-dialog overflow-hidden">
        <div class="aero-window-header-simple px-6 py-3">
          Nowy obiekt bezpieczeństwa
        </div>
        <v-card-text class="pa-8">
          <v-text-field
            v-model="newKeyName"
            label="Nazwa klucza"
            variant="outlined"
            density="comfortable"
            class="aero-input-fix"
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="grey-darken-2"
            @click="showAddKey = false"
            >Anuluj</v-btn
          >
          <v-btn class="aero-submit-btn-shiny px-8" @click="handleCreateKey"
            >Generuj</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* --- CENTROWANIE I TŁO --- */
.aero-main-container {
  background: radial-gradient(circle at 50% -20%, #f0f9ff 0%, #cbd5e1 100%);
  min-height: 100vh; /* Wymusza wysokość na całe okno */
  width: 100%;
}

/* --- KARTA VISTA (UKŁAD PIONOWY) --- */
.vista-frame {
  background: rgba(255, 255, 255, 0.35) !important;
  backdrop-filter: blur(25px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 24px !important;
  min-height: 500px;
}

.shadow-aero {
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15) !important;
}

/* --- FIX DLA ETYKIET I TABELI --- */
.label-header {
  height: 60px !important;
  vertical-align: middle !important;
  color: #0369a1 !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.7rem !important;
  border-bottom: 2px solid rgba(3, 105, 161, 0.1) !important;
}

.cell-align {
  height: 64px !important;
  vertical-align: middle !important;
}

/* --- ESTETYKA AERO --- */
.aero-title-text {
  color: #0369a1;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
  letter-spacing: -0.5px;
}

.aero-tabs-border {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.aero-panel-inset {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.aero-code-inline {
  background: rgba(3, 105, 161, 0.08);
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: "Consolas", monospace;
  font-size: 0.85rem;
  border: 1px solid rgba(3, 105, 161, 0.1);
}

.aero-submit-btn-shiny {
  background: linear-gradient(
    to bottom,
    #38bdf8 0%,
    #0284c7 50%,
    #0369a1 100%
  ) !important;
  color: white !important;
  border-radius: 50px !important;
  font-weight: 800 !important;
  text-transform: none !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3) !important;
}

/* --- DIALOG --- */
.aero-glass-dialog {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(30px);
  border-radius: 20px !important;
  border: 1px solid white !important;
}

.aero-window-header-simple {
  font-weight: 800;
  color: #0369a1;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: rgba(3, 105, 161, 0.05);
}

.code-block-container {
  background: #0f172a;
  border-radius: 12px;
}

.code-block {
  color: #38bdf8;
  font-family: monospace;
}
</style>
