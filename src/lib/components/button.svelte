<script lang="ts">
	let { content, icon: Icon = null, onclick, secondary = false } = $props();
</script>

<button {onclick} class:secondary>
	{#if Icon}
		<Icon />
	{/if}
	<span>{content}</span>
</button>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	button {
		display: flex;
		align-items: center;
		gap: $spacing-xs;

		background-color: $primary;
		color: #fff;

		border: none;
		padding: $spacing-xs 0.875rem;
		border-radius: $spacing-xs;

		cursor: pointer;

		font-size: $font-size-lg;
		font-weight: bold;
		text-decoration: none;
	}

	.secondary {
		background-color: transparent;
		color: $primary;

		border: 2px solid $primary;
	}
</style>
