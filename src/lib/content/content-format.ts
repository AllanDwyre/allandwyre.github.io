// Utilitaires de formatage partages entre experiments et articles (voir
// experiment-format.ts / article-format.ts), pour que les deux pages de
// detail (ContentPage) se comportent de la meme facon.

// 'Alice' -> 'Alice' / ['Alice', 'Bob'] -> 'Alice & Bob'
// ['Alice', 'Bob', 'Carl'] -> 'Alice, Bob & Carl'
export function formatAutors(autors: string[]): string {
	if (autors.length === 0) return '';
	if (autors.length === 1) return autors[0];

	return `${autors.slice(0, -1).join(', ')} & ${autors[autors.length - 1]}`;
}

export interface Adjacent<T> {
	prev: T;
	next: T;
}

// Voisins (precedent/suivant) du slug donne dans une liste de metas,
// deja triee dans l'ordre d'affichage voulu. Liste circulaire : prev/next
// bouclent via % pour ne jamais deborder (pas d'overflow en debut/fin de
// liste). Retourne null si le slug n'existe pas.
export function getAdjacent<T extends { slug: string }>(
	metas: T[],
	slug: string
): Adjacent<T> | null {
	const index = metas.findIndex((m) => m.slug === slug);
	if (index === -1) return null;

	const prev = metas[(index - 1 + metas.length) % metas.length];
	const next = metas[(index + 1) % metas.length];
	return { prev, next };
}
