<script lang="ts">
	import { page } from '$app/state';
	import {
		getExperimentLinks,
		getExperimentInfos,
		formatAutors,
		getCategoryColors,
		getAdjacentExperiments
	} from '$lib/content/experiment-format';
	import ContentPage from '$lib/components/content-page.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let slug = $derived(page.params.slug ?? '');
	let meta = $derived(data.meta);
	let Content = $derived(data.mod?.default);

	let infos = $derived(meta ? getExperimentInfos(meta) : []);
	let links = $derived(meta ? getExperimentLinks(meta) : []);
	let formated_autors = $derived(meta ? formatAutors(meta.autors) : '');
	// Meme mapping categorie -> couleur que sur la liste (experiments.svelte),
	// pour que "Deployment" ait toujours la meme couleur partout.
	let category_colors = $derived(meta ? getCategoryColors(meta.categories) : []);
	let adjacent = $derived(getAdjacentExperiments(slug));
</script>

<ContentPage
	title={meta ? `${meta.title} — Allan Golding Dwyre` : 'Experiment'}
	breadcrumbLinks={[
		{ href: '/', text: 'Portfolio' },
		{ href: '/#experiments', text: 'Experiments' },
		{ href: '', text: meta?.title ?? slug }
	]}
	headerColor={category_colors[0]}
	{links}
	hasContent={!!meta}
	{Content}
	emptyText="Cet experiment n'existe pas."
	authorsText={formated_autors}
	{adjacent}
	basePath="/experiments"
	entityName="project"
>
	{#snippet header()}
		<div class="categories">
			{#each meta?.categories ?? [] as cat}
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
			{#each meta?.tech_stack ?? [] as tech}
				<span>{tech}</span>
			{/each}
		</div>
	{/snippet}
</ContentPage>
