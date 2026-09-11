<script lang="ts">
	import ArticleCard from './article-card.svelte';
	import { getAllArticleMetas } from '$lib/content/articles';
	import { getCategoryColor } from '$lib/content/category-colors';

	const metas = getAllArticleMetas();

	const metas_with_colors = metas.map((m) => ({
		...m,
		color: getCategoryColor(m.category)
	}));
</script>

<section class="article">
	<div id="article" class="article-header">
		<h2>Blogs & Articles</h2>
	</div>

	<div class="grid">
		{#each metas_with_colors as meta}
			<ArticleCard {meta} />
		{/each}
	</div>
</section>

<style lang="scss">
	@use '../../styles/variables' as *;
	@use '../../styles/mixins' as *;

	.article {
		// min-height: calc(100dvh - $main-nav-height - 1rem);
		min-height: calc(70dvh - $main-nav-height - 1rem);
	}

	.article-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $primary;

		margin: $spacing-md 0;
		scroll-margin-top: 6rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
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
