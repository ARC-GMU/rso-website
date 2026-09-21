import { error } from "@sveltejs/kit";
import { loadResourceCategories } from "$lib/resources";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const categories = await loadResourceCategories(fetch);
	const category = categories.find((entry) => entry.slug === params.slug);

	if (!category) {
		error(404, "Resource category not found");
	}

	return { category };
};
