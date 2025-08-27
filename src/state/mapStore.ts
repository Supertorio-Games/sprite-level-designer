import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'

export enum MAP_MODE {SELECT = 0, PAINT = 1, FILL = 2, ERASE = 3};

export type mapCell = {
    sprite: [number, number] | null;
}

const defaultMapCell: mapCell = {
    sprite: null,
}

export const useMapStore = defineStore('settings', () => {
    const cellSize = ref<number>(64);
    const mapWidth = ref<number>(30);
    const mapHeight = ref<number>(10);
    const mapScale = ref<number>(1);
    const mapBackground = ref<string>("#000000");

    const enableGrid = ref<boolean>(true);

    const mapGrid = reactive<mapCell[][]>([]);

    // Initialize grid
    for (let i = 0; i < mapHeight.value; i++) {
        const row = [];
        for (let j = 0; j < mapWidth.value; j++) {
            row.push({sprite: null});
        }
        mapGrid.push(row)
    }

    const editMode = ref<MAP_MODE>(MAP_MODE.SELECT);
    const cellDisplaySize = computed(() => cellSize.value * mapScale.value);

    const getCellByIndex = (cellIndex: number) => {
        const row = Math.floor(cellIndex/mapWidth.value);
        const col = cellIndex % mapWidth.value;
        return mapGrid[row][col];
    }

    const setTileSprite = (cellIndex: number, sheetIndex: number, spriteIndex: number) => {
        getCellByIndex(cellIndex).sprite = [sheetIndex, spriteIndex];
    }

    const clearTileSprite = (cellIndex: number) => {
        getCellByIndex(cellIndex).sprite = null;
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
        getCellByIndex,
        setTileSprite,
        clearTileSprite
    };
});