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

		margin-top: auto;
	}

	.band {
		width: 100%;
		height: 1.1rem;
		transform: translateY(100%);
		opacity: 0;
		transition:
			transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.5s ease-out;

		&:nth-child(1) {
			background-color: $color-yellow;
			transition-delay: 0.18s;
		}
		&:nth-child(2) {
			background-color: $color-light-orange;
			transition-delay: 0.12s;
		}
		&:nth-child(3) {
			background-color: $color-orange;
			transition-delay: 0.06s;
		}
		&:nth-child(4) {
			background-color: $color-red;
			transition-delay: 0s;
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

	footer.in-view .band {
		transform: translateY(0);
		opacity: 1;
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
