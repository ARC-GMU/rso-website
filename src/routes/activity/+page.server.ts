import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

function postDate(post: { publishedAt?: string; createdAt?: string }) {
	return new Date(post.publishedAt || post.createdAt || 0).getTime();
}

async function loadJson(fetcher: typeof fetch, path: string) {
	try {
		const res = await fetcher(`${apiRoot}${path}`, { cache: "no-store" });
		if (!res.ok) return [];

		const data = await res.json();
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error(`Error fetching ${path}:`, error);
		return [];
	}
}

export const load: PageServerLoad = async ({ fetch }) => {
	const [posts, updates] = await Promise.all([
		loadJson(fetch, "/public/blog"),
		loadJson(fetch, "/public/club/project-updates?limit=24")
	]);

	posts.sort((a: any, b: any) => postDate(b) - postDate(a));

	return { posts, updates };
};
