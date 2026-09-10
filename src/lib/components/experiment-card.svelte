<script lang="ts">
	let { meta, style } = $props();

	// Offset = 20% du plus petit côté (même principe que la taille du circle)
	const offset = 'calc(min(20cqw, 20cqh) * -1)';

	// Position aléatoire du circle dans l'un des 3 coins possibles
	const corners = [
		`top: ${offset}; left: ${offset};`,
		`top: ${offset}; right: ${offset};`,
		`bottom: ${offset}; right: ${offset};`
	];
	const circle_style = corners[Math.floor(Math.random() * corners.length)];
</script>

<a href="/experiments/{meta.slug}" class="card" style="background:{meta.colors[0]}; {style}">
	<span class="circle" style={circle_style}></span>
	<span class="categories">{meta.categories.join(' · ')}</span>
	<span class="title">
		{meta.title}
		{#if meta.favorite}★{/if}
	</span>
</a>

<style lang="scss">
	@use '../../styles/variables' as *;
	@use '../../styles/mixins' as *;

	.card {
		cursor: pointer;

		position: relative;
		overflow: hidden;
		container-type: size;

		border-radius: 9px;

		display: flex;
		flex-direction: column;

		justify-content: flex-end;
		align-items: flex-start;

		padding: clamp(0.75rem, 6cqi, $spacing-md);

		overflow: hidden;

		color: #fff;
		text-decoration: none;

		transition: transform 300ms ease-in;

		.title {
			// Slope reduite (7cqi -> 2.5cqi) et range resserree : le texte ne
			// doit plus varier fort selon la taille propre de la card, juste
			// s'ajuster un peu sur les tres petites/tres grandes tiles.
			font-size: clamp(1rem, 2.5cqi, 1.25rem);
			font-weight: 600; // semi-bold

			line-height: 1.25;
			letter-spacing: 0.02em;
		}

		.categories {
			font-size: clamp(0.75rem, 1.5cqi, $font-size-base);
			opacity: 0.8;
		}

		.circle {
			position: absolute;
			width: min(70cqw, 70cqh);
			height: min(70cqw, 70cqh);
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.25);

			transform-origin: center center;
			transition: transform 500ms ease-in-out;
		}

		&:hover {
			transform: scale(1.02);
			// box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

			.circle {
				transform: scale(5);
			}
		}
	}
</style>
