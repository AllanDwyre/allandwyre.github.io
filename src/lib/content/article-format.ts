import type { Component } from 'svelte';
import { CalendarDays, Timer, ArrowUpRight } from '@lucide/svelte';
import { getAllArticleMetas } from './articles';
import { getAdjacent } from './content-format';
import type { ArticleMeta } from './types';

export { getCategoryColor } from './category-colors';
export { formatAutors } from './content-format';

export interface ArticleLink {
	icon: Component;
	content: string;
	href: string;
	secondary: boolean;
}

// Un seul lien possible pour l'instant (link est '' quand absent) : la
// source externe de l'article. S'ouvre dans un nouvel onglet (voir
// target="_blank" cote appelant).
export function getArticleLinks(meta: ArticleMeta): ArticleLink[] {
	const links: ArticleLink[] = [];

	if (meta.link) {
		links.push({ icon: ArrowUpRight, content: 'Source', href: meta.link, secondary: false });
	}

	return links;
}

export interface ArticleInfo {
	icon: Component;
	label: string;
}

// Formatte reading_time/creation_date en infos { icon, label } pretes a
// afficher, meme forme que getExperimentInfos.
export function getArticleInfos(meta: ArticleMeta): ArticleInfo[] {
	return [
		{ icon: Timer, label: `${meta.reading_time} min read` },
		{
			icon: CalendarDays,
			label: meta.creation_date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
		}
	];
}

// Voisins (precedent/suivant) du slug donne dans la liste des articles.
// Meme principe que getAdjacentExperiments (liste circulaire).
export function getAdjacentArticles(slug: string) {
	return getAdjacent(getAllArticleMetas(), slug);
}
