<script>
	import MainNav from '$lib/components/main-nav.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Countdown from '$lib/components/countdown.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Experiments from '$lib/components/experiments.svelte';
	import Divider from '$lib/components/divider.svelte';
</script>

<svelte:head>
	<title>Allan Golding Dwyre</title>
</svelte:head>

<MainNav />

<main>
	<Hero />
	<Divider />
	<Experiments />
</main>

<Countdown />
<!-- Footer -->
<Footer />

<style lang="scss">
	@use '../styles/mixins' as *;
	main {
		margin: 9rem 9.5rem 0 9rem;

		@include for-size(phone) {
			margin: 9rem 1rem 0 1rem;
		}
	}
</style>
