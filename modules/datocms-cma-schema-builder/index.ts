import { defineNuxtModule, resolvePath } from '@nuxt/kit';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { Nuxt } from 'nuxt/schema';
import { execSync } from 'node:child_process';

type CodegenModuleOptions = Types.Config;

export default defineNuxtModule<CodegenModuleOptions>({
	meta: {
		name: 'DatoCMS Schema Builder',
		configKey: 'datocmsCmaSchemaBuilder',
	},
	async setup(options: CodegenModuleOptions, nuxt: Nuxt) {
		const appDir = nuxt.options.dir.app;

		function generateCode() {
			execSync(`pnpx @datocms/cli schema:generate ${appDir}/types/datocms-cma-schema.ts`);
		}

		//nuxt.hook('build:before', generateCode);
		nuxt.hook('builder:watch', (e, stuff) => {
			console.log(e, stuff);
			//generateCode();
		});
	},
});
