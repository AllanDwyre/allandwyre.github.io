// ------------------------------------------------------------------
// EXACT TILING ALGORITHM
// Guarantees a W-column grid is filled with zero gaps using only
// 1x1, 1x2 (vertical) and 2x1 (horizontal) tiles, for any N >= 2.
//
// 1) Pick the smallest row count L such that the "double" tile count
//    k = W*L - N satisfies 0 <= k <= N (area must match exactly: k
//    double-tiles (area 2) + (N-k) single tiles (area 1) = W*L cells).
// 2) Start from a trivial full tiling: every row split into W/2
//    horizontal dominoes (2L such block-pairs). That's the maximum
//    possible number of doubles for this grid.
// 3) "Break" (2L - k) of those dominoes into two 1x1 tiles each, to
//    bring the double-count down to exactly k.
// 4) For visual variety, re-orient some remaining unbroken dominoes
//    into vertical 1x2 pairs (swaps two rows, same tile count either
//    way — purely cosmetic, doesn't change k).
// Tile count always comes out to exactly N by construction, so every
// project maps 1:1 to a tile and every cell is covered.
// ------------------------------------------------------------------
interface Block {
	r: number;
	c0: number;
	/** domino cassé en deux tuiles 1x1 (étape 3) */
	broken?: boolean;
	/** domino réorienté en tuile verticale 1x2 avec celui du dessous (étape 4) */
	verticalPair?: boolean;
	/** domino du dessous d'une verticalPair, absorbé et ignoré à la génération finale */
	consumed?: boolean;
}

function buildLayout(N: number, W = 4) {
	if (N <= 0) return { L: 0, tiles: [], filler: [] };

	if (N === 1) {
		// degenerate case: a single tile can cover at most 2 cells, so a
		// lone project can't tile a W-wide row by itself. We give it a
		// full-width hero row instead of leaving 2 empty cells.
		return { L: 1, tiles: [{ r: 0, c: 0, w: W, h: 1 }], filler: [] };
	}

	let L = Math.ceil(N / W);
	let k;
	while (true) {
		k = W * L - N;
		if (k >= 0 && k <= N) break;
		L++;
	}

	// Edge case: when N is an exact multiple of W, the minimal L forces
	// k = 0 — meaning every tile is a 1x1 and the grid loses all visual
	// variety (no 1x2 / 2x1 anywhere). Give it one extra row instead so
	// there's room for at least W double-tiles. Still zero gaps: the
	// area math (k = W*L - N) still holds for the new L.
	if (k === 0) {
		L += 1;
		k = W * L - N;
	}

	// Step 2: trivial full horizontal-domino tiling
	const halfW = W / 2; // assumes even W (4 or 2)
	const blocks: Block[] = [];
	for (let r = 0; r < L; r++) {
		for (let p = 0; p < halfW; p++) {
			blocks.push({ r, c0: p * 2 });
		}
	}
	const total = blocks.length; // = halfW * L
	const breakCount = total - k;
	const breakIdx = new Set();
	for (let i = 0; i < breakCount; i++) {
		breakIdx.add(Math.floor(i * total / Math.max(breakCount, 1)));
	}
	blocks.forEach((b, i) => { b.broken = breakIdx.has(i); });

	// Step 4: cosmetic vertical re-orientation for unbroken pairs
	const byColRow = new Map<string, Block>(); // key `${c0}-${r}` -> block
	blocks.forEach(b => byColRow.set(`${b.c0}-${b.r}`, b));
	for (let p = 0; p < halfW; p++) {
		const c0 = p * 2;
		for (let r = 0; r < L - 1; r += 2) {
			const top = byColRow.get(`${c0}-${r}`);
			const bot = byColRow.get(`${c0}-${r + 1}`);
			if (top && bot && !top.broken && !bot.broken) {
				top.verticalPair = true;
				bot.consumed = true;
			}
		}
	}

	const tiles = [];
	for (const b of blocks) {
		if (b.consumed) continue;
		if (b.verticalPair) {
			tiles.push({ r: b.r, c: b.c0, w: 1, h: 2 });
			tiles.push({ r: b.r, c: b.c0 + 1, w: 1, h: 2 });
		} else if (b.broken) {
			tiles.push({ r: b.r, c: b.c0, w: 1, h: 1 });
			tiles.push({ r: b.r, c: b.c0 + 1, w: 1, h: 1 });
		} else {
			tiles.push({ r: b.r, c: b.c0, w: 2, h: 1 });
		}
	}
	// sort in reading order so project #1 lands top-left, etc.
	tiles.sort((a, b) => a.r - b.r || a.c - b.c);
	return { L, tiles, filler: [] };
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