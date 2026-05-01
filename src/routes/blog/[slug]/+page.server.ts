import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const res = await fetch(`https://manage.autonomousrobotics.club/api/public/blog?slug=${params.slug}`);
        if (!res.ok) {
            if (res.status === 404) {
                error(404, 'Blog post not found');
            }
            throw new Error('Failed to fetch blog post');
        }
        
        const data = await res.json();
        
        // The API returns a single object when queried with a slug, or possibly an array containing one object.
        // Let's handle both just in case.
        let post;
        if (Array.isArray(data)) {
            post = data[0];
        } else {
            post = data;
        }

        if (!post) {
            error(404, 'Blog post not found');
        }

        return { post };
    } catch (err) {
        console.error("Error fetching blog post:", err);
        error(500, 'Internal Server Error');
    }
};