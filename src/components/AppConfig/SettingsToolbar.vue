<template>
        <v-expansion-panels :multiple="true">
            <v-expansion-panel>
                <v-expansion-panel-title>{{ $t('settings.layers') }}</v-expansion-panel-title>
                <v-expansion-panel-text class="layer-list">
                    <layer-list />
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-title>{{ $t('settings.mapConfig') }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <app-settings />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
</template>

<style lang="css" scoped>
    .v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline: 0;
    }

    .layer-list  ::v-deep(.v-expansion-panel-text__wrapper) {
        padding: 4px 8px 8px;
    }    
</style>
