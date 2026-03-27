<template>
  <v-app>
    <v-app-bar class="aero-glass" elevation="0">
      <v-app-bar-title>Sewers</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-for="link in links"
        :key="link.title"
        :to="link.to"
        variant="text"
      >
        {{ link.title }}
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2 mr-3">
          <div class="vista-frame">
            <v-avatar size="40">
              <v-img src="https://9611ebabdd7aa7a3c429-608cd691ca2791bf39ae82b0c902da1a.ssl.cf1.rackcdn.com/0-Betsy_redo_3.jpg" alt="Avatar"></v-img>
            </v-avatar>
          </div>
          </v-btn>
        </template>
        <v-list class="aero-glass" bg-color="transparent">
          <v-list-item
            v-for="item in profileMenu"
            :key="item.title"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid >
        <router-view></router-view>
      </v-container>
    </v-main>
    <GlobalNotifications />
    <GlobalLoader />
    <GlobalContextMenu />
  </v-app>
</template>

<script setup lang="ts">
import GlobalNotifications from './components/GlobalNotifications.vue'
import GlobalLoader from './components/GlobalLoader.vue'
import GlobalContextMenu from './components/GlobalContextMenu.vue'
import { ref } from 'vue'

const links = ref([
  { title: 'Start', to: '/' },
  { title: 'Dashboard', to: '/dashboard' },
  { title: 'Taski', to: '/tasks' },
  { title: 'Agenci AI', to: '/agents' },
  { title: 'Biling', to: '/billing' },
  { title: 'Dla Dostawców', to: '/providers' },
  { title: 'API', to: '/api-docs' }
])

const profileMenu = ref([
  { title: 'Ustawienia', action: () => console.log('Kliknięto ustawienia') },
  { title: 'Wyloguj', action: () => console.log('Wylogowano') }
])
</script>