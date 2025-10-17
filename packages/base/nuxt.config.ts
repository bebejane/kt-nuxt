import { defineNuxtConfig } from 'nuxt/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url))
	.split('/')
	.slice(0, -3)
	.join('/');

export default defineNuxtConfig({
	$meta: {
		name: 'kt-nuxt-datocms-base',
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
