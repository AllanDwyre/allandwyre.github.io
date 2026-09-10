import { getAllExperimentMetas, getExperimentContent } from '$lib/content/experiments';
import type { PageLoad } from './$types';

// Charge meta + contenu compile (svx) AVANT que SvelteKit ne bascule le DOM
// sur la nouvelle page. C'est ce qui permet a la view transition (voir
// +layout.svelte) de capturer le "new" state avec le contenu deja present,
// au lieu d'un header qui morphe puis d'un md-content/vertical-nav qui pop
// tout seul un instant plus tard une fois la promesse resolue cote client.
export const load: PageLoad = async ({ params }) => {
	const meta = getAllExperimentMetas().find((m) => m.slug === params.slug);
	const mod = meta ? await getExperimentContent(params.slug) : null;

	return { meta, mod };
};
