<script lang="ts">
	import { getAllExperimentMetas } from '$lib/content/experiments';
	import { getAllCategories, getCategoryColors } from '$lib/content/experiment-format';
	import { render } from '$lib/utils/create_layout';
	import { createDeviceMode } from '$lib/utils/viewport.svelte';
	import type { Category } from '$lib/content/types';
	import ExperimentCard from './experiment-card.svelte';

	const device = createDeviceMode();

	const metas = getAllExperimentMetas();

	const categories = getAllCategories();
	let filters: ('All' | Category)[] = ['All', ...categories];

	const metas_with_colors = metas.map((m) => ({
		...m,
		colors: getCategoryColors(m.categories)
	}));

	let active_filter = $state<'All' | Category>('All');

	let filtered = $derived.by(() => {
		const filter = active_filter;
		return filter === 'All'
			? metas_with_colors
			: metas_with_colors.filter((m) => m.categories.includes(filter));
	});
	// Le layout "grille asymetrique" de create_layout n'a de sens qu'avec 4
	// colonnes (desktop). Sur phone/tablet la grille CSS retombe deja sur
	// 1 ou 2 colonnes uniformes : pas besoin (et pas correct) d'y appliquer
	// des grid-column/row calcules pour 4 colonnes.
	let { grid_row, get_card_row_col } = $derived(
		device.current === 'desktop'
			? render(filtered.length, 4)
			: { grid_row: '', get_card_row_col: () => '' }
	);
</script>

<section class="experiments-wrapper">
	<div id="experiments" class="experiments-header">
		<h2>Experiments</h2>
		<div class="experiments_filters no-tablet">
			{#each filters as filter}
				<button
					type="button"
					class:active={filter === active_filter}
					onclick={() => (active_filter = filter)}
				>
					{filter}
				</button>
			{/each}
		</div>
	</div>

	<div class="grid" style={device.current === 'desktop' ? `grid-template-rows: ${grid_row};` : ''}>
		{#each filtered as meta, i}
			<ExperimentCard {meta} style={device.current === 'desktop' ? get_card_row_col(i) : ''} />
		{/each}
	</div>
</section>

<style lang="scss">
	@use '../../styles/variables' as *;
	@use '../../styles/mixins' as *;

	:root {
		--unit: clamp(12rem, 13.5dvw, 31rem);
	}

	.experiments-wrapper {
		min-height: calc(100dvh - $main-nav-height - 1rem);
	}

	.experiments-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $primary;

		margin: $spacing-md 0;
		scroll-margin-top: 6rem;

		.experiments_filters {
			display: flex;
			letter-spacing: 0.02em;
			gap: 1rem;

			button {
				appearance: none;
				background: none;
				border: none;
				padding: 0;
				font: inherit;
				color: inherit;
				cursor: pointer;
				transition: all 300ms ease-in;

				&.active,
				&:hover {
					font-weight: bold;
				}
			}
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);

		grid-auto-rows: var(--unit);
		gap: $spacing-lg;

		margin: $spacing-xxl clamp(1rem, 10vw, 9rem);

		@include for-size(tablet) {
			margin: $spacing-xl 1rem;
			grid-template-columns: repeat(2, 1fr);
		}

		@include for-size(phone) {
			grid-template-columns: repeat(1, 1fr);
			gap: $spacing-sm;
			margin: $spacing-xl 0;
		}
	}
</style>
