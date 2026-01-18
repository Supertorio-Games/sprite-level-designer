<template>
    <v-sheet class="" elevation="4">
        <v-tabs color="primary" v-model="tab">
            <v-tab value="kaplay">Kaplay.JS</v-tab>
            <v-tab value="phaser">Phaser.JS</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="kaplay">
                <code-output-kaplay />
            </v-tabs-window-item>
            <v-tabs-window-item value="phaser">
                <code-output-phaser />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const tab = ref('kaplay')
</script>
