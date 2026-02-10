<template>
    <div class="map-grid-cell"
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
    import { useMapStore } from '@/state/mapStore';
    import { MAP_MODE, useAppStore } from '@/state/appStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { computed } from 'vue';
    import { pixelValue } from '@/util/styleUtils';

    const props = defineProps(['cellindex', 'row', 'col', 'brushMode']);
    const emits = defineEmits(['selectStart', 'selectMove', 'selectEnd', 'enterBrushMode', 'exitBrushMode']);
    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();
    const appConfigStore = useAppStore();

    const cellClickAction = () => {
        if (appConfigStore.editMode == MAP_MODE.PAINT) {
            paintCell();
        }
        else if (appConfigStore.editMode == MAP_MODE.SAMPLE) {
            sampleCell();
        }
        else if (appConfigStore.editMode == MAP_MODE.ERASE) {
            clearCell();
        }
    };

    const mouseDownAction = () => {
        if (appConfigStore.editMode == MAP_MODE.SELECT) {
            emits("selectStart", {row: props.row, col: props.col});
        }
        else if (appConfigStore.editMode == MAP_MODE.PAINT) {
            emits("enterBrushMode");
            paintCell();
        }
        else if (appConfigStore.editMode == MAP_MODE.ERASE) {
            emits("enterBrushMode");
            clearCell();
        }  
    };

    const mouseOverAction = () => {
        if (appConfigStore.editMode == MAP_MODE.SELECT) {
            emits("selectMove", {row: props.row, col: props.col});
        }
    };

    const mouseUpAction = () => {
        if (appConfigStore.editMode == MAP_MODE.SELECT) {
            emits("selectEnd", {row: props.row, col: props.col});
        }
        else if (appConfigStore.editMode == MAP_MODE.PAINT) {
            emits("exitBrushMode");
        }
        else if (appConfigStore.editMode == MAP_MODE.ERASE) {
            emits("exitBrushMode");
        }
    };

    const mouseEnterEffect = () => {
        if (!props.brushMode) return;
        if (appConfigStore.editMode == MAP_MODE.PAINT) paintCell();
        else if (appConfigStore.editMode == MAP_MODE.ERASE) clearCell();
    };


    const paintCell = () => {
        if (spriteStore.selectedSpriteID) {
            let [sheetId, spriteId] = spriteStore.selectedSpriteID;
            mapStore.setTileSprite(props.row, props.col, sheetId, spriteId);
        }
    };

    const sampleCell = () => {
        const cell = mapStore.getCell(props.row, props.col);
        if (cell.sprite != null) {
            spriteStore.setSelectedSprite(cell.sprite[0], cell.sprite[1]);
        }
    };

    const clearCell = () => {
        mapStore.clearTileSprite(props.row, props.col);
    };

    const cellStyles = computed(() => {
        const cell = mapStore.getCell(props.row, props.col);
        if (cell.sprite === null) return {};

        const sprite = spriteStore.findSprite(cell.sprite);
        const posX = (sprite?.x || 0) * appConfigStore.mapScale;
        const posY = (sprite?.y || 0) * appConfigStore.mapScale;

        return {
            backgroundSize: 'var(--sheet-bg-size-' + cell.sprite[0] + ')',
            backgroundImage: 'var(--sheet-bg-' + cell.sprite[0] + ')',
            backgroundPosition: "-" +  pixelValue(posX)  + " -" + pixelValue(posY)
        }
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

</style>
