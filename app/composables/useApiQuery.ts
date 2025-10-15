import { executeQuery, type ExecuteQueryOptions } from '@datocms/cda-client';
import type { DocumentNode } from 'graphql';
import { useAsyncData } from '#imports';

export type ApiQueryOptions = ExecuteQueryOptions & { all?: boolean };

export const useApiQuery = async <T, V = void>(
	key: string,
	query: DocumentNode,
	variables?: ExecuteQueryOptions<V>['variables'],
	options?: ExecuteQueryOptions<V>
): Promise<ReturnType<typeof useAsyncData>> => {
	const config = useRuntimeConfig();
	return useAsyncData(key, () =>
		executeQuery<T>(query, { ...options, variables, token: config.public.apiToken as string })
	);
};
