import { loadResourceCategories } from "$lib/resources";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
	const categories = await loadResourceCategories(fetch);

	return {
		categories: categories.map(({ slug, name, kind, count }) => ({ slug, name, kind, count }))
	};
};
