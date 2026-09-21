import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const res = await fetch(
			`https://manage.autonomousrobotics.club/api/public/blog?slug=${params.slug}`
		);
		if (!res.ok) {
			if (res.status === 404) {
				error(404, 'Blog post not found');
			}
			throw new Error('Failed to fetch blog post');
		}

		const data = await res.json();
		const post = Array.isArray(data) ? data[0] : data;

		if (!post) {
			error(404, 'Blog post not found');
		}

		return { post };
	} catch (err) {
		console.error('Error fetching blog post:', err);
		error(500, 'Internal Server Error');
	}
};
