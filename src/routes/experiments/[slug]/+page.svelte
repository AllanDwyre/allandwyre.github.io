<script lang="ts">
	import { page } from '$app/state';
	import { getAllExperimentMetas, getExperimentContent } from '$lib/content/experiments';
	import {
		getExperimentLinks,
		getExperimentInfos,
		formatAutors,
		getCategoryColors,
		getAdjacentExperiments
	} from '$lib/content/experiment-format';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Button from '$lib/components/button.svelte';
	import Divider from '$lib/components/divider.svelte';

	let slug = $derived(page.params.slug ?? '');
	let meta = $derived(getAllExperimentMetas().find((m) => m.slug === slug));
	let contentPromise = $derived(getExperimentContent(slug));

	let infos = $derived(meta ? getExperimentInfos(meta) : []);
	let links = $derived(meta ? getExperimentLinks(meta) : []);
	let formated_autors = $derived(meta ? formatAutors(meta.autors) : '');
	// Meme mapping categorie -> couleur que sur la liste (experiments.svelte),
	// pour que "Deployment" ait toujours la meme couleur partout.
	let category_colors = $derived(meta ? getCategoryColors(meta.categories) : []);
	let adjacent = $derived(getAdjacentExperiments(slug));
</script>

<svelte:head>
	<title>{meta ? `${meta.title} — Allan Golding Dwyre` : 'Experiment'}</title>
</svelte:head>

<div id="vertical-nav"></div>

<main>
	<Breadcrumbs
		links={[
			{ href: '/', text: 'Portfolio' },
			{ href: '/#experiments', text: 'Experiments' },
			{ href: '', text: meta?.title ?? slug }
		]}
	/>

	<header style="background-color: {category_colors[0]};">
		<div class="circle"></div>

		<div class="categories">
			{#each meta?.categories ?? [] as cat, i}
				<span class="category">{cat}</span>
			{/each}
		</div>

		<h2>{meta?.title}</h2>

		<div class="infos">
			{#each infos as info}
				<span><info.icon size={18} /> {info.label}</span>
			{/each}
		</div>

		<div class="teck-stack">
			{#each meta?.tech_stack as tech}
				<span>{tech}</span>
			{/each}
		</div>
	</header>

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

	{#if meta}
		<article class="md-content">
			{#await contentPromise then mod}
				{#if mod}
					{@const Content = mod.default}
					<Content />
				{:else}
					<p>Contenu introuvable.</p>
				{/if}
			{/await}
		</article>
	{:else}
		<p>Cet experiment n'existe pas.</p>
	{/if}

	<Divider />

	<blockquote>
		— {formated_autors}
	</blockquote>

	{#if adjacent}
		<div class="quick_nav">
			<a href="/experiments/{adjacent.prev.slug}" class="project_quick_access left">
				<small>← Previous project</small>
				<p>{adjacent.prev.title}</p>
			</a>

			<a href="/experiments/{adjacent.next.slug}" class="project_quick_access right">
				<small>Next project →</small>
				<p>{adjacent.next.title}</p>
			</a>
		</div>
	{/if}
</main>

<Footer />

<style lang="scss">
	@use '../../../styles/variables' as *;
	@use '../../../styles/mixins' as *;
	// Style de .md-content : voir src/styles/_md.scss
	@use '../../../styles/md';

	#vertical-nav {
		position: fixed;
		top: 11rem;
		right: $spacing-lg;

		display: flex;
		flex-direction: column;

		align-items: flex-end;
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

		.categories {
			display: flex;
			gap: $spacing-xs;

			.category {
				background-color: rgba(#fff, 0.15);
				padding: $spacing-xxs $spacing-xs;
				border-radius: 20px;

				font-size: $font-size-sm;
				font-weight: 700; // bold
			}
		}

		h2 {
			margin: $spacing-xs 0 $spacing-sm 0;
			width: 50%;
			font-weight: 600; // semi bold
			font-family: $font-main;
		}

		.infos {
			display: flex;
			gap: $spacing-xs; // 10px

			font-size: $font-size-sm;
			font-weight: 300; // light
			font-family: $font-main;

			span {
				display: flex;
				align-items: center;
				gap: $spacing-xxs;
			}
		}

		.teck-stack {
			display: flex;
			gap: $spacing-xs; // 10px
			margin-top: $spacing-sm;

			span {
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

			p {
				font-weight: 600;
			}

			&.right {
				align-items: flex-end;
				text-align: right;
			}
		}
	}

	blockquote {
		letter-spacing: 0.02em;
		font-weight: 300; // Light

		margin: $spacing-md 0;
	}
</style>
