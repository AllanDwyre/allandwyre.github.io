
const Seed = 4

// --- Debug ---

// Affiche dans la console la grille (ASCII) et les patterns choisis par row,
// pour verifier visuellement le layout genere pour un N donne.
// Usage : `npx tsx -e "import('./src/lib/utils/create_layout.ts').then(m => m.printLayout(14))"`
export function printLayout(N: number, W = 4): void {
	const { L, tiles, chosenPatternsByRow } = buildLayout(N, W)

	console.log(`N=${N} W=${W} -> L=${L}, ${tiles.length} tiles`)

	console.log('\nPatterns choisis (par row) :')
	chosenPatternsByRow.forEach(({ row, name }) => console.log(`  row ${row}: ${name}`))

	// Grille ASCII : chaque cellule affiche l'indice de la tile qui l'occupe.
	const grid: Array<Array<string>> = Array.from({ length: L }, () => Array.from({ length: W }, () => '.'))
	tiles.forEach((t, i) => {
		for (let r = t.r; r < t.r + t.h; r++) {
			for (let c = t.c; c < t.c + t.w; c++) {
				if (grid[r]) grid[r][c] = String(i % 10)
			}
		}
	})

	console.log('\nGrille :')
	grid.forEach((row) => console.log(row.join(' ')))
}

// --- CODE ---

interface Tile {
	r: number;
	c: number;
	w: number;
	h: number;
}

// utils:

function createTile(col: number, row: number,): Tile {
	return { r: row, c: col, w: 1, h: 1 }
}

function createHorizontalTile(col: number, row: number): Tile {
	return { r: row, c: col, w: 2, h: 1 }
}

function createVerticalTile(col: number, row: number): Tile {
	return { r: row, c: col, w: 1, h: 2 }
}

function setRowToPattern(pattern: Array<Tile>, row: number): void {
	pattern.forEach((t) => t.r = row)
}

function clonePattern(pattern: Array<Tile>): Array<Tile> {
	return pattern.map((t) => ({ ...t }))
}

// PRNG deterministe (mulberry32) : meme seed => meme suite de nombres,
// ce qui permet d'avoir un layout "aleatoire" mais stable pour un N donne.
function createSeededRandom(seed: number): () => number {
	let t = seed
	return function () {
		t |= 0; t = (t + 0x6D2B79F5) | 0
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

// Entier aleatoire dans [min, max] (bornes incluses), a partir d'une
// fonction random (typiquement celle rendue par createSeededRandom).
function randomInt(random: () => number, min: number, max: number): number {
	return min + Math.floor(random() * (max - min + 1))
}

function removeFromList<T>(list: Array<T>, item: T): void {
	const index = list.indexOf(item)
	if (index !== -1) list.splice(index, 1)
}

// Donne un nom lisible a un pattern (pour le debug/print), en comparant la
// reference AVANT tout clonePattern (un clone perd l'egalite de reference).
function patternName(p: Array<Tile>): string {
	if (p === special_pattern) return 'special_pattern'
	if (p === pattern2) return 'pattern2'
	if (p === pattern3[0]) return 'pattern3[0]'
	if (p === pattern3[1]) return 'pattern3[1]'
	return 'unknown'
}

// --- Selection des patterns par row ---
//
// Regles a respecter (voir buildLayout pour le pourquoi) :
//  - au moins 1 "special_pattern" toutes les 3 rows, et au moins 1 sur tout le layout
//  - jamais plus de 2 "special_pattern" consecutifs
//  - jamais plus de 50% des rows en "special_pattern" (strict : 50% pile est
//    aussi refuse, ex. 3/6 ou 2/3 sont impossibles)
//  - "pattern2" limite a l'exces disponible (3 * L - N), sinon le total de
//    tiles peut tomber sous N et le merge ne peut pas rattraper un manque

interface PatternPickState {
	pattern2Budget: number
	specialPatternRunLength: number // nb de "special_pattern" places d'affilee, juste avant la row en cours
	rowsSinceSpecialPattern: number // nb de rows depuis le dernier "special_pattern" (0, 1 ou 2)
	specialPatternUsed: boolean // au moins 1 "special_pattern" choisi sur tout le layout ?
	specialPatternCount: number // nb total de "special_pattern" places jusqu'ici
	maxSpecialPatternCount: number // cap strict : < 50% des rows
}

function createPatternPickState(N: number, L: number, isPair: boolean): PatternPickState {
	return {
		pattern2Budget: isPair ? 0 : 3 * L - N,
		specialPatternRunLength: 0,
		rowsSinceSpecialPattern: 0,
		specialPatternUsed: false,
		specialPatternCount: 0,
		// < 50%  : pour L rows, le plus grand compte valide est L / 2 (ex. L=6 -> 3, pas 3).
		maxSpecialPatternCount: Math.ceil(L / 2),
	}
}

function canUseSpecialPattern(state: PatternPickState): boolean {
	return state.specialPatternRunLength < 2 && state.specialPatternCount < state.maxSpecialPatternCount
}

// force "special_pattern" si on approche 3 rows sans lui, OU si on arrive a
// la derniere row sans qu'il ait jamais ete choisi (le cap ci-dessus reste
// prioritaire : si le cap l'interdit, canUseSpecialPattern coupe court).
function mustUseSpecialPattern(state: PatternPickState, isLastRow: boolean): boolean {
	return canUseSpecialPattern(state) && (state.rowsSinceSpecialPattern >= 2 || (isLastRow && !state.specialPatternUsed))
}

function availablePatterns(state: PatternPickState, authorizedPatterns: Array<Array<Tile>>): Array<Array<Tile>> {
	return authorizedPatterns.filter((p) => {
		if (p === pattern2) return state.pattern2Budget > 0
		if (p === special_pattern) return canUseSpecialPattern(state)
		return true
	})
}

function applyPick(state: PatternPickState, pick: Array<Tile>): void {
	if (pick === pattern2) state.pattern2Budget--

	if (pick === special_pattern) {
		state.specialPatternRunLength++
		state.rowsSinceSpecialPattern = 0
		state.specialPatternUsed = true
		state.specialPatternCount++
	} else {
		state.specialPatternRunLength = 0
		state.rowsSinceSpecialPattern++
	}
}

function pickPatternForRow(
	state: PatternPickState,
	authorizedPatterns: Array<Array<Tile>>,
	isLastRow: boolean,
	random: () => number
): Array<Tile> {
	let pick: Array<Tile>
	if (mustUseSpecialPattern(state, isLastRow)) {
		pick = special_pattern
	} else {
		const pool = availablePatterns(state, authorizedPatterns)
		pick = pool[randomInt(random, 0, pool.length - 1)]
	}

	applyPick(state, pick)
	return pick
}

// Choisit L patterns, deterministic random (seed = N), row par row : l'ordre
// de generation EST l'ordre des rows (pas de shuffle apres coup, sinon on
// casserait les contraintes de voisinage). Chaque pattern est copie pour ne
// jamais modifier les const partagees (special_pattern, pattern2, pattern3).
function selectPatternsForRows(
	L: number,
	N: number,
	isPair: boolean,
	authorizedPatterns: Array<Array<Tile>>,
	random: () => number
): Array<{ tiles: Array<Tile>, name: string }> {
	const state = createPatternPickState(N, L, isPair)

	const rows: Array<{ tiles: Array<Tile>, name: string }> = []
	for (let i = 0; i < L; i++) {
		const pick = pickPatternForRow(state, authorizedPatterns, i === L - 1, random)

		const cloned = clonePattern(pick)
		setRowToPattern(cloned, i)

		rows.push({ tiles: cloned, name: patternName(pick) })
	}
	return rows
}

// Base-Patterns

const pattern2: Array<Tile> = [
	createHorizontalTile(0, 0),
	createHorizontalTile(2, 0)
]


const pattern3: Array<Array<Tile>> = [
	[
		createTile(0, 0),
		createTile(1, 0),
		createHorizontalTile(2, 0),
	],
	[
		createHorizontalTile(0, 0),
		createTile(2, 0),
		createTile(3, 0),
	],
]


const special_pattern: Array<Tile> = [
	createTile(0, 0),
	createHorizontalTile(1, 0),
	createTile(3, 0),
]

function buildLayout(N: number, W = 4) {
	let tiles: Array<Tile> = []
	const isPair = (N / 2) % 2 === 0


	function findNeighboor(orgine: Tile, x: number = 0, y: number = 0): Tile | undefined {
		const target_x = orgine.c + Math.max(x * orgine.w, x)
		const target_y = orgine.r + Math.max(y * orgine.h, y)

		return tiles.find((t) =>
			target_x >= t.c && target_x < t.c + t.w &&
			target_y >= t.r && target_y < t.r + t.h
		)
	}

	function isMergeableNeighboor(orgine: Tile, x: number = 0, y: number = 0): boolean {
		const target = findNeighboor(orgine, x, y)

		if (!target) return false;

		return target.w + target.h === 2;
	}

	function mergeTiles(a: Tile, b: Tile) {
		if (a.r !== b.r) {
			tiles = tiles.filter(t => t !== a && t !== b);
			tiles.push(createVerticalTile(a.c, Math.min(a.r, b.r),))
			return
		}

		if (a.c !== b.c) {
			tiles = tiles.filter(t => t !== a && t !== b);
			tiles.push(createHorizontalTile(Math.min(a.c, b.c), a.r))
			return
		}
	}


	if (N <= 0) return { L: 0, tiles: [], chosenPatternsByRow: [] };

	if (N === 1) {
		// Prend width = W si N == 1.
		return { L: 1, tiles: [{ r: 0, c: 0, w: W, h: 1 }], chosenPatternsByRow: [{ row: 0, name: 'special-case N=1' }] };
	}

	if (N === 2) {
		// Prend width = W si N == 1.
		return { L: 1, tiles: pattern2, chosenPatternsByRow: [{ row: 0, name: 'pattern2' }] };
	}

	if (N === 4) {
		// Cas spécial
		return { L: 2, tiles: [createVerticalTile(0, 0), createVerticalTile(3, 0), createHorizontalTile(1, 0), createHorizontalTile(1, 1)], chosenPatternsByRow: [{ row: 0, name: 'special-case N=4' }] };
	}

	// Calcule le nombre de Lignes
	let L = Math.ceil(N / Math.max(W - 1, 1));

	const authorizedPatterns: Array<Array<Tile>> = isPair ? [special_pattern, pattern3[0], pattern3[1]] : [special_pattern, pattern2, pattern3[0], pattern3[1]]

	const random = createSeededRandom(N + Seed)

	// Choisit un pattern par row (voir selectPatternsForRows pour les regles :
	// frequence min/max de "special_pattern", budget de pattern2...).
	const rows = selectPatternsForRows(L, N, isPair, authorizedPatterns, random)

	const chosenPatternsByRow: Array<{ row: number, name: string }> = []
	rows.forEach(({ tiles: rowTiles, name }, i) => {
		tiles.push(...rowTiles)
		chosenPatternsByRow.push({ row: i, name })
	})


	merging_tiles(tiles, N, random, isMergeableNeighboor, findNeighboor, mergeTiles)

	return { L, tiles, chosenPatternsByRow };
}


function merging_tiles(tiles: Tile[], N: number, random: () => number, isMergeableNeighboor: (orgine: Tile, x?: number, y?: number) => boolean, findNeighboor: (orgine: Tile, x?: number, y?: number) => Tile | undefined, mergeTiles: (a: Tile, b: Tile) => void) {
	let tiles_to_merge = tiles.length - N

	// Les patterns sont des templates a nombre de tiles fixe (3, parfois 2),
	// donc tiles.length peut depasser N : on fusionne alors des tiles 1x1
	// voisines pour redescendre a exactement N tiles au total.
	const mergeCandidatesY = tiles.filter((t) => t.w === 1 && t.h === 1)
	const mergeCandidatesX = [...mergeCandidatesY]

	// 1er passage : on essaie de fusionner avec le voisin du bas (y = -1).
	while (tiles_to_merge > 0 && mergeCandidatesY.length > 0) {
		const t = mergeCandidatesY[randomInt(random, 0, mergeCandidatesY.length - 1)]

		if (!isMergeableNeighboor(t, 0, -1)) {
			removeFromList(mergeCandidatesY, t)
			continue
		}

		const neighboor = findNeighboor(t, 0, -1)!
		mergeTiles(t, neighboor)
		tiles_to_merge--

		removeFromList(mergeCandidatesY, t)
		removeFromList(mergeCandidatesY, neighboor)
		removeFromList(mergeCandidatesX, t)
		removeFromList(mergeCandidatesX, neighboor)
	}

	// 2eme passage : s'il reste des fusions a faire, on retente avec le
	// voisin de droite (x = 1) sur la liste 1x1 restante.
	while (tiles_to_merge > 0 && mergeCandidatesX.length > 0) {
		const t = mergeCandidatesX[randomInt(random, 0, mergeCandidatesX.length - 1)]

		if (!isMergeableNeighboor(t, 1, 0)) {
			removeFromList(mergeCandidatesX, t)
			continue
		}

		const neighboor = findNeighboor(t, 1, 0)!
		mergeTiles(t, neighboor)
		tiles_to_merge--

		removeFromList(mergeCandidatesX, t)
		removeFromList(mergeCandidatesX, neighboor)
	}
}

export function render(N: number, W = 4) {
	const { L, tiles } = buildLayout(N, W);
	const grid_row = `repeat(${L}, var(--unit))`;

	const cards_row_col = tiles.map((t) => {
		return `
				grid-column: ${t.c + 1} / span ${t.w};
				grid-row: ${t.r + 1} / span ${t.h};
		`
	});

	function get_card_row_col(i: number) {
		return cards_row_col[i]

	}

	return { grid_row, get_card_row_col }
}