import { computed, ref, reactive, watch } from 'vue'
import { defineStore, type StateTree } from 'pinia'
import { DEFAULT_CELL_SIZE, DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT } from '@/config';
import { type mapLayer, type cellPos, type mapCell, LayerType } from '@/types';

const StoreName = "levelMap";

const defaultMapCell: mapCell = {
    sprite: null,
}

const defaultLayerList: mapLayer[] = [
    {
        _id: 1,
        _type: LayerType.physics,
        _interactable: false,
        title: 'Physics',
        enabled: false,
        icon: 'mdi-rocket-launch-outline',
        stacking: 10,
    },
    {
        _id: 2,
        _type: LayerType.tile,
        _interactable: true,
        title: 'Layer 1',
        enabled: true,
        icon: 'mdi-layers-outline',
        stacking: 1,
    },
    {
        _id: 0,
        _type: LayerType.background,
        _interactable: false,
        title: 'Background',
        enabled: true,
        icon: 'mdi-image-area',
        stacking: 0,
    }
];

/**
 * NOTE: The persistance plugin has a limititation around rehydrating deeply reactive objects.
 * To work around this, during deserializtion from storage, we copy the saved mapgrid into a separate
 * ref object and remove the original so it doesn't attempt to rehydrate and break reactivity. A watcher
 * in the store will instead, loop over the copy and update the reactive mapGrid object cell by cell.
 * 
 * Since this only happens once on store creation, the performance impact should be minimal.
 */
const serializer = {
    serialize: (data: StateTree) => JSON.stringify(data), // Default serialization 
    deserialize: (data: string) => {
        const values = JSON.parse(data) as StateTree;
        values['mapGridRef'] = values['mapGrid'];
        delete(values['mapGrid']);
        return values;
    },
};

export const useMapStore = defineStore(StoreName, () => {
    // Map Configuration
    const cellSize = ref<number>(DEFAULT_CELL_SIZE);
    const mapWidth = ref<number>(DEFAULT_MAP_WIDTH);
    const mapHeight = ref<number>(DEFAULT_MAP_HEIGHT);

    const selectionStart = ref<cellPos| null>(null);
    const selectionEnd = ref<cellPos | null>(null);

    // This is used to trigger a persistance update after the deeply reactive mapGrid changes.
    // Watchers on mapWidth and mapHeight will toggle this value to force a save after the grid has been resized.
    const persistTrigger = ref<boolean>(false);

    // Stored Grid Contents
    const mapGrid = reactive<mapCell[][]>([]);
    const mapGridRef = ref<mapCell[][]>([]); // Used for rehydration from storage only

    // Layers
    const layerList = ref<mapLayer[]>(defaultLayerList);

    // Initialize map grid
    const initializeGrid = (width:number, height:number, savedValues = null) => {
        mapGrid.length = 0;

        for (let r = 0; r < height; r++) {
            const rowValues = [];

            for (let c = 0; c < width; c++) {
                if (savedValues && savedValues[r] && savedValues[r][c]) {
                    rowValues.push(savedValues[r][c]);
                } else {
                    rowValues.push({sprite: null});
                }
            }

            mapGrid.push(rowValues);
        }
    }

    initializeGrid(mapWidth.value, mapHeight.value);


    // Watchers

    watch(mapWidth, () => {        
        reconcileMapDimensions();
        persistTrigger.value = !persistTrigger.value;
    });

    watch(mapHeight, () => {
        reconcileMapDimensions();
        persistTrigger.value = !persistTrigger.value;
    });

    watch(mapGridRef, (newGrid) => {
        for (let r = 0; r < mapHeight.value; r++) {
            for (let c = 0; c < mapWidth.value; c++) {
                mapGrid[r][c] = newGrid[r][c] || {...defaultMapCell};
            }
        }
        persistTrigger.value = !persistTrigger.value;
    });

    // Getters
    
    const getCell = (row: number, col: number) => {
        row--; col--;
        if ( row < 0 || row >= mapGrid.length ||
             col < 0 || col >= mapGrid[row].length
        ) {
            return {...defaultMapCell};
        }
        return mapGrid[row][col];
    }

    const getCellByIndex = (cellIndex: number) => {
        const row = Math.floor(cellIndex/mapWidth.value);
        const col = cellIndex % mapWidth.value;
        return mapGrid[row][col];
    }

    const hasSelectionRange = computed(() => {
        return selectionStart.value != null && selectionEnd.value != null;
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

    // Actions

    const setTileSprite = (row: number, col: number, sheetIndex: number, spriteIndex: number) => {
        getCell(row, col).sprite = [sheetIndex, spriteIndex];
    }

    const fillSelectionWithSprite = (sheetId: number, spriteId: number) => {
        if (!hasSelectionRange.value || sheetId < 0 || spriteId < 0) return;

        for (let r = cellSelectionRange.value!.start.row; r <= cellSelectionRange.value!.end.row; r++) {
            for (let c = cellSelectionRange.value!.start.col; c <= cellSelectionRange.value!.end.col; c++) {
                setTileSprite(r, c, sheetId, spriteId);
            }
        }

        clearSelectionRange();
    };

    const clearTileSprite = (row: number, col: number) => {
        if (!mapGrid[row][col] || !mapGrid[row][col]?.sprite) return;
        getCell(row, col).sprite = null;
    }

    const clearSpritesFromSelection = () => {
        if (!hasSelectionRange.value) return;

        for (let r = cellSelectionRange.value!.start.row; r <= cellSelectionRange.value!.end.row; r++) {
            for (let c = cellSelectionRange.value!.start.col; c <= cellSelectionRange.value!.end.col; c++) {
                clearTileSprite(r, c);
            }
        }
        clearSelectionRange();
    };

    const clearSelectionRange = () => {
        selectionStart.value = null;
        selectionEnd.value = null;
    }

     const clearSpriteSheetFromMap = async (spriteSheetID: number) => {
        for (let r = 0; r <= mapGrid.length; r++) {
            if (!mapGrid[r]) continue;
            for (let c = 0; c <= mapGrid[r].length; c++) {
                if (!mapGrid[r][c] || !mapGrid[r][c]?.sprite) continue;

                const cellSprite = mapGrid[r][c].sprite;
                if ( cellSprite && cellSprite[0] == spriteSheetID) {
                    mapGrid[r][c].sprite = null;
                }
            }
        }
        return { success: true };
    }

    const clearMapData = () => {
        for (let r = 0; r < mapGrid.length; r++) {
            for (let c = 0; c < mapGrid[r].length; c++) {
                try {
                    mapGrid[r][c].sprite = null;
                } catch (_e) {
                    mapGrid[r][c] = {...defaultMapCell};
                }
             } 
        }
    }

    const reconcileMapDimensions = () => {

        // Remove Excess Rows
        if (mapGrid.length > mapHeight.value) {
            mapGrid.length = mapHeight.value;
        } 
        // Add Missing Rows
        else if (mapGrid.length < mapHeight.value) {
            for (let r = mapGrid.length-1; r < mapHeight.value; r++) {
                mapGrid[r] = [];
                for (let c = 0; c < mapWidth.value; c++) {
                    mapGrid[r][c] = {...defaultMapCell};
                }
            }
        }

        // Reconcile each row width
        for (let r = 0; r < mapGrid.length; r++) {
            // Remove Excess Columns
            if (mapGrid[r].length > mapWidth.value) {
                mapGrid[r].length = mapWidth.value;
            }
            // Add missing columns
            else if (mapGrid[r].length < mapWidth.value) {
                for (let c = mapGrid[r].length-1; c < mapWidth.value; c++) {
                    mapGrid[r][c] = {...defaultMapCell};
                }
            }
        }
    }

    const resetAllData = () => {
        clearMapData();
        cellSize.value = DEFAULT_CELL_SIZE;
        mapWidth.value = DEFAULT_MAP_WIDTH;
        mapHeight.value = DEFAULT_MAP_HEIGHT;
    }


    return {
        cellSize,
        mapWidth,
        mapHeight,
        selectionStart,
        selectionEnd,
        mapGrid,
        mapGridRef,
        getCell,
        getCellByIndex,
        hasSelectionRange,
        cellSelectionRange,
        setTileSprite,
        fillSelectionWithSprite,
        clearSpritesFromSelection,
        clearTileSprite,
        clearSelectionRange,
        clearSpriteSheetFromMap,
        clearMapData,
        layerList,
        resetAllData,
    };

}, {
    persist: {
        serializer: serializer,
        omit: ['selectionStart', 'selectionEnd'],
    },
});
