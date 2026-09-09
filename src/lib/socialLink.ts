export type SocialLink = {
	type: string;
	url: string;
	icon?: string;
	label?: string;
};

export const LINK_TYPES = [
	{ value: "github", label: "GitHub", icon: "mdi:github" },
	{ value: "linkedin", label: "LinkedIn", icon: "mdi:linkedin" },
	{ value: "instagram", label: "Instagram", icon: "mdi:instagram" },
	{ value: "website", label: "Website", icon: "mdi:web" },
	{ value: "custom", label: "Other", icon: "mdi:link-variant" }
] as const;

export function emptySocialLink(): SocialLink {
	return { type: "github", url: "", label: "" };
}

export function socialLinkIcon(link: SocialLink): string {
	if (link.type === "custom") return link.icon || "mdi:link-variant";
	return LINK_TYPES.find((option) => option.value === link.type)?.icon ?? "mdi:link-variant";
}

export function socialLinkLabel(link: SocialLink): string {
	if (link.type === "custom") return link.label || "Link";
	return LINK_TYPES.find((option) => option.value === link.type)?.label ?? "Link";
}
