<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';

type Props = InstanceType<typeof VueMarkdown>['$props'];

const props = defineProps<Props>();
</script>
<template :if="props.source !== undefined">
	<VueMarkdown :source="props.source as string" />
</template>
