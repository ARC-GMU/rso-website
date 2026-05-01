import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch('https://manage.autonomousrobotics.club/api/public/media');
        if (!res.ok) {
            throw new Error('Failed to fetch media');
        }
        const data = await res.json();
        const mediaList = data.media || [];
        
        const images = mediaList
            .filter((m: any) => m.category === 'image')
            .map((m: any) => ({
                src: m.url,
                caption: m.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                date: m.uploadedAt ? m.uploadedAt.split('T')[0] : ''
            }))
            .sort((a: any, b: any) => b.date.localeCompare(a.date));

        const videos = mediaList
            .filter((m: any) => m.category === 'video')
            .map((m: any) => ({
                src: m.url,
                title: m.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                date: m.uploadedAt ? m.uploadedAt.split('T')[0] : ''
            }))
            .sort((a: any, b: any) => b.date.localeCompare(a.date));

        return { images, videos };
    } catch (error) {
        console.error("Error fetching media:", error);
        return { images: [], videos: [] };
    }
};
