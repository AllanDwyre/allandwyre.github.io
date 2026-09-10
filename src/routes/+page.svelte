<script>
	import MainNav from '$lib/components/main-nav.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Countdown from '$lib/components/countdown.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Experiments from '$lib/components/experiments.svelte';
	import Divider from '$lib/components/divider.svelte';
	import { Contact } from '@lucide/svelte';
	import Articles from '$lib/components/articles.svelte';
</script>

<svelte:head>
	<title>Allan Golding Dwyre</title>
</svelte:head>

<MainNav />

<main>
	<Hero />
	<Divider />
	<Experiments />
	<Divider />
	<Articles/>
</main>

<Countdown />
<!-- Footer -->
<Footer />

<style lang="scss">
	@use '../styles/mixins' as *;
	main {
		margin: 9rem clamp(4rem, 10vw, 9.5rem) 0 clamp(4rem, 10vw, 9rem);

		@include for-size(tablet) {
			margin: 9rem 4rem 0 4rem;
		}

		@include for-size(phone) {
			margin: 9rem 2rem 0 2rem;
		}
	}
</style>
