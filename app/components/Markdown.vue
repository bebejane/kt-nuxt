<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';

type Props = Partial<Omit<InstanceType<typeof VueMarkdown>, `$${string}`>>;
const props = defineProps<Props>();
</script>

<template :if="props.source !== undefined">
	<VueMarkdown :source="props.source as string" />
</template>
