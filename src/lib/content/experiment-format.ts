import type { Component } from 'svelte';
import { CalendarDays, Timer, User, Users, UsersRound, ArrowUpRight } from '@lucide/svelte';
import Github from '$lib/icons/github.svg?component';
import { getAllExperimentMetas } from './experiments';
import type { ExperimentMeta } from './types';

export { getCategoryColors, getCategoryColor } from './category-colors';

// Categories des experiments uniquement (triees, dedupliquees) : c'est la
// liste utilisee pour les filtres de experiments.svelte. Le mapping
// couleur, lui, est partage avec les articles via category-colors.ts pour
// qu'une meme categorie garde toujours la meme couleur dans les deux
// sections.
export function getAllCategories(): string[] {
	return Array.from(
		new Set(
			getAllExperimentMetas()
				.flatMap((m) => m.categories)
				.sort((a, b) => a.localeCompare(b))
		)
	);
}

export interface ExperimentLink {
	icon: Component;
	content: string;
	href: string;
	secondary: boolean;
}

// Un lien par champ renseigne (github_link/demo_link sont '' quand absents),
// avec l'icone et le libelle qui vont avec. Les deux s'ouvrent dans un
// nouvel onglet (voir target="_blank" cote appelant).
export function getExperimentLinks(meta: ExperimentMeta): ExperimentLink[] {
	const links: ExperimentLink[] = [];

	if (meta.demo_link) {
		links.push({ icon: ArrowUpRight, content: 'Demo', href: meta.demo_link, secondary: false });
	}

	if (meta.github_link) {
		links.push({ icon: Github, content: 'Github', href: meta.github_link, secondary: true });
	}


	return links;
}

export interface ExperimentInfo {
	icon: Component;
	label: string;
}

const GROUP_TYPE_ICONS: Record<ExperimentMeta['group_type'], Component> = {
	Solo: User,
	Group: Users,
	Teams: UsersRound
};

// Formatte started_date/project_duration/group_type en 3 infos { icon, label }
// pretes a afficher, dans cet ordre.
export function getExperimentInfos(meta: ExperimentMeta): ExperimentInfo[] {
	return [
		{ icon: Timer, label: meta.project_duration },
		{ icon: GROUP_TYPE_ICONS[meta.group_type], label: meta.group_type + " project" },
		{
			icon: CalendarDays,
			label: meta.started_date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
		},
	];
}

export interface AdjacentExperiments {
	prev: ExperimentMeta;
	next: ExperimentMeta;
}

// Voisins (precedent/suivant) du slug donne dans la liste des experiments.
// Liste circulaire (ordre deterministe = getAllExperimentMetas(), triee par
// titre) : prev/next bouclent via % pour ne jamais deborder (pas d'overflow
// en debut/fin de liste). Retourne null si le slug n'existe pas.
export function getAdjacentExperiments(slug: string): AdjacentExperiments | null {
	const metas = getAllExperimentMetas();
	const index = metas.findIndex((m) => m.slug === slug);
	if (index === -1) return null;

	const prev = metas[(index - 1 + metas.length) % metas.length];
	const next = metas[(index + 1) % metas.length];
	return { prev, next };
}

// 'Alice' -> 'Alice' / ['Alice', 'Bob'] -> 'Alice & Bob'
// ['Alice', 'Bob', 'Carl'] -> 'Alice, Bob & Carl'
export function formatAutors(autors: string[]): string {
	if (autors.length === 0) return '';
	if (autors.length === 1) return autors[0];

	return `${autors.slice(0, -1).join(', ')} & ${autors[autors.length - 1]}`;
}
