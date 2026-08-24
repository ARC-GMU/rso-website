import type { PageServerLoad } from './$types';

export const prerender = false;

type FAQ = { question: string; answer: string };

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const [pagesRes, faqRes] = await Promise.all([
			fetch('https://manage.autonomousrobotics.club/api/public/club/about-pages'),
			fetch('https://manage.autonomousrobotics.club/api/public/club/about-faq')
		]);
		const pages = pagesRes.ok ? await pagesRes.json() : [];
		const faqData = faqRes.ok ? await faqRes.json() : { faqs: [] };

		return { pages: pages || [], faqs: (faqData.faqs || []) as FAQ[] };
	} catch (error) {
		console.error('Error fetching about pages:', error);
		return { pages: [], faqs: [] as FAQ[] };
	}
};
