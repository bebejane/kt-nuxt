export default function formatDate(date: string, locale = 'en-US') {
	const dateObj = new Date(date);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return dateObj.toLocaleDateString(locale, options);
}
