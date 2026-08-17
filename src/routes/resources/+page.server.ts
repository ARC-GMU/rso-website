import type { PageServerLoad } from './$types';

export const prerender = false;

type PublicLink = {
	title: string;
	description: string;
	url: string;
	category?: string;
};

type LinkGroup = {
	category: string;
	links: PublicLink[];
};

const uncategorized = 'Links';

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function groupLinks(links: PublicLink[]): LinkGroup[] {
	const groups = new Map<string, PublicLink[]>();

	for (const link of links) {
		const category = link.category?.trim() || uncategorized;
		const existing = groups.get(category);
		if (existing) {
			existing.push(link);
		} else {
			groups.set(category, [link]);
		}
	}

	return [...groups.entries()]
		.map(([category, groupLinks]) => ({ category, links: groupLinks }))
		.sort((a, b) => {
			if (a.category === uncategorized) return 1;
			if (b.category === uncategorized) return -1;
			return a.category.localeCompare(b.category);
		});
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const [mediaRes, linksRes] = await Promise.all([
			fetch('https://manage.autonomousrobotics.club/api/public/media'),
			fetch('https://manage.autonomousrobotics.club/api/public/links')
		]);
		if (!mediaRes.ok) {
			throw new Error('Failed to fetch media');
		}
		const data = await mediaRes.json();
		const mediaList = data.media || [];
		const links = linksRes.ok ? await linksRes.json() : [];

		const files = mediaList
			.filter((m: any) => m.category === 'resource')
			.map((m: any) => {
				const extension = m.originalName.split('.').pop()?.toUpperCase() || 'FILE';
				return {
					name: m.originalName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
					description: `${extension} file`,
					src: m.url,
					size: formatBytes(m.size || 0)
				};
			})
			.sort((a: any, b: any) => a.name.localeCompare(b.name));

		return { files, linkGroups: groupLinks(links) };
	} catch (error) {
		console.error('Error fetching resources:', error);
		return { files: [], linkGroups: [] as LinkGroup[] };
	}
};
