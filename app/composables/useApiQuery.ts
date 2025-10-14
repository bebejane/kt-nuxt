import { executeQuery, type ExecuteQueryOptions } from '@datocms/cda-client';
import type { DocumentNode } from 'graphql';

export type ApiQueryOptions = ExecuteQueryOptions & { all?: boolean };

export const useApiQuery = async <T, V = void>(
	query: DocumentNode,
	variables?: ExecuteQueryOptions<V>['variables'],
	options?: ExecuteQueryOptions<V>
): Promise<T> => {
	const config = useRuntimeConfig();

	return executeQuery(query, { ...options, variables, token: config.public.apiToken as string });
};
