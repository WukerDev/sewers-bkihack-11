import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
  const apiKeys = ref([
    { id: '1', name: 'Main Backend App', key: 'sk-gniazdo-7cc1-4b82-9d3f', createdAt: '2026-03-15' },
    { id: '2', name: 'Mobile Integration', key: 'sk-gniazdo-9aa2-11e3-8b22', createdAt: '2026-03-20' }
  ])

  function createKey(name: string) {
    const newKey = {
      id: Math.random().toString(36).substring(7),
      name: name || 'New API Key',
      key: `sk-gniazdo-${Math.random().toString(16).substring(2, 6)}-${Math.random().toString(16).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    apiKeys.value.push(newKey)
  }

  function deleteKey(id: string) {
    apiKeys.value = apiKeys.value.filter(k => k.id !== id)
  }

  return { apiKeys, createKey, deleteKey }
})