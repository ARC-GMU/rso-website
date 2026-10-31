export type MediaCaption = { url: string; caption: string };

export function toCaptionMap(captions: unknown): Record<string, string> {
	const captionsByUrl: Record<string, string> = {};
	if (!Array.isArray(captions)) return captionsByUrl;
	for (const entry of captions as MediaCaption[]) {
		if (entry?.url && entry?.caption) captionsByUrl[entry.url] = entry.caption;
	}
	return captionsByUrl;
}
