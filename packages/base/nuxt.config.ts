import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	$meta: {
		name: 'kt-nuxt-base',
	},
	typescript: {
		includeWorkspace: true,
	},
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "~/assets/styles/_mediaqueries.scss" as *;`,
				},
			},
		},
	},
	$production: {
		routeRules: {
			'/**': { isr: true },
		},
	},
	experimental: {
		typedPages: true,
	},
	runtimeConfig: {
		private: {
			apiToken: process.env.DATOCMS_API_TOKEN,
		},
		public: {
			apiToken: process.env.PUBLIC_DATOCMS_API_TOKEN,
		},
	},
	nitro: {
		vercel: {
			config: {
				bypassToken: process.env.REVALIDATE_KEY,
			},
		},
	},
});
