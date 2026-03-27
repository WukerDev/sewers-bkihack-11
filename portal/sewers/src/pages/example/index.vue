<script setup lang="ts">
import { useNotificationStore } from '@/core/notifications'

const notificationStore = useNotificationStore()

function triggerSnackbar() {
  notificationStore.showSnackbar('Zadanie zostało pomyślnie dodane do kolejki', 'success')
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
</script>

<template>
<v-container>
  <v-card class="aero-glass pa-6">
    <v-card-title>Test systemu powiadomień</v-card-title>
    <v-card-actions class="ga-4 mt-4">
      <v-btn color="success" variant="flat" @click="triggerSnackbar">
        Testuj Snackbar
      </v-btn>
      <v-btn color="primary" variant="flat" @click="triggerDialog">
        Testuj Dialog
      </v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<style scoped>

</style>