import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContextMenuStore = defineStore('contextMenu', () => {
  const show = ref(false)
  const x = ref(0)
  const y = ref(0)
  const items = ref<{ label: string; action: () => void }[]>([])

  function openMenu(event: MouseEvent, menuItems: { label: string; action: () => void }[]) {
    event.preventDefault()
    show.value = false
    setTimeout(() => {
      x.value = event.clientX
      y.value = event.clientY
      items.value = menuItems
      show.value = true
    }, 50)
  }

  return { show, x, y, items, openMenu }
})