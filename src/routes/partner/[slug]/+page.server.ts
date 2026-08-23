import { error } from "@sveltejs/kit";
import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${apiRoot}/public/club/about`, { cache: "no-store" });
	if (!res.ok) {
		error(404, "Partner not found");
	}

	const data = await res.json();
	const partner = (data.partners ?? []).find((p: any) => p.slug === params.slug);

	if (!partner) {
		error(404, "Partner not found");
	}

	return { partner };
};
