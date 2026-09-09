<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/button.svelte';
	import { downloadCV } from '$lib/utils/download.js';

	import CompactContact from './compact-contact.svelte';
	import { Laptop, MapPinHouse, LaptopMinimalCheck, ArrowBigDownDash } from '@lucide/svelte';

	const status = [
		{
			icon: Laptop,
			title: 'Recent Experience',
			text: 'AI Engineer Internship at VIDAL France'
		},
		{
			icon: MapPinHouse,
			title: 'Location',
			text: 'Paris, France'
		},
		{
			icon: LaptopMinimalCheck,
			title: 'Open to',
			text: 'Full-time roles, Sept 2026'
		}
	];

	let coverLetterElement: HTMLElement;
	let ticking = false;

	function updateProgress() {
		if (!coverLetterElement) return;

		const rect = coverLetterElement.getBoundingClientRect();
		const vh = window.innerHeight;

		// début : l'élément touche le bas du viewport -> progress 0
		const start = vh;
		// fin : l'élément atteint le centre du viewport -> progress 1
		const end = vh / 2 - rect.height / 2;

		let progress = (start - rect.top) / (start - end);
		progress = Math.min(1, Math.max(0, progress));

		coverLetterElement.style.setProperty('--progress', progress.toString());
		ticking = false;
	}

	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(updateProgress);
			ticking = true;
		}
	}

	onMount(() => {
		updateProgress();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<section class="hero-header">
	<h1 class="no-phone fade-in-item">
		Passionate about building <span>AI models</span> and deploying them.
	</h1>
	<div class="profil">
		<img src="/profil.png" alt="Allan Golding Dwyre profile" class="header-image" />
		<div class="fade-in-item">
			<CompactContact />
		</div>
		<div class="only-phone" style="margin: 2rem 0;">
			<Button icon={ArrowBigDownDash} content="Download Resume" onclick={() => downloadCV()} />
		</div>
	</div>
</section>

<section class="info">
	{#each status as item}
		<div class="status-item">
			<item.icon color="#000" />
			<p class="item-title">{item.title}</p>
			<p>{item.text}</p>
		</div>
	{/each}
</section>

<section class="cover-letter" bind:this={coverLetterElement} style="--progress: 0">
	<p class="letter">
		As a graduate of the IASD (Artificial Intelligence and Data Science) Master's program at the
		University of Montpellier, I design systems that transform raw data into tangible value. From
		training a model to deploying it in production. I'm just as interested in a model's performance
		as I am in its reliability once it's in actual use: impact analysis, monitoring, and document
		retrieval. This portfolio showcases my projects across these five areas, rather than serving as
		a traditional resume.
	</p>
	<small>— Allan</small>
</section>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;
	@use '../../styles/_mixins.scss' as *;

	.hero-header {
		display: flex;
		justify-content: space-between;

		margin-bottom: 5rem;

		h1 {
			color: $color-red;
			line-height: 1.2;
			width: 35dvw;

			span {
				font-family: $font-main;
				font-style: italic;
				font-weight: 400;
			}
		}

		.profil {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		@include for-size(phone) {
			flex-direction: column-reverse;

			h1 {
				margin-top: 2rem;
				width: 100%;
			}
		}
	}
	// h1 et le wrapper autour de CompactContact : jamais un ancêtre de
	// .header-image, donc peuvent fade-in sans perturber la View Transition
	.fade-in-item {
		animation: fade-in 0.6s ease-out both;
	}

	.header-image {
		aspect-ratio: 1 / 1;
		height: clamp(10rem, 20vw, 13.875rem);
		width: clamp(10rem, 20vw, 13.875rem);
		object-fit: cover;
		border-radius: 50%;
		flex-shrink: 0;

		view-transition-name: profil-photo;
	}

	.info {
		display: flex;
		gap: $spacing-xxl;
		font-size: $font-size-lg;

		animation: fade-in 0.6s ease-out 0.15s both;

		.item-title {
			font-family: $font-heading;
			font-weight: bold;
			color: $primary;
		}

		@include for-size(phone) {
			flex-direction: column;
			gap: $spacing-sm;
			font-size: $font-size-base;
		}
	}

	.cover-letter {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: clamp(20rem, 43dvw, 43.75rem);
		margin: 0 auto;

		.letter {
			font-size: $font-size-lg;
			color: $primary;
			line-height: 1.5;
			letter-spacing: 0.04em;

			animation: fade-in 0.6s ease-out 0.3s both;

			@include for-size(phone) {
				font-size: $font-size-base;
			}
		}

		small {
			animation: fade-in 0.6s ease-out 0.45s both;
		}

		--offset-y: -40dvh;

		opacity: calc(0.15 + 0.85 * var(--progress, 0));
		filter: blur(calc((1 - var(--progress, 0)) * 10px));
		transform: translateY(calc((1 - var(--progress, 0)) * var(--offset-y)))
			scale(calc(0.85 + 0.15 * var(--progress, 0)));

		will-change: opacity, filter, transform;
	}

	@media (prefers-reduced-motion: reduce) {
		.cover-letter {
			opacity: 1;
			filter: none;
			transform: none;
		}
	}
</style>
