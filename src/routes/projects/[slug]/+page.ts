export const prerender = false;

export const load = ({ params }: { params: { slug: string } }) => {
	return { slug: params.slug };
};
