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
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({ useScope: "global" });
    const code = ref(t("misc.phaserComingSoon"));
</script>
