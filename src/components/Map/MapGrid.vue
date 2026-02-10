<template>
    <div id="layer-stack" :style="layerStackStyles">
        <map-guides :cellDisplaySize="cellDisplaySize" />
        <template v-for="layer in mapStore.layerList">
            <div 
                v-if="layer.enabled"
                :id="layer.title"
                :style="{...baseLayerStyles, pointerEvents: layer._interactable ? 'auto' : 'none', 'z-index': layer.stacking}">
                    <template v-if="layer._type !== LayerType.background">
                        <div class="map-row" :style="rowStyles" v-for="row in mapStore.mapHeight">
                            <template v-if="layer._type === LayerType.physics">
                                <map-grid-physics-cell v-for="col in mapStore.mapWidth"
                                    :row="row" 
                                    :col="col">
                                </map-grid-physics-cell>
                            </template>
                            <template  v-if="layer._type === LayerType.tile">
                                <map-grid-cell v-for="col in mapStore.mapWidth" 
                                    :row="row" 
                                    :col="col" 
                                    :brush-mode="isInBrushMode"
                                    @select-start="onSelectStart" 
                                    @select-move="onSelectMove" 
                                    @select-end="onSelectEnd"
                                    @enter-brush-mode="onEnterBrushMode"
                                    @exit-brush-mode="onExitBrushMode"></map-grid-cell>
                            </template>
                        </div>
                    </template>
                    <template v-if="layer._type === LayerType.background">
                        <div class="map-background" :style="backgroundLayerStyles" />
                    </template>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, type CSSProperties } from 'vue';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { LayerType, type cellPos } from '@/types';
    import { MAP_MODE, useAppStore } from '@/state/appStore';
    import { hexToRgb } from '@/util/graphicsUtils';
    import { DEFAULT_GRID_COLOR } from '@/config';
    import { pixelValue } from '@/util/styleUtils';

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

    const layerStackStyles = computed<CSSProperties>(() => {
        const mapWidth = pixelValue(mapStore.mapWidth * cellDisplaySize.value);
        const mapHeight = pixelValue(mapStore.mapHeight * cellDisplaySize.value);

        let sheetVars: Record<string, string> = {};
        spriteStore.spriteSheets.forEach((sheet) => {
            const width = sheet.width * appConfigStore.mapScale;
            const height = sheet.height * appConfigStore.mapScale;
            sheetVars['--sheet-bg-size-' + sheet._id] =  pixelValue(width) + " " + pixelValue(height);
            sheetVars['--sheet-bg-' + sheet._id] = 'url(' + sheet.imageData + ')';
        })

        return {
            position: 'relative',
            width: mapWidth, 
            height:mapHeight,
            '--cell-size': pixelValue(cellDisplaySize.value),
            '--grid-line-color': hexToRgb(appConfigStore.gridLineColor) || DEFAULT_GRID_COLOR, 
            ...sheetVars
        }
    })

    const baseLayerStyles = computed<CSSProperties>(() => {
        const mapWidth = pixelValue(mapStore.mapWidth * cellDisplaySize.value);
        const mapHeight = pixelValue(mapStore.mapHeight * cellDisplaySize.value);

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: mapWidth,
            height: mapHeight,
            '--cell-size': pixelValue(cellDisplaySize.value),
        }
    });

    const backgroundLayerStyles = computed<CSSProperties>(() => {
        return {
            'background-color': appConfigStore.mapBackgroundColor,
        }
    })

    const rowStyles = computed<CSSProperties>(() => ({
        'grid-template-columns': 'repeat('+mapStore.mapWidth+', 1fr)', 
    }));
</script>


<style lang="css" scoped>
    .map-row {
        display: grid;
    }

    .map-background {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>
