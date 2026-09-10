import { getAllArticleMetas, getArticleContent } from '$lib/content/articles';
import type { PageLoad } from './$types';

// Charge meta + contenu compile (svx) AVANT que SvelteKit ne bascule le DOM
// sur la nouvelle page. Meme raison que experiments/[slug]/+page.ts : la
// view transition (voir +layout.svelte) doit capturer le "new" state avec
// le contenu deja present.
export const load: PageLoad = async ({ params }) => {
	const meta = getAllArticleMetas().find((m) => m.slug === params.slug);
	const mod = meta ? await getArticleContent(params.slug) : null;

	return { meta, mod };
};
