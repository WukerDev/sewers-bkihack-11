import { defineStore } from 'pinia'
import { ref } from 'vue'
import {useConfigStore} from "../../core/config.ts";

export const useApiStore = defineStore('api', () => {

const config = useConfigStore();
  function createKey(name: string) {
    const newKey = {
      id: Math.random().toString(36).substring(7),
      name: name || 'New API Key',
      key: `sk-gniazdo-${Math.random().toString(16).substring(2, 6)}-${Math.random().toString(16).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    config.apiKeys.push(newKey)
  }

  function deleteKey(id: string) {
    config.apiKeys = config.apiKeys.filter(k => k.id !== id)
  }

  return { createKey, deleteKey }
})