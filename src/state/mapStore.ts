import { defineStore } from 'pinia'
import { computed, ref, reactive, watch } from 'vue'

export enum MAP_MODE {SELECT = 0, PAINT = 1, FILL = 2, ERASE = 3};

export type mapCell = {
    sprite: [number, number] | null;
}

const defaultMapCell: mapCell = {
    sprite: null,
}

export const useMapStore = defineStore('settings', () => {
    // Map Configuration
    const cellSize = ref<number>(64);
    const mapWidth = ref<number>(30);
    const mapHeight = ref<number>(10);
    const mapScale = ref<number>(1);
    const mapBackground = ref<string>("#000000");

    // View options
    const enableGrid = ref<boolean>(true);

    // Stored Grid Contents
    const mapGrid = reactive<mapCell[][]>([]);

    // Initialize grid
    for (let i = 0; i < mapHeight.value; i++) {
        const row = [];
        for (let j = 0; j < mapWidth.value; j++) {
            row.push({sprite: null});
        }
        mapGrid.push(row)
    }

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
    });

    // Getters

    const cellDisplaySize = computed(() => cellSize.value * mapScale.value);

    const getCell = (row: number, col: number) => {
        row--; col--;
        if ( row < 0 || row >= mapGrid.length) {
            console.warn("Requested Cell Row out of Bounds", row);
            return {...defaultMapCell};
        }

        if ( col < 0 || col >= mapGrid[row].length) {
            console.warn("Requested Cell Col out of Bounds", col);
            return {...defaultMapCell};
        }

        return mapGrid[row][col];
    }

    const getCellByIndex = (cellIndex: number) => {
        const row = Math.floor(cellIndex/mapWidth.value);
        const col = cellIndex % mapWidth.value;
        return mapGrid[row][col];
    }

    const setTileSprite = (row: number, col: number, sheetIndex: number, spriteIndex: number) => {
        getCell(row, col).sprite = [sheetIndex, spriteIndex];
    }

    const clearTileSprite = (row: number, col: number) => {
        getCell(row, col).sprite = null;
    }


    return {
        cellSize,
        mapWidth,
        mapHeight,
        mapScale,
        mapBackground,
        enableGrid,
        map: mapGrid,
        cellDisplaySize,
        editMode,
        getCell,
        getCellByIndex,
        setTileSprite,
        clearTileSprite
    };
});