<template>
    <div :id="'sheet-'+index" class="sheet-display" :style="backgroundImageCSS">
        <h2>{{ sheet.config.imagePath }}</h2>

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
</template>


<script setup lang="ts">
    import { computed } from 'vue';
    import { useSpritesStore, type subTexture } from '@/state/spritesStore';
    
    const { setSelectedSprite } = useSpritesStore();

    const props = defineProps(['sheet', 'index']);

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