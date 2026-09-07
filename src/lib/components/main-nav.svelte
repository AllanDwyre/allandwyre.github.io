<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { downloadCV } from '$lib/utils/download.js';
</script>

<nav>
	<a href="/" class="container after-gap" style="margin-right: auto;">
		<div class="color-container" style="background-color: var(--color-red);"></div>
		<div class="slider">
			<p>Allan Golding Dwyre</p>
		</div>
	</a>

	<a href="/" class="container">
		<div class="color-container" style="background-color: var(--color-orange);"></div>
		<div class="slider">
			<p>Expriments</p>
		</div>
	</a>

	<a href="/" class="container">
		<div class="color-container" style="background-color: var(--color-light-blue);"></div>
		<div class="slider">
			<p>Articles</p>
		</div>
	</a>

	<a href="/contact" class="container">
		<div class="color-container" style="background-color: var(--color-yellow);"></div>
		<div class="slider">
			<p>Contact</p>
		</div>
	</a>

	<div class="container">
		<Button content="Download Resume" onclick={() => downloadCV()} />
	</div>
</nav>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;

	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;

		display: flex;
		height: 5rem;
		align-items: center;
		justify-content: flex-end;

		background-color: rgba($background, 0.9);
		border-bottom: 1px solid $border;

		backdrop-filter: blur(10px);
	}

	.container {
		height: 100%;
		overflow: hidden;
		transition: transform 0.3s ease-in-out;

		&:last-child {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 2rem;
		}

		.color-container {
			width: 100%;
			height: 0px;

			transition: height 0.3s ease-in-out;
		}

		&:hover {
			.color-container {
				width: 100%;
				height: 20px;
			}
		}
		.slider {
			height: 100%;
			width: 100%;
			padding: 0 2rem;
			display: flex;
			align-items: center;
			justify-content: center;

			// chaque slider ne dessine QUE sa bordure droite — une seule source de vérité par frontière
			box-shadow: inset -1px 0 0 $border;
			transition:
				transform 0.3s ease-in-out,
				box-shadow 0.3s ease-in-out;
		}
	}

	.after-gap + .container .slider {
		box-shadow:
			inset -1px 0 0 $border,
			inset 1px 0 0 $border;
	}

	a {
		text-decoration: none;
		color: #000;
		font-weight: bold;
	}
</style>
