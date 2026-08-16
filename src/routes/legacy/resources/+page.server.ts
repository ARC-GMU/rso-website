import type { PageServerLoad } from './$types';

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch('https://manage.autonomousrobotics.club/api/public/media');
        if (!res.ok) {
            throw new Error('Failed to fetch media');
        }
        const data = await res.json();
        const mediaList = data.media || [];
        
        const files = mediaList
            .filter((m: any) => m.category === 'resource')
            .map((m: any) => {
                const ext = m.originalName.split('.').pop()?.toUpperCase() || 'FILE';
                return {
                    name: m.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                    description: `${ext} file`,
                    src: m.url,
                    size: formatBytes(m.size || 0)
                };
            })
            .sort((a: any, b: any) => a.name.localeCompare(b.name));

        return { files };
    } catch (error) {
        console.error("Error fetching resources:", error);
        return { files: [] };
    }
};
