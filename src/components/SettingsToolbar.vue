<template>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-title>Grid Settings</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list>
                        <v-list-item>
                            <v-slider
                                v-model="appConfigStore.mapScale"
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
                                v-model="appConfigStore.enableGridLines"
                                label="Enable Grid Lines"
                                hide-details
                            ></v-switch>
                        </v-list-item>
                        <v-list-item>
                            <v-text-field
                                v-model="appConfigStore.mapBackgroundColor"
                                label="Background Color">
                            </v-text-field>
                        </v-list-item>
                        <v-list-item>
                            <v-text-field
                                v-model="appConfigStore.gridLineColor"
                                label="Grid Line COlor">
                            </v-text-field>
                        </v-list-item>
                    </v-list>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { useAppStore } from '@/state/appStore';

    const appConfigStore = useAppStore();

    const minScale = ref(0.1);
    const maxScale = ref(2);

</script>
