import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  const pageTitle = ref('Projekt na Hackathon')
  const items = ref([])
  const isLoading = ref(false)

  const hasItems = computed(() => items.value.length > 0)

  async function fetchItems() {
    isLoading.value = true
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        items.value = await response.json()
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  function setTitle(newTitle: string) {
    pageTitle.value = newTitle
  }

  return {
    pageTitle,
    items,
    isLoading,
    hasItems,
    fetchItems,
    setTitle
  }
})