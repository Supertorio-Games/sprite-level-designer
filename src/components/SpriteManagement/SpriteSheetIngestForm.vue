<template>
    <v-dialog max-width="500" v-model="dialogOpen">
            <v-card :title="$t('spriteIngestForm.title')">
            <v-card-text>
                <v-file-input 
                    :label="$t('spriteIngestForm.sheetFileLabel')" 
                    :multiple="false"
                    accept=".jpg, .png"
                    @update:model-value="onSpriteFileChanged"></v-file-input>
                <v-file-input 
                    :label="$t('spriteIngestForm.configFileLabel')" 
                    :multiple="false"
                    accept=".xml"
                    @update:model-value="onConfigFileChanged"></v-file-input>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    variant="tonal" 
                    @click="processSpriteSheet">
                    {{ $t('spriteIngestForm.loadSubmitButton') }}
                </v-btn>
                <v-btn
                    :text="$t('misc.btnClose')"
                    @click="$emit('onClose')"
                ></v-btn>
            </v-card-actions>
            </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useSpritesStore } from '@/state/spritesStore';
    import SpriteSheetIngest from '@/util/spriteSheetIngest';

    const dialogOpen = ref<boolean>(false);
    const props = defineProps(['showDialog']);
    const emit = defineEmits(['onClose']);
    const spritesIngest = new SpriteSheetIngest();

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
        await spritesIngest.processSpriteSheet(spritesInput.value!, configInput.value!).then(
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
