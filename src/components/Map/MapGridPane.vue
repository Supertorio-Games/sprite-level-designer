<template>
    <v-container fluid class="h-100 overflow-x-auto overflow-y-auto">
        <div>
        <map-grid></map-grid>
        </div>
    </v-container>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useMapStore } from '@/state/mapStore';
</script>


<style lang="css" scoped>

</style>