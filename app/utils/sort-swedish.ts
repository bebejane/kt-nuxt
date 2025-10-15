export const sortSwedish = <T>(arr: T[], key: string): T[] => {
	const sorter = new Intl.Collator('sv', { usage: 'sort' });
	return arr.sort((a: any, b: any) => sorter.compare(a[key], b[key]));
};
