<script lang="ts">
	import { onMount } from 'svelte';
	import CompactContact from '$lib/components/compact-contact.svelte';

	let footerEl: HTMLElement;
	let inView = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// on retire puis remet la classe -> l'animation CSS se rejoue
				// à chaque fois que le footer entre dans le viewport
				inView = entry.isIntersecting;
			},
			{ threshold: 0.25 }
		);

		observer.observe(footerEl);

		return () => observer.disconnect();
	});
</script>

<footer bind:this={footerEl} class:in-view={inView}>
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
	<div class="info">
		<p>@2026, Allan Golding Dwyre</p>
		<CompactContact invert_color={true} />
	</div>
</footer>

<!-- Syncronize the date with the last modified date of the project. This is a placeholder for now. -->

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	footer {
		background-color: $background;
		position: relative;
		overflow: hidden;

		margin-top: 15rem;
	}

	// Bandes au repos : aplaties depuis la gauche, pas encore peintes.
	// Au lieu de tomber/rebondir, elles se "peignent" horizontalement,
	// comme un coup de pinceau confiant - plus sobre et plus proche de
	// l'identite "swatch de couleurs" du bloc que du jouet elastique.
	// Le decalage entre bandes cree un balayage en diagonale plutot qu'un
	// aplat qui apparait d'un bloc.
	.band {
		width: 100%;
		height: 1.1rem;
		transform-origin: left center;
		transform: scaleX(0);
		opacity: 0;

		&:nth-child(1) {
			background-color: $color-yellow;
		}
		&:nth-child(2) {
			background-color: $color-light-orange;
		}
		&:nth-child(3) {
			background-color: $color-orange;
		}
		&:nth-child(4) {
			background-color: $color-red;
		}
	}

	// Sortie de vue : reset rapide et sans decalage. Si l'entree partageait
	// le meme stagger (jusqu'a 0.24s), un aller-retour scroll up/down rapide
	// n'avait pas le temps de repasser par un etat propre avant de rejouer
	// l'entree - l'anim semblait "coincee" a mi-chemin.
	footer:not(.in-view) .band {
		transition:
			transform 0.2s ease-in,
			opacity 0.15s ease-in;
	}

	// Entree : le balayage soigne, avec son decalage diagonal.
	footer.in-view .band {
		transform: scaleX(1);
		opacity: 1;
		transition:
			transform 0.7s cubic-bezier(0.76, 0, 0.24, 1),
			opacity 0.3s ease-out;

		&:nth-child(1) {
			transition-delay: 0.24s, 0.24s;
		}
		&:nth-child(2) {
			transition-delay: 0.16s, 0.16s;
		}
		&:nth-child(3) {
			transition-delay: 0.08s, 0.08s;
		}
		&:nth-child(4) {
			transition-delay: 0s, 0s;
		}
	}

	.info {
		position: absolute;
		bottom: 0;
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 2rem;
		color: #fff;

		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.5s ease-out 0.28s,
			transform 0.5s ease-out 0.28s;
	}

	footer.in-view .info {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.band,
		.info {
			transition: none !important;
		}
	}
</style>
