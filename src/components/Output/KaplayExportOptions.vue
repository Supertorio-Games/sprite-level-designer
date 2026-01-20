<template>
    <v-list>
        <v-list-item title="" subtitle="Kaplay Options"></v-list-item>
        <div class="px-4">
            <v-text-field
                v-model="appConfigStore.outputSpritePath" 
                label="Sprite Path"
                placeholder="sprites/">
            </v-text-field>
            <v-text-field
                v-model="appConfigStore.kaplayOptPrefix" 
                label="Method Prefix"
                placeholder="kaplay">
            </v-text-field>
        </div>
    </v-list>
</template>

<script lang="ts" setup>
    import { useAppStore } from '@/state/appStore';


    const appConfigStore = useAppStore();

</script>
