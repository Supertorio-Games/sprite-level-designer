<template>
    <v-list>
        <v-list-item title="" subtitle="Kaplay Options"></v-list-item>
        <div class="px-4">
            <v-text-field
                v-model="appConfigStore.outputSpritePath" 
                :label="$t('settings.spritePath')"
                placeholder="sprites/">
            </v-text-field>
            <v-text-field
                v-model="appConfigStore.kaplayOptPrefix"
                :label="$t('settings.methodPrefix')"
                :placeholder="$t('settings.kaplayMethodPlaceholder')">
            </v-text-field>
        </div>
    </v-list>
</template>

<script lang="ts" setup>
    import { useAppStore } from '@/state/appStore';
    const appConfigStore = useAppStore();
</script>
