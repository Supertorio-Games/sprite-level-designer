<template>
    <v-list>
        <v-list-item
            v-for="(layer, i) in mapStore.layerList"
            :key="i"
            :value="layer._id"
            color="primary">
            <template v-slot:prepend>
                <v-icon :icon="layer.icon"></v-icon>
            </template>
            <template v-slot:append>
                <v-checkbox-btn
                    v-model="layer.enabled"
                    class="pe-2"
                    true-icon="mdi-eye-outline"
                    false-icon="mdi-eye-off-outline"
                    ></v-checkbox-btn>
            </template>
            <v-list-item-title v-text="layer.title"></v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/state/mapStore';
    const mapStore = useMapStore();
</script>
