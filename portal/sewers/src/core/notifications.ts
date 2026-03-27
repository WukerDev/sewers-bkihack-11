import { defineStore } from 'pinia'
import { ref } from 'vue'
import { playSystemSound } from './audio'
export const useNotificationStore = defineStore('notifications', () => {
  const snackbar = ref({
    show: false,
    text: '',
    color: 'info'
  })

  const dialog = ref({
    show: false,
    title: '',
    text: '',
    confirmText: 'OK',
    cancelText: '',
    onConfirm: null as (() => void) | null,
    onCancel: null as (() => void) | null
  })

  function showSnackbar(text: string, color = 'info') {
      const soundType = color === 'error' ? 'error' : color === 'success' ? 'success' : 'info'
        playSystemSound(soundType)
    snackbar.value = { show: true, text, color }
  }

  function showDialog(options: {
    title: string
    text: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }) {
    dialog.value = {
      show: true,
      title: options.title,
      text: options.text,
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || '',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null
    }
    playSystemSound('info')
  }

  function closeDialog() {
    dialog.value.show = false
  }

  return { snackbar, dialog, showSnackbar, showDialog, closeDialog }
})