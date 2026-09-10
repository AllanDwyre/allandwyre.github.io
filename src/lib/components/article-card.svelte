<script lang="ts">
	let { meta } = $props();
</script>

<a href="/articles/{meta.slug}" class="card">
	<small class="category" style="color: {meta.color};">{meta.category}</small>
	<p>{meta.title}</p>
	<small class="reading-time">{meta.reading_time} mins read</small>
</a>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	.card {
		width: 100%;
		padding: $spacing-xs;
		background-color: rgba(white, 0.6);

		border-radius: 0.5rem;

		display: block;
		text-decoration: none;

		transition:
			transform 300ms ease-in,
			background-color 300ms ease-in;

		&:hover {
			transform: scale(1.02);
			background-color: rgba(white, 0.85);
		}

		.category {
			font-size: $font-size-sm;
			letter-spacing: 0.02em;
			font-weight: 600; //semi bold
		}

		p {
			letter-spacing: 0.02em;
			font-weight: 600; //semi bold
			color: $primary;
		}

		.reading-time {
			font-size: $font-size-sm;
			font-weight: 300; //semi bold
			color: $secondary;
		}
	}
</style>
