import { defineStore } from 'pinia'
import { computed, ref } from 'vue'


export type spriteSheet = {
    _id: number;
    imageData: string;
    config: sheetConfig;
}

export type sheetConfig = {
    imagePath: string;
    SubTexture: subTexture[];
}

export type subTexture = {
    _id: number;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
}

export const useSpritesStore = defineStore('sprites', () => {
    const spriteSheets = ref<spriteSheet[]>([]);
    const selectedSheetId = ref<number>(-1);
    const selectedSpriteId = ref<number>(-1);

    const nextSheetID = () => spriteSheets.value.length;

    const addSpriteSheet = (imageData: string, config: sheetConfig) => {
            config.SubTexture.forEach((texture, index) => {
                texture._id = index;
            });

            const sheet : spriteSheet = {
                _id: nextSheetID(),
                imageData,
                config
            };
            spriteSheets.value.push(sheet);
        };

    const setSelectedSprite = (sheetIndex = -1, textureIndex = -1) => {
        selectedSheetId.value = sheetIndex;
        selectedSpriteId.value = textureIndex;
    }

    const hasSheets = computed(() => spriteSheets.value.length > 0);

    const selectedSprite = computed(() => {
        if (selectedSheetId.value < 0) return null;
        const sheet = spriteSheets.value.filter((sheet:spriteSheet) => sheet._id == selectedSheetId.value)[0];

        if (selectedSpriteId.value < 0 || !sheet?.config?.SubTexture) return null;
        const sprite = sheet.config.SubTexture.filter((subTexture) => subTexture._id == selectedSpriteId.value)[0];

        return !sprite ? null : {
            spriteImage: sheet.imageData, 
            sprite
        };
    });

    return { 
        spriteSheets, 
        hasSheets,
        selectedSprite,
        addSpriteSheet, 
        setSelectedSprite,
    };
})