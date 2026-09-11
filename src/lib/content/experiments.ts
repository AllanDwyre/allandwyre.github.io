import type { ExperimentMeta } from './types';

// Glob "léger" : n'importe que meta.ts (eager, exécuté au build), jamais le
// markdown/svx associé. C'est ce qui permet à la page de liste de rester
// petite même quand le nombre de posts grandit.
const metaModules = import.meta.glob<{ meta: ExperimentMeta }>('./experiments/*/meta.ts', {
	eager: true
});

// Glob "lourd" : ne résout le contenu compilé (svx -> composant Svelte)
// qu'à la demande, un seul post à la fois, quand on ouvre /experiments/[slug].
const contentModules = import.meta.glob('./experiments/*/content.svx');

export function getAllExperimentMetas(): ExperimentMeta[] {
	return Object.values(metaModules)
		.map((mod) => mod.meta)
		.sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.title.localeCompare(b.title));
}

export async function getExperimentContent(slug: string) {
	const path = `./experiments/${slug}/content.svx`;
	const loader = contentModules[path];
	if (!loader) return null;

	return loader() as Promise<{ default: import('svelte').Component }>;
}

export function getAllExperimentSlugs(): string[] {
	return getAllExperimentMetas().map((meta) => meta.slug);
}
