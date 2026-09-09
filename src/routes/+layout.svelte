<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import favicon_pascale from '$lib/assets/favicon.png';
	import '../styles/main.scss';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// simple scroll d'ancre sur la même route (ex: /#experiments) : pas besoin
		// d'une view transition, on laisse le scroll natif faire son travail
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;

		return new Promise((resolve) => {
			const html = document.documentElement;
			// bloque le scroll pendant la transition : l'overlay de la view
			// transition est pinné au viewport (pas au scroll du document), donc
			// scroller pendant qu'elle joue désynchronise l'image de la vraie page
			html.style.overflow = 'hidden';

			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});

			transition.finished.finally(() => {
				html.style.overflow = '';
			});
		});
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Averia+Sans+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" href={favicon_pascale} />
</svelte:head>

{@render children()}
