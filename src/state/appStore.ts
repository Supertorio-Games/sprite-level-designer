import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_MAP_BACKGROUND_COLOR, DEFAULT_GRID_COLOR, DEFAULT_MAP_SCALE } from "@/config";

const StoreName = "appConfig";

export enum MAP_MODE {SELECT = 0, PAINT = 1, SAMPLE = 2, ERASE = 3};

export const useAppStore = defineStore(StoreName, () => {

    // Editor State
    const toolbarOpen = ref<boolean>(true);
    const editMode = ref<MAP_MODE>(MAP_MODE.SELECT);
    const ingestFormOpen = ref<boolean>(false);
    
    const outputSpritePath = ref<string>("");
    const kaplayOptPrefix = ref<string>("");

    // Map Display Options
    const mapScale = ref<number>(DEFAULT_MAP_SCALE);
    const enableGridLines = ref<boolean>(true);
    const mapBackgroundColor = ref<string>(DEFAULT_MAP_BACKGROUND_COLOR);
    const gridLineColor = ref<string>(DEFAULT_GRID_COLOR);

    const openIngestForm = () => ingestFormOpen.value = true;
    const closeIngestForm = () => ingestFormOpen.value = false;

    return {
        toolbarOpen,
        editMode,
        ingestFormOpen,
        outputSpritePath,
        kaplayOptPrefix,
        mapScale,
        enableGridLines,
        mapBackgroundColor,
        gridLineColor,
        openIngestForm,
        closeIngestForm
    };

}, {
    persist: {
        omit: ['ingestFormOpen']
    }
});
