export type ProjectMember = {
	name: string;
	role: string;
	photoUrl: string;
};

const SEPARATOR = " — ";

export function parseProjectMember(entry: unknown): ProjectMember {
	if (typeof entry === "string") {
		const index = entry.indexOf(SEPARATOR);
		if (index === -1) return { name: entry.trim(), role: "", photoUrl: "" };
		return {
			name: entry.slice(0, index).trim(),
			role: entry.slice(index + SEPARATOR.length).trim(),
			photoUrl: ""
		};
	}

	const member = (entry ?? {}) as Record<string, string>;
	return {
		name: (member.name ?? "").trim(),
		role: (member.role ?? "").trim(),
		photoUrl: member.photoUrl ?? ""
	};
}
