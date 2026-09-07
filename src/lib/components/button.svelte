<script lang="ts">
	let { content, click_action } = $props();
</script>

<button onclick={click_action}>{content}</button>

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
