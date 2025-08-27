<template>
    <v-container fluid class="h-100 overflow-x-auto overflow-y-auto">
        <div class="map-container" :style="containerStyles">
            <map-grid-cell v-for="index in numCells" :cellindex="index-1"></map-grid-cell>
        </div>
    </v-container>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';

    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();
    const numCells = computed(() => mapStore.mapWidth * mapStore.mapHeight);
    const containerStyles = computed(() => {
        const mapWidth = (mapStore.mapWidth * mapStore.cellDisplaySize) + "px";
        const mapHeight = (mapStore.mapHeight * mapStore.cellDisplaySize) + "px";

        let sheetVars: Record<string, string> = {};
        spriteStore.spriteSheets.forEach((sheet) => {
            const width = sheet.width * mapStore.mapScale;
            const height = sheet.height * mapStore.mapScale;
            sheetVars['--sheet-bg-size-' + sheet._id] =  width + "px " + height + "px ";
            sheetVars['--sheet-bg-' + sheet._id] = 'url(' + sheet.imageData + ')';
        })

        return {
            'background-color': mapStore.mapBackground,
            'grid-template-columns': 'repeat('+mapStore.mapWidth+', 1fr)', 
            'width': mapWidth, 
            'height':mapHeight,
            '--cell-size': mapStore.cellDisplaySize + "px",
            ...sheetVars
        }
    });
</script>


<style lang="css" scoped>
    .map-container {
        display: grid;
        row-gap: 0;
    }
</style>