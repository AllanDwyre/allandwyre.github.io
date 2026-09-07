<script lang="ts">
	let { content, onclick } = $props();
</script>

<button {onclick}>{content}</button>

<style lang="scss">
	button {
		background-color: #000;
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: bold;
		text-decoration: none;
		display: inline-block;
	}
</style>
