import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch('https://manage.autonomousrobotics.club/api/roster');
        if (!res.ok) {
            throw new Error('Failed to fetch roster');
        }
        const teams = await res.json();
        return { teams };
    } catch (error) {
        console.error("Error fetching roster:", error);
        return { teams: [] };
    }
};