<script lang="ts">
	// Tally captures emails via its own popup modal (loaded from tally.so/widgets/embed.js).
	// Form ID is the 6-char string at the end of tally.so/r/<id>.
	const TALLY_FORM_ID = 'Y5gJgB';

	let submitted = $state(false);

	function openWaitlist() {
		// Tally's embed.js attaches itself to window.Tally once loaded.
		// Falls back to a direct link if for any reason the script didn't load.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Tally = (typeof window !== 'undefined' ? (window as any).Tally : undefined);
		if (Tally?.openPopup) {
			Tally.openPopup(TALLY_FORM_ID, {
				layout: 'modal',
				width: 460,
				hideTitle: true,
				autoClose: 1500,
				emoji: { text: '👋', animation: 'wave' },
				onSubmit: () => {
					submitted = true;
				}
			});
		} else {
			window.open(`https://tally.so/r/${TALLY_FORM_ID}`, '_blank');
		}
	}
</script>

<svelte:head>
	<title>Marco — coming soon</title>
	<meta
		name="description"
		content="Marco — your weekend plans you've been waiting for. A social map of what your people are up to. Coming soon."
	/>
	<script src="https://tally.so/widgets/embed.js"></script>
</svelte:head>

<main class="marco">
	<section class="stage">
		<div class="logo-wrap">
			<svg class="logo" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-label="Marco">
				<rect width="1024" height="1024" rx="228" ry="228" fill="#F4F1EA" />
				<circle cx="512" cy="512" r="298" fill="#2D63F5" />
				<circle cx="512" cy="512" r="172" fill="#F4F1EA" />
				<circle class="friend-dot" cx="600" cy="446" r="70" fill="#18B26B" />
			</svg>
		</div>

		<h1 class="wordmark">Marco</h1>

		<div class="status">
			<span class="dot"></span>
			Coming soon
		</div>

		<p class="tagline">
			Your weekend plans<br />
			you've been <em>waiting for.</em>
		</p>

		<p class="sub">
			A social map of what your people are actually doing.<br />
			Quietly cooking. Built for iPhone.
		</p>

		{#if submitted}
			<div class="success">
				<span class="check">✓</span>
				You're on the list. We'll let you know when Marco opens.
			</div>
		{:else}
			<button class="cta" onclick={openWaitlist}>
				Get early access
			</button>
			<p class="cta-sub">Drop your email — we'll only use it for the launch.</p>
		{/if}

		<a href="/app/marco/organizers" class="org-link">Hosting events? Marco for Organizers →</a>

		<a href="/" class="back">← from LongShot Digital</a>
	</section>
</main>

<style>
	:global(html),
	:global(body) {
		background: #f4f1ea;
	}

	.marco {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		background: #f4f1ea;
		overflow: hidden;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #1c1d1f;
	}

	/* very faint hairline grid — a nod to a map without spelling it out */
	.marco::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, rgba(28, 29, 31, 0.04) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(28, 29, 31, 0.04) 1px, transparent 1px);
		background-size: 64px 64px;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%);
		-webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%);
		pointer-events: none;
	}

	.stage {
		position: relative;
		z-index: 1;
		max-width: 540px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}

	.logo-wrap {
		width: 132px;
		height: 132px;
		border-radius: 30px;
		box-shadow:
			0 18px 48px rgba(45, 99, 245, 0.18),
			0 2px 6px rgba(28, 29, 31, 0.06);
		overflow: hidden;
		animation: bob 4.5s ease-in-out infinite;
	}
	.logo {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* the green friend-dot subtly drifts around the porthole edge */
	.friend-dot {
		transform-origin: 512px 512px;
		animation: orbit 9s ease-in-out infinite;
	}
	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50%      { transform: translateY(-5px); }
	}
	@keyframes orbit {
		0%   { transform: rotate(0deg); }
		25%  { transform: rotate(-18deg); }
		50%  { transform: rotate(8deg); }
		75%  { transform: rotate(-4deg); }
		100% { transform: rotate(0deg); }
	}

	.wordmark {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(3rem, 8vw, 4.6rem);
		letter-spacing: -0.025em;
		line-height: 1;
		color: #1c1d1f;
		margin: 6px 0 0;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		background: rgba(45, 99, 245, 0.10);
		color: #2d63f5;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow: 0 0 0 0 rgba(24, 178, 107, 0.5);
		animation: pulse 2s ease-out infinite;
	}
	@keyframes pulse {
		0%   { box-shadow: 0 0 0 0   rgba(24, 178, 107, 0.6); }
		70%  { box-shadow: 0 0 0 10px rgba(24, 178, 107, 0); }
		100% { box-shadow: 0 0 0 0   rgba(24, 178, 107, 0); }
	}

	.tagline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 500;
		font-size: clamp(1.4rem, 3.4vw, 1.95rem);
		line-height: 1.22;
		letter-spacing: -0.015em;
		color: #1c1d1f;
		max-width: 28ch;
		margin: 4px 0 0;
	}
	.tagline em {
		font-style: italic;
		font-weight: 600;
		color: #2d63f5;
	}

	.sub {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #6f6b61;
		max-width: 34ch;
		font-weight: 400;
		margin: 0;
	}

	/* ── Waitlist CTA ─────────────────────────────────────── */
	.cta {
		margin-top: 14px;
		border: 0;
		background: #2d63f5;
		color: #ffffff;
		font-family: inherit;
		font-size: 1.02rem;
		font-weight: 600;
		padding: 14px 28px;
		border-radius: 14px;
		cursor: pointer;
		box-shadow:
			0 10px 28px rgba(45, 99, 245, 0.22),
			0 2px 4px rgba(45, 99, 245, 0.08);
		transition: background 0.15s ease, transform 0.08s ease, box-shadow 0.2s ease;
	}
	.cta:hover {
		background: #1f51d6;
		transform: translateY(-1px);
		box-shadow:
			0 14px 32px rgba(45, 99, 245, 0.28),
			0 2px 4px rgba(45, 99, 245, 0.10);
	}
	.cta:active {
		transform: scale(0.98) translateY(0);
	}
	.cta-sub {
		margin: 8px 0 0;
		font-size: 0.78rem;
		color: #8593ac;
	}

	.success {
		margin-top: 14px;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 18px;
		border-radius: 14px;
		background: rgba(24, 178, 107, 0.10);
		border: 1px solid rgba(24, 178, 107, 0.28);
		color: #0f6e56;
		font-size: 0.95rem;
		font-weight: 500;
	}
	.success .check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #18b26b;
		color: #ffffff;
		font-size: 0.78rem;
		font-weight: 700;
	}

	.org-link {
		margin-top: 20px;
		font-size: 0.85rem;
		font-weight: 600;
		color: #2d63f5;
		text-decoration: none;
	}
	.org-link:hover {
		text-decoration: underline;
	}

	.back {
		margin-top: 28px;
		font-size: 0.82rem;
		color: #9a958a;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: color 0.2s ease;
	}
	.back:hover {
		color: #2d63f5;
	}

	@media (max-width: 480px) {
		.logo-wrap { width: 112px; height: 112px; border-radius: 26px; }
		.stage { gap: 14px; }
		.cta { width: 100%; }
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-wrap, .friend-dot, .dot {
			animation: none;
		}
	}
</style>
