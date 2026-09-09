export function formatDuration(minutes: number): string {
	if (!minutes || minutes <= 0) return "0h";

	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;

	if (hours === 0) return `${remainder}m`;
	if (remainder === 0) return `${hours}h`;
	return `${hours}h ${remainder}m`;
}
