<template>
    <div class="map-grid-cell"
        :class="cellClasses"
        :style="cellStyles"
        @click="cellClickAction"
        @mousedown="mouseDownAction"
        @mouseover="mouseOverAction"
        @mouseup="mouseUpAction"
        @mouseenter="mouseEnterEffect"
        >
    </div>
</template>

<script setup lang="ts">
import { MAP_MODE, useMapStore } from '@/state/mapStore';
import { useSpritesStore } from '@/state/spritesStore';
import { computed } from 'vue';

const props = defineProps(['cellindex', 'row', 'col', 'selection', 'brushMode']);
const emits = defineEmits(['selectStart', 'selectMove', 'selectEnd', 'enterBrushMode', 'exitBrushMode']);
const mapStore = useMapStore();
const spriteStore = useSpritesStore();

const cellClickAction = () => {
    switch(mapStore.editMode) {
        case MAP_MODE.PAINT:
            paintCell();
            break;
        case MAP_MODE.FILL:
            break;
        case MAP_MODE.ERASE:
            clearCell();
            break;
        default:
            // Cell Select Action
    }
};

const mouseDownAction = () => {
    if (mapStore.editMode == MAP_MODE.SELECT) {
        emits("selectStart", {row: props.row, col: props.col});
    }
    else if (mapStore.editMode == MAP_MODE.PAINT) {
        emits("enterBrushMode");
        paintCell();
    }
    else if (mapStore.editMode == MAP_MODE.ERASE) {
        emits("enterBrushMode");
        clearCell();
    }  
};

const mouseOverAction = () => {
    if (mapStore.editMode == MAP_MODE.SELECT) {
        emits("selectMove", {row: props.row, col: props.col});
    }
    
};

const mouseUpAction = () => {
    if (mapStore.editMode == MAP_MODE.SELECT) {
        emits("selectEnd", {row: props.row, col: props.col});
    }
    else if (mapStore.editMode == MAP_MODE.PAINT) {
        emits("exitBrushMode");
    }
    else if (mapStore.editMode == MAP_MODE.ERASE) {
        emits("exitBrushMode");
    }
};

const mouseEnterEffect = () => {
    if (!props.brushMode) return;
    if (mapStore.editMode == MAP_MODE.PAINT) paintCell();
    else if (mapStore.editMode == MAP_MODE.ERASE) clearCell();
};


const paintCell = () => {
    if (spriteStore.selectedSpriteID) {
        let [sheetId, spriteId] = spriteStore.selectedSpriteID;
        mapStore.setTileSprite(props.row, props.col, sheetId, spriteId);
    }
};

const clearCell = () => {
    mapStore.clearTileSprite(props.row, props.col);
};

const cellStyles = computed(() => {
    const cell = mapStore.getCell(props.row, props.col);
    const bgStyles:Record<string, string> = {};

    if (cell.sprite != null) {
        bgStyles.backgroundSize = 'var(--sheet-bg-size-' + cell.sprite[0] + ')';
        bgStyles.backgroundImage = 'var(--sheet-bg-' + cell.sprite[0] + ')';

        const sprite = spriteStore.findSprite(cell.sprite);
        const posX = (sprite?.x || 0) * mapStore.mapScale;
        const posY = (sprite?.y || 0) * mapStore.mapScale;

        bgStyles.backgroundPosition = "-" + posX + "px -" + posY + "px ";
    }

    return bgStyles;
});

const isCellSelected = computed(() => {
    if (props.selection == null ) {
        return false;
    }

    return (props.row >= props.selection.start.row && props.row <= props.selection.end.row &&
            props.col >= props.selection.start.col && props.col <= props.selection.end.col);
});

const cellClasses = computed(() => {
    return {
        'gridded': mapStore.enableGrid,
        'selection-start-row': isCellSelected.value &&  props.row == props.selection.start.row,
        'selection-end-row': isCellSelected.value &&  props.row == props.selection.end.row,
        'selection-start-col': isCellSelected.value &&  props.col == props.selection.start.col,
        'selection-end-col': isCellSelected.value &&  props.col == props.selection.end.col,
    };
});

</script>


<style lang="css" scoped>
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
        border-color: rgba(var(--v-border-color), var(--v-border-opacity));
        border-width: thin;
    }

    .map-grid-cell:hover::before {
        border-color: rgba(var(--v-border-color), 0.8);
    }

    .map-grid-cell.selection-start-row {
        border-top-style: dashed;
        border-top-color: white;
        border-top-width: thin;
    }

    .map-grid-cell.selection-end-row {
        border-bottom-style: dashed;
        border-bottom-color: white;
        border-bottom-width: thin;
    }

    .map-grid-cell.selection-start-col{
        border-left-style: dashed;
        border-left-color: white;
        border-left-width: thin;
    }

    .map-grid-cell.selection-end-col{
        border-right-style: dashed;
        border-right-color: white;
        border-right-width: thin;
    }


</style>