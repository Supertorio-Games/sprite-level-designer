<template>
    <div>
        <v-btn-toggle
            v-model="mapStore.editMode"
            divided
            mandatory
            rounded
            density="comfortable"
            variant="tonal" >
            <v-tooltip text="Select (s)" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-cursor-default"  v-bind="props"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip text="Paint (w)" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-brush" v-bind="props"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip text="Erase (e)" location="top">
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
            <v-tooltip text="Fill Selection (f)" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn @click="fillSelection" v-bind="props" icon="mdi-format-color-fill" :disabled="!mapStore.hasSelectionRange || !spriteStore.selectedSpriteID"></v-btn>
                </template>
            </v-tooltip>
            <v-tooltip text="Clear Selection (x)" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn @click="clearSelection" v-bind="props" icon="mdi-water-remove"  :disabled="!mapStore.hasSelectionRange"></v-btn>
                </template>
            </v-tooltip>
        </v-btn-group>
    </div>
</template>

<script setup lang="ts">
    import { onKeyStroke } from '@vueuse/core'
    import { MAP_MODE, useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';

    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();

    const fillSelection = () => {
        if (!spriteStore.selectedSpriteID || !mapStore.hasSelectionRange) return;
        const [sheetId, spriteId] = spriteStore.selectedSpriteID;
        mapStore.fillSelectionWithSprite(sheetId, spriteId);
    };

    const clearSelection = () => {
        mapStore.clearSpritesFromSelection();
    };

    onKeyStroke('s', () => {
       mapStore.editMode = MAP_MODE.SELECT;
    });
    onKeyStroke('w', () => {
       mapStore.editMode = MAP_MODE.PAINT;
    });
    onKeyStroke('e', () => {
       mapStore.editMode = MAP_MODE.ERASE;
    });
    onKeyStroke('f', (e) => {
        fillSelection();
    });
    onKeyStroke('x', (e) => {
       clearSelection();
    });
    onKeyStroke('Escape', (e) => {
       mapStore.clearSelectionRange();
    });
 
</script>