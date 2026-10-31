export type MediaKind = "image" | "video";

export type TimelineMedia = {
	src: string;
	kind: MediaKind;
	caption: string;
	altText: string;
	date: Date;
	hasTakenDate: boolean;
};

export type TimelineMonth = { key: string; label: string; items: TimelineMedia[] };

export type TimelineYear = { year: number; count: number; months: TimelineMonth[] };

function cleanName(originalName: string): string {
	return originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

export function toTimelineMedia(raw: any): TimelineMedia | null {
	if (raw?.category !== "image" && raw?.category !== "video") return null;
	const date = new Date(raw.takenAt || raw.uploadedAt || "");
	if (Number.isNaN(date.getTime())) return null;
	const caption = (raw.caption ?? "").trim();
	return {
		src: raw.url,
		kind: raw.category,
		caption,
		altText: caption || cleanName(raw.originalName ?? ""),
		date,
		hasTakenDate: Boolean(raw.takenAt)
	};
}

function timeZoneFor(item: TimelineMedia): string {
	return item.hasTakenDate ? "UTC" : "America/New_York";
}

function datePart(item: TimelineMedia, part: "year" | "month"): number {
	const formatted = item.date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "numeric",
		timeZone: timeZoneFor(item)
	});
	const [month, year] = formatted.split("/").map(Number);
	return part === "year" ? year : month;
}

export function formatMediaDate(item: TimelineMedia): string {
	return item.date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: timeZoneFor(item)
	});
}

export function buildTimeline(items: TimelineMedia[]): TimelineYear[] {
	const sorted = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());
	const years: TimelineYear[] = [];

	for (const item of sorted) {
		const year = datePart(item, "year");
		const month = datePart(item, "month");

		let yearGroup = years.find((group) => group.year === year);
		if (!yearGroup) {
			yearGroup = { year, count: 0, months: [] };
			years.push(yearGroup);
		}
		yearGroup.count++;

		const key = `${year}-${month}`;
		let monthGroup = yearGroup.months.find((group) => group.key === key);
		if (!monthGroup) {
			const label = new Date(Date.UTC(year, month - 1, 15)).toLocaleDateString("en-US", {
				month: "long",
				timeZone: "UTC"
			});
			monthGroup = { key, label, items: [] };
			yearGroup.months.push(monthGroup);
		}
		monthGroup.items.push(item);
	}

	return years;
}
