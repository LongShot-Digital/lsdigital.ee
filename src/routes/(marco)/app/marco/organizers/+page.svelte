<script lang="ts">
	// Same Web3Forms inbox as the LSD contact form (info@lsdigital.ee).
	const WEB3FORMS_KEY = '74131967-39f2-4010-b10e-4769f4aa0303';

	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state(false);

	async function submitPilot(e: SubmitEvent) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;
		error = false;
		const form = e.target as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form).entries());
		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					access_key: WEB3FORMS_KEY,
					subject: `Marco organizer pilot — ${data.org ?? data.name}`,
					from_name: 'Marco for Organizers',
					...data
				})
			});
			submitted = res.ok;
			error = !res.ok;
		} catch {
			error = true;
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Marco for Organizers — put your events where the night starts</title>
	<meta
		name="description"
		content="Marco puts your events on the map young people actually check. Poster pins, RSVP analytics, and a console built for event teams. Join the pilot."
	/>
</svelte:head>

<main class="org">
	<section class="stage">
		<a href="/app/marco" class="brandline">
			<svg class="mark" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<rect width="1024" height="1024" rx="228" ry="228" fill="#F4F1EA" />
				<circle cx="512" cy="512" r="298" fill="#2D63F5" />
				<circle cx="512" cy="512" r="172" fill="#F4F1EA" />
				<circle cx="600" cy="446" r="70" fill="#18B26B" />
			</svg>
			<span class="brand">Marco</span>
			<span class="for-tag">FOR ORGANIZERS</span>
		</a>

		<h1 class="headline">
			Put your events where<br />the night <em>starts.</em>
		</h1>

		<p class="sub">
			Marco is a live map of what people's friends are doing tonight. Your events sit on it
			as poster pins — right where the "what are we doing?" decision happens.
		</p>

		<div class="cards">
			<div class="card">
				<div class="card-icon">📍</div>
				<h3>On the map, as posters</h3>
				<p>
					Not a listing in a feed — a poster pinned to your venue on the map everyone
					opens first. Friends going make it pulse.
				</p>
			</div>
			<div class="card">
				<div class="card-icon">📊</div>
				<h3>Know your crowd</h3>
				<p>
					RSVPs, reach, and who-brought-whom in a web console built for event teams —
					publish once, update everywhere, notify everyone who's going.
				</p>
			</div>
			<div class="card">
				<div class="card-icon">✓</div>
				<h3>Verified, not spam</h3>
				<p>
					Organizer accounts are verified by us — a short call, once. Your events carry
					the badge; the map stays trustworthy.
				</p>
			</div>
		</div>

		<div class="pilot" id="pilot">
			<div class="pilot-head">
				<span class="pilot-dot"></span>
				<span class="pilot-label">EARLY PARTNER PILOT</span>
			</div>
			<p class="pilot-sub">
				We're onboarding a small group of venues, promoters, and community hosts before the
				public launch. Pilot partners get free access, a direct line to the founders, and a
				say in what the console becomes.
			</p>

			{#if submitted}
				<div class="success">
					<span class="check">✓</span>
					Got it — we'll reach out to set up a short intro call.
				</div>
			{:else}
				<form class="pilot-form" onsubmit={submitPilot}>
					<div class="row">
						<input name="name" type="text" placeholder="Your name" required autocomplete="name" />
						<input name="org" type="text" placeholder="Venue / organization" required autocomplete="organization" />
					</div>
					<div class="row">
						<input name="email" type="email" placeholder="Work email" required autocomplete="email" />
						<input name="city" type="text" placeholder="City" required autocomplete="address-level2" />
					</div>
					<input
						name="events"
						type="text"
						placeholder="What do you host, and how often? (e.g. club nights, weekly)"
					/>
					<button class="cta" type="submit" disabled={submitting}>
						{submitting ? 'Sending…' : 'Apply for the pilot'}
					</button>
					{#if error}
						<p class="error">Something went wrong — email us at info@lsdigital.ee instead.</p>
					{/if}
					<p class="cta-sub">We reply to every application. No newsletters, no spam.</p>
				</form>
			{/if}
		</div>

		<a href="/app/marco" class="back">← Marco for humans</a>
	</section>
</main>

<style>
	:global(html),
	:global(body) {
		background: #f4f1ea;
	}

	.org {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		justify-content: center;
		padding: 56px 24px 72px;
		background: #f4f1ea;
		overflow: hidden;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #1c1d1f;
	}

	.org::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, rgba(28, 29, 31, 0.04) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(28, 29, 31, 0.04) 1px, transparent 1px);
		background-size: 64px 64px;
		mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, #000 30%, transparent 82%);
		-webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, #000 30%, transparent 82%);
		pointer-events: none;
	}

	.stage {
		position: relative;
		z-index: 1;
		max-width: 720px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 22px;
	}

	.brandline {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: inherit;
	}
	.mark {
		width: 44px;
		height: 44px;
		border-radius: 11px;
		box-shadow: 0 8px 22px rgba(45, 99, 245, 0.16);
	}
	.brand {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 1.5rem;
		letter-spacing: -0.02em;
	}
	.for-tag {
		padding: 5px 11px;
		border-radius: 999px;
		background: rgba(45, 99, 245, 0.1);
		color: #2d63f5;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
	}

	.headline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(2rem, 6vw, 3.2rem);
		line-height: 1.08;
		letter-spacing: -0.025em;
		margin: 10px 0 0;
	}
	.headline em {
		font-style: italic;
		color: #2d63f5;
	}

	.sub {
		font-size: 1.02rem;
		line-height: 1.65;
		color: #6f6b61;
		max-width: 52ch;
		margin: 0;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
		width: 100%;
		margin-top: 14px;
		text-align: left;
	}
	.card {
		background: #ffffff;
		border: 1px solid rgba(28, 29, 31, 0.07);
		border-radius: 18px;
		padding: 22px 20px;
		box-shadow: 0 6px 22px rgba(28, 29, 31, 0.05);
	}
	.card-icon {
		font-size: 1.3rem;
		margin-bottom: 10px;
	}
	.card h3 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 1.02rem;
		letter-spacing: -0.01em;
		margin: 0 0 6px;
	}
	.card p {
		font-size: 0.86rem;
		line-height: 1.55;
		color: #6f6b61;
		margin: 0;
	}

	.pilot {
		width: 100%;
		max-width: 560px;
		margin-top: 22px;
		background: #ffffff;
		border: 1px solid rgba(45, 99, 245, 0.22);
		border-radius: 22px;
		padding: 28px 26px;
		box-shadow: 0 14px 40px rgba(45, 99, 245, 0.1);
		text-align: left;
	}
	.pilot-head {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pilot-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow: 0 0 0 0 rgba(24, 178, 107, 0.5);
		animation: pulse 2s ease-out infinite;
	}
	@keyframes pulse {
		0%   { box-shadow: 0 0 0 0 rgba(24, 178, 107, 0.6); }
		70%  { box-shadow: 0 0 0 9px rgba(24, 178, 107, 0); }
		100% { box-shadow: 0 0 0 0 rgba(24, 178, 107, 0); }
	}
	.pilot-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: #2d63f5;
	}
	.pilot-sub {
		font-size: 0.9rem;
		line-height: 1.6;
		color: #6f6b61;
		margin: 10px 0 18px;
	}

	.pilot-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	input {
		width: 100%;
		border: 1px solid rgba(28, 29, 31, 0.12);
		border-radius: 12px;
		background: #faf8f4;
		padding: 13px 14px;
		font-family: inherit;
		font-size: 0.92rem;
		color: #1c1d1f;
		outline: none;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	input:focus {
		border-color: #2d63f5;
		box-shadow: 0 0 0 3px rgba(45, 99, 245, 0.12);
	}
	input::placeholder {
		color: #9a958a;
	}

	.cta {
		margin-top: 4px;
		border: 0;
		background: #2d63f5;
		color: #ffffff;
		font-family: inherit;
		font-size: 1rem;
		font-weight: 600;
		padding: 14px 28px;
		border-radius: 13px;
		cursor: pointer;
		box-shadow: 0 10px 28px rgba(45, 99, 245, 0.22);
		transition: background 0.15s ease, transform 0.08s ease;
	}
	.cta:hover:not(:disabled) {
		background: #1f51d6;
		transform: translateY(-1px);
	}
	.cta:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.cta-sub {
		font-size: 0.76rem;
		color: #8593ac;
		margin: 2px 0 0;
		text-align: center;
	}
	.error {
		font-size: 0.82rem;
		color: #c2402a;
		margin: 0;
		text-align: center;
	}

	.success {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 18px;
		border-radius: 14px;
		background: rgba(24, 178, 107, 0.1);
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
		flex: none;
	}

	.back {
		margin-top: 24px;
		font-size: 0.82rem;
		color: #9a958a;
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.back:hover {
		color: #2d63f5;
	}

	@media (max-width: 640px) {
		.cards {
			grid-template-columns: 1fr;
		}
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
