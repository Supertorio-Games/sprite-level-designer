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
    import { computed, ref, watch } from 'vue';
    import VCodeBlock from '@wdns/vue-code-block';
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { CODE_PREFIX_COMMENT, formatLevelConfig, formatLevelMap, formatSpriteAtlasConfig, formatAddLevelConfig,
        parseMapGridForExport, parseSpriteSheetsForExport, type kaplayExportOptions} from '@/util/kaplayJsExporters';
    import { useAppStore } from '@/state/appStore';

    const mapStore = useMapStore();
    const spritesStore = useSpritesStore();
    const configStore = useAppStore();
    const code = ref<string>("");

    const kaplayOptions = computed<kaplayExportOptions >(() => {
        return {
            outputSpritePath: configStore.outputSpritePath,
            kaplayOptPrefix: configStore.kaplayOptPrefix
        };
    })


    const processMapData = () => {
        let mapExportData = parseMapGridForExport(mapStore.mapGrid, mapStore.mapWidth, mapStore.mapHeight);
        let spriteExportData = parseSpriteSheetsForExport(spritesStore.spriteSheets, mapExportData.spriteMapKeys);

        let atlasConfigString = formatSpriteAtlasConfig(spriteExportData, kaplayOptions.value);
        let asciMapString = formatLevelMap(mapExportData.asciMap);
        let levelConfigString = formatLevelConfig(mapExportData.spriteMapKeys, spritesStore.spriteSheets, kaplayOptions.value);
        let addLevelString = formatAddLevelConfig(kaplayOptions.value);
        code.value = CODE_PREFIX_COMMENT + atlasConfigString + asciMapString + levelConfigString + addLevelString;
    }

    // Because of the hacky way we are hydrating the map from local storage
    // there might be the need to watch for the mapGrid to be updated on a fresh page load
    watch([mapStore.mapGrid, spritesStore.spriteSheets, kaplayOptions], () => {
        processMapData();
    });

    processMapData();
</script>
