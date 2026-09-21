import { loadSubTeams } from "$lib/subTeams";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
	return { subTeams: await loadSubTeams(fetch) };
};
