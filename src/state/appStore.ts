import { defineStore } from "pinia";
import { ref } from "vue";


const StoreName = "appConfig";

export const useAppStore = defineStore(StoreName, () => {

    const outputSpritePath = ref<string>("");
    const kaplayOptPrefix = ref<string>("");

    return {
        outputSpritePath,
        kaplayOptPrefix
    };

}, {
    persist: true
});
