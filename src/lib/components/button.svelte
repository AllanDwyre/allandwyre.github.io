<script lang="ts">
	let { content, icon: Icon = null, onclick } = $props();
</script>

<button {onclick}>
	<Icon />
	<span>{content}</span>
</button>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	button {
		display: flex;
		align-items: center;
		gap: $spacing-xs;

		background-color: #000;
		color: #fff;

		border: none;
		padding: $spacing-xs 0.875rem;
		border-radius: $spacing-xs;

		cursor: pointer;

		font-size: $font-size-lg;
		font-weight: bold;
		text-decoration: none;
	}
</style>
