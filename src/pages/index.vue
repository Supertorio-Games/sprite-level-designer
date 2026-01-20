<template>
  <v-app>
    <v-app-bar>
    <template v-slot:prepend>
      <v-btn class="v-btn--icon" href="https://www.supertorio.dev/" target="_blank">
          <v-icon size="x-large"><supertorio-games></supertorio-games></v-icon>
      </v-btn>
    </template>

    <v-app-bar-title>Sprite Level Designer</v-app-bar-title>

    <template v-slot:append>
      <v-btn to="/output" prepend-icon="mdi-code-braces" variant="tonal">Display Code</v-btn>
      <v-btn icon="mdi-cog"
        class="ml-4"
        value="Settings"
        @click.stop="appConfigStore.toolbarOpen = !appConfigStore.toolbarOpen"></v-btn>
    </template>
    </v-app-bar>

    <v-main class="h-screen">
      <div class="h-100 main-layout" style="display: grid; grid-template-rows: 50% 50%;">
        <map-grid-pane></map-grid-pane>
        <sprite-management-pane />
      </div>
    </v-main>
    <v-navigation-drawer
        location="right"
        v-model="appConfigStore.toolbarOpen"
      >
        <settings-toolbar />
      </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts" setup>
  import {ref} from 'vue';
  import SettingsToolbar from '@/components/SettingsToolbar.vue';
  import { useAppStore } from '@/state/appStore';

  const appConfigStore = useAppStore();
</script>

<style lang="css" scoped>
  .main-layout {
    display: grid;
    grid-template-rows: 50% 50%;
    height: 100vh;
  }

  .main-layout > div {
    overflow-y: hidden;
  }
</style>