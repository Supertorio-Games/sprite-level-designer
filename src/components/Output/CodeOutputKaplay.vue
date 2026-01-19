<template>
    <div class="pa-5 h-100 overflow-auto">
        <VCodeBlock
            :code="code"
            highlightjs
            lang="javascript"
            theme="neon-bunny"
        />
    </div>
</template>


<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import VCodeBlock from '@wdns/vue-code-block';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { CODE_PREFIX_COMMENT, ADD_LEVEL_CODE, formatLevelConfig, formatLevelMap, formatSpriteAtlasConfig, 
        parseMapGridForExport, parseSpriteSheetsForExport } from '@/util/kaplayJsExporters';

    const mapStore = useMapStore();
    const spritesStore = useSpritesStore();
    const code = ref<string>("");


    const processMapData = () => {
        let mapExportData = parseMapGridForExport(mapStore.mapGrid, mapStore.mapWidth, mapStore.mapHeight);
        let spriteExportData = parseSpriteSheetsForExport(spritesStore.spriteSheets, mapExportData.spriteMapKeys);

        let atlasConfigString = formatSpriteAtlasConfig(spriteExportData);
        let asciMapString = formatLevelMap(mapExportData.asciMap);
        let levelConfigString = formatLevelConfig(mapExportData.spriteMapKeys, spritesStore.spriteSheets);
        code.value = CODE_PREFIX_COMMENT + atlasConfigString + asciMapString + levelConfigString + ADD_LEVEL_CODE;
    }

    // Because of the hacky way we are hydrating the map from local storage
    // there might be the need to watch for the mapGrid to be updated on a fresh page load
    watch([mapStore.mapGrid, spritesStore.spriteSheets], () => {
        processMapData();
    });

    processMapData();
</script>
