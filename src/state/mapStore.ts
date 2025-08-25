import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export enum MAP_MODE {SELECT = 0, PAINT = 1, FILL = 2, ERASE = 3};


export type mapConfig = {
    cellSize: number;
    mapWidth: number;
    mapHeight: number;
    mapScale: number;
    backgroundColor: string;
}

export const defaultMapConfig = {
    cellSize: 64,
    mapWidth: 30,
    mapHeight: 10,
    mapScale: 1,
    backgroundColor: "#000000",
}


export const useMapStore = defineStore('settings', () => {
    const cellSize = ref<number>(64);
    const mapWidth = ref<number>(30);
    const mapHeight = ref<number>(10);
    const mapScale = ref<number>(1);
    const mapBackground = ref<string>("#000000");

    const editMode = ref<MAP_MODE>(MAP_MODE.SELECT);
    const cellDisplaySize = computed(() => cellSize.value * mapScale.value);


    return {
        cellSize,
        mapWidth,
        mapHeight,
        mapScale,
        mapBackground,
        cellDisplaySize,
        editMode, 
    };
});