import { sleep } from './sleep';

export const awaitElement = async <T>(selector: string, ms: number = 1000): Promise<T | null> => {
	const cleanSelector = function (selector: string) {
		(selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(function (n) {
			selector = selector.replace(n, '[id="' + n.replace('#', '') + '"]');
		});
		return selector;
	};
	const retry = 30;
	for (let t = 0; t < ms; t += retry) {
		const el = document.querySelector(cleanSelector(selector)) as T;
		if (el) return el;
		await sleep(retry);
	}

	return null;
};
