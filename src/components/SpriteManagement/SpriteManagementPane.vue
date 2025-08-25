<template>
    <sprite-sheet-ingest-form :showDialog="showIngestFormDialog" @on-close="showIngestFormDialog = false"  />
    <div class="d-flex flex-column h-100">
        <v-toolbar border density="compact" class="flex-0-0">
            <template v-slot:prepend>
                <map-mode-selector></map-mode-selector>
            </template>
            <template v-slot:append>
                <v-btn 
                prepend-icon="mdi-plus-circle"
                @click="showIngestFormDialog = true"
                >Add Spritesheet</v-btn>
            </template>
        </v-toolbar>
        
        <div class="d-flex flex-row flex-1-1-100 sheets-wrapper">
            
            <sprite-details-pane></sprite-details-pane>

            <div class="sprite-sheets-list d-flex flex-column flex-1-1-100 pa-5">

                <div class="h-100 2-100 d-flex flex-row justify-center align-center pa-5" v-if="!spritesStore.hasSheets">
                    <div class="empty-action-prompt border pa-5 text-center">
                        <h2 class="text-h4 mb-4">Add a Sprite Sheet</h2>
                        <v-btn 
                            prepend-icon="mdi-plus-circle"
                            @click="showIngestFormDialog = true"
                            >Add Spritesheet</v-btn>
                    </div>
                </div>

                <sprite-sheet-display 
                    v-if="spritesStore.hasSheets"  
                    v-for="(sheet, index) in spritesStore.spriteSheets" 
                    :sheet="sheet" 
                    :index="index"
                    />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useSpritesStore } from '@/state/spritesStore';    
    const showIngestFormDialog = ref(false)
    const spritesStore = useSpritesStore();
</script>


<style lang="css" scoped>
    .sprite-sheets-list {
        position: absolute;
        right: 0;
        left: 256px;
        top: 0;
        bottom: 0;
        overflow-y: auto;
    }

    .sheets-wrapper {
        position: relative;
        height: calc(100% - 50px);
    }

    .empty-action-prompt {
        flex: 0 1 40%;
    }
    
</style>