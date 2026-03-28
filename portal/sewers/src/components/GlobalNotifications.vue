<template>
  <div>
    <v-snackbar
      v-model="store.snackbar.show"
      :color="store.snackbar.color"
      timeout="3000"
      content-class="aero-snackbar"
    >
      <span class="aero-text-main">{{ store.snackbar.text }}</span>
      <template v-slot:actions>
        <v-btn
          class="aero-text-main font-weight-bold"
          variant="text"
          @click="store.snackbar.show = false"
        >
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="store.dialog.show" max-width="500" persistent>
      <v-card class="aero-glass aero-window" elevation="10">
        <v-card-title class="d-flex align-center aero-titlebar">
          <span class="aero-text-title">{{ store.dialog.title }}</span>
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
          <v-card-text class="pt-4 aero-text-body">{{
            store.dialog.text
          }}</v-card-text>
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

<style scoped>
.aero-text-main {
  color: #000000 !important;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 1),
    0 0 5px rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.aero-text-title {
  color: #000000 !important;
  text-shadow: 0 0 8px rgba(255, 255, 255, 1);
  font-weight: 700;
}

.aero-text-body {
  color: #1a1a1a !important;
}

.aero-snackbar {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(15px) !important;
  -webkit-backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
}

.v-theme--dark .aero-text-main,
.v-theme--dark .aero-text-title {
  color: #ffffff !important;
  text-shadow:
    0 0 10px rgba(0, 0, 0, 1),
    0 0 5px rgba(0, 0, 0, 0.8);
}

.v-theme--dark .aero-text-body {
  color: #eeeeee !important;
}
</style>
