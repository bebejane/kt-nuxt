export default function (date: string, locale = 'en-US', month: Intl.DateTimeFormatOptions['month'] = 'long') {
	const dateObj = new Date(date);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month,
		day: 'numeric',
	};
	return dateObj.toLocaleDateString(locale, options);
}
