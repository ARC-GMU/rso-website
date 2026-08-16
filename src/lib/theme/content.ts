export type ScheduleEntry = { day: string; time: string };

export type ProjectLink = { label: string; url: string };

export type Project = {
	id: string;
	name: string;
	description: string;
	repoUrl: string;
	requirements?: string[];
	links?: ProjectLink[];
	teamMembers?: string[];
	images?: string[];
	videos?: string[];
	external?: boolean;
	externalUrl?: string;
};

export type ClubContent = {
	focusStatement: string;
	missionStatement: string;
	whatWeDo: string;
	organization: string;
	location: string;
	schedule: ScheduleEntry[];
	projects: Project[];
};

export const apiRoot = "https://manage.autonomousrobotics.club/api";

export const discordUrl = "https://discord.gg/WfKAbJpZFX";
export const githubUrl = "https://github.com/ARC-GMU";
export const instagramUrl = "https://www.instagram.com/arc.gmu/";
export const linkedinUrl = "https://www.linkedin.com/company/arcgmu/";
export const youtubeUrl = "https://www.youtube.com/@arc-gmu";
export const mason360Url = "https://mason360.gmu.edu/ARC/club_signup";

export const navLinks = [
	{ label: "Projects", href: "/projects" },
	{ label: "Team", href: "/team" },
	{ label: "Events", href: "/events" },
	{ label: "Resources", href: "/resources" },
	{ label: "Blog", href: "/blog" },
	{ label: "Media", href: "/media" }
];

export const emptyContent: ClubContent = {
	focusStatement: "",
	missionStatement: "",
	whatWeDo: "",
	organization: "Autonomous Robotics Club",
	location: "",
	schedule: [],
	projects: []
};

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
			focusStatement: about?.focusStatement ?? "",
			missionStatement: about?.missionStatement || about?.focusStatement || "",
			whatWeDo: about?.whatWeDo ?? "",
			organization: about?.organization || emptyContent.organization,
			location: about?.location ?? "",
			schedule: about?.schedule ?? [],
			projects: projects ?? []
		};
	} catch (e) {
		console.error("Error fetching club content:", e);
		return emptyContent;
	}
}
