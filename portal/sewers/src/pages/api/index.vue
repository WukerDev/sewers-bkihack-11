<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6 text-white aero-title">API & Integracje</h1>

        <v-card class="aero-glass rounded-xl overflow-hidden">
          <v-tabs v-model="tab" bg-color="rgba(0,0,0,0.2)" color="primary" align-tabs="start">
            <v-tab value="keys"><v-icon start>mdi-key-chain</v-icon>Klucze API</v-tab>
            <v-tab value="docs"><v-icon start>mdi-file-document-outline</v-icon>Dokumentacja</v-tab>
          </v-tabs>

          <v-window v-model="tab" class="pa-6">
            <v-window-item value="keys">
              <div class="d-flex justify-space-between align-center mb-6">
                <div class="text-subtitle-1 text-grey-lighten-1">Twoje klucze uwierzytelniające do komunikacji Backend-to-Backend.</div>
                <v-btn color="success" prepend-icon="mdi-plus" class="aero-btn" @click="showAddKey = true">
                  Generuj nowy klucz
                </v-btn>
              </div>

              <v-table class="bg-transparent text-white aero-table">
                <thead>
                  <tr>
                    <th class="text-left font-weight-bold">Nazwa</th>
                    <th class="text-left font-weight-bold">Klucz</th>
                    <th class="text-left font-weight-bold">Data utworzenia</th>
                    <th class="text-right font-weight-bold">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in apiStore.apiKeys" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td><code class="aero-code">{{ item.key }}</code></td>
                    <td>{{ item.createdAt }}</td>
                    <td class="text-right">
                      <v-btn icon="mdi-content-copy" variant="text" size="small" color="info" @click="copy(item.key)"></v-btn>
                      <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="apiStore.deleteKey(item.id)"></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="docs">
              <v-card variant="outlined" border color="rgba(255,255,255,0.1)" class="rounded-lg bg-black-opacity">
                <div class="pa-4 bg-blue-darken-4 d-flex align-center">
                  <v-chip color="success" label class="mr-4 font-weight-bold">POST</v-chip>
                  <span class="font-mono">/api/v1/tasks/train</span>
                </div>
                <v-card-text>
                  <div class="text-subtitle-2 mb-2 text-grey">Nagłówki (Headers):</div>
                  <pre class="aero-code mb-4">Authorization: Bearer sk-gniazdo-...</pre>

                  <div class="text-subtitle-2 mb-2 text-grey">Przykładowy Body (JSON):</div>
                  <pre class="aero-code">
{
  "model": "Llama-3-8B",
  "dataset_url": "https://data.example.com/set.zip",
  "priority": "speed",
  "config": { "epochs": 3, "lr": 0.0001 }
}</pre>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddKey" max-width="400">
      <v-card class="aero-glass pa-4">
        <v-card-title>Nazwij swój klucz</v-card-title>
        <v-text-field v-model="newKeyName" label="Np. Produkcja" variant="outlined" density="compact" class="mt-4"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddKey = false">Anuluj</v-btn>
          <v-btn color="success" variant="flat" @click="handleCreateKey">Generuj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApiStore } from './store.ts'

const apiStore = useApiStore()
const tab = ref('keys')
const showAddKey = ref(false)
const newKeyName = ref('')

const handleCreateKey = () => {
  apiStore.createKey(newKeyName.value)
  newKeyName.value = ''
  showAddKey.value = false
}

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.aero-glass {
background: linear-gradient(
    180deg,
    rgba(20, 30, 45, 0.85) 0%, /* Ciemny góra */
    rgba(10, 15, 25, 0.95) 100% /* Bardzo ciemny dół */
  ) !important;

  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important; /* Mocniejszy cień */
}

.aero-title {
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.aero-table th {
  background: rgba(255, 255, 255, 0.05);
}

.aero-code {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  color: #00ffcc;
  border: 1px solid rgba(0, 255, 204, 0.2);
}

.aero-btn {
  background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

pre.aero-code {
  display: block;
  padding: 12px;
  line-height: 1.5;
}
</style>