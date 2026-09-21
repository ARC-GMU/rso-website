import { apiRoot } from "$lib/theme/content";

export type ResourceLink = {
	title: string;
	description: string;
	url: string;
	category?: string;
};

export type ResourceFile = {
	name: string;
	description: string;
	src: string;
	size: string;
};

export type ResourceCategory = {
	slug: string;
	name: string;
	kind: "links" | "files";
	count: number;
	links: ResourceLink[];
	files: ResourceFile[];
};

export const FILES_SLUG = "files";

const UNCATEGORIZED = "Links";

export function resourceSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function linkCategories(links: ResourceLink[]): ResourceCategory[] {
	const groups = new Map<string, ResourceLink[]>();

	for (const link of links) {
		const name = link.category?.trim() || UNCATEGORIZED;
		const existing = groups.get(name);
		if (existing) {
			existing.push(link);
		} else {
			groups.set(name, [link]);
		}
	}

	return [...groups.entries()]
		.map(([name, grouped]) => ({
			slug: resourceSlug(name),
			name,
			kind: "links" as const,
			count: grouped.length,
			links: grouped,
			files: []
		}))
		.sort((a, b) => {
			if (a.name === UNCATEGORIZED) return 1;
			if (b.name === UNCATEGORIZED) return -1;
			return a.name.localeCompare(b.name);
		});
}

function filesCategory(media: any[]): ResourceCategory | null {
	const files: ResourceFile[] = media
		.filter((item) => item.category === "resource")
		.map((item) => {
			const extension = item.originalName.split(".").pop()?.toUpperCase() || "FILE";
			return {
				name: item.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
				description: `${extension} file`,
				src: item.url,
				size: formatBytes(item.size || 0)
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	if (files.length === 0) return null;

	return {
		slug: FILES_SLUG,
		name: "Files",
		kind: "files",
		count: files.length,
		links: [],
		files
	};
}

export async function loadResourceCategories(
	fetcher: typeof fetch
): Promise<ResourceCategory[]> {
	try {
		const [mediaRes, linksRes] = await Promise.all([
			fetcher(`${apiRoot}/public/media`),
			fetcher(`${apiRoot}/public/links`)
		]);

		const media = mediaRes.ok ? ((await mediaRes.json()).media ?? []) : [];
		const links = linksRes.ok ? await linksRes.json() : [];

		const categories = linkCategories(links);
		const files = filesCategory(media);

		return files ? [...categories, files] : categories;
	} catch (error) {
		console.error("Error fetching resources:", error);
		return [];
	}
}
