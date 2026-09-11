<script lang="ts">
	let { content, icon: Icon = null, onclick, secondary = false } = $props();
</script>

<button {onclick} class:secondary>
	{#if Icon}
		<span class="icon-wrap">
			<span class="icon-reel">
				<span class="tint"><Icon /></span>
				<span class="tint tint-yellow"><Icon /></span>
				<span class="tint tint-light-orange"><Icon /></span>
				<span class="tint tint-orange"><Icon /></span>
				<span class="tint tint-red"><Icon /></span>
				<span class="tint"><Icon /></span>
			</span>
		</span>
	{/if}
	<span>{content}</span>
</button>

<style lang="scss">
	@use '../../styles/variables' as *;

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

		transition: all 200ms linear;

		&:hover {
			transform: scale(1.02);
		}
	}

	.secondary {
		background-color: transparent;
		color: $primary;

		border: 2px solid $primary;
	}

	$icon-size: 24px;

	.icon-wrap {
		display: inline-flex;
		flex: none;
		width: $icon-size;
		height: $icon-size;
		overflow: hidden;
	}

	.icon-reel {
		display: flex;
		flex-direction: column;
		// Repos = dernier cran de la pile (l'icone normale du bas), aligne
		// avec ce que montre l'animation une fois revenue a sa base.
		transform: translateY(calc($icon-size * -5));
	}

	.tint {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: $icon-size;
		height: $icon-size;
		color: inherit;
	}

	.tint-red {
		color: $color-red;
	}

	.tint-orange {
		color: $color-orange;
	}

	.tint-light-orange {
		color: $color-light-orange;
	}

	.tint-yellow {
		color: $color-yellow;
	}

	button:hover .icon-reel {
		animation: icon-reel 800ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	button:hover .icon-wrap {
		animation: icon-pop 800ms cubic-bezier(0.33, 1, 0.68, 1);
	}

	@keyframes icon-reel {
		from {
			// Meme valeur que le repos : le reel demarre "en haut" de sa pile
			// (icone normale) et descend, teinte par teinte, jusqu'a l'icone
			// normale du haut - defilement inverse du premier essai.
			transform: translateY(calc($icon-size * -5));
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes icon-pop {
		0% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
