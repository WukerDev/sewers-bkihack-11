<script setup lang="ts">
import { useNotificationStore } from '../../core/notifications'
import { useLoaderStore } from '../../core/loader'
import { useContextMenuStore } from '../../core/contextMenu'

const notificationStore = useNotificationStore()
const loaderStore = useLoaderStore()
const contextMenuStore = useContextMenuStore()

function triggerSnackbar(message: string, type: 'success' | 'error' | 'info') {
  notificationStore.showSnackbar(message, type)
}

function triggerDialog() {
  notificationStore.showDialog({
    title: 'Potwierdzenie akcji',
    text: 'Czy na pewno chcesz uruchomić ten węzeł? Szacowany koszt to 15 PLN.',
    confirmText: 'Uruchom',
    cancelText: 'Anuluj',
    onConfirm: () => {
      notificationStore.showSnackbar('Węzeł uruchomiony pomyślnie.', 'success')
    },
    onCancel: () => {
      notificationStore.showSnackbar('Anulowano operację.', 'error')
    }
  })
}

function testLoader() {
  loaderStore.start()
  setTimeout(() => {
    loaderStore.stop()
    notificationStore.showSnackbar('Dane zostały odświeżone', 'info')
  }, 2000)
}

function handleRightClick(event: MouseEvent) {
  contextMenuStore.openMenu(event, [
    { label: 'Pokaż szczegóły', action: () => notificationStore.showSnackbar('Otwieram szczegóły...') },
    { label: 'Kopiuj ID węzła', action: () => notificationStore.showSnackbar('Skopiowano do schowka') },
    { label: 'Zatrzymaj proces', action: () => triggerDialog() }
  ])
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="aero-glass pa-6">
          <v-card-title>Panel Sterowania Aero</v-card-title>
          <v-card-text>
            Przetestuj globalne funkcje systemowe. Kliknij przyciski poniżej lub użyj
            <strong>prawego przycisku myszy</strong> na żółtym przycisku.
          </v-card-text>

          <v-card-actions class="ga-4 mt-4 d-flex flex-wrap">
          <v-btn color="success" variant="flat" @click="triggerSnackbar('Zadanie dodane!', 'success')">
            Powiadomienie Success (Sound)
          </v-btn>
          <v-btn color="error" variant="flat" @click="triggerSnackbar('Wystąpił błąd!', 'error')">
            Powiadomienie Error (Sound)
          </v-btn>
          <v-btn color="info" variant="flat" @click="triggerSnackbar('Informacja systemowa', 'info')">
            Powiadomienie Info (Sound)
          </v-btn>

            <v-btn color="primary" variant="flat" @click="triggerDialog">
              Okno Dialogowe
            </v-btn>

            <v-btn color="secondary" variant="flat" @click="testLoader">
              Loader (2 sekundy)
            </v-btn>

            <v-btn
              color="warning"
              variant="flat"
              @contextmenu.prevent="handleRightClick"
            >
              Menu Kontekstowe (PPM)
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>