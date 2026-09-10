import type { Component } from 'svelte';
import { Calendar, Clock, User, Users, UsersRound, ArrowUpRight } from '@lucide/svelte';
import Github from '$lib/icons/github.svg?component';
import { getAllExperimentMetas } from './experiments';
import type { ExperimentMeta } from './types';

const CATEGORY_COLORS = [
	'var(--color-red)',
	'var(--color-orange)',
	'var(--color-light-orange)',
	'var(--color-yellow)',
	'var(--color-dark-blue)',
	'var(--color-light-blue)',
	'var(--color-blue)'
];

// Toutes les categories, tous experiments confondus, triees et dedupliquees.
// C'est la meme liste utilisee pour les filtres (experiments.svelte) et pour
// deriver le mapping couleur ci-dessous : il faut que l'ordre soit identique
// partout pour qu'une categorie garde toujours la meme couleur.
export function getAllCategories(): string[] {
	return Array.from(
		new Set(
			getAllExperimentMetas()
				.flatMap((m) => m.categories)
				.sort((a, b) => a.localeCompare(b))
		)
	);
}

// Mapping cat -> couleur, piochee dans CATEGORY_COLORS (cycle si plus de
// categories que de couleurs).
export function getCategoryColorMap(): Map<string, string> {
	const categories = getAllCategories();
	return new Map(categories.map((cat, i) => [cat, CATEGORY_COLORS[i % CATEGORY_COLORS.length]]));
}

// Couleur de chaque categorie donnee, dans le meme ordre.
export function getCategoryColors(categories: string[]): string[] {
	const colorMap = getCategoryColorMap();
	return categories.map((cat) => colorMap.get(cat) ?? CATEGORY_COLORS[0]);
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
		{ icon: Clock, label: meta.project_duration },
		{ icon: GROUP_TYPE_ICONS[meta.group_type], label: meta.group_type + " project" },
		{
			icon: Calendar,
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
