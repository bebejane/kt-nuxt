import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	$meta: {
		name: 'kt-nuxt-datocms-i18n',
	},
	typescript: {
		includeWorkspace: true,
	},
	modules: ['@nuxtjs/i18n'],
});
