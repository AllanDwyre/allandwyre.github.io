import { CATEGORIES, type Category } from './types';

// Une couleur par categorie, dans le meme ordre que CATEGORIES. Grace au
// type litteral Category, ces deux listes ont forcement la meme longueur
// (5 categories, 5 couleurs) : plus de cycle possible, donc plus de
// collision de couleur entre deux categories.
const CATEGORY_COLORS: Record<Category, string> = {
	Data: 'var(--color-red)',
	Deployment: 'var(--color-orange)',
	'Impact Study': 'var(--color-yellow)',
	Models: 'var(--color-dark-blue)',
	Monitoring: 'var(--color-light-blue)'
};

// Toutes les categories disponibles, experiments ET articles confondus.
// Liste fixe (CATEGORIES) : garantit qu'une categorie donnee (ex: "Data")
// a toujours la meme couleur, qu'elle vienne d'un experiment ou d'un
// article.
export function getAllCategories(): Category[] {
	return [...CATEGORIES];
}

// Couleur d'une seule categorie (ex: usage sur article-card).
export function getCategoryColor(category: Category): string {
	return CATEGORY_COLORS[category];
}

// Couleur de chaque categorie donnee, dans le meme ordre (ex: usage sur
// experiment-card, qui affiche plusieurs categories par experiment).
export function getCategoryColors(categories: Category[]): string[] {
	return categories.map((cat) => CATEGORY_COLORS[cat]);
}
