import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { colors } from 'consola/utils';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { Nuxt } from 'nuxt/schema';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

type CodegenModuleOptions = Types.Config;

export default defineNuxtModule<CodegenModuleOptions>({
	meta: {
		name: 'DatoCMS Schema Builder',
		configKey: 'datocmsCmaSchemaBuilder',
	},
	async setup(options: CodegenModuleOptions, nuxt: Nuxt) {
		if (process.env.NODE_ENV !== 'development') return;
		const appDir = nuxt.options.dir.app;
		const rootDir = appDir.split('/').slice(0, -1).join('/');
		const typesDir = `${rootDir}/shared/types`;
		const logger = useLogger('datocms-cma-schema-builder', { formatOptions: { colors: true } });

		function generateCode() {
			try {
				if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir);

				execSync(`pnpx @datocms/cli schema:generate ${typesDir}/datocms-cma-schema.d.ts`);
				logger.log(`${colors.blue('✔')} DatoCMS CMA Schema generated`);
			} catch (e) {
				logger.error(`${colors.red('x')} DatoCMS CMA Schema error`);
				logger.error(e);
			}
		}
		nuxt.hook('build:before', generateCode);
	},
});
