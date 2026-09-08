<script lang="ts">
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import { Mail, Phone, ArrowBigDownDash } from '@lucide/svelte';
	import Button from '$lib/components/button.svelte';
	import LinkedinIcon from '$lib/icons/linkedin.svg?component';
	import GithubIcon from '$lib/icons/github.svg?component';
	import { downloadCV } from '$lib/utils/download.js';
	import RainbowBand from '$lib/components/rainbow-band.svelte';

	const contactLinks = [
		{
			icon: LinkedinIcon,
			href: 'https://www.linkedin.com/in/allan-dwyre/',
			text: 'linkedin.com/in/allan-dwyre/'
		},
		{
			icon: GithubIcon,
			href: 'https://github.com/AllanDwyre',
			text: 'github.com/AllanDwyre'
		},
		{
			icon: Mail,
			href: 'mailto:allan.dwyre@gmail.com',
			text: 'allan.dwyre@gmail.com',
			label: 'personal'
		},
		// {
		// 	icon: Mail,
		// 	href: 'mailto:allan.golding-dwyre@mistral.fr',
		// 	text: 'allan.golding-dwyre@mistral.fr',
		// 	label: 'professional'
		// },
		{
			icon: Phone,
			href: 'tel:+33767024346',
			text: '07.67.02.43.46'
		}
	];
</script>

<svelte:head>
	<title>Contact - Allan Golding Dwyre</title>
</svelte:head>

<header>
	<Breadcrumbs
		links={[
			{ href: '/', text: 'Portfolio' },
			{ href: '/contact', text: 'Contact' }
		]}
	/>
	<div class="header-data">
		<img src="/profil.png" alt="Allan Golding Dwyre profile" class="header-image" />
		<div class="header-text">
			<h1>Allan Golding Dwyre</h1>
			<p>
				I'm currently based in <span>Paris, France</span>. <br />
				Feel free to reach out to me via email or through my professional profiles
			</p>
		</div>
	</div>
</header>

<section class="contact-container">
	<h2>📬 Contact</h2>

	<div class="contact-links">
		{#each contactLinks as link}
			<p class="contact-row">
				<link.icon />

				<span class="link-text">
					<a href={link.href} target="_blank" rel="noopener noreferrer">{link.text}</a>
					{#if link.label}
						<span class="link-label">({link.label})</span>
					{/if}
				</span>
			</p>
		{/each}
	</div>
</section>

<footer>
	<Button icon={ArrowBigDownDash} content="Download Resume" onclick={() => downloadCV()} />

	<RainbowBand />

	<small>@2026 Allan Golding Dwyre</small>
</footer>

<style lang="scss">
	@use '../../styles/_variables.scss' as *;
	@use '../../styles/_mixins.scss' as *;

	header {
		margin: 5rem 0 0 clamp(1rem, 10vw, 10rem);
	}

	.header-data {
		display: flex;
		gap: 2.5rem;
		color: $primary;
		@include for-size(phone) {
			flex-direction: column;
			gap: 1rem;
		}
	}

	.header-text {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		height: 10rem;

		@include for-size(phone) {
			h1 {
				font-size: 2rem;
			}
		}

		p {
			line-height: 1.5;
			span {
				font-family: $font-heading;
			}
		}
	}

	.header-image {
		aspect-ratio: 1 / 1;
		height: clamp(6rem, 20vw, 10rem);
		width: clamp(6rem, 20vw, 10rem);
		object-fit: cover;
		border-radius: 50%;
		flex-shrink: 0; // évite qu'un flex parent l'écrase

		view-transition-name: profil-photo;
	}

	.contact-container {
		color: $primary;

		margin: 3rem 0 0 clamp(2rem, 15vw, 22.5rem);
		display: flex;
		flex-direction: column;
		gap: $spacing-md;

		.contact-links {
			display: flex;
			flex-direction: column;
			gap: $spacing-md;

			.contact-row {
				display: flex;
				align-items: center;
				gap: $spacing-sm;
				a {
					color: $primary;
					text-decoration: underline;
					padding: $spacing-xs;
					letter-spacing: 0.04em;

					transition: background-color 0.3s ease;
					&:hover {
						background-color: rgba($color-light-blue, 0.2);
					}
				}
				.link-label {
					color: gray;
					font-size: 0.9em;
				}
			}
		}
	}

	footer {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		margin-top: auto;
		padding-top: 2rem;
		small {
			margin-top: clamp(1.5rem, 6vw, 3.6rem);
		}
	}
</style>
