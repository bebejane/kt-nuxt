import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { colors } from 'consola/utils';
import { generate } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import defu from 'defu';
import type { Nuxt } from 'nuxt/schema';
import fs from 'node:fs';

type CodegenModuleOptions = Types.Config;

export default defineNuxtModule<CodegenModuleOptions>({
	meta: {
		name: 'Graphql Codegen',
		configKey: 'graphqlCodegen',
	},
	async setup(options: CodegenModuleOptions, nuxt: Nuxt) {
		if (process.env.NODE_ENV !== 'development') return;

		const c = options.config as GraphqlCodegenOptions;
		const appDir = nuxt.options.dir.app;
		const rootDir = appDir.split('/').slice(0, -1).join('/');
		const sharedDir = `${rootDir}/shared`;
		const configFile = `${rootDir}/graphql.config.json`;
		const logger = useLogger('gql', { formatOptions: { colors: true } });
		const defaultConfig: { [key: string]: string } = {
			dir: `${appDir}/graphql`,
			types: `${sharedDir}/types`,
			queries: `${appDir}/composables`,
		};

		// Create config dir if not exists
		for (const key in defaultConfig) if (!fs.existsSync(defaultConfig[key])) fs.mkdirSync(defaultConfig[key]);

		const config = defu({ ...options, errorsOnly: true, silent: true }, getConfig(c ?? defaultConfig));
		fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
		logger.log(`${colors.blue('✔')} Graphql: Wrote config ${configFile}`);

		async function generateCode(event?: String, file?: string) {
			if (file?.endsWith('.graphql') || file?.endsWith('.gql') || !event) {
				generate(config, true)
					.then(() => {
						logger.log(`${colors.blue('✔')} Graphql: Regenerated - ${file ?? 'all'}`);
					})
					.catch((e) => {
						logger.error(`${colors.red('x')} Graphql: Error`);
						logger.error(`${colors.red(e.message)}`);
					});
			}
		}

		nuxt.hook('build:before', generateCode);
		nuxt.hook('builder:watch', generateCode);
	},
	moduleDependencies: {
		'@graphql-codegen/cli': {
			version: '>=5',
			optional: true,
		},
		'@graphql-codegen/typed-document-node': {
			version: '>=5',
			optional: true,
		},
		'@graphql-codegen/typescript': {
			version: '>=4',
			optional: true,
		},
		'@graphql-codegen/typescript-graphql-files-modules': {
			version: '>=3',
			optional: true,
		},
		'@graphql-codegen/typescript-operations': {
			version: '>=4.5',
			optional: true,
		},
		'@graphql-codegen/typescript-vue-urql': {
			version: '>=3',
			optional: true,
		},
		'defu': {
			version: '>=6',
			optional: true,
		},
	},
});

const defaultModuleConfig = {
	dedupeOperationSuffix: true,
	dedupeFragments: true,
	pureMagicComment: false,
	exportFragmentSpreadSubTypes: true,
	namingConvention: 'keep',
	skipDocumentsValidation: false,
	useTypeImports: true,
};

export type GraphqlCodegenOptions = {
	dir: string;
	types: string;
	queries: string;
};

const getConfig = (options: GraphqlCodegenOptions): Types.Config => {
	const documents = `${options.dir}/**/*.gql`;
	const typesPath = `${options.types}/datocms-cda-schema.d.ts`;
	const modulesPath = `${options.types}/datocms-document-modules.d.ts`;
	const urqlPath = `${options.queries}/urql-queries.ts`;
	const datoCmsPath = `${options.queries}/datocms-queries.ts`;
	const queriesPath = `${options.queries}/datocms-graphql-queries.ts`;

	return {
		schema: {
			'https://graphql.datocms.com': {
				headers: {
					'Authorization': process.env.DATOCMS_API_TOKEN as string,
					'X-Exclude-Invalid': 'true',
				},
			},
		},
		documents,
		generates: {
			[typesPath]: {
				plugins: ['typescript', 'typescript-operations'],
				config: { ...defaultModuleConfig, noExport: true },
			},
			[queriesPath]: {
				plugins: ['typed-document-node'],
				config: { ...defaultModuleConfig },
			},
			[datoCmsPath]: {
				plugins: ['/Users/bebejane/Projects/typescript-vue-datocms/dist/index.cjs'],
				config: {
					...defaultModuleConfig,
				},
			},
			/*
			[modulesPath]: {
				plugins: ['typescript-graphql-files-modules'],
				config: { ...defaultModuleConfig },
			},
			*/
		},
	};
};
