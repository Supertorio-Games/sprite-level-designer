<template>
    <div class="sprite-details-drawer v-theme--dark">
        <div class="sprite-details-drawer__content">
            <div v-if="selectedSprite">
                <h3 class="text-h5">Selected Sprite</h3>
                <div class="sprite-display">
                    <div :style="getSpriteSwatchStyle(selectedSprite)"></div>
                </div>
                <v-list :items="items"></v-list>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue";
    import { storeToRefs } from "pinia";
    import { useSpritesStore } from "@/state/spritesStore";
    import type {subTexture} from "@/types";

    const spriteStore = useSpritesStore();
    const { selectedSprite } = storeToRefs(spriteStore);

    const getSpriteSwatchStyle = (spriteSelection: {spriteImage: string, sprite: subTexture}) => {
        return {
            'background-image': 'url('+ spriteSelection.spriteImage + ')', 
            'width': spriteSelection.sprite.width + 'px', 
            'height': spriteSelection.sprite.height + 'px',
            'background-position': -spriteSelection.sprite.x + 'px ' +  -spriteSelection.sprite.y + 'px'
        }
    }

    const items = computed(() => !selectedSprite ? [] : [
        {
            title: 'Width: ' + spriteStore.selectedSprite?.sprite.width + 'px',
            props: {
                prependIcon: 'mdi-arrow-expand-horizontal',
            },
        },
        {
            title: 'Height: ' + spriteStore.selectedSprite?.sprite.height + 'px',
            props: {
                prependIcon: 'mdi-arrow-expand-vertical',
            },
        },
        {
            title: 'Pos X: ' + spriteStore.selectedSprite?.sprite.x + 'px',
            props: {
                prependIcon: 'mdi-arrow-left-right',
            },
        },
        {
            title: 'Pos Y: ' + spriteStore.selectedSprite?.sprite.y + 'px',
            props: {
                prependIcon: 'mdi-arrow-up-down',
            },
        },
    ]);

</script>

<style lang="css" scoped>
    .sprite-details-drawer {
        position: absolute;
        -webkit-overflow-scrolling: touch;
        background: rgb(var(--v-theme-surface));
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width: 100%;
        pointer-events: auto;
        border-color: rgba(var(--v-border-color), var(--v-border-opacity));
        border-style: solid;
        border-width: 0;
        border-right-width: thin;
        
        box-shadow: 0px 8px 10px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 
                    0px 16px 24px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 
                    0px 6px 30px 5px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));
        color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
        width: 256px;
    }

    .sprite-details-drawer__content {
        flex: 0 1 auto;
        height: 100%;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 20px;
    }

    .sprite-display {
        text-align: center;
        border-width: thin;
        border-color: rgba(var(--v-border-color), var(--v-border-opacity));
        border-style: dashed;
        margin-top: 0.5em;
    }
    .sprite-display > div {
        margin: 0.5em auto;
    }
</style>