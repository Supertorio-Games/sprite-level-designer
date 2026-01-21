<template>
    <div>
        <v-card variant="tonal" style="overflow: initial; z-index: initial">
            <v-toolbar density="compact" :title="sheet.config.imagePath">
                <v-btn icon="mdi-trash-can-outline" @click="confirmDialogOpen = true"></v-btn>
            </v-toolbar>
            
                <div :id="'sheet-'+index" class="sheet-display" :style="backgroundImageCSS">
                    <div v-for="tile in sheet.config.SubTexture" class="spriteTile">
                        <v-tooltip :text="tile.name">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    :title="tile.name" 
                                    :style="getBackgroundPosCSS(tile)"
                                    @click="selectSprite(tile._id)">
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </div>
            
        </v-card>
    </div>
    <v-dialog v-model="confirmDialogOpen" width="auto">
        <v-card max-width="400"
            prepend-icon="mdi-alert-octagram"
            :text="$t('message.removeSpriteSheetMessage')"
            :title="$t('message.removeSpriteSheetTitle')">
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn class="ms-auto"
                    variant="tonal"
                    :text="$t('message.removeSpriteSheetAction')"
                    @click="onDeleteSpritesheet"></v-btn>
                <v-btn class="ms-auto"
                    :text="$t('navigation.btnCancel')"
                    @click="confirmDialogOpen = false"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useSpritesStore } from '@/state/spritesStore';
    import { useMapStore } from '@/state/mapStore';
    import type { subTexture } from '@/types';
    
    const { setSelectedSprite, removeSpriteSheet } = useSpritesStore();
    const { clearSpriteSheetFromMap } = useMapStore();
    const props = defineProps(['sheet', 'index']);

    const confirmDialogOpen = ref<boolean>(false);

    const backgroundImageCSS = computed(() => {
        return {'--button-bg-image': 'url(' + props.sheet.imageData + ')'};
    });

    const getBackgroundPosCSS = (tile: subTexture) => {
        return {
            'background-position': -tile.x + 'px ' +  -tile.y + 'px'
        };
    }

    const selectSprite = (tileID: number) => {
        setSelectedSprite(props.sheet._id, tileID);
    }

    const onDeleteSpritesheet = () => {
        clearSpriteSheetFromMap(props.sheet._id);
        removeSpriteSheet(props.sheet._id);
        confirmDialogOpen.value = false;
    }

</script>

<style lang="css" scoped>
    .sheet-display {
        padding: 10px;
    }

    .spriteTile {
        width: 64px; 
        height: 64px; 
        display: inline-block;
        border: 1px solid #ccc;
        overflow: hidden; 
        margin-right: 5px;
    }

    .spriteTile button {
        width: 100%;
        height: 100%;
        background-image: var(--button-bg-image);
    }
</style>