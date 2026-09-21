import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	redirect(308, `/activity/blog/${params.slug}`);
};
