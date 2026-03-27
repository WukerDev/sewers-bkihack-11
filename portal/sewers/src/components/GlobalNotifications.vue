<template>
  <div>
    <v-snackbar
      v-model="store.snackbar.show"
      :color="store.snackbar.color"
      timeout="3000"
      content-class="aero-glass text-success"
    >
      {{ store.snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          class="text-error"
          @click="store.snackbar.show = false"
          >Zamknij</v-btn
        >
      </template>
    </v-snackbar>

    <v-dialog v-model="store.dialog.show" max-width="500" persistent>
      <v-card class="aero-glass aero-window" elevation="10">
        <v-card-title class="d-flex align-center aero-titlebar">
          {{ store.dialog.title }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="handleCancel"
            class="aero-close-btn"
          ></v-btn>
        </v-card-title>

        <div class="aero-window-content">
          <v-card-text class="pt-4">{{ store.dialog.text }}</v-card-text>
          <v-card-actions class="aero-actions">
            <v-spacer></v-spacer>
            <v-btn
              v-if="store.dialog.cancelText"
              class="aero-btn"
              variant="flat"
              @click="handleCancel"
            >
              {{ store.dialog.cancelText }}
            </v-btn>
            <v-btn
              color="primary"
              class="aero-btn"
              variant="flat"
              @click="handleConfirm"
            >
              {{ store.dialog.confirmText }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "../core/notifications";

const store = useNotificationStore();

function handleConfirm() {
  if (store.dialog.onConfirm) store.dialog.onConfirm();
  store.closeDialog();
}

function handleCancel() {
  if (store.dialog.onCancel) store.dialog.onCancel();
  store.closeDialog();
}
</script>
