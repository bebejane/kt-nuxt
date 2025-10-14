import { defineNuxtModule } from '@nuxt/kit';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { Nuxt } from 'nuxt/schema';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { execSync } from 'node:child_process';

type CodegenModuleOptions = Types.Config;

const rootDir = dirname(fileURLToPath(import.meta.url))
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
			const res = execSync(`pnpx @datocms/cli schema:generate ${rootDir}/app/types/datocms-cma-schema.ts`);
		}

		nuxt.hook('build:before', generateCode);
		//nuxt.hook('builder:watch', generateCode);
	},
});
