<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ArrowDownToLine } from '@lucide/svelte';

	// Date cible : 10 septembre 2026, minuit (heure locale)
	const TARGET_DATE: Date = new Date('2026-09-11T00:00:00');
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let isLive = $state(false);

	let interval: ReturnType<typeof setInterval> | undefined;

	function updateCountdown(): void {
		const now = new Date();
		const diff = TARGET_DATE.getTime() - now.getTime();

		if (diff <= 0) {
			isLive = true;
			days = hours = minutes = seconds = 0;
			if (interval) clearInterval(interval);
			return;
		}

		days = Math.floor(diff / (1000 * 60 * 60 * 24));
		hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
		minutes = Math.floor((diff / (1000 * 60)) % 60);
		seconds = Math.floor((diff / 1000) % 60);
	}

	onMount(() => {
		updateCountdown();
		interval = setInterval(updateCountdown, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	type UnitKey = 'days' | 'hours' | 'minutes' | 'seconds';

	const units: { key: UnitKey; label: string; color: string }[] = [
		{ key: 'days', label: 'Days', color: '#FF5A1F' },
		{ key: 'hours', label: 'Hours', color: '#FFB800' },
		{ key: 'minutes', label: 'Minutes', color: '#1E8CFF' },
		{ key: 'seconds', label: 'Seconds', color: '#FF5A1F' }
	];

	const values = $derived<Record<UnitKey, number>>({ days, hours, minutes, seconds });
</script>

<section class="countdown-wrap">
	<div class="badge">
		<span class="dot"></span>
		Under construction
	</div>

	{#if !isLive}
		<h1 class="headline">
			This portfolio <em>is under construction</em>.
		</h1>
		<p class="subtext">
			I'm still polishing a few experiments before making it public. Coming back on <strong
				>{TARGET_DATE.toLocaleDateString(undefined, options)}</strong
			>.
		</p>

		<div class="blocks">
			{#each units as unit}
				<div class="block" style="background:{unit.color}">
					<span class="circle"></span>
					<span class="number">{String(values[unit.key]).padStart(2, '0')}</span>
					<span class="label">{unit.label}</span>
				</div>
			{/each}
		</div>
	{:else}
		<h1 class="headline">It's ready. <em>Welcome.</em></h1>
		<p class="subtext">The full portfolio is now available.</p>
	{/if}

	<a class="cv-btn" href="/contact" aria-disabled="true">
		<ArrowDownToLine color="#fff" />
		Contact me in the meantime
	</a>
</section>

<style>
	:global(body) {
		margin: 0;
	}

	.countdown-wrap {
		background: #edeae1;
		font-family:
			'Poppins',
			'Segoe UI',
			system-ui,
			-apple-system,
			sans-serif;
		color: #111;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 4rem 1.5rem;
		box-sizing: border-box;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #111;
		color: #edeae1;
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 2rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ff5a1f;
		display: inline-block;
		animation: pulse 1.6s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.4;
			transform: scale(0.75);
		}
	}

	.headline {
		font-size: clamp(2rem, 5vw, 3.4rem);
		font-weight: 800;
		line-height: 1.15;
		color: #ff5a1f;
		max-width: 800px;
		margin: 0 0 1rem 0;
	}

	.headline em {
		font-style: italic;
		color: #111;
	}

	.subtext {
		font-size: 1.05rem;
		color: #444;
		max-width: 520px;
		line-height: 1.6;
		margin: 0 0 3rem 0;
	}

	.subtext strong {
		color: #111;
	}

	.blocks {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		justify-content: center;
		margin-bottom: 3rem;
	}

	.block {
		position: relative;
		overflow: hidden;
		width: 130px;
		height: 130px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
	}

	.circle {
		position: absolute;
		top: -20px;
		right: -20px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
	}

	.number {
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 600;
		opacity: 0.9;
		margin-top: 0.4rem;
	}

	.cv-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		background: #111;
		color: #edeae1;
		text-decoration: none;
		font-weight: 600;
		padding: 0.85rem 1.6rem;
		border-radius: 999px;
		transition: transform 0.15s ease;
	}

	.cv-btn:hover {
		transform: translateY(-2px);
	}

	@media (max-width: 480px) {
		.block {
			width: 100px;
			height: 100px;
			border-radius: 16px;
		}
		.number {
			font-size: 1.6rem;
		}
	}
</style>
