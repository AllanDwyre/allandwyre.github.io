
<script>
	import CompactContact from '$lib/components/compact-contact.svelte';
</script>

<footer>
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
	<div class="info">
		<p> @2026, Allan Golding Dwyre</p>
		<CompactContact invert_color={true}/>
	</div>
</footer>

<!-- Syncronize the date with the last modified date of the project. This is a placeholder for now. -->

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	footer {
		background-color: $background;
		border-top: 1px solid $border;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
	}
	
	.band {
		width: 100%;
		height: 1.1rem;

		&:nth-child(1) { background-color: $color-yellow; }
		&:nth-child(2) { background-color: $color-light-orange; }
		&:nth-child(3) { background-color: $color-orange; }
		&:nth-child(4) { background-color: $color-red; }

	}

	.info {
		position: absolute;
		bottom: 0;
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 2rem;
		color: #fff;
	}

</style>