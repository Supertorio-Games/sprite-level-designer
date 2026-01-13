import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const StoreName = "sprites";

export type spriteSheet = {
    _id: number;
    imageData: string;
    width: number;
    height: number;
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

export const useSpritesStore = defineStore(StoreName, () => {
    const spriteSheets = ref<spriteSheet[]>([]);
    const selectedSheetId = ref<number>(-1);
    const selectedSpriteImageId = ref<number>(-1);
    const nextSheetID = () => spriteSheets.value.length;

    const addSpriteSheet = (imageData: string, width: number, height: number, config: sheetConfig) => {
        config.SubTexture.forEach((texture, index) => {
            texture._id = index;
        });

        const sheet : spriteSheet = {
            _id: nextSheetID(),
            width,
            height,
            imageData,
            config
        };
        spriteSheets.value.push(sheet);
    };

    const setSelectedSprite = (sheetIndex = -1, textureIndex = -1) => {
        selectedSheetId.value = sheetIndex;
        selectedSpriteImageId.value = textureIndex;
    }

    const hasSheets = computed(() => spriteSheets.value.length > 0);

    const selectedSprite = computed(() => {
        if (selectedSheetId.value < 0) return null;
        const sheet = spriteSheets.value.filter((sheet:spriteSheet) => sheet._id == selectedSheetId.value)[0];

        if (selectedSpriteImageId.value < 0 || !sheet?.config?.SubTexture) return null;
        const sprite = sheet.config.SubTexture.filter((subTexture) => subTexture._id == selectedSpriteImageId.value)[0];

        return !sprite ? null : {
            spriteImage: sheet.imageData, 
            sprite
        };
    });

    const selectedSpriteID = computed(() => {
         if (selectedSheetId.value < 0) return null;
         return [selectedSheetId.value, selectedSpriteImageId.value];
    });

    const findSpriteSheet = (sheetId: number) => {
        const sheet = spriteSheets.value.filter((sheet:spriteSheet) => sheet._id == sheetId);
        return sheet[0] || null;
    }

    const findSprite = (spriteId: [number, number]) => {
        const sheet = findSpriteSheet(spriteId[0]);
        if (!sheet) return null;

        const sprite = sheet.config.SubTexture.filter((subTexture) => subTexture._id == spriteId[1]);
        if (!sprite.length) return null;

        return sprite[0];
    };

    return { 
        spriteSheets,
        hasSheets,
        selectedSprite,
        selectedSpriteID,
        addSpriteSheet,
        findSpriteSheet,
        findSprite,
        setSelectedSprite,
    };

}, {
    persist: true,
});
