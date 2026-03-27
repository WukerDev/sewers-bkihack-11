<template>
  <v-menu
    v-model="store.show"
    :style="{ left: store.x + 'px', top: store.y + 'px', position: 'absolute' }"
    target="body"
    transition="scale-transition"
  >
    <v-list class="aero-glass py-1" elevation="8" density="compact">
      <v-list-item
        v-for="(item, index) in store.items"
        :key="index"
        @click="item.action"
        class="context-item"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useContextMenuStore } from '../core/contextMenu'
const store = useContextMenuStore()
</script>

<style scoped>
.context-item:hover {
  background: rgba(0, 163, 232, 0.2);
}
</style>