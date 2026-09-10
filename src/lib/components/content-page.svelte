<script lang="ts">
	import { tick, type Snippet, type Component } from 'svelte';
	import { extractHeadingAnchors, type Heading } from '$lib/utils/headings';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Button from '$lib/components/button.svelte';
	import Divider from '$lib/components/divider.svelte';

	interface QuickLink {
		icon: Component;
		content: string;
		href: string;
		secondary: boolean;
	}

	interface AdjacentEntry {
		slug: string;
		title: string;
	}

	let {
		title,
		breadcrumbLinks,
		headerColor,
		header,
		links = [],
		hasContent,
		Content,
		emptyText,
		authorsText,
		adjacent,
		basePath,
		entityName
	}: {
		title: string;
		breadcrumbLinks: { href: string; text: string }[];
		headerColor?: string;
		header: Snippet;
		links?: QuickLink[];
		hasContent: boolean;
		Content?: Component;
		emptyText: string;
		authorsText: string;
		adjacent: { prev: AdjacentEntry; next: AdjacentEntry } | null;
		basePath: string;
		entityName: string;
	} = $props();

	let headings = $state<Heading[]>([]);
	let activeId = $state<string | null>(null);

	function updateActiveHeading() {
		const threshold = 300; // px depuis le haut du viewport

		let current: string | null = null;
		for (const heading of headings) {
			const el = document.getElementById(heading.id);
			if (el && el.getBoundingClientRect().top <= threshold) {
				current = heading.id;
			}
		}
		activeId = current;
	}

	// Recalcule les headings a chaque changement de contenu (nouveau slug).
	// Le contenu est deja resolu par +page.ts avant que SvelteKit ne bascule
	// le DOM (voir le load()), donc plus besoin d'attendre une promesse ici :
	// juste un tick() pour laisser <Content/> se monter avant de lire le DOM.
	$effect(() => {
		const currentContent = Content;
		let cancelled = false;

		tick().then(() => {
			if (!cancelled) {
				headings = extractHeadingAnchors('.md-content');
				updateActiveHeading();
			}
		});

		window.addEventListener('scroll', updateActiveHeading, { passive: true });

		return () => {
			cancelled = true;
			headings = [];
			window.removeEventListener('scroll', updateActiveHeading);
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<nav id="vertical-nav" class="no-phone">
	{#each headings as heading}
		<a href="#{heading.id}" class="nav-item" class:active={activeId === heading.id}>
			<span class="bar"></span>
			<span class="label">{heading.text}</span>
		</a>
	{/each}
</nav>

<main>
	<Breadcrumbs links={breadcrumbLinks} />

	<header style="background-color: {headerColor};">
		<div class="circle"></div>
		{@render header()}
	</header>

	{#if links.length > 0}
		<section class="links">
			{#each links as link}
				<Button
					icon={link.icon}
					content={link.content}
					onclick={() => window.open(link.href, '_blank', 'noopener')}
					secondary={link.secondary}
				/>
			{/each}
		</section>
	{/if}

	{#if hasContent}
		<article class="md-content">
			{#if Content}
				<Content />
			{:else}
				<p>Contenu introuvable.</p>
			{/if}
		</article>
	{:else}
		<p>{emptyText}</p>
	{/if}

	<Divider />

	<blockquote>
		— {authorsText}
	</blockquote>

	{#if adjacent}
		<div class="quick_nav">
			<a href="{basePath}/{adjacent.prev.slug}" class="project_quick_access left">
				<small>← Previous {entityName}</small>
				<p>{adjacent.prev.title}</p>
			</a>

			<a href="{basePath}/{adjacent.next.slug}" class="project_quick_access right">
				<small>Next {entityName} →</small>
				<p>{adjacent.next.title}</p>
			</a>
		</div>
	{/if}
</main>

<Footer />

<style lang="scss">
	@use '../../styles/variables' as *;
	@use '../../styles/mixins' as *;
	// Style de .md-content : voir src/styles/_md.scss
	@use '../../styles/md';

	#vertical-nav {
		position: fixed;
		top: 11rem;
		right: $spacing-lg;

		display: flex;
		flex-direction: column;
		align-items: flex-end;
		user-select: none;

		.nav-item {
			position: relative;
			display: flex;
			align-items: center;
			text-decoration: none;

			padding-block: $spacing-xxs;
			padding-left: $spacing-lg;
			transition: padding-block 250ms ease;

			.bar {
				width: 28px;
				height: 2px;
				background-color: rgba($secondary, 0.35);
				transition:
					background-color 250ms ease,
					width 250ms ease;
			}

			.label {
				position: absolute;
				right: calc(100% + #{$spacing-xs});

				font-size: $font-size-sm;
				color: $primary;
				white-space: nowrap;

				opacity: 0;
				transform: translateX(4px);
				pointer-events: none;
				transition:
					opacity 200ms ease,
					transform 200ms ease;
			}

			&:hover {
				.bar {
					background-color: $primary;
					width: 36px;
				}
				.label {
					opacity: 1;
					transform: translateX(0);
				}
			}

			&.active .bar {
				background-color: $primary;
				width: 36px;
			}
		}

		&:hover .nav-item {
			padding-block: $spacing-xs;
		}
	}

	main {
		// Design de reference : 1440px de large, contenu a 60% -> 864px.
		// Le cap est une valeur fixe (pas de vw) : combine a `margin: auto`,
		// ca grignote tout seul l'espace vide au fur et a mesure qu'on
		// retrecit l'ecran (width:auto + max-width fixe = min(max-width, 100%
		// du parent)), jusqu'a ne laisser qu'une marge plancher de
		// $spacing-lg de chaque cote (au lieu de coller le contenu aux bords).
		max-width: min(864px, calc(100% - #{$spacing-lg * 2}));
		margin: $spacing-xxl auto;
	}

	header {
		display: flex;
		flex-direction: column;

		border-radius: $spacing-md;

		padding: $spacing-lg;
		color: white;

		position: relative;
		overflow: hidden;

		:global(.categories) {
			display: flex;
			gap: $spacing-xs;

			:global(.category) {
				background-color: rgba(#fff, 0.15);
				padding: $spacing-xxs $spacing-xs;
				border-radius: 20px;

				font-size: $font-size-sm;
				font-weight: 700; // bold
			}
		}

		:global(h2) {
			margin: $spacing-xs 0 $spacing-sm 0;
			width: 50%;
			font-weight: 600; // semi bold
			font-family: $font-main;
		}

		:global(.infos) {
			display: flex;
			gap: $spacing-xs; // 10px

			font-size: $font-size-sm;
			font-weight: 300; // light
			font-family: $font-main;

			:global(span) {
				display: flex;
				align-items: center;
				gap: $spacing-xxs;
			}
		}

		:global(.teck-stack) {
			display: flex;
			gap: $spacing-xs; // 10px
			margin-top: $spacing-sm;

			:global(span) {
				padding: $spacing-xxs $spacing-xs;
				border-radius: 6px;
				background-color: rgba(#000, 0.15);
			}
		}

		.circle {
			--size: min(20cqw, 20cqh);
			--offset: calc(min(5cqw, 5cqh) * -1);

			position: absolute;
			bottom: var(--offset);
			right: var(--offset);
			width: var(--size);
			height: var(--size);
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.25);

			transform-origin: center center;
		}

		// Le header prend toute la largeur de l'ecran sur phone, sans etre
		// borne par le max-width/margin de <main> : on "casse" le conteneur
		// avec une marge negative egale a la marge laterale plancher de
		// <main> ($spacing-lg), et on retire l'arrondi qui n'a plus de sens
		// une fois colle aux bords de l'ecran.
		@include for-size(phone) {
			margin-inline: -#{$spacing-lg};
			border-radius: 0;
		}
	}

	.links {
		display: flex;
		margin: $spacing-lg 0;

		gap: $spacing-xs;
	}

	.quick_nav {
		display: flex;
		gap: $spacing-lg;

		margin: $spacing-lg 0;

		.project_quick_access {
			display: flex;
			flex-direction: column;
			gap: $spacing-xxs;

			width: 100%;
			padding: $spacing-sm $spacing-md;

			background-color: rgba(white, 0.6);
			border-radius: 10px;
			color: $primary;

			text-decoration: none;

			transition: all 150ms ease-in;

			p {
				font-weight: 600;
			}

			&.right {
				align-items: flex-end;
				text-align: right;
			}

			&:hover {
				transform: scale(1.05);
			}
		}
	}

	blockquote {
		letter-spacing: 0.02em;
		font-weight: 300; // Light

		margin: $spacing-md 0;
	}
</style>
