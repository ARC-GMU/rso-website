import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch('https://manage.autonomousrobotics.club/api/public/blog');
        if (!res.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const posts = await res.json();
        return { posts };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { posts: [] };
    }
};