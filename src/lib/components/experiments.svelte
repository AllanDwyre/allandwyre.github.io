<script lang="ts">
	// TODO : Load l'array concat dynamiquement
	let filters = ['All'].concat(['Models', 'Retrieval', 'Monitoring', 'Deployment', 'Impact Study']);

	let active_filter = 'All';
</script>

<section id="experiments" class="experiments-header">
	<h2>Experiments</h2>
	<div class="experiments_filters">
		<!-- TODO : Faire la liste des filters dynamiquement -->
		{#each filters as filter}
			<p>{filter}</p>
		{/each}
	</div>
</section>

<style lang="scss">
	@use '../../styles/variables' as *;

	.experiments-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $primary;

		margin: $spacing-md 0;
		scroll-margin-top: 6rem;

		.experiments_filters {
			display: flex;
			letter-spacing: 0.02em;
			gap: 1rem;

			p {
				cursor: pointer;
				transition: all 300ms ease-in;
				&:hover {
					font-weight: bold;
				}
			}
		}
	}
</style>
