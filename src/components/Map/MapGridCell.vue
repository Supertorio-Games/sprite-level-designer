<template>
    <div class="map-grid-cell"
        :class="mapStore.enableGrid ? 'gridded' : ''"
        :style="cellStyles"
        @click="cellClickAction">
    </div>
</template>

<script setup lang="ts">
import { MAP_MODE, useMapStore } from '@/state/mapStore';
import { useSpritesStore } from '@/state/spritesStore';
import { computed } from 'vue';

const props = defineProps(['cellindex']);
const mapStore = useMapStore();
const spriteStore = useSpritesStore();

const cellClickAction = () => {
    switch(mapStore.editMode) {
        case MAP_MODE.PAINT:
            // cell fill action
            if (spriteStore.selectedSpriteID) {
                let [sheetId, spriteId] = spriteStore.selectedSpriteID;
                mapStore.setTileSprite(props.cellindex, sheetId, spriteId);
            }
            break;
        case MAP_MODE.FILL:
            break;
        case MAP_MODE.ERASE:
                mapStore.clearTileSprite(props.cellindex);
            break;
        default:
            // Cell Select Action
    }

};

const cellStyles = computed(() => {
    const cell = mapStore.getCellByIndex(props.cellindex);
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
</style>