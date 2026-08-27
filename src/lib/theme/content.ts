export type ScheduleEntry = { day: string; time: string };

export type ProjectLink = { label: string; url: string };

export type Project = {
	id: string;
	name: string;
	slug?: string;
	description: string;
	repoUrl: string;
	requirements?: string[];
	links?: ProjectLink[];
	teamMembers?: unknown[];
	images?: string[];
	videos?: string[];
	external?: boolean;
	externalUrl?: string;
	status?: "active" | "completed";
};

export type SocialLink = { type: string; url: string; icon?: string; label?: string };

export type Sponsor = { name: string; imageUrl: string };

export type PartnerContact = {
	name: string;
	role?: string;
	contact?: string;
	photoUrl?: string;
	socialLinks?: SocialLink[];
};

export type Partner = {
	name: string;
	slug?: string;
	imageUrl: string;
	url?: string;
	bio?: string;
	socialLinks?: SocialLink[];
	contacts?: PartnerContact[];
};

export type ClubContent = {
	missionStatement: string;
	whatWeDo: string;
	organization: string;
	location: string;
	schedule: ScheduleEntry[];
	socialLinks: SocialLink[];
	sponsors: Sponsor[];
	partners: Partner[];
	projects: Project[];
};

export const apiRoot = "https://manage.autonomousrobotics.club/api";

export const discordUrl = "https://discord.gg/zn93yRNZGb";
export const mason360Url = "https://mason360.gmu.edu/ARC/club_signup";

export const navLinks = [
	{ label: "About", href: "/about" },
	{ label: "Projects", href: "/projects" },
	{ label: "Team", href: "/team" },
	{ label: "Events", href: "/events" },
	{ label: "Resources", href: "/resources" },
	{ label: "Blog", href: "/blog" },
	{ label: "Media", href: "/media" }
];

export const emptyContent: ClubContent = {
	missionStatement: "",
	whatWeDo: "",
	organization: "Autonomous Robotics Club",
	location: "",
	schedule: [],
	socialLinks: [],
	sponsors: [],
	partners: [],
	projects: []
};

const socialIcons: Record<string, string> = {
	instagram: "mdi:instagram",
	linkedin: "mdi:linkedin",
	youtube: "mdi:youtube",
	discord: "mdi:discord",
	github: "mdi:github"
};

const socialColorVars: Record<string, string> = {
	instagram: "var(--arc-instagram)",
	linkedin: "var(--arc-linkedin)",
	youtube: "var(--arc-youtube)",
	discord: "var(--arc-discord)"
};

export function socialIcon(link: SocialLink): string {
	if (link.type === "custom") return link.icon || "mdi:link-variant";
	return socialIcons[link.type] || "mdi:link-variant";
}

export function socialLabel(link: SocialLink): string {
	if (link.type === "custom") return link.label || "Link";
	return link.type.charAt(0).toUpperCase() + link.type.slice(1);
}

export function socialColor(link: SocialLink): string {
	return socialColorVars[link.type] || "var(--arc-ink)";
}

async function fetchJson(path: string) {
	const res = await fetch(`${apiRoot}${path}`, { cache: "no-store" });
	if (!res.ok) return null;
	return await res.json();
}

export async function loadClubContent(): Promise<ClubContent> {
	try {
		const [about, projects] = await Promise.all([
			fetchJson("/public/club/about"),
			fetchJson("/public/club/projects")
		]);

		return {
			missionStatement: about?.missionStatement ?? "",
			whatWeDo: about?.whatWeDo ?? "",
			organization: about?.organization || emptyContent.organization,
			location: about?.location ?? "",
			schedule: about?.schedule ?? [],
			socialLinks: about?.socialLinks ?? [],
			sponsors: about?.sponsors ?? [],
			partners: about?.partners ?? [],
			projects: projects ?? []
		};
	} catch (e) {
		console.error("Error fetching club content:", e);
		return emptyContent;
	}
}
