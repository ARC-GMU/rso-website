import { error } from "@sveltejs/kit";
import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${apiRoot}/public/club/events?id=${params.id}`, {
		cache: "no-store"
	});
	if (!res.ok) {
		error(404, "Event not found");
	}

	const event = await res.json();

	return { event };
};
