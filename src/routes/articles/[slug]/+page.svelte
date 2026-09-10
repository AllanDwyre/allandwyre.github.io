<script lang="ts">
	import { page } from '$app/state';
	import {
		getArticleLinks,
		getArticleInfos,
		formatAutors,
		getCategoryColor,
		getAdjacentArticles
	} from '$lib/content/article-format';
	import ContentPage from '$lib/components/content-page.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let slug = $derived(page.params.slug ?? '');
	let meta = $derived(data.meta);
	let Content = $derived(data.mod?.default);

	let infos = $derived(meta ? getArticleInfos(meta) : []);
	let links = $derived(meta ? getArticleLinks(meta) : []);
	let formated_autors = $derived(meta ? formatAutors(meta.autors) : '');
	// Meme mapping categorie -> couleur que la liste (articles.svelte) ET que
	// les experiments, pour qu'une categorie garde toujours la meme couleur.
	let header_color = $derived(meta ? getCategoryColor(meta.category) : undefined);
	let adjacent = $derived(getAdjacentArticles(slug));
</script>

<ContentPage
	title={meta ? `${meta.title} — Allan Golding Dwyre` : 'Article'}
	breadcrumbLinks={[
		{ href: '/', text: 'Portfolio' },
		{ href: '/#article', text: 'Articles' },
		{ href: '', text: meta?.title ?? slug }
	]}
	headerColor={header_color}
	{links}
	hasContent={!!meta}
	{Content}
	emptyText="Cet article n'existe pas."
	authorsText={formated_autors}
	{adjacent}
	basePath="/articles"
	entityName="article"
>
	{#snippet header()}
		<div class="categories">
			<span class="category">{meta?.category}</span>
		</div>

		<h2>{meta?.title}</h2>

		<div class="infos">
			{#each infos as info}
				<span><info.icon size={18} /> {info.label}</span>
			{/each}
		</div>
	{/snippet}
</ContentPage>
