<template>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-eye-settings-outline"
          v-bind="props"
        ></v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            title="Display Settings"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-slider
                v-model="mapStore.mapScale"
                label="Map Scale"
                :max="maxScale"
                :min="minScale"
                class="align-center"
                hide-details
                >
            </v-slider>
          </v-list-item>

          <v-list-item>
            <v-switch
              v-model="mapStore.enableGrid"
              label="Enable Grid Lines"
              hide-details
            ></v-switch>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            @click="menu = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMapStore } from '@/state/mapStore';

const mapStore = useMapStore();

const minScale = ref(0.1);
const maxScale = ref(2);
  const fav = ref(true)
  const menu = ref(false)
  const message = ref(false)
  const hints = ref(true)
</script>