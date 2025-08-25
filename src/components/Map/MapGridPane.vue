<template>
    <v-container fluid class="h-100 overflow-x-auto overflow-y-auto">
        <div class="map-container" :style="containerStyles">
            <div v-for="index in numCells" class="map-cell" :style="cellStyles"></div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useMapStore } from '@/state/mapStore';

    const mapStore = useMapStore();
    const numCells = computed(() => mapStore.mapWidth * mapStore.mapHeight);

    const containerStyles = computed(() => {
        const mapWidth = (mapStore.mapWidth * mapStore.cellDisplaySize) + "px";
        const mapHeight = (mapStore.mapHeight * mapStore.cellDisplaySize) + "px";
        return {
            'background-color': mapStore.mapBackground,
            'grid-template-columns': 'repeat('+mapStore.mapWidth+', 1fr)', 
            'width': mapWidth, 
            'height':mapHeight
        }
    });

    const cellStyles = computed(() => {
        const cellSize = mapStore.cellDisplaySize + "px";
        return  {
            'width': cellSize, 
            'height': cellSize
        }
    })

</script>


<style lang="css" scoped>
    .map-container {
        display: grid;
        row-gap: 0;
    }

    .map-cell {
        display: inline-block;
        position: relative;
        margin: 0;
        padding: 0;
    }

    .map-cell::after {
        content: "";
        display: block;
        border: 1px solid #999;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>