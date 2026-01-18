<template>
  <v-app>
    <settings-modal activator="#activator-settings"></settings-modal>
    <v-app-bar>
    <template v-slot:prepend>
      <v-btn class="v-btn--icon" href="https://www.supertorio.dev/" target="_blank">
          <v-icon size="x-large"><supertorio-games></supertorio-games></v-icon>
      </v-btn>
    </template>

    <v-app-bar-title>Sprite Level Designer</v-app-bar-title>

    <template v-slot:append>
      <v-btn prepend-icon="mdi-code-braces" variant="tonal" @click="showCodeView = true">Display Code</v-btn>
      <display-settings-menu />
      <v-btn icon="mdi-cog" value="Settings" id="activator-settings"></v-btn>
    </template>
    </v-app-bar>

    <v-main class="h-screen">
      <div class="h-100 main-layout" style="display: grid; grid-template-rows: 50% 50%;">
        <map-grid-pane></map-grid-pane>
        <sprite-management-pane />
      </div>
    </v-main>

    <v-dialog width="90%" min-height="60%" max-height="90%" v-model="showCodeView">
        <v-card title="Code Output" height="100%">
          <output-display-window />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Close Dialog"
              @click="showCodeView = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const showCodeView = ref(false);
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