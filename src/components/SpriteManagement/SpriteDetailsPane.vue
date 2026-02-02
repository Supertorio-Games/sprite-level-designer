<template>
    <div class="sprite-details-drawer v-theme--dark">
        <div class="sprite-details-drawer__content">
            <div v-if="selectedSprite">
                <div class="sprite-config">
                    <h3 class="text-h7">Selected Sprite</h3>
                    <div class="sprite-display">
                        <div :style="getSpriteSwatchStyle(selectedSprite)"></div>
                    </div>
                    <div class="block-options">
                        <v-checkbox 
                            v-model="selectedSprite.sprite.hasCollision"
                            :label="t('spriteInfo.hasCollisions')" 
                            density="compact" 
                            :hide-details="true"></v-checkbox>
                        <v-checkbox 
                            v-model="selectedSprite.sprite.hasPhysics"
                            :label="t('spriteInfo.hasPhysics')" 
                            density="compact" 
                            :hide-details="true"></v-checkbox>
                        <v-checkbox 
                            v-if="selectedSprite.sprite.hasPhysics"
                            v-model="selectedSprite.sprite.isStatic"
                            :label="t('spriteInfo.isStatic')" 
                            density="compact" 
                            :hide-details="true"></v-checkbox>
                        <v-text-field 
                            v-model="tags"
                            clearable 
                            :label="t('spriteInfo.tags')" 
                            density="compact" 
                            :hide-details="true">
                        </v-text-field>
                    </div>
                </div>

                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>{{ $t('spriteInfo.details') }}</v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-list :items="items" density="compact"></v-list>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue";
    import { storeToRefs } from "pinia";
    import { useSpritesStore } from "@/state/spritesStore";
    import type {sheetTexture} from "@/types";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({ useScope: "global" });
    const spriteStore = useSpritesStore();
    const { selectedSprite } = storeToRefs(spriteStore);

    const tags = ref<string>();

    const getSpriteSwatchStyle = (spriteSelection: {spriteImage: string, sprite: sheetTexture}) => {
        return {
            'background-image': 'url('+ spriteSelection.spriteImage + ')', 
            'width': spriteSelection.sprite.width + 'px', 
            'height': spriteSelection.sprite.height + 'px',
            'background-position': -spriteSelection.sprite.x + 'px ' +  -spriteSelection.sprite.y + 'px'
        }
    }

    const items = computed(() => !selectedSprite ? [] : [
        {
            title: t('spriteInfo.width', {value: spriteStore.selectedSprite?.sprite.width.toString()}),
            props: {
                prependIcon: 'mdi-arrow-expand-horizontal',
            },
        },
        {
            title: t('spriteInfo.height', {value: spriteStore.selectedSprite?.sprite.height.toString()}),
            props: {
                prependIcon: 'mdi-arrow-expand-vertical',
            },
        },
        {
            title: t('spriteInfo.posX', {value: spriteStore.selectedSprite?.sprite.x.toString()}),
            props: {
                prependIcon: 'mdi-arrow-left-right',
            },
        },
        {
            title: t('spriteInfo.posY', {value: spriteStore.selectedSprite?.sprite.y.toString()}),
            props: {
                prependIcon: 'mdi-arrow-up-down',
            },
        },
    ]);

    // Tags -> array to strings for input
    watch(selectedSprite, (spriteData) => {
        tags.value = spriteData?.sprite.tags.join(",");
    });

    // Tags -> string to array for storage
    watch(tags, (newValue:string | undefined) => {
        const tagsAsArray = newValue ? newValue.split(",") : [];
        if (!selectedSprite.value) return;
        selectedSprite.value.sprite.tags = tagsAsArray.map(t => t.trim());
    });

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
        padding: 20px 0 0;
    }

    .sprite-config {
        padding: 0 20px 20px;
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