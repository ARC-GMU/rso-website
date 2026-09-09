import { error } from "@sveltejs/kit";
import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(
		`${apiRoot}/public/members/profile?clubId=${encodeURIComponent(params.clubId)}`,
		{ cache: "no-store" }
	);
	if (!res.ok) {
		error(404, "Member not found");
	}

	const profile = await res.json();

	return { profile };
};
