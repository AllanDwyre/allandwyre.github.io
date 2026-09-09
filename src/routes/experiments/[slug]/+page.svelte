<script lang="ts">
	import { page } from '$app/state';
	import { getAllExperimentMetas, getExperimentContent } from '$lib/content/experiments';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';

	let slug = $derived(page.params.slug ?? '');
	let meta = $derived(getAllExperimentMetas().find((m) => m.slug === slug));
	let contentPromise = $derived(getExperimentContent(slug));
</script>

<svelte:head>
	<title>{meta ? `${meta.title} — Allan Golding Dwyre` : 'Experiment'}</title>
</svelte:head>

<Breadcrumbs
	links={[
		{ href: '/', text: 'Accueil' },
		{ href: '/#experiments', text: 'Experiments' },
		{ href: '', text: meta?.title ?? slug }
	]}
/>

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

<style lang="scss">
	@use '../../../styles/variables' as *;
	@use '../../../styles/mixins' as *;

	.md-content {
		margin: $spacing-lg auto;
		max-width: 42rem;
		color: $text;
		font-family: $font-main;
		line-height: 1.7;

		:global(h1),
		:global(h2),
		:global(h3) {
			font-family: $font-heading;
			color: $primary;
			margin: $spacing-lg 0 $spacing-sm;
		}

		:global(h1) {
			font-size: $font-size-xl;
		}

		:global(p) {
			margin: $spacing-sm 0;
		}

		:global(a) {
			color: $primary;
			text-decoration: underline;
		}

		:global(ul),
		:global(ol) {
			padding-left: $spacing-md;
			margin: $spacing-sm 0;
		}

		:global(blockquote) {
			border-left: 3px solid $border;
			margin: $spacing-md 0;
			padding-left: $spacing-sm;
			color: $secondary;
			font-style: italic;
		}

		:global(code) {
			font-family: monospace;
			background: $background;
			padding: 0.1em 0.35em;
			border-radius: 0.25em;
		}

		:global(pre) {
			background: $background;
			border: 1px solid $border;
			border-radius: 0.5em;
			padding: $spacing-sm;
			overflow-x: auto;

			:global(code) {
				background: none;
				padding: 0;
			}
		}

		@include for-size(phone) {
			margin: $spacing-md 1rem;
		}
	}
</style>
