<template>
    <v-dialog :activator="props.activator" max-width="600">
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-cog"
                title="Map Settings"
            >
                <div class="pa-2">
                    <v-number-input
                        v-model="mapStore.mapWidth"
                        :reverse="false"
                        controlVariant="default"
                        label="Width"
                        :hideInput="false"
                        :inset="false"
                        ></v-number-input>
                </div>
                <div class="pa-2">
                    <v-number-input
                        v-model="mapStore.mapHeight"
                        :reverse="false"
                        controlVariant="default"
                        label="Height"
                        :hideInput="false"
                        :inset="false"
                        ></v-number-input>
                </div>
                <div class="pa-2">
                    <v-color-picker 
                        v-model="mapStore.mapBackground"
                        mode="rgb"
                        ></v-color-picker>
                </div>
                <template v-slot:actions>
                    <v-btn
                        class="ms-auto"
                        text="Close"
                        @click="isActive.value = false"
                    ></v-btn>
                </template>
            </v-card>
        </template>
      </v-dialog>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useMapStore } from '@/state/mapStore';
    
    const mapStore = useMapStore();
    const props = defineProps(['activator']);
    const minScale = ref(0.1)
    const maxScale = ref(2)
</script>