import { defineEventHandler } from '#imports';
import { buildClient } from '@datocms/cma-client';
//import type { User } from '../types/datocms-cma-schema';

export default defineEventHandler(async (event) => {
	const client = buildClient({
		apiToken: process.env.DATOCMS_API_TOKEN as string,
		environment: process.env.DATOCMS_ENVIRONMENT,
	});

	const { password, email } = await readBody(event);

	if (!password) throw new Error('Password is required');

	const user = (
		await client.items.list({
			version: 'current',
			filter: {
				type: 'user',
				fields: {
					email: { eq: email },
				},
			},
		})
	)?.[0];

	console.log(user);
	if (!user) throw new Error('User not found');

	if (await verifyPassword(user.password as string, password)) {
		await setUserSession(event, {
			// User data
			user: {
				login: user.email,
			},
			secure: {
				test: '1234567890',
			},
			loggedInAt: new Date(),
		});
		return { status: 200 };
	} else throw new Error('Invalid password');
});
