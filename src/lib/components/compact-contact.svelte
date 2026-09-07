
<script lang="ts">
	let { invert_color = false } = $props();

	let color = $derived(() => {
		return invert_color ? '#fff' : '#000';
	});

</script>

<div>
	<p style="color: {color};"> L </p>
	<p style="color: {color};"> G </p>
	<p style="color: {color};"> M </p>
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}
</style>