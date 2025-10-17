import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	$meta: {
		name: 'kt-nuxt-dev',
	},
	typescript: {
		includeWorkspace: true,
	},
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	runtimeConfig: {
		private: {
			apiToken: process.env.DATOCMS_API_TOKEN,
		},
		public: {
			apiToken: process.env.PUBLIC_DATOCMS_API_TOKEN,
		},
	},
});
