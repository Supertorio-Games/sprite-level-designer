<template>
    <div>
        <v-btn-toggle
            v-model="appConfigStore.editMode"
            divided
            mandatory
            rounded
            density="comfortable"
            variant="tonal" >
            <v-tooltip :text="$t('tools.selectModeToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-cursor-default"  v-bind="props"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="$t('tools.brushModeToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-brush" v-bind="props"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="$t('tools.eyedropperToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-eyedropper" v-bind="props"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="$t('tools.eraserToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-eraser" v-bind="props"></v-btn>
                </template>
            </v-tooltip>
        </v-btn-toggle>
        <v-btn-group
            class="ml-4"
            divided
            rounded
            density="comfortable"
            variant="tonal">
            <v-tooltip :text="$t('tools.fillSelectionToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn @click="fillSelection" v-bind="props" icon="mdi-format-color-fill" :disabled="!mapStore.hasSelectionRange || !spriteStore.selectedSpriteID"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="$t('tools.clearSelectionToolTip')" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn @click="clearSelection" v-bind="props" icon="mdi-water-remove"  :disabled="!mapStore.hasSelectionRange"></v-btn>
                </template>
            </v-tooltip>
        </v-btn-group>
    </div>
</template>

<script setup lang="ts">
    import { watch } from 'vue';
    import { onKeyStroke } from '@vueuse/core'
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { MAP_MODE, useAppStore } from '@/state/appStore';

    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();
    const appConfigStore = useAppStore();

    const fillSelection = () => {
        if (!spriteStore.selectedSpriteID || !mapStore.hasSelectionRange) return;
        const [sheetId, spriteId] = spriteStore.selectedSpriteID;
        mapStore.fillSelectionWithSprite(sheetId, spriteId);
    };

    const clearSelection = () => {
        mapStore.clearSpritesFromSelection();
    };

    watch(() => appConfigStore.editMode, (newMode) => {
        if (newMode !== MAP_MODE.SELECT) {
            mapStore.clearSelectionRange();
        }
    });

    onKeyStroke('s', () => {
       appConfigStore.editMode = MAP_MODE.SELECT;
    });
    onKeyStroke('b', () => {
       appConfigStore.editMode = MAP_MODE.PAINT;
    });
    onKeyStroke('i', () => {
       appConfigStore.editMode = MAP_MODE.SAMPLE;
    });
    onKeyStroke('e', () => {
       appConfigStore.editMode = MAP_MODE.ERASE;
    });
    onKeyStroke('f', () => {
        fillSelection();
    });
    onKeyStroke('x', () => {
       clearSelection();
    });
    onKeyStroke('Escape', () => {
       mapStore.clearSelectionRange();
    });
 
</script>
