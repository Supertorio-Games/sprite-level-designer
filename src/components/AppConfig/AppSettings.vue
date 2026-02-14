<template>
    <v-list class="panel-list" density="compact">

        <v-list-item>
            <map-size-controls />
        </v-list-item>

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
                :label="$t('settings.gridLinesColor')"
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

        <v-divider color="warning" content-offset="-16" opacity="1" style="color: inherit" thickness="1" />

        <v-list-item>
            <div class="text-h6 text-warning mt-2 mb-3">{{$t('settings.dangerZone')}}</div>

            <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                        v-bind="activatorProps"
                        color="error"
                        :text="$t('settings.clearMapData')"
                        variant="elevated"
                        class="mb-3"
                        block
                        ></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card :title="$t('settings.clearMapDataConfirmTitle')">
                        <v-card-text>
                            {{ $t('settings.clearMapDataConfirmMessage') }}<br/>
                            <strong class="text-warning">{{ $t('settings.noUnDoWarningMessage') }}</strong>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                :text="$t('misc.btnCancel')"
                                @click="isActive.value = false"
                                ></v-btn>
                            <v-btn
                                :text="$t('settings.clearMapData')"
                                color="error"
                                variant="flat"
                                prepend-icon="mdi-nuke"
                                @click="isActive.value = false; clearMapData()"
                                ></v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>

            <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                        v-bind="activatorProps"
                        color="error"
                        :text="$t('settings.clearAppData')"
                        variant="elevated"
                        class="mb-3"
                        block
                        ></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card :title="$t('settings.clearAppDataConfirmTitle')">
                    <v-card-text>
                        {{ $t('settings.clearAppDataConfirmMessage') }}<br/>
                        <strong class="text-warning">{{ $t('settings.noUnDoWarningMessage') }}</strong>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            :text="$t('misc.btnCancel')"
                            @click="isActive.value = false"
                            ></v-btn>
                        <v-btn
                            :text="$t('settings.clearAppData')"
                            color="error"
                            variant="flat"
                            prepend-icon="mdi-nuke"
                            @click="isActive.value = false; clearAppData()"
                            ></v-btn>
                    </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>

        </v-list-item>

    </v-list>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useAppStore } from '@/state/appStore';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';

    const appConfigStore = useAppStore();
    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();

    const minScale = ref(0.1);
    const maxScale = ref(2);

    const clearMapData = () => {
        mapStore.clearMapData();
    };

    const clearAppData = async () => {
        appConfigStore.resetAppData();
        mapStore.resetAllData();
        spriteStore.clearSpriteData();
    };

</script>

