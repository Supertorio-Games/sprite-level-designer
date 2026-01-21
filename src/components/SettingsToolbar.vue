<template>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-title>{{ $t('settings.mapConfig') }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list class="panel-list" density="compact">
                        <v-list-item>
                            <v-slider
                                v-model="appConfigStore.mapScale"
                                :label="$t('settings.mapScale')"
                                :max="maxScale"
                                :min="minScale"
                                class="align-center"
                                hide-details
                                density="compact"   
                                >
                            </v-slider>
                        </v-list-item>
                        <v-list-item>
                            <v-switch
                                v-model="appConfigStore.enableGridLines"
                                :label="$t('settings.enableGridLines')"
                                hide-details
                            ></v-switch>
                        </v-list-item>
                        <v-list-item>
                            <v-text-field
                                v-model="appConfigStore.mapBackgroundColor"
                                :label="$t('settings.backgroundColor')"
                                density="compact">
                            </v-text-field>
                        </v-list-item>
                        <v-list-item>
                            <v-text-field
                                v-model="appConfigStore.gridLineColor"
                                l:abel="$t('settings.gridLinesColor')"
                                density="compact">
                            </v-text-field>
                        </v-list-item>
                        <v-list-item>
                            <v-text-field
                                v-model="mapStore.cellSize"
                                :label="$t('settings.cellSize')"
                                density="compact">
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
    import { useMapStore } from '@/state/mapStore';

    const appConfigStore = useAppStore();
    const mapStore = useMapStore();

    const minScale = ref(0.1);
    const maxScale = ref(2);

</script>

<style lang="css" scoped>
    .v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline: 0;
    }
</style>
