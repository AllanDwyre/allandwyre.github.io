<script lang="ts">
	let { links = [] } = $props();
</script>

<div class="breadcrumbs">
	{#each links as link, index}
		<a href={link.href} class="breadcrumb-link">{link.text}</a>
		{#if index < links.length - 1}
			<span class="breadcrumb-separator">/</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 0.0125rem;
		font-size: 1rem;
		color: $text;

		margin-bottom: 1rem;
	}

	.breadcrumb-link {
		text-decoration: none;
		color: $primary;

		padding: 0.15rem 0.4rem;
		border-radius: 0.2rem;

		transition: background-color 0.3s ease;

		&:hover {
			background-color: rgba($color-light-blue, 0.1);
		}
	}

	.breadcrumb-separator {
		cursor: pointer;
		padding: 0.15rem 0.4rem;
		border-radius: 0.2rem;

		&:hover {
			background-color: rgba(#fff, 0.25);
		}
	}
</style>
