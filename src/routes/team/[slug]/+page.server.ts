import { error } from "@sveltejs/kit";
import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${apiRoot}/roster?slug=${params.slug}`, {
		cache: "no-store"
	});
	if (!res.ok) {
		error(404, "Team member not found");
	}

	const member = await res.json();

	return { member };
};
