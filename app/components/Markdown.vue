<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';
import { type Options as MarkdownItOptions, type PluginSimple } from 'markdown-it';

type Props = {
	source?: string;
	options?: MarkdownItOptions;
	plugins?: PluginSimple[];
};

const props = defineProps<Props>();
</script>

<template :if="props.source !== undefined">
	<VueMarkdown :source="props.source as string" />
</template>
