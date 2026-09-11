import type { ArticleMeta } from './types';

// Glob "léger" : n'importe que meta.ts (eager, exécuté au build), jamais le
// markdown/svx associé. Meme principe que experiments.ts, pour garder la
// page de liste petite même quand le nombre d'articles grandit.
const metaModules = import.meta.glob<{ meta: ArticleMeta }>('./articles/*/meta.ts', {
	eager: true
});

// Glob "lourd" : ne résout le contenu compilé (svx -> composant Svelte)
// qu'à la demande, un seul article a la fois.
const contentModules = import.meta.glob('./articles/*/content.svx');

export function getAllArticleMetas(): ArticleMeta[] {
	return Object.values(metaModules)
		.map((mod) => mod.meta)
		.sort(
			(a, b) =>
				Number(b.favorite) - Number(a.favorite) || b.creation_date.getTime() - a.creation_date.getTime()
		);
}

export async function getArticleContent(slug: string) {
	const path = `./articles/${slug}/content.svx`;
	const loader = contentModules[path];
	if (!loader) return null;

	return loader() as Promise<{ default: import('svelte').Component }>;
}

export function getAllArticleSlugs(): string[] {
	return getAllArticleMetas().map((meta) => meta.slug);
}
