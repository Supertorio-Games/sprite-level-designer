<template>
    <div class="map-container" :style="containerStyles">
        <div class="map-row" :style="rowStyles" v-for="row in mapStore.mapHeight">
            <map-grid-cell v-for="col in mapStore.mapWidth" 
                :row="row" 
                :col="col" 
                :selection="cellSelectionRange"
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
    import { onKeyStroke } from '@vueuse/core'
    import { MAP_MODE, useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { type cellPos } from '@/types';

    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();

    const isInBrushMode = ref(false);
    const isSelecting = ref(false);
    const selectionStart = ref<cellPos| null>(null);
    const selectionEnd = ref<cellPos | null>(null);

    const onSelectStart = (position: cellPos) => {
        if (mapStore.editMode !== MAP_MODE.SELECT) return;
        selectionStart.value = position;
        selectionEnd.value = position;
        isSelecting.value = true;
    };

    const onSelectMove = (position: cellPos) => {
        if (mapStore.editMode !== MAP_MODE.SELECT) return;
        if (!isSelecting.value) return;
        selectionEnd.value = position;
    };

    const onSelectEnd = (position: cellPos) => {
        if (mapStore.editMode !== MAP_MODE.SELECT) return;
        isSelecting.value = false;
        selectionEnd.value = position;
    };

    const onEnterBrushMode = () => {
        isInBrushMode.value = true;
    };

    const onExitBrushMode = () => {
        isInBrushMode.value = false;
    };

    const deselect = () => {
        selectionStart.value = null;
        selectionEnd.value = null;
    };

    const fillSelection = () => {
        if (!spriteStore.selectedSpriteID) return;

        const [sheetId, spriteId] = spriteStore.selectedSpriteID;
        mapStore.fillTileSpriteRange(cellSelectionRange.value!.start, cellSelectionRange.value!.end, sheetId, spriteId);
        deselect();
    };

    const clearSelection = () => {
        mapStore.clearTileSpriteRange(cellSelectionRange.value!.start, cellSelectionRange.value!.end);
        deselect();
        deselect();
    };

    onKeyStroke('Escape', (e) => {
       deselect();
    });

    onKeyStroke('f', (e) => {
       fillSelection();
    });

    onKeyStroke('x', (e) => {
       clearSelection();
    });

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
            'width': mapWidth, 
            'height':mapHeight,
            '--cell-size': mapStore.cellDisplaySize + "px",
            ...sheetVars
        }
    });

    const cellSelectionRange = computed(() => {
        if (selectionStart.value == null || selectionEnd == null) {
            return null;
        }

        const startRow = Math.min(selectionStart.value?.row || 0, selectionEnd.value?.row || 0);
        const endRow = Math.max(selectionStart.value?.row || 0, selectionEnd.value?.row || 0);
        const startCol = Math.min(selectionStart.value?.col || 0, selectionEnd.value?.col || 0);
        const endCol = Math.max(selectionStart.value?.col || 0, selectionEnd.value?.col || 0);
        return { start: { row: startRow, col: startCol }, end: { row: endRow, col: endCol } };
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