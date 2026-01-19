<template>
    <div class="pa-5 h-100 overflow">
        <VCodeBlock
            :code="code"
            highlightjs
            lang="javascript"
            theme="neon-bunny"
        />
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import VCodeBlock from '@wdns/vue-code-block';

    const code = ref("// Phaser Code Coming Soon");
</script>
