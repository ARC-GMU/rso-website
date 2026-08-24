import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const res = await fetch(
			`https://manage.autonomousrobotics.club/api/public/club/about-pages?slug=${params.slug}`
		);
		if (!res.ok) {
			if (res.status === 404) {
				error(404, 'Page not found');
			}
			throw new Error('Failed to fetch about page');
		}

		const data = await res.json();
		const page = Array.isArray(data) ? data[0] : data;

		if (!page) {
			error(404, 'Page not found');
		}

		return { page };
	} catch (err) {
		console.error('Error fetching about page:', err);
		error(500, 'Internal Server Error');
	}
};
