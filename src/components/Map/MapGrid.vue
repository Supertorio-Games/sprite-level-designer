<template>
    <div class="map-container" :style="containerStyles">
        <div class="map-row" :style="rowStyles" v-for="row in mapStore.mapHeight">
            <map-grid-cell v-for="col in mapStore.mapWidth" 
                :row="row" 
                :col="col" 
                :selection="mapStore.cellSelectionRange"
                :brush-mode="isInBrushMode"
                @select-start="onSelectStart" 
                @select-move="onSelectMove" 
                @select-end="onSelectEnd"
                @enter-brush-mode="onEnterBrushMode"
                @exit-brush-mode="onExitBrushMode"></map-grid-cell>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { type cellPos } from '@/types';
    import { MAP_MODE, useAppStore } from '@/state/appStore';

    const appConfigStore = useAppStore();
    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();

    const isInBrushMode = ref(false);
    const isSelecting = ref(false);

    const cellDisplaySize = computed(() => mapStore.cellSize * appConfigStore.mapScale);

    const onSelectStart = (position: cellPos) => {
        if (appConfigStore.editMode !== MAP_MODE.SELECT) return;
        mapStore.selectionStart = position;
        mapStore.selectionEnd = position;
        isSelecting.value = true;
    };

    const onSelectMove = (position: cellPos) => {
        if (appConfigStore.editMode !== MAP_MODE.SELECT) return;
        if (!isSelecting.value) return;
        mapStore.selectionEnd = position;
    };

    const onSelectEnd = (position: cellPos) => {
        if (appConfigStore.editMode !== MAP_MODE.SELECT) return;
        isSelecting.value = false;
        mapStore.selectionEnd = position;
    };

    const onEnterBrushMode = () => {
        isInBrushMode.value = true;
    };

    const onExitBrushMode = () => {
        isInBrushMode.value = false;
    };

    const containerStyles = computed(() => {
        const mapWidth = (mapStore.mapWidth * cellDisplaySize.value) + "px";
        const mapHeight = (mapStore.mapHeight * cellDisplaySize.value) + "px";

        let sheetVars: Record<string, string> = {};
        spriteStore.spriteSheets.forEach((sheet) => {
            const width = sheet.width * appConfigStore.mapScale;
            const height = sheet.height * appConfigStore.mapScale;
            sheetVars['--sheet-bg-size-' + sheet._id] =  width + "px " + height + "px ";
            sheetVars['--sheet-bg-' + sheet._id] = 'url(' + sheet.imageData + ')';
        })

        return {
            'background-color': appConfigStore.mapBackgroundColor,
            'width': mapWidth, 
            'height':mapHeight,
            '--cell-size': cellDisplaySize.value + "px",
            ...sheetVars
        }
    });

    const rowStyles = computed(() => {
        return {
            'grid-template-columns': 'repeat('+mapStore.mapWidth+', 1fr)', 
        }
    });
</script>


<style lang="css" scoped>
    .map-row {
        display: grid;
    }
</style>