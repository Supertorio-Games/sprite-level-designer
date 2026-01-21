<template>
    <sprite-sheet-ingest-form />
    <v-toolbar border density="compact" class="flex-0-0">
        <template v-slot:default>
            <div class="toolbar-contents">
                <map-mode-selector></map-mode-selector>
                <form class="map-size-controls">
                    <span>{{ $t('tools.mapSizeLabel') }} </span>
                    <input name="grid-width" type="number" v-model="mapStore.mapWidth" /> 
                    <span>{{ $t('tools.mapSizeDimensionsSeparator') }}</span> 
                    <input  name="grid-height" type="number" v-model="mapStore.mapHeight" />
                </form>
            </div>
        </template>
        <template v-slot:append>
            <v-btn 
            prepend-icon="mdi-plus-circle"
            @click="openIngestForm"
            >{{ $t('navigation.actionAddSpriteSheet') }}</v-btn>
        </template>
    </v-toolbar>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/state/mapStore';
    import { useAppStore } from '@/state/appStore';

    const mapStore = useMapStore();
    const { openIngestForm } = useAppStore();
</script>

<style scoped>
    .toolbar-contents {
        flex: 1 1 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3rem;
    }

    .map-size-controls {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .map-size-controls span {
        text-transform: uppercase;
        font-weight: 500;
        font-size: 0.875rem;
    }

    .map-size-controls input {
        border-color: rgba(var(--v-border-color), var(--v-border-opacity));
        border-style: solid;
        max-width: 4rem;
        padding: 4px 6px;
        font-size: 1.1rem;
    }
</style>