<template>
    <div id="Guidelines" class="map-guides" :style="layerStyles">
        <div class="map-row" :style="rowStyles" v-for="row in mapStore.mapHeight">
            <div v-for="col in mapStore.mapWidth" 
                class="map-grid-cell" 
                :class="{ 
                    'gridded': appConfigStore.enableGridLines ,
                    'selection-start-row': isCellSelected(row, col) &&  row == mapStore.cellSelectionRange?.start.row,
                    'selection-end-row': isCellSelected(row, col) &&  row == mapStore.cellSelectionRange?.end.row,
                    'selection-start-col': isCellSelected(row, col) &&  col == mapStore.cellSelectionRange?.start.col,
                    'selection-end-col': isCellSelected(row, col) &&  col == mapStore.cellSelectionRange?.end.col,
                }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, type CSSProperties } from 'vue';
    import { useMapStore } from '@/state/mapStore';
    import { useAppStore } from '@/state/appStore';
    import { pixelValue } from '@/util/styleUtils';

    const props = defineProps([
        'cellDisplaySize',
    ]);

    const mapStore = useMapStore();
    const appConfigStore = useAppStore();

    const layerStyles = computed<CSSProperties>(() => {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: pixelValue(mapStore.mapWidth * props.cellDisplaySize),
            height: pixelValue(mapStore.mapHeight * props.cellDisplaySize),
            '--cell-size': pixelValue(props.cellDisplaySize),
        }
    });

    const rowStyles = computed<CSSProperties>(() => ({
        'grid-template-columns': 'repeat('+mapStore.mapWidth+', 1fr)', 
    }));

    const isCellSelected = (row: number, col: number) => {
        if (mapStore.cellSelectionRange == null ) return false;
        return (row >= mapStore.cellSelectionRange.start.row && row <= mapStore.cellSelectionRange.end.row &&
                col >= mapStore.cellSelectionRange.start.col && col <= mapStore.cellSelectionRange.end.col);
    };

</script>


<style lang="css" scoped>
    .map-guides {
        z-index: 1000;
        pointer-events: none;
    }

    .map-row {
        display: grid;
    }

    .map-grid-cell {
        display: inline-block;
        position: relative;
        margin: 0;
        padding: 0;
        width: var(--cell-size);
        height: var(--cell-size);
    }

    .map-grid-cell::before {
        content: "";
        display: block;
        border-style: solid;
        border-width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .map-grid-cell.gridded::before {
        border-color: rgba(var(--grid-line-color), var(--v-border-opacity));
        border-width: thin;
    }

    .map-grid-cell:hover::before {
        border-color: rgba(var(--grid-line-color), 0.8);
    }

    .map-grid-cell.selection-start-row::before {
        border-top-style: dashed;
        border-top-color: rgb(var(--grid-line-color));
        border-top-width: thin;
    }

    .map-grid-cell.selection-end-row::before {
        border-bottom-style: dashed;
        border-bottom-color: rgb(var(--grid-line-color));
        border-bottom-width: thin;
    }

    .map-grid-cell.selection-start-col::before {
        border-left-style: dashed;
        border-left-color: rgb(var(--grid-line-color));
        border-left-width: thin;
    }

    .map-grid-cell.selection-end-col::before {
        border-right-style: dashed;
        border-right-color: rgb(var(--grid-line-color));
        border-right-width: thin;
    }

</style>
