import { error, redirect } from "@sveltejs/kit";
import { apiRoot } from "$lib/theme/content";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${apiRoot}/public/club/projects?slug=${params.slug}`, {
		cache: "no-store"
	});
	if (!res.ok) {
		error(404, "Project not found");
	}

	const project = await res.json();

	if (project.external && project.externalUrl) {
		redirect(302, project.externalUrl);
	}

	return { project };
};
