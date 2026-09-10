export interface Heading {
	id: string;
	text: string;
}

// 'Résultats & Évaluation' -> 'resultats-evaluation'
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '') // accents (e -> e apres normalize NFD)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Cherche les <tag> dans `containerSelector`, leur assigne un id slugifie
// (unique meme en cas de titres en double, via suffixe -1/-2/...) ecrit
// directement sur l'element du DOM, et retourne { id, text } pour chacun.
// Utile quand le contenu (ex: markdown compile) n'a pas d'id natif sur ses
// headings (pas de plugin rehype-slug) : ca permet d'y pointer avec de
// simples <a href="#...">.
export function extractHeadingAnchors(containerSelector: string, tag = 'h1'): Heading[] {
	const container = document.querySelector(containerSelector);
	if (!container) return [];

	const seen = new Map<string, number>();

	return Array.from(container.querySelectorAll(tag)).map((el) => {
		const text = el.textContent?.trim() ?? '';
		const base = slugify(text) || 'section';
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);

		const id = count === 0 ? base : `${base}-${count}`;
		el.id = id;

		return { id, text };
	});
}
