<script lang="ts">
	// Same Web3Forms inbox as the LSD contact form (info@lsdigital.ee).
	const WEB3FORMS_KEY = '74131967-39f2-4010-b10e-4769f4aa0303';

	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state(false);

	async function requestCall(e: SubmitEvent) {
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
					subject: `Marco organizer pilot — ${data.org ?? ''}`,
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
	<style>
		html,
		body {
			background: #f4f1ea;
		}
	</style>

	<title>Marco for Organizers — your events, on the map where tonight gets decided</title>
	<meta
		name="description"
		content="Marco is where groups of friends pick their plan. Verified organizers put real events on that map — and pulse when someone's friends are going. Apply for the pilot."
	/>
</svelte:head>

<main class="org">
	<!-- nav -->
	<nav class="nav">
		<a href="/app/marco" class="brandline">
			<span class="aperture" aria-hidden="true"></span>
			<span class="wordmark">marco <span class="for-tag">for organizers</span></span>
		</a>
		<div class="nav-actions">
			<a href="/app/marco/console" class="signin">Sign in</a>
			<a href="#apply" class="apply-btn">Apply for the pilot</a>
		</div>
	</nav>

	<!-- hero: the map IS the pitch -->
	<header class="org-hero">
		<h1 class="headline">Your events, on the map where tonight gets decided.</h1>
		<p class="sub">
			Marco is where groups of friends pick their plan. Verified organizers put real events on
			that map — and pulse when someone&rsquo;s friends are going.
		</p>

		<!-- map product shot -->
		<div class="map-shot" role="img" aria-label="A Marco poster pin on the dark map, pulsing because friends are going">
			<div class="street street-h"></div>
			<div class="street street-v"></div>
			<div class="pin-wrap">
				<div class="pin">
					<div class="sonar" aria-hidden="true"></div>
					<div class="poster">
						<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
						<div class="poster-scrim"></div>
						<div class="poster-title">Vinyl night</div>
						<div class="poster-going">4 GOING</div>
					</div>
					<span class="pin-seal" aria-hidden="true">
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F5F6F8" stroke-width="3" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
					</span>
				</div>
				<div class="pin-tip" aria-hidden="true"></div>
			</div>
			<div class="friends" aria-hidden="true">
				<span class="friend live">J</span>
				<span class="friend">L</span>
			</div>
			<span class="shot-caption">Live product shot — the Poster Field map</span>
		</div>
	</header>

	<!-- proof strip -->
	<section class="proof">
		<div class="proof-cell">
			<span class="proof-numeral cobalt">68%</span>
			<span class="proof-caption">of RSVPs arrive through a friend&rsquo;s plan — crowds that multiply themselves</span>
		</div>
		<div class="proof-cell">
			<span class="proof-numeral">0 spam</span>
			<span class="proof-caption">every pin is a hand-verified organizer — your poster never competes with ghost listings or clutter</span>
		</div>
		<div class="proof-cell">
			<span class="proof-label">PILOT VENUES — SLOT</span>
			<div class="logo-slots" aria-hidden="true">
				<span class="logo-slot">LOGO</span>
				<span class="logo-slot">LOGO</span>
				<span class="logo-slot">LOGO</span>
			</div>
		</div>
	</section>

	<!-- console + verification + apply -->
	<section class="bottom">
		<div class="console-col">
			<h2 class="section-title">A console, not a dashboard farm.</h2>
			<a class="console-shot" href="/app/marco/console" aria-label="Open the Marco console">
				<div class="mini-sidebar" aria-hidden="true"></div>
				<div class="mini-title">Events</div>
				<div class="mini-cards" aria-hidden="true">
					<div class="mini-card">
						<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&q=60&auto=format&fit=crop" alt="" loading="lazy" />
						<div class="mini-going green">86 going</div>
					</div>
					<div class="mini-card">
						<img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=60&auto=format&fit=crop" alt="" loading="lazy" />
						<div class="mini-going">142 going</div>
					</div>
					<div class="mini-card dashed"></div>
				</div>
				<span class="mini-caption">Product shot — the events board</span>
			</a>
			<p class="section-body">
				Publish in two minutes, duplicate your weekly night as a template, watch RSVPs live.
				Aggregate analytics only — you see how your crowd grows, never your guests&rsquo;
				private lives.
			</p>
		</div>

		<div class="verify-col" id="apply">
			<h2 class="section-title">We verify every organizer.</h2>
			<p class="section-body">
				A short call with the founders, then you&rsquo;re on the map with the seal. No spam, no
				ghost listings — that&rsquo;s why people trust the pins, and why your pin is worth
				something.
			</p>
			{#if submitted}
				<div class="success">
					<span class="check">✓</span>
					Got it — we&rsquo;ll reach out to book your call.
				</div>
			{:else}
				<form class="apply-card" onsubmit={requestCall}>
					<span class="apply-label">APPLY — 2 MINUTES</span>
					<input name="org" type="text" placeholder="Organization name" required autocomplete="organization" />
					<input name="details" type="text" placeholder="City · Instagram or website" required />
					<input name="email" type="email" placeholder="Work email — where we book the call" required autocomplete="email" />
					<button class="cta" type="submit" disabled={submitting}>
						{submitting ? 'Sending…' : 'Request a call'}
					</button>
					{#if error}
						<p class="error">Something went wrong — email us at info@lsdigital.ee instead.</p>
					{/if}
				</form>
			{/if}
		</div>
	</section>

	<a href="/app/marco" class="back">← Marco for humans</a>
</main>

<style>
	.org {
		min-height: 100vh;
		min-height: 100dvh;
		max-width: 960px;
		margin: 0 auto;
		background: #f4f1ea;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #1c1b18;
		display: flex;
		flex-direction: column;
	}

	/* nav */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 44px;
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		gap: 14px;
	}
	.brandline {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
	}
	.aperture {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 4.5px solid #2d63f5;
		position: relative;
		flex: none;
	}
	.aperture::after {
		content: '';
		position: absolute;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #18b26b;
		right: -1px;
		bottom: -1px;
	}
	.wordmark {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 19px;
		letter-spacing: -0.02em;
	}
	.for-tag {
		color: rgba(28, 27, 24, 0.45);
		font-weight: 500;
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 18px;
		flex: none;
	}
	.signin {
		font-weight: 600;
		font-size: 13.5px;
		color: rgba(28, 27, 24, 0.6);
		text-decoration: none;
	}
	.signin:hover {
		color: #2d63f5;
	}
	.apply-btn {
		padding: 9px 18px;
		border-radius: 11px;
		background: #1c1b18;
		font-weight: 700;
		font-size: 13px;
		color: #f4f1ea;
		text-decoration: none;
		flex: none;
	}
	.apply-btn:hover {
		background: #33312c;
	}

	/* hero */
	.org-hero {
		padding: 52px 44px 40px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.headline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(30px, 5.4vw, 44px);
		line-height: 1.05;
		letter-spacing: -0.03em;
		max-width: 600px;
		text-wrap: balance;
		margin: 0;
	}
	.sub {
		font-weight: 400;
		font-size: 17px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		max-width: 540px;
		margin: 0;
	}

	/* map product shot */
	.map-shot {
		height: 300px;
		border-radius: 20px;
		background: #101115;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(28, 27, 24, 0.15);
	}
	.street-h {
		position: absolute;
		left: -40px;
		top: 120px;
		width: 150%;
		height: 7px;
		background: rgba(245, 246, 248, 0.06);
		transform: rotate(-5deg);
	}
	.street-v {
		position: absolute;
		left: 200px;
		top: -30px;
		width: 5px;
		height: 130%;
		background: rgba(245, 246, 248, 0.05);
		transform: rotate(5deg);
	}
	.pin-wrap {
		position: absolute;
		left: 90px;
		top: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pin {
		position: relative;
	}
	.sonar {
		position: absolute;
		inset: -5px;
		border-radius: 16px;
		border: 2px solid rgba(24, 178, 107, 0.5);
		animation: sonar 1.8s ease-out infinite;
	}
	@keyframes sonar {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.35);
			opacity: 0;
		}
	}
	.poster {
		width: 82px;
		height: 104px;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		box-shadow:
			0 0 0 2px #101115,
			0 0 0 3.5px rgba(195, 168, 240, 0.55),
			0 14px 30px -10px rgba(0, 0, 0, 0.8);
	}
	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.poster-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.05) 30%, rgba(15, 16, 19, 0.9) 100%);
	}
	.poster-title {
		position: absolute;
		left: 7px;
		bottom: 18px;
		right: 7px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 11px;
		color: #f5f6f8;
	}
	.poster-going {
		position: absolute;
		left: 7px;
		bottom: 6px;
		font-weight: 700;
		font-size: 8px;
		letter-spacing: 0.1em;
		color: #2bce85;
		white-space: nowrap;
	}
	.pin-seal {
		position: absolute;
		right: -8px;
		top: -8px;
		width: 21px;
		height: 21px;
		border-radius: 50%;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 0 2px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pin-tip {
		width: 8px;
		height: 8px;
		background: rgba(195, 168, 240, 0.55);
		transform: rotate(45deg);
		margin-top: -2px;
		border-radius: 1.5px;
	}
	.friends {
		position: absolute;
		left: 290px;
		top: 110px;
		display: flex;
	}
	.friend {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.5), transparent 62%), #17181d;
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 0 0 2px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 13px;
		color: #e3b678;
	}
	.friend + .friend {
		margin-left: -10px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(223, 106, 152, 0.5), transparent 62%), #17181d;
		color: #e59fbe;
	}
	.friend.live {
		box-shadow:
			0 0 0 2px #101115,
			0 0 0 4px #18b26b;
		z-index: 2;
	}
	.shot-caption {
		position: absolute;
		right: 26px;
		bottom: 22px;
		padding: 8px 15px;
		border-radius: 999px;
		background: rgba(23, 24, 29, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.12);
		font-weight: 600;
		font-size: 12.5px;
		color: #f5f6f8;
	}

	/* proof strip */
	.proof {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		border-top: 1px solid rgba(28, 27, 24, 0.1);
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.proof-cell {
		padding: 26px 30px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.proof-cell:not(:last-child) {
		border-right: 1px solid rgba(28, 27, 24, 0.1);
	}
	.proof-numeral {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 30px;
		letter-spacing: -0.02em;
	}
	.proof-numeral.cobalt {
		color: #2d63f5;
	}
	.proof-caption {
		font-weight: 500;
		font-size: 13px;
		line-height: 1.45;
		color: rgba(28, 27, 24, 0.6);
	}
	.proof-label {
		font-weight: 700;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		color: rgba(28, 27, 24, 0.4);
		margin-bottom: 4px;
	}
	.logo-slots {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.logo-slot {
		width: 78px;
		height: 30px;
		border-radius: 8px;
		border: 1.5px dashed rgba(28, 27, 24, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 10px;
		color: rgba(28, 27, 24, 0.4);
	}

	/* bottom: console + verify + CTA */
	.bottom {
		padding: 40px 44px 46px;
		display: flex;
		gap: 30px;
		align-items: flex-start;
	}
	.console-col {
		flex: 1.3;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.verify-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.section-title {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 23px;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.section-body {
		font-weight: 400;
		font-size: 14px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		margin: 0;
	}

	.console-shot {
		display: block;
		height: 190px;
		border-radius: 16px;
		background: #0f1013;
		border: 1px solid rgba(28, 27, 24, 0.15);
		position: relative;
		overflow: hidden;
		text-decoration: none;
	}
	.mini-sidebar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 70px;
		background: #101115;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
	}
	.mini-title {
		position: absolute;
		left: 86px;
		top: 18px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 16px;
		color: #f5f6f8;
	}
	.mini-cards {
		position: absolute;
		left: 86px;
		top: 48px;
		display: flex;
		gap: 10px;
	}
	.mini-card {
		width: 120px;
		height: 110px;
		border-radius: 12px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}
	.mini-card img {
		width: 100%;
		height: 62px;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.mini-card.dashed {
		background: #101115;
		border: 1px dashed rgba(255, 255, 255, 0.2);
	}
	.mini-going {
		padding: 7px 9px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 11px;
		color: rgba(245, 246, 248, 0.75);
	}
	.mini-going.green {
		color: #2bce85;
	}
	.mini-caption {
		position: absolute;
		right: 16px;
		bottom: 14px;
		font-weight: 600;
		font-size: 11.5px;
		color: rgba(245, 246, 248, 0.5);
	}

	/* apply card */
	.apply-card {
		padding: 18px 20px;
		border-radius: 14px;
		background: #fff;
		border: 1px solid rgba(28, 27, 24, 0.12);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.apply-label {
		font-weight: 700;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		color: rgba(28, 27, 24, 0.4);
	}
	.apply-card input {
		height: 40px;
		border-radius: 10px;
		border: 1px solid rgba(28, 27, 24, 0.18);
		padding: 0 13px;
		font-family: inherit;
		font-weight: 500;
		font-size: 13.5px;
		color: #1c1b18;
		outline: none;
		background: #fff;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	.apply-card input:focus {
		border-color: #2d63f5;
		box-shadow: 0 0 0 3px rgba(45, 99, 245, 0.12);
	}
	.apply-card input::placeholder {
		color: rgba(28, 27, 24, 0.45);
	}
	.cta {
		height: 44px;
		border-radius: 10px;
		border: 0;
		background: #2d63f5;
		font-family: inherit;
		font-weight: 700;
		font-size: 14px;
		color: #fff;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.cta:hover:not(:disabled) {
		background: #1f51d6;
	}
	.cta:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.error {
		font-size: 12.5px;
		color: #c2402a;
		margin: 0;
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
		font-size: 14.5px;
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
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		flex: none;
	}

	.back {
		padding: 0 44px 40px;
		font-size: 13px;
		color: rgba(28, 27, 24, 0.45);
		text-decoration: none;
	}
	.back:hover {
		color: #2d63f5;
	}

	@media (max-width: 760px) {
		.nav,
		.hero,
		.bottom {
			padding-left: 22px;
			padding-right: 22px;
		}
		.proof {
			grid-template-columns: 1fr;
		}
		.proof-cell:not(:last-child) {
			border-right: 0;
			border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		}
		.bottom {
			flex-direction: column;
		}
		.bottom > * {
			width: 100%;
		}
		.friends {
			left: auto;
			right: 40px;
			top: 60px;
		}
		.back {
			padding: 0 22px 40px;
		}
	}
</style>
