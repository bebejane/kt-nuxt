<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';

const props = defineProps({
	source: String,
});
</script>
<template :if="props.source !== undefined">
	<VueMarkdown :source="props.source as string" />
</template>
