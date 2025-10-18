import { executeQuery, type ExecuteQueryOptions } from '@datocms/cda-client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { FieldNode, OperationDefinitionNode, VariableDefinitionNode } from 'graphql';
import { useAsyncData } from '#imports';

export const useApiQuery = async <TResult, TVariables = void>(
	query: TypedDocumentNode<TResult, TVariables>,
	options?: Omit<ExecuteQueryOptions<TVariables>, 'token'> & { all?: boolean },
	key?: string
): Promise<Omit<ReturnType<typeof useAsyncData<TResult>>, 'data'> & TResult> => {
	const config = useRuntimeConfig();
	const opt: ApiQueryOptions<TVariables> = { ...options, token: config.public.apiToken };
	const operation = query.definitions?.find(({ kind }) => kind === 'OperationDefinition') as OperationDefinitionNode;
	console.log(
		`useApiQuery: ${operation.name?.value} (${operation.variableDefinitions?.reduce(
			// @ts-ignore
			(acc, cur) => `${acc}$${cur.variable?.name?.value ?? ''}: ${cur.type?.name?.value ?? ''}`,
			''
		)}) ${JSON.stringify(options?.variables ?? {})}`
	);

	const { data, ...rest } = await useAsyncData(key, () => executeQuery(query, opt));
	return { ...rest, ...data.value } as Omit<ReturnType<typeof useAsyncData<TResult>>, 'data'> & TResult;
};
/*
const executeAllQuery = async <TResult, TVariables = void>(
	query: TypedDocumentNode<TResult, TVariables>,
	options: ExecuteQueryOptions<TVariables>,
	data: { [key: string]: any }
): Promise<TResult> => {
	try {
		if (typeof data !== 'object' || data === null || data === undefined) throw new Error('Data must be an object');

		const operation = query.definitions?.find(({ kind }) => kind === 'OperationDefinition') as OperationDefinitionNode;

		if (!operation) throw new Error('Query must have an operation definition');

		const firstVariable = operation.variableDefinitions?.find(
			(v) => v.variable.name.value === 'first'
		) as VariableDefinitionNode;
		const skipVariable = operation.variableDefinitions?.find(
			(v) => v.variable.name.value === 'skip'
		) as VariableDefinitionNode;

		if (!firstVariable || !skipVariable) throw new Error(`Query must have first and skip variables`);

		const pageKeys = Object.keys(data).filter((k) => k.startsWith('_all') && k.endsWith('Meta'));

		//if (pageKeys.length === 0) throw new Error('Query must have at least one paginated field');

		const pageKeyMap: { [key: string]: string } = pageKeys.reduce<{ [key: string]: string }>((acc, cur) => {
			acc[cur] = `${cur.substring(1, cur.length - 'Meta'.length)}`;
			return acc;
		}, {}) as { [key: string]: string };

		// Check filter diff
		Object.keys(pageKeyMap).forEach((k) => {
			const filter = (
				operation.selectionSet.selections.find((s) => (s as FieldNode).name.value === k) as FieldNode
			)?.arguments?.find((a) => a.name.value === 'filter');
			const metaFilter = (
				operation.selectionSet.selections.find((s) => (s as FieldNode).name.value === pageKeyMap[k]) as FieldNode
			)?.arguments?.find((a) => a.name.value === 'filter');
			if ((!filter && metaFilter) || (filter && !metaFilter) || JSON.stringify(filter) !== JSON.stringify(metaFilter))
				throw new Error(`Query must have same filter argument on ${k} and ${pageKeyMap[k]}`);
		});

		//@ts-ignore
		const first = options.variables?.first ?? (firstVariable?.defaultValue as any)?.value ?? 500;

		if (first > 500) throw new Error('"first" variable must be less than or equal to 500');

		let count = 0;

		while (Object.keys(pageKeyMap).some((k) => pageKeyMap[k] && data[k].count > data[pageKeyMap[k]].length)) {
			const key = Object.keys(pageKeyMap).sort((a, b) => (data[a].count > data[b].count ? -1 : 1))[0];
			if (typeof key !== 'string') break;
			const maxPageKey = pageKeyMap[key] as string;
			const skip = data[maxPageKey].length;

			const pageData: any = await executeQuery<TResult>(query, {
				...options,
				variables: {
					...options.variables,
					first,
					skip,
				},
			});

			console.log(pageData);
			Object.keys(pageKeyMap).forEach(
				(k: string) =>
					typeof pageKeyMap[k] !== 'undefined' &&
					(data[pageKeyMap[k]] = [...data[pageKeyMap[k]], ...pageData[pageKeyMap[k]]])
			);

			if (++count > 1000) {
				throw new Error('Paginated query exceeded 1000 requests');
			}
		}

		return data as TResult;
	} catch (e) {
		throw new Error(`${(e as Error).message}`);
	}
};
*/
