<template>
    <div class="map-grid-physics-cell" :class="cellClasses"></div>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/state/mapStore';
    import { useSpritesStore } from '@/state/spritesStore';
    import { computed } from 'vue';

    const props = defineProps(['row', 'col']);
    const mapStore = useMapStore();
    const spriteStore = useSpritesStore();

    const cellClasses = computed(() => {
        const cell = mapStore.getCell(props.row, props.col);
        if (!cell.sprite) return {};

        const sprite = spriteStore.findSprite(cell.sprite);
        return {
            physical: sprite?.hasPhysics,
            collideable: sprite?.hasCollision
        };
    });
</script>


<style lang="css" scoped>
    .map-grid-physics-cell {
        display: inline-block;
        position: relative;
        margin: 0;
        padding: 0;
        width: var(--cell-size);
        height: var(--cell-size);
    }

    .map-grid-physics-cell.physical {
        background-color: rgba(255, 0, 0, 0.34);
    }

    .map-grid-physics-cell::before {
        content: "";
        display: block;
        border-style: solid;
        border-width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .map-grid-physics-cell.collideable::before {
        border-width: 2px;
        border-color: #fff;
    }
</style>
