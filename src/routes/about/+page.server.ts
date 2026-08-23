import type { PageServerLoad } from './$types';

export const prerender = false;

type FAQ = { question: string; answer: string };

type AboutPage = {
	content: string;
	faqs: FAQ[];
	author: string;
	updatedAt: string;
};

const emptyAbout: AboutPage = { content: '', faqs: [], author: '', updatedAt: '' };

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('https://manage.autonomousrobotics.club/api/public/club/about-page');
		if (!res.ok) return { about: emptyAbout };
		const data = await res.json();
		return { about: { ...emptyAbout, ...data } };
	} catch (error) {
		console.error('Error fetching about page:', error);
		return { about: emptyAbout };
	}
};
