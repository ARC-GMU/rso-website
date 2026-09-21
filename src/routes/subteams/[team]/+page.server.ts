import { error } from "@sveltejs/kit";
import { loadSubTeams } from "$lib/subTeams";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const subTeams = await loadSubTeams(fetch);
	const team = subTeams.find(
		(entry) => entry.slug === params.team || entry.id === params.team
	);

	if (!team) {
		error(404, "Sub team not found");
	}

	return { team };
};
