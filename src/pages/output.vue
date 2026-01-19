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
        <v-btn to="/" class="mr-5" prepend-icon="mdi-map-outline" variant="tonal">Edit Map</v-btn>
        </template>
    </v-app-bar>

    <v-main class="h-screen">
        <div class="h-100 main-layout">
            <v-tabs-window v-model="tab" class="code-contents h-100">
                <v-tabs-window-item value="kaplay" class="h-100">
                    <code-output-kaplay />
                </v-tabs-window-item>
                <v-tabs-window-item value="phaser" class="h-100">
                    <code-output-phaser />
                </v-tabs-window-item>
            </v-tabs-window>
        </div>
    </v-main>
    <v-navigation-drawer 
        location="right"
        permanent>
        <v-tabs 
            color="primary" 
            grow
            v-model="tab">
            <v-tab value="kaplay">Kaplay.JS</v-tab>
            <v-tab value="phaser">Phaser.JS</v-tab>
        </v-tabs>
        
      </v-navigation-drawer>

  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const tab = ref('kaplay')
</script>

<style lang="css">
.code-contents > div {
    height: 100%;
}

</style>
