<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Sewer</v-card-title>
          <v-card-text>Witaj na stronie startowej!</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useHomeStore } from './store'
import { onMounted } from 'vue'

const homeStore = useHomeStore()

onMounted(() => {
  homeStore.fetchItems()
})
</script>