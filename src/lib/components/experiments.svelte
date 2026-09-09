<script lang="ts">
	import { getAllExperimentMetas } from '$lib/content/experiments';
	import { render } from '$lib/utils/create_layout';
	import ExperimentCard from './experiment-card.svelte';

	const colors = [
		'var(--color-red)',
		'var(--color-orange)',
		'var(--color-light-orange)',
		'var(--color-yellow)',
		'var(--color-dark-blue)',
		'var(--color-light-blue)',
		'var(--color-blue)'
	];

	const metas = getAllExperimentMetas();

	const categories = Array.from(
		new Set(metas.flatMap((m) => m.categories).sort((a, b) => a.localeCompare(b)))
	);
	let filters = ['All'].concat(categories);

	// Mapping cat -> couleur, piochée dans `colors` (cycle si plus de catégories que de couleurs)
	const category_colors = new Map(categories.map((cat, i) => [cat, colors[i % colors.length]]));

	const metas_with_colors = metas.map((m) => ({
		...m,
		colors: m.categories.map((cat) => category_colors.get(cat)!)
	}));

	let active_filter = $state('All');

	let filtered = $derived(
		active_filter === 'All'
			? metas_with_colors
			: metas_with_colors.filter((m) => m.categories.includes(active_filter))
	);
	let { grid_row, get_card_row_col } = $derived(render(filtered.length, 4));
</script>

<section class="experiments-wrapper">
	<div id="experiments" class="experiments-header">
		<h2>Experiments</h2>
		<div class="experiments_filters no-phone">
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

	<div class="grid" style="grid-template-rows: {grid_row};">
		{#each filtered as meta, i}
			<ExperimentCard {meta} style={get_card_row_col(i)} />
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

		margin: $spacing-xxl 9rem;

		@include for-size(tablet) {
			margin: $spacing-xl 3rem;
			grid-template-columns: repeat(2, 1fr);
		}

		@include for-size(phone) {
			grid-template-columns: repeat(1, 1fr);
			gap: $spacing-sm;
			margin: $spacing-xl 0;
		}
	}
</style>
