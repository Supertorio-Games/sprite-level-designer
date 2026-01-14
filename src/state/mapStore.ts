import type { cellPos } from '@/types';
import { defineStore, type StateTree } from 'pinia'
import { computed, ref, reactive, watch, toRaw } from 'vue'

const StoreName = "levelMap";

export enum MAP_MODE {SELECT = 0, PAINT = 1, FILL = 2, ERASE = 3};

type mapCell = {
    sprite: [number, number] | null;
}

const defaultMapCell: mapCell = {
    sprite: null,
}

const DEFAULT_CELL_SIZE = 64;
const DEFAULT_MAP_WIDTH = 30;
const DEFAULT_MAP_HEIGHT = 10;
const DEFAULT_MAP_SCALE = 1;
const DEFAULT_MAP_BACKGROUND = "#000000";

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
    const mapScale = ref<number>(DEFAULT_MAP_SCALE);
    const mapBackground = ref<string>(DEFAULT_MAP_BACKGROUND);

    // This is used to trigger a persistance update after the deeply reactive mapGrid changes.
    // Watchers on mapWidth and mapHeight will toggle this value to force a save after the grid has been resized.
    const persistTrigger = ref<boolean>(false);

    // View options
    const enableGrid = ref<boolean>(true);

    // Stored Grid Contents
    const mapGrid = reactive<mapCell[][]>([]);
    const mapGridRef = ref<mapCell[][]>([]); // Used for rehydration from storage only

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

    // Editor State
    const editMode = ref<MAP_MODE>(MAP_MODE.SELECT);

    // Watchers

    watch(mapWidth, (newWidth, oldWidth) => {
        if (newWidth > oldWidth) {
            const diff = newWidth - oldWidth;
            for (let r = 0; r < mapHeight.value; r++) {
                for (let c = 0; c < diff; c++) {
                    mapGrid[r].push({sprite: null});
                }
            }
        } else {
            const diff = oldWidth - newWidth;
            for (let r = 0; r < mapHeight.value; r++) {
                for (let c = 0; c < diff; c++) {
                    mapGrid[r].pop();
                }
            }
        }
        persistTrigger.value = !persistTrigger.value;
    });

    watch(mapHeight, (newHeight, oldHeight) => {
        if (newHeight > oldHeight) {
            const diff = newHeight - oldHeight;
            for (let r = 0; r < diff; r++) {
                const newRow = [];
                for (let c = 0; c < mapWidth.value; c++) {
                    newRow.push({sprite: null});
                }
                mapGrid.push(newRow);
            }
        } else {
            const diff = oldHeight - newHeight;
            for (let r = 0; r < diff; r++) {
                mapGrid.pop();
            }
        }
        persistTrigger.value = !persistTrigger.value;
    });

    watch(mapGridRef, (newGrid) => {
        for (let r = 0; r < mapHeight.value; r++) {
            for (let c = 0; c < mapWidth.value; c++) {
                mapGrid[r][c] = newGrid[r][c] || {...defaultMapCell};
            }
        }
    });

    // Getters

    const cellDisplaySize = computed(() => cellSize.value * mapScale.value);

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

    // Actions

    const setTileSprite = (row: number, col: number, sheetIndex: number, spriteIndex: number) => {
        getCell(row, col).sprite = [sheetIndex, spriteIndex];
    }

    const fillTileSpriteRange = (startTile:cellPos, endTile: cellPos, sheetIndex: number, spriteIndex: number) => {
        for (let r = startTile.row; r <= endTile.row; r++) {
            for (let c = startTile.col; c <= endTile.col; c++) {
                setTileSprite(r, c, sheetIndex, spriteIndex);
            }
        }
    }

    const clearTileSprite = (row: number, col: number) => {
        getCell(row, col).sprite = null;
    }

    const clearTileSpriteRange = (startTile:cellPos, endTile: cellPos) => {
        for (let r = startTile.row; r <= endTile.row; r++) {
            for (let c = startTile.col; c <= endTile.col; c++) {
                clearTileSprite(r, c);
            }
        }
    }


    return {
        cellSize,
        mapWidth,
        mapHeight,
        mapScale,
        mapBackground,
        enableGrid,
        mapGrid,
        mapGridRef,
        cellDisplaySize,
        editMode,
        getCell,
        getCellByIndex,
        setTileSprite,
        fillTileSpriteRange,
        clearTileSprite,
        clearTileSpriteRange,
    };

}, {
    persist: {
        serializer: serializer
    },
});
