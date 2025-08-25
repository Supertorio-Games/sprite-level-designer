<template>
    <div>
        <v-btn-toggle
            v-model="mapStore.editMode"
            divided
            mandatory
            rounded
            density="comfortable"
            variant="tonal" >
            <v-btn icon="mdi-cursor-default"></v-btn>
            <v-btn icon="mdi-brush"></v-btn>
            <v-btn icon="mdi-format-color-fill"></v-btn>
            <v-btn icon="mdi-eraser"></v-btn>
        </v-btn-toggle>
    </div>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/state/mapStore';
    const mapStore = useMapStore();
</script>