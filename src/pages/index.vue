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
  </v-app>
</template>

<script lang="ts" setup>
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