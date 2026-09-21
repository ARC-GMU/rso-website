import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${apiRoot}/public/club/subteams`, { cache: "no-store" });
		if (!res.ok) {
			return { subTeams: [] };
		}
		return { subTeams: (await res.json()) ?? [] };
	} catch (error) {
		console.error("Error fetching sub teams:", error);
		return { subTeams: [] };
	}
};
