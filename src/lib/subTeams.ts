import { apiRoot } from "$lib/theme/content";

export const defaultSubTeamIcon = "mdi:account-multiple-outline";

export type SubTeamProject = {
	id: string;
	name: string;
	slug: string;
	status: string;
	role: string;
	description: string;
	image: string;
};

export type SubTeamMember = {
	clubId: string;
	name: string;
	role: string;
	major: string;
	year: string;
	photoUrl: string;
	projects: SubTeamProject[];
};

export type SubTeam = {
	id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	images: string[];
	members: SubTeamMember[];
	projects: SubTeamProject[];
};

function toProject(raw: any): SubTeamProject {
	return {
		id: raw?.id ?? "",
		name: raw?.name ?? "",
		slug: raw?.slug ?? "",
		status: raw?.status ?? "active",
		role: raw?.role ?? "",
		description: raw?.description ?? "",
		image: raw?.image ?? ""
	};
}

function toMember(raw: any): SubTeamMember {
	return {
		clubId: raw?.clubId ?? "",
		name: raw?.name ?? "",
		role: raw?.role ?? "",
		major: raw?.major ?? "",
		year: raw?.year ?? "",
		photoUrl: raw?.photoUrl ?? "",
		projects: Array.isArray(raw?.projects) ? raw.projects.map(toProject) : []
	};
}

export function toSubTeam(raw: any): SubTeam {
	return {
		id: raw?.id ?? "",
		name: raw?.name ?? "",
		slug: raw?.slug ?? "",
		description: raw?.description ?? "",
		icon: raw?.icon ?? "",
		images: Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [],
		members: Array.isArray(raw?.members) ? raw.members.map(toMember) : [],
		projects: Array.isArray(raw?.projects) ? raw.projects.map(toProject) : []
	};
}

export function subTeamHref(team: { slug?: string; id?: string }): string {
	return `/subteams/${team.slug || team.id}`;
}

export async function loadSubTeams(fetcher: typeof fetch): Promise<SubTeam[]> {
	try {
		const res = await fetcher(`${apiRoot}/public/club/subteams`, { cache: "no-store" });
		if (!res.ok) return [];

		const data = await res.json();
		if (!Array.isArray(data)) return [];

		return data.map(toSubTeam);
	} catch (error) {
		console.error("Error fetching sub teams:", error);
		return [];
	}
}
