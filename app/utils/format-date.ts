export default function formatDate(date: string) {
	const dateObj = new Date(date);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return dateObj.toLocaleDateString('en-US', options);
}
