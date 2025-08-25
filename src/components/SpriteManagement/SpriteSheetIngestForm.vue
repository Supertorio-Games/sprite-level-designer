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
    import xmlToJson from '@/util/transformers/xmlToJson';
    import { useSpritesStore, type sheetConfig } from '@/state/spritesStore';

    const dialogOpen = ref<boolean>(false);
    const props = defineProps(['showDialog']);
    const emit = defineEmits(['onClose']);

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
        const spriteImageData = await readSpriteImage();
        const spriteImageConfig = await readSpriteConfig();
        if (spriteImageData && spriteImageConfig) {
            console.log(spriteStore);
            spriteStore.addSpriteSheet(spriteImageData, spriteImageConfig);
            emit("onClose");
        }
    }

    const readSpriteImage = () => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(reader.result as string);
        reader.onerror = reject;
        if (spritesInput.value) {
            reader.readAsDataURL(spritesInput.value);
        } else {
            reject();
        }
    });

    const readSpriteConfig = () => new Promise<sheetConfig>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            resolve(xmlToJson(text) as sheetConfig);
        }
        reader.onerror = reject;
        if (configInput.value) {
            reader.readAsText(configInput.value);
        } else {
            reject();
        }
    });

</script>