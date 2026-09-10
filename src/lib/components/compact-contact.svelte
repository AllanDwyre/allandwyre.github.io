<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import LinkedinIcon from '$lib/icons/linkedin.svg?component';
	import GithubIcon from '$lib/icons/github.svg?component';

	let { invert_color = false } = $props();

	let color = $derived(invert_color ? '#fff' : '#000');
</script>

<div class="social-icons">
	<a
		href="https://linkedin.com/in/allan-dwyre"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="LinkedIn"
	>
		<LinkedinIcon style="color: {color};" />
	</a>

	<a
		href="https://github.com/AllanDwyre"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="GitHub"
	>
		<GithubIcon style="color: {color};" />
	</a>

	<a href="mailto:allan.dwyre@gmail.com" aria-label="Email">
		<Mail style="color: {color};" />
	</a>
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.social-icons {
		display: flex;
		gap: 1rem;

		a {
			display: inline-flex;
			align-items: center;

			transition: all 300ms ease-in-out;

			&:hover {
				transform: scale(1.2);
			}
		}
	}
</style>
