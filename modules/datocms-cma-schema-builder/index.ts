import { defineNuxtModule } from '@nuxt/kit';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { Nuxt } from 'nuxt/schema';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { run } from '@datocms/cli';

type CodegenModuleOptions = Types.Config;

const appDir = dirname(fileURLToPath(import.meta.url))
	.split('/')
	.slice(0, -5)
	.join('/');

export default defineNuxtModule<CodegenModuleOptions>({
	meta: {
		name: 'datocms-cma-schema-builder',
		configKey: 'datocmsCmaSchemaBuilder',
	},
	async setup(options: CodegenModuleOptions, nuxt: Nuxt) {
		async function generateCode() {
			const res = await run(['datocms', 'schema:generate', `${appDir}/types/datocms-cma-schema.ts`]);
			console.log(res);
		}

		nuxt.hook('build:before', generateCode);
		nuxt.hook('builder:watch', generateCode);
	},
	moduleDependencies: {
		'@datocms/cli': {
			version: '>=3.1.4',
			optional: true,
		},
	},
});
