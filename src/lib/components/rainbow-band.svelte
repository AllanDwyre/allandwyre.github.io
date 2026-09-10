<section class="rainbow-band">
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
	<div class="band"></div>
</section>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	.rainbow-band {
		border-radius: 13px;
		overflow: hidden;
		width: 55dvw;
	}

	.band {
		width: 100%;
		height: 0.6rem;

		&:nth-child(1) {
			background-color: $color-yellow;
		}
		&:nth-child(2) {
			background-color: $color-light-orange;
		}
		&:nth-child(3) {
			background-color: $color-orange;
		}
		&:nth-child(4) {
			background-color: $color-red;
		}
	}
</style>
