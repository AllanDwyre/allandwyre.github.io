import { getAllExperimentMetas } from './experiments';
import { getAllArticleMetas } from './articles';

const CATEGORY_COLORS = [
	'var(--color-red)',
	'var(--color-orange)',
	'var(--color-light-orange)',
	'var(--color-yellow)',
	'var(--color-dark-blue)',
	'var(--color-light-blue)',
	'var(--color-blue)'
];

// Toutes les categories, experiments ET articles confondus, triees et
// deduplicquees. Une seule liste partagee entre les deux sections : c'est ce
// qui garantit qu'une categorie donnee (ex: "Data") a toujours la meme
// couleur, qu'elle vienne d'un experiment ou d'un article.
export function getAllCategories(): string[] {
	const experimentCategories = getAllExperimentMetas().flatMap((m) => m.categories);
	const articleCategories = getAllArticleMetas().map((m) => m.category);

	return Array.from(new Set([...experimentCategories, ...articleCategories])).sort((a, b) =>
		a.localeCompare(b)
	);
}

// Mapping cat -> couleur, piochee dans CATEGORY_COLORS (cycle si plus de
// categories que de couleurs).
export function getCategoryColorMap(): Map<string, string> {
	const categories = getAllCategories();
	return new Map(categories.map((cat, i) => [cat, CATEGORY_COLORS[i % CATEGORY_COLORS.length]]));
}

// Couleur d'une seule categorie (ex: usage sur article-card).
export function getCategoryColor(category: string): string {
	return getCategoryColorMap().get(category) ?? CATEGORY_COLORS[0];
}

// Couleur de chaque categorie donnee, dans le meme ordre (ex: usage sur
// experiment-card, qui affiche plusieurs categories par experiment).
export function getCategoryColors(categories: string[]): string[] {
	const colorMap = getCategoryColorMap();
	return categories.map((cat) => colorMap.get(cat) ?? CATEGORY_COLORS[0]);
}
