import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { colors } from 'consola/utils';
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
		const logger = useLogger('datocms-cma-schema-builder', { formatOptions: { colors: true } });

		function generateCode() {
			try {
				execSync(`pnpx @datocms/cli schema:generate ${appDir}/types/datocms-cma-schema.ts`);
				logger.log(`${colors.blue('✔')} DatoCMS CMA Schema generated`);
			} catch (e) {
				logger.error(`${colors.red('x')} DatoCMS CMA Schema error`);
				logger.error(e);
			}
		}

		nuxt.hook('build:before', generateCode);
	},
});
