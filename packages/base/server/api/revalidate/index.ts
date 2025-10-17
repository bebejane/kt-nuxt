export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { entity, related_entities } = body;
	const api_key = related_entities?.find(({ id }: { id: string }) => id === entity.relationships?.item_type?.data?.id)
		?.attributes?.api_key;

	const slug = entity.attributes?.slug;

	const paths: string[] = [`/projects/${slug}`, '/'];
	console.log(api_key, paths);
	for (const path of paths) await invalidate(path);

	return { revalidated: true, paths };
});

async function invalidate(path: string) {
	const res = await fetch(`${process.env.SITE_URL}${path}`, {
		method: 'POST',
		headers: {
			'x-prerender-revalidate': process.env.REVALIDATE_KEY as string,
		},
		body: '{}',
	});

	if (res.status !== 200) {
		throw new Error(`Failed to invalidate ${path}`);
	}
}
