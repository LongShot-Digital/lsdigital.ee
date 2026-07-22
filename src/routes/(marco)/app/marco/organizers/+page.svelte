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
			background: #f4f1ea !important;
		}
		body::before {
			display: none;
		}
	</style>

	<title>Marco for Organizers — your events, on the map where tonight gets decided</title>
	<meta
		name="description"
		content="Marco is where groups of friends pick their plan. Verified organizers put real events on that map — and pulse when someone's friends are going. Apply for the pilot."
	/>
</svelte:head>

<main class="org">
	<div class="page-backdrop" aria-hidden="true"></div>
	<!-- ── nav ── -->
	<nav class="nav">
		<div class="shell nav-inner">
			<a href="/app/marco" class="brandline">
				<svg width="34" height="34" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-label="Marco" style="border-radius: 8px; display: block;">
					<rect width="1024" height="1024" rx="228" ry="228" fill="#F4F1EA" />
					<circle cx="512" cy="512" r="298" fill="#2D63F5" />
					<circle cx="512" cy="512" r="172" fill="#F4F1EA" />
					<circle cx="600" cy="446" r="70" fill="#18B26B" />
				</svg>
				<span class="wordmark-sm">Marco</span>
				<span class="for-tag">FOR ORGANIZERS</span>
			</a>
			<div class="nav-actions">
				<a href="/app/marco/console" class="nav-link">Sign in</a>
				<a href="#apply" class="nav-cta">Apply for the pilot</a>
			</div>
		</div>
	</nav>

	<!-- ── hero ── -->
	<header class="hero-band">
		<div class="shell hero-inner">
			<div class="hero-copy">
				<span class="status"><span class="dot"></span>Pilot open · first cities</span>
				<h1 class="headline">Your events, on the map where tonight gets decided.</h1>
				<p class="sub">
					Marco is where groups of friends pick their plan. Verified organizers put real
					events on that map — and pulse when someone&rsquo;s friends are going.
				</p>
				<div class="cta-stack">
					<a href="#apply" class="cta">Apply for the pilot</a>
					<span class="cta-sub">A short call with the founders — then you&rsquo;re on the map.</span>
				</div>
			</div>

			<!-- map product shot: the sealed pin, pulsing -->
			<div class="shot-wrap" role="img" aria-label="A verified organizer's poster pin pulsing on the Marco map because friends are going">
				<div class="map-shot">
					<div class="street s1"></div>
					<div class="street s2"></div>
					<div class="street s3"></div>

					<div class="pin pin-main">
						<div class="sonar" aria-hidden="true"></div>
						<div class="poster">
							<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&q=75&auto=format&fit=crop" alt="" loading="lazy" />
							<div class="poster-scrim"></div>
							<div class="poster-text">
								<span class="poster-title">Vinyl night</span>
								<span class="poster-going">4 GOING</span>
							</div>
						</div>
						<span class="pin-seal" aria-hidden="true">
							<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#F5F6F8" stroke-width="3.2" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
						</span>
						<div class="pin-tip violet" aria-hidden="true"></div>
					</div>

					<div class="friends" aria-hidden="true">
						<span class="friend live">J</span>
						<span class="friend f2">L</span>
					</div>

					<span class="you-dot" aria-hidden="true"></span>

					<span class="shot-caption">The Poster Field — your pin, where the night starts</span>
				</div>
			</div>
		</div>
	</header>

	<!-- ── proof strip ── -->
	<section class="proof-band">
		<div class="shell proof">
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
		</div>
	</section>

	<!-- ── dark console band ── -->
	<section class="console-band">
		<div class="shell console-inner">
			<h2 class="console-headline">A console, not a dashboard farm.</h2>
			<p class="console-sub">
				Publish in two minutes, duplicate your weekly night as a template, watch RSVPs
				live. Aggregate analytics only — you see how your crowd grows, never your
				guests&rsquo; private lives.
			</p>

			<!-- console mock, drawn from the real thing -->
			<div class="console-shot" role="img" aria-label="The Marco console: events board with live, published and draft cards">
				<div class="cs-sidebar">
					<div class="cs-org">
						<span class="cs-tile">LM
							<span class="cs-seal"><svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg></span>
						</span>
						<span class="cs-org-meta"><strong>Le Motel</strong><em>Venue · Paris</em></span>
					</div>
					<span class="cs-nav active">Events</span>
					<span class="cs-nav">Analytics</span>
					<span class="cs-nav">Settings</span>
					<span class="cs-verified"><span class="cs-vdot"></span>Verified organizer</span>
				</div>
				<div class="cs-main">
					<div class="cs-head">
						<span class="cs-title">Events</span>
						<span class="cs-tabs"><span class="cs-tab on">Upcoming · 6</span><span class="cs-tab">Drafts · 2</span><span class="cs-tab">Past · 48</span></span>
						<span class="cs-new">+ New event</span>
					</div>
					<div class="cs-grid">
						<div class="cs-card">
							<div class="cs-photo">
								<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&q=70&auto=format&fit=crop" alt="" loading="lazy" />
								<span class="cs-chip live"><span class="cs-chipdot"></span>LIVE TONIGHT</span>
								<span class="cs-card-title">Vinyl night</span>
							</div>
							<div class="cs-counts"><strong class="green">86</strong> going · <strong>31</strong> maybe</div>
						</div>
						<div class="cs-card">
							<div class="cs-photo">
								<img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=70&auto=format&fit=crop" alt="" loading="lazy" />
								<span class="cs-chip">PUBLISHED</span>
								<span class="cs-card-title">Modular synth live set</span>
							</div>
							<div class="cs-counts"><strong>142</strong> going · <strong>58</strong> maybe</div>
						</div>
						<div class="cs-card draft">
							<div class="cs-photo dashed">
								<span class="cs-chip dashedchip">DRAFT</span>
								<span class="cs-card-title dim">NYE — save the date</span>
							</div>
							<div class="cs-counts dim">Missing: photo, end time</div>
						</div>
					</div>
				</div>
			</div>
			<a href="/app/marco/console" class="console-link">Explore the demo console →</a>
		</div>
	</section>

	<!-- ── roadmap: the venue toolkit, honestly dashed ── -->
	<section class="roadmap-band">
		<div class="shell roadmap-inner">
			<h2>Where this is going.</h2>
			<p class="roadmap-sub">
				The pilot ships the console. The venue toolkit comes next — built with pilot
				partners, dashed until it&rsquo;s real. That&rsquo;s the house rule: we never fake a
				number, and we never sell your guests.
			</p>
			<div class="roadmap-grid">
				<div class="roadmap-card">
					<div class="roadmap-head">
						<span class="roadmap-icon">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M3 19c1-3.5 11-3.5 12 0" /><path d="M17 5v0M19.5 9a6.5 6.5 0 0 0-1.2-3.8" /><path d="M16 8.5a3 3 0 1 1 3 5" /></svg>
						</span>
						<span class="roadmap-tag">IN THE PIPELINE</span>
					</div>
					<h3>Audience insights</h3>
					<p>
						The average night at your venue: age bands, how far people travel, first-timers
						vs regulars. Aggregate always — never individuals.
					</p>
				</div>
				<div class="roadmap-card">
					<div class="roadmap-head">
						<span class="roadmap-icon">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>
						</span>
						<span class="roadmap-tag">IN THE PIPELINE</span>
					</div>
					<h3>Ticket timing</h3>
					<p>
						When your crowd commits: RSVP and ticket curves by day and hour, so you know
						exactly when to push a night — and when to hold.
					</p>
				</div>
				<div class="roadmap-card">
					<div class="roadmap-head">
						<span class="roadmap-icon">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10.5h18M7 15h4" /></svg>
						</span>
						<span class="roadmap-tag">IN THE PIPELINE</span>
					</div>
					<h3>Membership passes</h3>
					<p>
						Venue passes sold inside Marco — your regulars, subscribed. Recurring revenue
						for you, a home venue for them.
					</p>
				</div>
				<div class="roadmap-card">
					<div class="roadmap-head">
						<span class="roadmap-icon">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11v3l4 1 9 5V4L8 9l-4 2z" /><path d="M18 9.5a3.5 3.5 0 0 1 0 4" /></svg>
						</span>
						<span class="roadmap-tag">IN THE PIPELINE</span>
					</div>
					<h3>Promotion, not ads</h3>
					<p>
						Boost a night to nearby people with matching taste — clearly marked, capped,
						and friends&rsquo; plans always rank first.
					</p>
				</div>
			</div>
			<p class="roadmap-note">
				Pilot partners vote on the order. That&rsquo;s half the point of being early.
			</p>
		</div>
	</section>

	<!-- ── verify + apply ── -->
	<section class="apply-band" id="apply">
		<div class="shell apply-inner">
			<div class="verify-copy">
				<h2>We verify every organizer.</h2>
				<p>
					A short call with the founders, then you&rsquo;re on the map with the seal. No
					spam, no ghost listings — that&rsquo;s why people trust the pins, and why your
					pin is worth something.
				</p>
				<ul class="verify-list">
					<li><strong>15 minutes.</strong> We confirm your venue and switch you on.</li>
					<li><strong>Free for the pilot.</strong> Plus a direct line to the founders.</li>
					<li><strong>Draft before the call.</strong> Your events go live the moment you&rsquo;re verified.</li>
				</ul>
			</div>
			<div class="apply-col">
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
						<button class="cta form-cta" type="submit" disabled={submitting}>
							{submitting ? 'Sending…' : 'Request a call'}
						</button>
						{#if error}
							<p class="error">Something went wrong — email us at info@lsdigital.ee instead.</p>
						{/if}
					</form>
				{/if}
			</div>
		</div>
	</section>

	<footer class="footer">
		<div class="shell footer-inner">
			<a href="/app/marco" class="footer-link">← Marco for humans</a>
			<a href="/" class="footer-link">from LongShot Digital</a>
		</div>
	</footer>
</main>

<style>
	/* Structural fix for the recurring "different-colored sidebars": a fixed
	   full-viewport layer painted by US, immune to any global stylesheet
	   ordering, body rules, or grain overlays — forever. */
	.page-backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: #f4f1ea;
	}

	.org {
		width: 100%;
		min-height: 100vh;
		min-height: 100dvh;
		background: #f4f1ea;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #1c1b18;
	}
	.shell {
		max-width: 1040px;
		margin: 0 auto;
		padding-left: 32px;
		padding-right: 32px;
	}

	/* ── nav ── */
	.nav {
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		background: #f4f1ea;
		position: sticky;
		top: 0;
		z-index: 20;
	}
	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		height: 66px;
	}
	.brandline {
		display: flex;
		align-items: center;
		gap: 11px;
		text-decoration: none;
		color: inherit;
	}
	.wordmark-sm {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 20px;
		letter-spacing: -0.02em;
	}
	.for-tag {
		padding: 5px 11px;
		border-radius: 999px;
		background: rgba(45, 99, 245, 0.1);
		color: #2d63f5;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.13em;
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 20px;
		flex: none;
	}
	.nav-link {
		font-weight: 600;
		font-size: 13.5px;
		color: rgba(28, 27, 24, 0.6);
		text-decoration: none;
	}
	.nav-link:hover {
		color: #2d63f5;
	}
	.nav-cta {
		padding: 10px 18px;
		border-radius: 11px;
		background: #1c1b18;
		font-weight: 700;
		font-size: 13px;
		color: #f4f1ea;
		text-decoration: none;
	}
	.nav-cta:hover {
		background: #33312c;
	}

	/* ── hero ── */
	.hero-band {
		position: relative;
		overflow: hidden;
	}
	.hero-band::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, rgba(28, 27, 24, 0.045) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(28, 27, 24, 0.045) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 75% 70% at 62% 45%, #000 25%, transparent 80%);
		-webkit-mask-image: radial-gradient(ellipse 75% 70% at 62% 45%, #000 25%, transparent 80%);
		pointer-events: none;
	}
	.hero-inner {
		position: relative;
		display: flex;
		align-items: center;
		gap: 48px;
		padding-top: 64px;
		padding-bottom: 72px;
	}
	.hero-copy {
		flex: 1.15;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		background: rgba(45, 99, 245, 0.1);
		color: #2d63f5;
		font-size: 11.5px;
		font-weight: 700;
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
		0%   { box-shadow: 0 0 0 0 rgba(24, 178, 107, 0.6); }
		70%  { box-shadow: 0 0 0 10px rgba(24, 178, 107, 0); }
		100% { box-shadow: 0 0 0 0 rgba(24, 178, 107, 0); }
	}
	.headline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(32px, 5vw, 46px);
		line-height: 1.05;
		letter-spacing: -0.03em;
		margin: 0;
		text-wrap: balance;
	}
	.sub {
		font-size: 16.5px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		max-width: 46ch;
		margin: 0;
	}
	.cta-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 6px;
	}
	.cta {
		display: inline-block;
		border: 0;
		background: #2d63f5;
		color: #fff;
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		padding: 15px 30px;
		border-radius: 13px;
		cursor: pointer;
		text-align: center;
		text-decoration: none;
		box-shadow: 0 10px 28px rgba(45, 99, 245, 0.22);
		transition: background 0.15s ease, transform 0.08s ease;
	}
	.cta:hover {
		background: #1f51d6;
		transform: translateY(-1px);
	}
	.cta:active {
		transform: scale(0.98);
	}
	.cta-sub {
		font-size: 12.5px;
		color: rgba(28, 27, 24, 0.45);
	}

	/* ── map shot ── */
	.shot-wrap {
		flex: 1;
		display: flex;
		justify-content: center;
		min-width: 0;
	}
	.map-shot {
		position: relative;
		width: 100%;
		max-width: 420px;
		height: 380px;
		border-radius: 24px;
		background: #14161b;
		overflow: hidden;
		box-shadow:
			0 40px 80px -30px rgba(28, 27, 24, 0.45),
			0 0 0 1px rgba(28, 27, 24, 0.15);
	}
	.street {
		position: absolute;
		background: rgba(245, 246, 248, 0.055);
	}
	.s1 { left: -30px; top: 150px; width: 150%; height: 6px; transform: rotate(-6deg); }
	.s2 { left: 90px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); }
	.s3 { left: 280px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); background: rgba(245, 246, 248, 0.04); }

	.pin {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pin-main { left: 64px; top: 64px; }
	.sonar {
		position: absolute;
		inset: -6px 0 auto -6px;
		width: calc(100% + 12px);
		height: 128px;
		border-radius: 16px;
		border: 2px solid rgba(24, 178, 107, 0.5);
		animation: sonar 1.8s ease-out infinite;
	}
	@keyframes sonar {
		0%   { transform: scale(1); opacity: 1; }
		100% { transform: scale(1.3); opacity: 0; }
	}
	.poster {
		width: 92px;
		height: 116px;
		border-radius: 13px;
		overflow: hidden;
		position: relative;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 3.5px rgba(195, 168, 240, 0.55),
			0 16px 34px -12px rgba(0, 0, 0, 0.85);
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
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.05) 30%, rgba(15, 16, 19, 0.92) 100%);
	}
	.poster-text {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 7px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.poster-title {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 11.5px;
		color: #f5f6f8;
	}
	.poster-going {
		font-weight: 700;
		font-size: 7.5px;
		letter-spacing: 0.09em;
		color: #2bce85;
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
		box-shadow: 0 0 0 2px #14161b;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
	}
	.pin-tip {
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		margin-top: -1px;
		border-radius: 1.5px;
	}
	.pin-tip.violet { background: rgba(195, 168, 240, 0.55); }

	.friends {
		position: absolute;
		right: 76px;
		top: 168px;
		display: flex;
	}
	.friend {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 13px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 0 0 2px #14161b;
		background: radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.5), transparent 62%), #17181d;
		color: #e3b678;
	}
	.friend.live {
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 4px #18b26b;
		z-index: 2;
	}
	.friend.f2 {
		margin-left: -10px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.5), transparent 62%), #17181d;
		color: #c3a8f0;
	}
	.you-dot {
		position: absolute;
		left: 200px;
		bottom: 92px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow:
			0 0 0 4px rgba(24, 178, 107, 0.22),
			0 0 0 8px rgba(24, 178, 107, 0.08);
	}
	.shot-caption {
		position: absolute;
		right: 16px;
		bottom: 14px;
		padding: 7px 13px;
		border-radius: 999px;
		background: rgba(23, 24, 29, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.12);
		font-weight: 600;
		font-size: 11.5px;
		color: #f5f6f8;
	}

	/* ── proof strip ── */
	.proof-band {
		border-top: 1px solid rgba(28, 27, 24, 0.1);
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.proof {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.proof-cell {
		padding: 30px;
		display: flex;
		flex-direction: column;
		gap: 5px;
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
		margin-bottom: 6px;
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

	/* ── console band (dark) ── */
	.console-band {
		background: #0f1013;
		color: #f5f6f8;
	}
	.console-inner {
		padding-top: 72px;
		padding-bottom: 72px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		text-align: center;
	}
	.console-headline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(28px, 4.4vw, 38px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.console-sub {
		font-size: 15.5px;
		line-height: 1.6;
		color: rgba(236, 237, 240, 0.55);
		max-width: 58ch;
		margin: 0;
	}
	.console-shot {
		width: 100%;
		margin-top: 26px;
		border-radius: 18px;
		background: #101115;
		border: 1px solid rgba(255, 255, 255, 0.09);
		display: flex;
		overflow: hidden;
		text-align: left;
		box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.8);
	}
	.cs-sidebar {
		width: 190px;
		flex: none;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
		background: #101115;
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 18px 13px 15px;
	}
	.cs-org {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 0 6px 14px;
	}
	.cs-tile {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.4), transparent 62%), #17181d;
		border: 1px solid rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 12px;
		color: #c3a8f0;
		position: relative;
		flex: none;
	}
	.cs-seal {
		position: absolute;
		right: -4px;
		bottom: -4px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #2d63f5;
		box-shadow: 0 0 0 2px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cs-org-meta {
		display: flex;
		flex-direction: column;
	}
	.cs-org-meta strong {
		font-weight: 700;
		font-size: 12.5px;
		color: #f5f6f8;
	}
	.cs-org-meta em {
		font-style: normal;
		font-weight: 400;
		font-size: 10px;
		color: rgba(236, 237, 240, 0.4);
	}
	.cs-nav {
		padding: 8px 10px;
		border-radius: 10px;
		font-weight: 600;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.55);
	}
	.cs-nav.active {
		background: rgba(45, 99, 245, 0.13);
		border: 1px solid rgba(45, 99, 245, 0.35);
		font-weight: 700;
		color: #f5f6f8;
	}
	.cs-verified {
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px;
		border-radius: 10px;
		background: rgba(24, 178, 107, 0.08);
		border: 1px solid rgba(24, 178, 107, 0.3);
		font-weight: 700;
		font-size: 10.5px;
		color: #2bce85;
	}
	.cs-vdot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #18b26b;
		flex: none;
	}
	.cs-main {
		flex: 1;
		min-width: 0;
		padding: 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.cs-head {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.cs-title {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 21px;
		letter-spacing: -0.02em;
		color: #f5f6f8;
	}
	.cs-tabs {
		display: flex;
		gap: 3px;
		padding: 3px;
		border-radius: 9px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.07);
	}
	.cs-tab {
		padding: 5px 11px;
		border-radius: 7px;
		font-weight: 600;
		font-size: 10.5px;
		color: rgba(236, 237, 240, 0.55);
	}
	.cs-tab.on {
		background: #2d63f5;
		font-weight: 700;
		color: #fff;
	}
	.cs-new {
		margin-left: auto;
		padding: 8px 14px;
		border-radius: 9px;
		background: #2d63f5;
		font-weight: 700;
		font-size: 11px;
		color: #fff;
		box-shadow: 0 8px 20px -6px rgba(45, 99, 245, 0.6);
	}
	.cs-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.cs-card {
		border-radius: 13px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}
	.cs-card.draft {
		background: #101115;
		border: 1px dashed rgba(255, 255, 255, 0.18);
	}
	.cs-photo {
		height: 96px;
		position: relative;
		background: #101115;
	}
	.cs-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.cs-photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.1) 30%, rgba(15, 16, 19, 0.9) 100%);
	}
	.cs-photo.dashed {
		background:
			radial-gradient(120% 70% at 85% -8%, rgba(201, 141, 60, 0.28), rgba(201, 141, 60, 0) 58%),
			#17181d;
	}
	.cs-photo.dashed::after {
		display: none;
	}
	.cs-chip {
		position: absolute;
		left: 9px;
		top: 8px;
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 3.5px 8px;
		border-radius: 999px;
		background: rgba(15, 16, 19, 0.55);
		font-weight: 700;
		font-size: 7.5px;
		letter-spacing: 0.12em;
		color: #f5f6f8;
		z-index: 2;
	}
	.cs-chip.live {
		background: rgba(24, 178, 107, 0.16);
		border: 1px solid rgba(24, 178, 107, 0.45);
		color: #2bce85;
	}
	.cs-chip.dashedchip {
		background: rgba(255, 255, 255, 0.05);
		border: 1px dashed rgba(255, 255, 255, 0.25);
		color: rgba(236, 237, 240, 0.55);
	}
	.cs-chipdot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #18b26b;
	}
	.cs-card-title {
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: 8px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 13px;
		letter-spacing: -0.015em;
		color: #f5f6f8;
		z-index: 2;
	}
	.cs-card-title.dim {
		color: rgba(245, 246, 248, 0.8);
	}
	.cs-counts {
		padding: 10px 12px 12px;
		font-weight: 600;
		font-size: 11px;
		color: rgba(236, 237, 240, 0.5);
	}
	.cs-counts strong {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 15px;
		color: #f5f6f8;
	}
	.cs-counts strong.green {
		color: #2bce85;
	}
	.cs-counts.dim {
		font-weight: 400;
		color: rgba(236, 237, 240, 0.45);
	}
	.console-link {
		margin-top: 18px;
		font-weight: 700;
		font-size: 14px;
		color: #5b85f7;
		text-decoration: none;
	}
	.console-link:hover {
		text-decoration: underline;
	}

	/* ── roadmap ── */
	.roadmap-band {
		border-top: 1px solid rgba(28, 27, 24, 0.1);
	}
	.roadmap-inner {
		padding-top: 60px;
		padding-bottom: 64px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.roadmap-inner h2 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(26px, 4vw, 34px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.roadmap-sub {
		font-size: 15px;
		line-height: 1.6;
		color: rgba(28, 27, 24, 0.6);
		max-width: 62ch;
		margin: 0;
	}
	.roadmap-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 14px;
	}
	.roadmap-card {
		border: 1.5px dashed rgba(28, 27, 24, 0.22);
		border-radius: 18px;
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: rgba(255, 255, 255, 0.4);
	}
	.roadmap-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 4px;
	}
	.roadmap-icon {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: rgba(45, 99, 245, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.roadmap-tag {
		font-weight: 700;
		font-size: 9.5px;
		letter-spacing: 0.14em;
		color: rgba(28, 27, 24, 0.4);
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px dashed rgba(28, 27, 24, 0.25);
	}
	.roadmap-card h3 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 18px;
		letter-spacing: -0.015em;
		margin: 0;
	}
	.roadmap-card p {
		font-size: 13.5px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		margin: 0;
	}
	.roadmap-note {
		font-size: 13px;
		font-weight: 600;
		color: rgba(28, 27, 24, 0.45);
		margin: 6px 0 0;
	}

	/* ── verify + apply ── */
	.apply-inner {
		display: flex;
		gap: 56px;
		align-items: flex-start;
		padding-top: 64px;
		padding-bottom: 72px;
	}
	.verify-copy {
		flex: 1.1;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.verify-copy h2 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(26px, 4vw, 34px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.verify-copy p {
		font-size: 15.5px;
		line-height: 1.6;
		color: rgba(28, 27, 24, 0.6);
		max-width: 48ch;
		margin: 0;
	}
	.verify-list {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.verify-list li {
		position: relative;
		padding-left: 26px;
		font-size: 14px;
		line-height: 1.5;
		color: rgba(28, 27, 24, 0.6);
	}
	.verify-list li strong {
		color: #1c1b18;
	}
	.verify-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 3px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #2d63f5;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round'%3E%3Cpath d='M4.5 12.5l5 5L19.5 7'/%3E%3C/svg%3E");
		background-size: 9px;
		background-repeat: no-repeat;
		background-position: center;
	}
	.apply-col {
		flex: 1;
	}
	.apply-card {
		padding: 22px;
		border-radius: 16px;
		background: #fff;
		border: 1px solid rgba(28, 27, 24, 0.12);
		box-shadow: 0 20px 50px rgba(28, 27, 24, 0.08);
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
		height: 44px;
		border-radius: 11px;
		border: 1px solid rgba(28, 27, 24, 0.18);
		padding: 0 14px;
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
	.form-cta {
		width: 100%;
		padding: 14px 0;
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
		padding: 14px 18px;
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

	/* ── footer ── */
	.footer {
		/* app.css styles the bare <footer> element (900px, centered, big
		   padding) — reset it so this one is ours. */
		max-width: none;
		width: 100%;
		margin: 0;
		padding: 0;
		text-align: left;
		border-top: 1px solid rgba(28, 27, 24, 0.1);
	}
	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding-top: 22px;
		padding-bottom: 30px;
	}
	.footer-link {
		font-size: 12.5px;
		font-weight: 600;
		color: rgba(28, 27, 24, 0.45);
		text-decoration: none;
	}
	.footer-link:hover {
		color: #2d63f5;
	}

	/* ── responsive ── */
	@media (max-width: 900px) {
		.shell {
			padding-left: 22px;
			padding-right: 22px;
		}
		.hero-inner {
			flex-direction: column;
			align-items: stretch;
			gap: 40px;
			padding-top: 44px;
			padding-bottom: 56px;
		}
		.shot-wrap {
			align-self: center;
			width: 100%;
		}
		.proof {
			grid-template-columns: 1fr;
		}
		.proof-cell:not(:last-child) {
			border-right: 0;
			border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		}
		.console-shot {
			flex-direction: column;
		}
		.cs-sidebar {
			width: 100%;
			flex-direction: row;
			align-items: center;
			border-right: 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.07);
			padding: 12px 13px;
		}
		.cs-org {
			padding: 0 6px 0 0;
		}
		.cs-verified {
			margin-top: 0;
			margin-left: auto;
		}
		.cs-grid {
			grid-template-columns: 1fr;
		}
		.roadmap-grid {
			grid-template-columns: 1fr;
		}
		.apply-inner {
			flex-direction: column;
			gap: 40px;
		}
		.apply-col {
			width: 100%;
		}
		.cta {
			width: 100%;
		}
		.cta-stack {
			width: 100%;
		}
		.for-tag {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.sonar {
			animation: none;
		}
	}
</style>
