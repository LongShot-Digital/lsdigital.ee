<script lang="ts">
	// Waitlist signups land in the same Web3Forms inbox as organizer
	// applications (info@lsdigital.ee) — one pipeline, no third-party popup.
	const WEB3FORMS_KEY = '74131967-39f2-4010-b10e-4769f4aa0303';

	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state(false);

	async function joinWaitlist(e: SubmitEvent) {
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
					subject: `Marco waitlist — ${data.email ?? ''}`,
					from_name: 'Marco waitlist',
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

	/// Nav CTA: bring the hero form into view and put the cursor in it.
	function focusWaitlist() {
		const input = document.querySelector<HTMLInputElement>('.wl-form input[name="email"]');
		input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		setTimeout(() => input?.focus({ preventScroll: true }), 350);
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

	<title>Marco — a map of your people's nights</title>
	<meta
		name="description"
		content="See what friends are planning, say Marco, decide in minutes. A live map of your people's nights — coming soon, built for iPhone."
	/>
</svelte:head>

{#snippet appIcon(size: number)}
	<svg
		width={size}
		height={size}
		viewBox="0 0 1024 1024"
		xmlns="http://www.w3.org/2000/svg"
		aria-label="Marco"
		style="border-radius: {Math.round(size * 0.23)}px; display: block;"
	>
		<rect width="1024" height="1024" rx="228" ry="228" fill="#F4F1EA" />
		<circle cx="512" cy="512" r="298" fill="#2D63F5" />
		<circle cx="512" cy="512" r="172" fill="#F4F1EA" />
		<circle cx="600" cy="446" r="70" fill="#18B26B" />
	</svg>
{/snippet}

<main class="marco">
	<!-- ── nav ── -->
	<nav class="nav">
		<div class="shell nav-inner">
			<span class="brandline">
				<span class="logo-sm">{@render appIcon(34)}</span>
				<span class="wordmark-sm">Marco</span>
			</span>
			<div class="nav-actions">
				<a href="/app/marco/organizers" class="nav-link">For organizers</a>
				<button class="nav-cta" onclick={focusWaitlist}>Get early access</button>
			</div>
		</div>
	</nav>

	<!-- ── hero ── -->
	<header class="hero-band">
		<div class="shell hero-inner">
			<div class="hero-copy">
				<span class="status"><span class="dot"></span>Coming soon · built for iPhone</span>
				<h1 class="headline">A map of your people&rsquo;s nights.</h1>
				<p class="sub">
					See what friends are planning, say Marco, decide in minutes — no group-chat
					archaeology, no feeds, no strangers.
				</p>
				{#if submitted}
					<div class="success">
						<span class="check">✓</span>
						You&rsquo;re on the list. We&rsquo;ll let you know when Marco opens.
					</div>
				{:else}
					<div class="cta-stack">
						<form class="wl-form" onsubmit={joinWaitlist}>
							<input name="email" type="email" placeholder="you@email.com" required autocomplete="email" aria-label="Your email address" />
							<button class="cta wl-btn" type="submit" disabled={submitting}>
								{submitting ? 'Adding…' : 'Get early access'}
							</button>
						</form>
						{#if error}
							<span class="wl-error">Something went wrong — email us at info@lsdigital.ee instead.</span>
						{:else}
							<span class="cta-sub">Just your email — we&rsquo;ll only use it for the launch.</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- phone shot, drawn to match the shipped app -->
			<div class="phone-wrap" role="img" aria-label="The Marco map: plans as poster pins, friends as circles with a green live ring">
				<div class="phone">
					<div class="screen">
						<div class="street s1"></div>
						<div class="street s2"></div>
						<div class="street s3"></div>
						<div class="street s4"></div>

						<!-- top chrome: date pill + filter, search -->
						<div class="map-topbar">
							<span class="date-pill">
								<span class="pill-dot"></span>Today
								<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="rgba(245,246,248,0.4)" stroke-width="2"><path d="M3 5l3 3 3-3" /></svg>
							</span>
							<span class="chrome-circle">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(245,246,248,0.75)" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
							</span>
							<span class="spacer"></span>
							<span class="chrome-circle">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(245,246,248,0.75)" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>
							</span>
						</div>

						<!-- full-tier poster pin: cobalt ring = yours, avatars in the corner -->
						<div class="pin pin-main">
							<div class="poster">
								<img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&q=75&auto=format&fit=crop" alt="" loading="lazy" />
								<div class="poster-scrim"></div>
								<div class="poster-text">
									<span class="poster-title">Sunset run club</span>
									<span class="poster-meta">7 AM · HOSTING</span>
								</div>
								<span class="stack-badge">+2</span>
							</div>
							<div class="pin-avatars" aria-hidden="true">
								<span class="pav emoji">🌵</span>
								<span class="pav mono">J</span>
							</div>
							<div class="pin-tip cobalt" aria-hidden="true"></div>
						</div>

						<!-- chip-tier organizer pin with the ink seal -->
						<div class="pin pin-side">
							<div class="poster poster-chip">
								<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
								<div class="poster-scrim"></div>
								<span class="chip-time">10 PM</span>
							</div>
							<span class="pin-seal" aria-hidden="true">
								<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F5F6F8" stroke-width="3.2" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
							</span>
							<div class="pin-tip violet" aria-hidden="true"></div>
						</div>

						<!-- friends: circles, one live -->
						<div class="friends" aria-hidden="true">
							<span class="friend live">P</span>
							<span class="friend f2">T</span>
						</div>

						<!-- your green dot -->
						<span class="you-dot" aria-hidden="true"></span>

						<!-- locate + create, stacked like the app -->
						<span class="locate" aria-hidden="true">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(245,246,248,0.8)" stroke-width="2.2" stroke-linejoin="round"><path d="M21 3L10 14M21 3l-7 18-2.8-7.2L4 11z" /></svg>
						</span>
						<span class="fab" aria-hidden="true">
							<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>
						</span>

						<!-- tab bar, iconography matching the app -->
						<div class="tabbar" aria-hidden="true">
							<span class="tab active">
								<svg width="19" height="19" viewBox="0 0 22 22"><path d="M11 2l8 9-8 9-8-9z" fill="#5B85F7" /></svg>
								<span>Map</span>
							</span>
							<span class="tab">
								<svg width="19" height="19" viewBox="0 0 22 22"><g fill="rgba(245,246,248,0.38)"><rect x="4" y="4.5" width="14" height="3" rx="1.5" /><rect x="4" y="9.5" width="14" height="3" rx="1.5" /><rect x="4" y="14.5" width="9" height="3" rx="1.5" /></g></svg>
								<span>Plans</span>
							</span>
							<span class="tab">
								<svg width="19" height="19" viewBox="0 0 22 22"><g fill="rgba(245,246,248,0.38)"><circle cx="8" cy="11" r="4.5" /><circle cx="15.5" cy="11" r="4.5" opacity="0.7" /></g></svg>
								<span>Friends</span>
							</span>
							<span class="tab">
								<svg width="19" height="19" viewBox="0 0 22 22"><g fill="rgba(245,246,248,0.38)"><circle cx="11" cy="7.5" r="4" /><path d="M3.5 19c1.5-4.5 13.5-4.5 15 0z" /></g></svg>
								<span>Profile</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- ── dark band: the poster field, wide ── -->
	<section class="field-band">
		<div class="shell field-inner">
			<h2 class="field-headline">The night, laid out.</h2>
			<p class="field-sub">
				Plans are posters pinned where they happen. Friends are circles — a green ring
				means they&rsquo;re out. One glance and you know where tonight is.
			</p>
			<div class="field-stage" aria-hidden="true">
				<div class="fstreet fs1"></div>
				<div class="fstreet fs2"></div>
				<div class="fstreet fs3"></div>

				<div class="fpin fp1">
					<div class="sonar"></div>
					<div class="fposter">
						<img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
						<div class="poster-scrim"></div>
						<div class="poster-text">
							<span class="poster-title sm">Negroni hour</span>
							<span class="poster-going">3 GOING</span>
						</div>
					</div>
					<div class="pin-tip gold"></div>
				</div>

				<div class="fpin fp2">
					<div class="fposter chip">
						<img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
						<div class="poster-scrim"></div>
						<span class="chip-time">9 PM</span>
					</div>
					<span class="pin-seal">
						<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F5F6F8" stroke-width="3.2" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
					</span>
					<div class="pin-tip violet"></div>
				</div>

				<div class="fpin fp3">
					<div class="fposter mini"></div>
				</div>

				<div class="ffriends">
					<span class="friend live">L</span>
					<span class="friend f3">N</span>
				</div>

				<span class="fyou"></span>
			</div>
		</div>
	</section>

	<!-- ── three beats ── -->
	<section class="beats-band">
		<div class="shell beats">
			<div class="beat">
				<div class="beat-visual">
					<span class="mini-friend live">J</span>
					<span class="mini-friend b">L</span>
					<span class="mini-friend c">N</span>
				</div>
				<h3>Friends first</h3>
				<p>
					Your map shows the people you approved — nobody else. A green ring means
					they&rsquo;re out tonight. No followers, no feed, no strangers.
				</p>
			</div>
			<div class="beat">
				<div class="beat-visual">
					<span class="mini-poster">
						<img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&q=70&auto=format&fit=crop" alt="" loading="lazy" />
						<span class="mini-poster-scrim"></span>
						<span class="mini-poster-time">7 PM</span>
					</span>
				</div>
				<h3>Plans as posters</h3>
				<p>
					Every plan is a poster pinned where it happens — who&rsquo;s going, when it
					starts, one tap to join.
				</p>
			</div>
			<div class="beat">
				<div class="beat-visual">
					<span class="marco-bubble">Marco</span>
					<span class="polo-bubble">Polo!</span>
				</div>
				<h3>Say Marco</h3>
				<p>
					Free tonight? Ping a friend. They answer Polo, and the night has a plan —
					decided in minutes, not forty unread messages.
				</p>
			</div>
		</div>
	</section>

	<!-- ── poster share ── -->
	<section class="share-band">
		<div class="shell share-inner">
			<div class="share-poster-wrap" role="img" aria-label="A Marco event poster, ready to share to stories">
				<div class="share-poster">
					<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&q=75&auto=format&fit=crop" alt="" loading="lazy" />
					<div class="sp-scrim"></div>
					<span class="sp-chip">MUSIC</span>
					<div class="sp-text">
						<span class="sp-title">Vinyl night</span>
						<span class="sp-when">Fri · 10 PM · Le Motel</span>
						<span class="sp-host">
							<span class="sp-host-tile">LM<span class="sp-seal"><svg width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg></span></span>
							Le Motel · <em>Verified</em>
						</span>
					</div>
					<div class="sp-footer">
						<span class="sp-brand"><span class="sp-aperture"></span>marco</span>
						<span class="sp-qr">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#101115" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1" /></svg>
						</span>
					</div>
				</div>
			</div>
			<div class="share-copy">
				<h2>Every plan ships as a poster.</h2>
				<p>
					Made a plan? Marco renders it as a poster — story, post or square — with a QR
					code that drops friends straight onto your pin. The flyer is back, and it&rsquo;s
					yours.
				</p>
			</div>
		</div>
	</section>

	<!-- ── trust ── -->
	<section class="trust-band">
		<div class="shell trust-inner">
			<h2>A tool, not a feed.</h2>
			<div class="trust-grid">
				<div class="trust-cell">
					<span class="trust-icon">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
					</span>
					<p><strong>Location, while-using only.</strong> Visible to friends you approve, never sold, never shared with organizers, off with one switch.</p>
				</div>
				<div class="trust-cell">
					<span class="trust-icon">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4.5 14.5-4.5 16 0" /></svg>
					</span>
					<p><strong>No followers, no algorithm.</strong> Nothing to scroll, nothing to perform. The map shows tonight, then you go live it.</p>
				</div>
				<div class="trust-cell">
					<span class="trust-icon">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d63f5" stroke-width="2" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
					</span>
					<p><strong>Every venue verified by hand.</strong> Organizers get on the map after a call with us — no spam, no ghost listings.</p>
				</div>
			</div>
			<a href="/app/marco/organizers" class="trust-org-link">Hosting events? Marco for Organizers →</a>
		</div>
	</section>

	<!-- ── final CTA ── -->
	<section class="final-band">
		<div class="shell final-inner">
			<span class="logo-lg">{@render appIcon(96)}</span>
			<h2>Be first on the map.</h2>
			{#if submitted}
				<div class="success">
					<span class="check">✓</span>
					You&rsquo;re on the list. We&rsquo;ll let you know when Marco opens.
				</div>
			{:else}
				<form class="wl-form" onsubmit={joinWaitlist}>
					<input name="email" type="email" placeholder="you@email.com" required autocomplete="email" aria-label="Your email address" />
					<button class="cta wl-btn" type="submit" disabled={submitting}>
						{submitting ? 'Adding…' : 'Get early access'}
					</button>
				</form>
				{#if error}
					<span class="wl-error">Something went wrong — email us at info@lsdigital.ee instead.</span>
				{:else}
					<span class="cta-sub">Built for iPhone · launching with the first cities soon</span>
				{/if}
			{/if}
		</div>
	</section>

	<footer class="footer">
		<div class="shell footer-inner">
			<a href="/" class="footer-link">← from LongShot Digital</a>
			<a href="/app/marco/organizers" class="footer-link">Marco for Organizers</a>
		</div>
	</footer>
</main>

<style>
	.marco {
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
	}
	.logo-sm {
		display: block;
		border-radius: 9px;
		box-shadow: 0 4px 12px rgba(45, 99, 245, 0.16);
	}
	.wordmark-sm {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 20px;
		letter-spacing: -0.02em;
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
		border: 0;
		padding: 10px 18px;
		border-radius: 11px;
		background: #1c1b18;
		font-family: inherit;
		font-weight: 700;
		font-size: 13px;
		color: #f4f1ea;
		cursor: pointer;
	}
	.nav-cta:hover {
		background: #33312c;
	}

	/* ── hero ── */
	.hero-band {
		position: relative;
		overflow: hidden;
	}
	/* faint hairline grid — the map, whispered */
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
		flex: 1.1;
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
		font-size: clamp(36px, 5.8vw, 52px);
		line-height: 1.03;
		letter-spacing: -0.03em;
		margin: 0;
		text-wrap: balance;
	}
	.sub {
		font-size: 17px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		max-width: 42ch;
		margin: 0;
	}
	.cta-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 6px;
	}
	.cta {
		border: 0;
		background: #2d63f5;
		color: #fff;
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		padding: 15px 30px;
		border-radius: 13px;
		cursor: pointer;
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
	.wl-form {
		display: flex;
		gap: 10px;
		width: 100%;
		max-width: 460px;
	}
	.wl-form input {
		flex: 1;
		min-width: 0;
		height: 52px;
		border-radius: 13px;
		border: 1px solid rgba(28, 27, 24, 0.18);
		background: #fff;
		padding: 0 16px;
		font-family: inherit;
		font-weight: 500;
		font-size: 15px;
		color: #1c1b18;
		outline: none;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	.wl-form input:focus {
		border-color: #2d63f5;
		box-shadow: 0 0 0 3px rgba(45, 99, 245, 0.12);
	}
	.wl-form input::placeholder {
		color: rgba(28, 27, 24, 0.4);
	}
	.wl-btn {
		flex: none;
		padding: 0 22px;
		height: 52px;
	}
	.wl-btn:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.wl-error {
		font-size: 12.5px;
		color: #c2402a;
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
		margin-top: 6px;
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

	/* ── phone ── */
	.phone-wrap {
		flex: 1;
		display: flex;
		justify-content: center;
		min-width: 0;
	}
	.phone {
		width: 300px;
		max-width: 100%;
		border-radius: 46px;
		background: #0f1013;
		padding: 11px;
		box-shadow:
			0 50px 100px -30px rgba(28, 27, 24, 0.5),
			0 0 0 1px rgba(28, 27, 24, 0.16);
	}
	.screen {
		position: relative;
		height: 580px;
		border-radius: 37px;
		background: #14161b;
		overflow: hidden;
	}
	.street {
		position: absolute;
		background: rgba(245, 246, 248, 0.055);
	}
	.s1 { left: -30px; top: 160px; width: 150%; height: 6px; transform: rotate(-6deg); }
	.s2 { left: -30px; top: 360px; width: 150%; height: 5px; transform: rotate(-6deg); background: rgba(245, 246, 248, 0.04); }
	.s3 { left: 84px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); }
	.s4 { left: 214px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); background: rgba(245, 246, 248, 0.04); }

	.map-topbar {
		position: absolute;
		left: 14px;
		right: 14px;
		top: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		z-index: 3;
	}
	.map-topbar .spacer {
		flex: 1;
	}
	.date-pill {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 13px;
		border-radius: 999px;
		background: #1f2127;
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-weight: 600;
		font-size: 12.5px;
		color: #f5f6f8;
	}
	.pill-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #18b26b;
	}
	.chrome-circle {
		width: 33px;
		height: 33px;
		border-radius: 50%;
		background: #1f2127;
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pin {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pin-main { left: 34px; top: 92px; z-index: 2; }
	.pin-side { right: 34px; top: 268px; }

	.poster {
		width: 92px;
		height: 116px;
		border-radius: 13px;
		overflow: hidden;
		position: relative;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 4px #2d63f5,
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
		right: 24px;
		bottom: 7px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.poster-title {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 11.5px;
		line-height: 1.15;
		color: #f5f6f8;
	}
	.poster-title.sm {
		font-size: 10.5px;
	}
	.poster-meta {
		font-weight: 700;
		font-size: 6.5px;
		letter-spacing: 0.07em;
		color: #5b85f7;
		white-space: nowrap;
	}
	.poster-going {
		font-weight: 700;
		font-size: 7.5px;
		letter-spacing: 0.09em;
		color: #2bce85;
	}
	.stack-badge {
		position: absolute;
		right: 5px;
		bottom: 5px;
		padding: 2.5px 6px;
		border-radius: 999px;
		background: rgba(15, 16, 19, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.18);
		font-weight: 700;
		font-size: 8px;
		color: #f5f6f8;
	}
	.pin-avatars {
		position: absolute;
		right: -9px;
		top: -9px;
		display: flex;
	}
	.pav {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 2px #14161b;
		font-size: 11px;
	}
	.pav.emoji {
		background: #22252c;
		z-index: 2;
	}
	.pav.mono {
		margin-left: -7px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.55), transparent 62%), #17181d;
		color: #e3b678;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 9.5px;
	}
	.poster-chip {
		width: 64px;
		height: 80px;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 3.5px rgba(195, 168, 240, 0.55),
			0 12px 26px -10px rgba(0, 0, 0, 0.8);
	}
	.chip-time {
		position: absolute;
		left: 7px;
		bottom: 5px;
		font-weight: 700;
		font-size: 7.5px;
		letter-spacing: 0.09em;
		color: rgba(245, 246, 248, 0.75);
	}
	.pin-seal {
		position: absolute;
		right: -7px;
		top: -7px;
		width: 19px;
		height: 19px;
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
	.pin-tip.cobalt { background: #2d63f5; }
	.pin-tip.violet { background: rgba(195, 168, 240, 0.55); }
	.pin-tip.gold { background: rgba(227, 182, 120, 0.55); }

	.friends {
		position: absolute;
		left: 120px;
		top: 356px;
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
	.friend.f3 {
		margin-left: -10px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(201, 101, 144, 0.5), transparent 62%), #17181d;
		color: #e59fbe;
	}

	.you-dot {
		position: absolute;
		left: 138px;
		top: 440px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow:
			0 0 0 4px rgba(24, 178, 107, 0.22),
			0 0 0 8px rgba(24, 178, 107, 0.08);
	}

	.locate {
		position: absolute;
		right: 16px;
		bottom: 132px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #1f2127;
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.fab {
		position: absolute;
		right: 14px;
		bottom: 82px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #2d63f5;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 10px 22px -6px rgba(45, 99, 245, 0.6);
	}

	.tabbar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 66px;
		border-top: 0.5px solid rgba(255, 255, 255, 0.08);
		background: rgba(15, 16, 19, 0.92);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		padding: 0 10px;
	}
	.tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		font-weight: 600;
		font-size: 10px;
		color: rgba(245, 246, 248, 0.38);
		padding: 7px 0;
	}
	.tab.active {
		font-weight: 700;
		color: #5b85f7;
		background: rgba(45, 99, 245, 0.14);
		border-radius: 14px;
	}

	/* ── dark field band ── */
	.field-band {
		background: #0f1013;
		color: #f5f6f8;
	}
	.field-inner {
		padding-top: 72px;
		padding-bottom: 72px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		text-align: center;
	}
	.field-headline {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(28px, 4.4vw, 38px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.field-sub {
		font-size: 15.5px;
		line-height: 1.6;
		color: rgba(236, 237, 240, 0.55);
		max-width: 56ch;
		margin: 0;
	}
	.field-stage {
		position: relative;
		width: 100%;
		height: 300px;
		margin-top: 26px;
		border-radius: 22px;
		background: #14161b;
		border: 1px solid rgba(255, 255, 255, 0.07);
		overflow: hidden;
	}
	.fstreet {
		position: absolute;
		background: rgba(245, 246, 248, 0.05);
	}
	.fs1 { left: -40px; top: 120px; width: 150%; height: 7px; transform: rotate(-4deg); }
	.fs2 { left: 20%; top: -30px; width: 5px; height: 130%; transform: rotate(5deg); }
	.fs3 { left: 68%; top: -30px; width: 4px; height: 130%; transform: rotate(5deg); background: rgba(245, 246, 248, 0.04); }

	.fpin {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.fp1 { left: 12%; top: 46px; }
	.fp2 { left: 46%; top: 84px; }
	.fp3 { right: 12%; top: 60px; }
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
	.fposter {
		width: 92px;
		height: 116px;
		border-radius: 13px;
		overflow: hidden;
		position: relative;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 3.5px rgba(227, 182, 120, 0.55),
			0 16px 34px -12px rgba(0, 0, 0, 0.85);
	}
	.fposter img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.fposter.chip {
		width: 64px;
		height: 80px;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 3.5px rgba(195, 168, 240, 0.55),
			0 12px 26px -10px rgba(0, 0, 0, 0.8);
	}
	.fposter.mini {
		width: 30px;
		height: 38px;
		border-radius: 8px;
		background: radial-gradient(130% 130% at 76% 6%, rgba(62, 158, 175, 0.3), transparent 62%), #17181d;
		box-shadow:
			0 0 0 2px #14161b,
			0 0 0 3px rgba(62, 158, 175, 0.4);
		opacity: 0.8;
	}
	.ffriends {
		position: absolute;
		left: 32%;
		bottom: 52px;
		display: flex;
	}
	.fyou {
		position: absolute;
		right: 26%;
		bottom: 64px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow:
			0 0 0 4px rgba(24, 178, 107, 0.22),
			0 0 0 8px rgba(24, 178, 107, 0.08);
	}

	/* ── beats ── */
	.beats-band {
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.beats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.beat {
		padding: 40px 30px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.beat:not(:last-child) {
		border-right: 1px solid rgba(28, 27, 24, 0.1);
	}
	.beat h3 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 19px;
		letter-spacing: -0.015em;
		margin: 0;
	}
	.beat p {
		font-size: 14px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		margin: 0;
	}
	.beat-visual {
		height: 56px;
		display: flex;
		align-items: center;
	}
	.mini-friend {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 13px;
		box-shadow: 0 0 0 2.5px #f4f1ea;
		background: radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.55), transparent 62%), #1c1b18;
		color: #e3b678;
	}
	.mini-friend.live {
		box-shadow:
			0 0 0 2.5px #f4f1ea,
			0 0 0 5px #18b26b;
		z-index: 2;
	}
	.mini-friend.b {
		margin-left: -9px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.55), transparent 62%), #1c1b18;
		color: #c3a8f0;
		z-index: 1;
	}
	.mini-friend.c {
		margin-left: -9px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(201, 101, 144, 0.55), transparent 62%), #1c1b18;
		color: #e59fbe;
	}
	.mini-poster {
		width: 40px;
		height: 52px;
		border-radius: 9px;
		overflow: hidden;
		position: relative;
		display: block;
		box-shadow:
			0 0 0 2px #f4f1ea,
			0 0 0 3.5px rgba(45, 99, 245, 0.45),
			0 8px 18px rgba(28, 27, 24, 0.2);
	}
	.mini-poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.mini-poster-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0) 40%, rgba(15, 16, 19, 0.85) 100%);
	}
	.mini-poster-time {
		position: absolute;
		left: 5px;
		bottom: 4px;
		font-weight: 700;
		font-size: 7px;
		letter-spacing: 0.08em;
		color: #5b85f7;
	}
	.marco-bubble,
	.polo-bubble {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 13px;
		padding: 8px 14px;
		border-radius: 14px;
	}
	.marco-bubble {
		background: #2d63f5;
		color: #fff;
		border-bottom-left-radius: 4px;
	}
	.polo-bubble {
		margin-left: 8px;
		background: rgba(24, 178, 107, 0.14);
		border: 1px solid rgba(24, 178, 107, 0.35);
		color: #0f6e56;
		border-bottom-right-radius: 4px;
	}

	/* ── poster share ── */
	.share-band {
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.share-inner {
		display: flex;
		align-items: center;
		gap: 56px;
		padding-top: 64px;
		padding-bottom: 64px;
	}
	.share-poster-wrap {
		flex: none;
		display: flex;
		justify-content: center;
	}
	.share-poster {
		width: 220px;
		height: 340px;
		border-radius: 18px;
		overflow: hidden;
		position: relative;
		background: #101115;
		box-shadow:
			0 30px 60px -20px rgba(28, 27, 24, 0.4),
			0 0 0 1px rgba(28, 27, 24, 0.12);
		transform: rotate(-2.5deg);
	}
	.share-poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.sp-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.05) 30%, rgba(15, 16, 19, 0.93) 100%);
	}
	.sp-chip {
		position: absolute;
		left: 13px;
		top: 13px;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(15, 16, 19, 0.55);
		backdrop-filter: blur(6px);
		font-weight: 700;
		font-size: 8.5px;
		letter-spacing: 0.13em;
		color: #f5f6f8;
	}
	.sp-text {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 46px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.sp-title {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 24px;
		letter-spacing: -0.02em;
		color: #f5f6f8;
	}
	.sp-when {
		font-weight: 500;
		font-size: 11.5px;
		color: rgba(245, 246, 248, 0.65);
	}
	.sp-host {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 4px;
		font-weight: 600;
		font-size: 10.5px;
		color: rgba(245, 246, 248, 0.8);
	}
	.sp-host em {
		font-style: normal;
		color: #5b85f7;
	}
	.sp-host-tile {
		width: 21px;
		height: 21px;
		border-radius: 6px;
		background: radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.4), transparent 62%), #17181d;
		border: 1px solid rgba(255, 255, 255, 0.14);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 700;
		font-size: 7.5px;
		color: #c3a8f0;
		position: relative;
		flex: none;
	}
	.sp-seal {
		position: absolute;
		right: -3px;
		bottom: -3px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2d63f5;
		box-shadow: 0 0 0 1.5px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sp-footer {
		position: absolute;
		left: 15px;
		right: 13px;
		bottom: 11px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.sp-brand {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 12px;
		color: rgba(245, 246, 248, 0.85);
	}
	.sp-aperture {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2.5px solid #2d63f5;
		position: relative;
		display: inline-block;
	}
	.sp-aperture::after {
		content: '';
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #18b26b;
		right: -1px;
		bottom: -1px;
	}
	.sp-qr {
		width: 26px;
		height: 26px;
		border-radius: 6px;
		background: #f5f6f8;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.share-copy {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.share-copy h2 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(26px, 4vw, 34px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.share-copy p {
		font-size: 15.5px;
		line-height: 1.6;
		color: rgba(28, 27, 24, 0.6);
		max-width: 48ch;
		margin: 0;
	}

	/* ── trust ── */
	.trust-band {
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.trust-inner {
		padding-top: 60px;
		padding-bottom: 60px;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}
	.trust-inner h2 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(26px, 4vw, 34px);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.trust-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 28px;
	}
	.trust-cell {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.trust-icon {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: rgba(45, 99, 245, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.trust-cell p {
		font-size: 13.5px;
		line-height: 1.55;
		color: rgba(28, 27, 24, 0.6);
		margin: 0;
	}
	.trust-cell strong {
		color: #1c1b18;
	}
	.trust-org-link {
		font-weight: 700;
		font-size: 13.5px;
		color: #2d63f5;
		text-decoration: none;
	}
	.trust-org-link:hover {
		text-decoration: underline;
	}

	/* ── final CTA ── */
	.final-inner {
		padding-top: 72px;
		padding-bottom: 64px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		text-align: center;
	}
	.logo-lg {
		display: block;
		border-radius: 22px;
		box-shadow: 0 18px 48px rgba(45, 99, 245, 0.18);
		animation: bob 4.5s ease-in-out infinite;
	}
	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50%      { transform: translateY(-5px); }
	}
	.final-inner h2 {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(28px, 4.6vw, 40px);
		letter-spacing: -0.028em;
		margin: 0;
	}
	.final-inner .wl-form {
		justify-content: center;
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
	@media (max-width: 860px) {
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
		.phone-wrap {
			align-self: center;
		}
		.beats {
			grid-template-columns: 1fr;
		}
		.beat {
			padding: 28px 0;
		}
		.beat:not(:last-child) {
			border-right: 0;
			border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		}
		.share-inner {
			flex-direction: column;
			gap: 40px;
		}
		.trust-grid {
			grid-template-columns: 1fr;
		}
		.cta {
			width: 100%;
		}
		.cta-stack {
			width: 100%;
		}
		.wl-form {
			flex-direction: column;
			max-width: none;
		}
		.wl-btn {
			width: 100%;
		}
		.field-stage {
			height: 260px;
		}
		.fp3 { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.sonar,
		.logo-lg {
			animation: none;
		}
	}
</style>
