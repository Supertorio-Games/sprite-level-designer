<template>
    <v-sheet class="pa-5" elevation="0">
        <VCodeBlock
            :code="code"
            highlightjs
            lang="javascript"
            theme="neon-bunny"
        />
    </v-sheet>
</template>


<script lang="ts" setup>
    import { ref } from 'vue';
    import VCodeBlock from '@wdns/vue-code-block';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { ADD_LEVEL_CODE, formatLevelConfig, formatLevelMap, formatSpriteAtlasConfig, parseMapGridForExport, parseSpriteSheetsForExport } from '@/util/kaplayJsExporters';

    const mapStore = useMapStore();
    const spritesStore = useSpritesStore();

    // Get Map Data From Stores
    const mapExportData = parseMapGridForExport(mapStore.mapGrid, mapStore.mapWidth, mapStore.mapHeight);
    const spriteExportData = parseSpriteSheetsForExport(spritesStore.spriteSheets, mapExportData.spriteMapKeys);

    // Format Ouptut Code Strings
    const atlasConfigString = formatSpriteAtlasConfig(spriteExportData);
    const levelMapString = formatLevelMap(mapExportData.asciMap);
    const levelConfigString = formatLevelConfig(mapExportData.spriteMapKeys, spritesStore.spriteSheets);

    const code = ref(atlasConfigString + levelMapString + levelConfigString + ADD_LEVEL_CODE);

</script>