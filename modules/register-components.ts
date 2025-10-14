import { addComponent, defineNuxtModule } from '@nuxt/kit';

const components = [
	{
		name: 'Image',
		export: 'Image',
		filePath: 'vue-datocms',
	},
	{
		name: 'StructuredText',
		export: 'StructuredText',
		filePath: 'vue-datocms',
	},
];

export default defineNuxtModule({
	moduleDependencies: {
		'vue-datocms': {
			// You can specify a version constraint for the module
			version: '>=8',
			// By default moduleDependencies will be added to the list of modules
			// to be installed by Nuxt unless `optional` is set.
			optional: true,
			// Any configuration that should override `nuxt.options`.
			overrides: {},
			// Any configuration that should be set. It will override module defaults but
			// will not override any configuration set in `nuxt.options`.
			defaults: {},
		},
	},
	setup() {
		components.forEach((c) => addComponent(c));
	},
});
