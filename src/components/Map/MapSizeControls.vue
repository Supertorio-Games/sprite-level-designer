<template>
    <form class="map-size-controls">
        <v-number-input
            :label="$t('settings.mapWidth')"
            controlVariant="stacked"
            v-model="debouncedWidth"
            :hide-details="true"
            density="compact"
            @update:model-value="debouncedWidthChange"
            ></v-number-input>

        <v-number-input
            :label="$t('settings.mapHeight')"
            controlVariant="stacked"
            v-model="debouncedHeight"
            :hide-details="true"
            density="compact"
            @update:model-value="debouncedHeightChange"
            ></v-number-input>
    </form>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useDebounceFn } from '@vueuse/core'
    import { useMapStore } from '@/state/mapStore';
    
    const mapStore = useMapStore();

    const debouncedWidth = ref<number>(mapStore.mapWidth);
    const debouncedHeight = ref<number>(mapStore.mapHeight);
    const debounceTime = 500;

    mapStore.$subscribe((_mutation, state) => {
        debouncedWidth.value = state.mapWidth;
        debouncedHeight.value = state.mapHeight;
    });

    const debouncedWidthChange = useDebounceFn((newWidth) => {
        mapStore.mapWidth = newWidth;
    }, debounceTime);

    const debouncedHeightChange = useDebounceFn((newHeight) => {
        mapStore.mapHeight = newHeight;
    }, debounceTime);

</script>

<style>
    .map-size-controls {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>
