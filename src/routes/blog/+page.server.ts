import type { PageServerLoad } from './$types';

export const prerender = false;

function postDate(post: { publishedAt?: string; createdAt?: string }) {
	return new Date(post.publishedAt || post.createdAt || 0).getTime();
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('https://manage.autonomousrobotics.club/api/public/blog');
		if (!res.ok) {
			throw new Error('Failed to fetch blog posts');
		}
		const posts = await res.json();
		posts.sort((a: any, b: any) => postDate(b) - postDate(a));
		return { posts };
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return { posts: [] };
	}
};
