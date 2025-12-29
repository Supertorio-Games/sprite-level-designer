<template>
    <v-dialog max-width="500" v-model="dialogOpen">
            <v-card title="Add New Sprite Sheet">
            <v-card-text>
                <v-file-input 
                    label="Sprite Sheet" 
                    :multiple="false"
                    accept=".jpg, .png"
                    @update:model-value="onSpriteFileChanged"></v-file-input>
                <v-file-input 
                    label="Sheet Config XML" 
                    :multiple="false"
                    accept=".xml"
                    @update:model-value="onConfigFileChanged"></v-file-input>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    variant="tonal" 
                    @click="processSpriteSheet">
                    Load Sprite Sheet
                </v-btn>
                <v-btn
                    text="Close Dialog"
                    @click="$emit('onClose')"
                ></v-btn>
            </v-card-actions>
            </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useSpritesStore } from '@/state/spritesStore';
    import SpriteSheetInjestService from '@/services/SpriteSheetInjestService';

    const dialogOpen = ref<boolean>(false);
    const props = defineProps(['showDialog']);
    const emit = defineEmits(['onClose']);
    const injestService = new SpriteSheetInjestService();

    const spriteStore = useSpritesStore();

    watch(() => props.showDialog, (newValue) => {
        dialogOpen.value = newValue;
    });

    const spritesInput = ref<File>();
    const configInput = ref<File>();

    function onSpriteFileChanged(inputFile:File|File[]) {
        if (Array.isArray(inputFile)) {
            spritesInput.value = inputFile[0];
        } else {
            spritesInput.value = inputFile;
        }
    }

    function onConfigFileChanged(inputFile:File|File[]) {
        if (Array.isArray(inputFile)) {
            configInput.value = inputFile[0];
        } else {
            configInput.value = inputFile;
        }
    }

    async function processSpriteSheet() {
        await injestService.processSpriteSheet(spritesInput.value!, configInput.value!).then(
            ({ spriteImageData, width, height, spriteImageConfig }) => {
                spriteStore.addSpriteSheet(spriteImageData, width, height, spriteImageConfig);
                emit("onClose");
            }
        ).catch(
            (error) => {
                console.error("Error processing sprite sheet:", error);
                emit("onClose");
            }
        );
    }

</script>
