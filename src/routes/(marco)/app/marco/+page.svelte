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
	<style>
		html,
		body {
			background: #f4f1ea;
		}
	</style>

	<title>Marco — a map of your people's nights</title>
	<meta
		name="description"
		content="See what friends are planning, say Marco, decide in minutes. A live map of your people's nights — coming soon, built for iPhone."
	/>
	<script src="https://tally.so/widgets/embed.js"></script>
</svelte:head>

<main class="marco">
	<!-- nav -->
	<nav class="nav">
		<span class="brandline">
			<span class="aperture" aria-hidden="true"></span>
			<span class="wordmark-sm">marco</span>
		</span>
		<div class="nav-actions">
			<a href="/app/marco/organizers" class="nav-link">For organizers</a>
			<button class="nav-cta" onclick={openWaitlist}>Get early access</button>
		</div>
	</nav>

	<!-- hero: claim left, the live map right -->
	<header class="marco-hero">
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
					<button class="cta" onclick={openWaitlist}>Get early access</button>
					<span class="cta-sub">Drop your email — we&rsquo;ll only use it for the launch.</span>
				</div>
			{/if}
		</div>

		<!-- phone product shot: the Poster Field, drawn honest -->
		<div class="phone-wrap" role="img" aria-label="The Marco map: friends' plans as poster pins, friends as circles with a green live ring">
			<div class="phone">
				<div class="map">
					<div class="street s1"></div>
					<div class="street s2"></div>
					<div class="street s3"></div>
					<div class="street s4"></div>

					<!-- date pill + search -->
					<span class="date-pill"><span class="pill-dot"></span>Today</span>
					<span class="search" aria-hidden="true">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(245,246,248,0.7)" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>
					</span>

					<!-- pulsing poster pin (friends going) -->
					<div class="pin pin-main">
						<div class="sonar" aria-hidden="true"></div>
						<div class="poster">
							<img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
							<div class="poster-scrim"></div>
							<div class="poster-title">Negroni hour</div>
							<div class="poster-going">3 GOING</div>
						</div>
						<div class="pin-tip" aria-hidden="true"></div>
					</div>

					<!-- second, smaller pin with the organizer seal -->
					<div class="pin pin-side">
						<div class="poster poster-sm">
							<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&q=70&auto=format&fit=crop" alt="" loading="lazy" />
							<div class="poster-scrim"></div>
							<div class="poster-title sm">Vinyl night</div>
						</div>
						<span class="pin-seal" aria-hidden="true">
							<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F5F6F8" stroke-width="3.2" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
						</span>
					</div>

					<!-- friends: circles, one live -->
					<div class="friends" aria-hidden="true">
						<span class="friend live">P</span>
						<span class="friend f2">T</span>
					</div>

					<!-- your green dot -->
					<span class="you-dot" aria-hidden="true"></span>

					<!-- + button -->
					<span class="fab" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>
					</span>

					<!-- tab bar hint -->
					<div class="tabbar" aria-hidden="true">
						<span class="tab active">Map</span>
						<span class="tab">Plans</span>
						<span class="tab">Friends</span>
						<span class="tab">Profile</span>
					</div>
				</div>
			</div>
			<span class="shot-caption">The Poster Field — plans as posters, friends as circles</span>
		</div>
	</header>

	<!-- three beats: the product grammar -->
	<section class="beats">
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
					<img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=200&q=70&auto=format&fit=crop" alt="" loading="lazy" />
					<span class="mini-poster-scrim"></span>
					<span class="mini-poster-time">7 PM</span>
				</span>
			</div>
			<h3>Plans as posters</h3>
			<p>
				Every plan is a poster pinned where it happens — who&rsquo;s going, when it
				starts, one tap to join. Share it anywhere as the same poster.
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
	</section>

	<!-- organizers strip -->
	<section class="org-strip">
		<div class="org-strip-copy">
			<span class="org-seal" aria-hidden="true">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
			</span>
			<p>
				<strong>Real venues live here too.</strong> Every organizer on the map is
				verified by hand — no spam, no ghost listings.
			</p>
		</div>
		<a href="/app/marco/organizers" class="org-strip-link">Marco for Organizers →</a>
	</section>

	<a href="/" class="back">← from LongShot Digital</a>
</main>

<style>
	.marco {
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

	/* ── nav ── */
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
	.wordmark-sm {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 19px;
		letter-spacing: -0.02em;
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 18px;
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
		padding: 9px 18px;
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
	.marco-hero {
		display: flex;
		gap: 40px;
		align-items: center;
		padding: 56px 44px 52px;
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
		font-size: clamp(34px, 5.6vw, 48px);
		line-height: 1.04;
		letter-spacing: -0.03em;
		margin: 0;
		text-wrap: balance;
	}
	.sub {
		font-size: 16.5px;
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
		padding: 14px 28px;
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

	/* ── phone shot ── */
	.phone-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.phone {
		width: 290px;
		max-width: 100%;
		border-radius: 44px;
		background: #0f1013;
		padding: 10px;
		box-shadow:
			0 40px 80px -30px rgba(28, 27, 24, 0.45),
			0 0 0 1px rgba(28, 27, 24, 0.15);
	}
	.map {
		position: relative;
		height: 560px;
		border-radius: 36px;
		background: #101115;
		overflow: hidden;
	}
	.street {
		position: absolute;
		background: rgba(245, 246, 248, 0.05);
	}
	.s1 { left: -30px; top: 150px; width: 150%; height: 6px; transform: rotate(-6deg); }
	.s2 { left: -30px; top: 350px; width: 150%; height: 5px; transform: rotate(-6deg); background: rgba(245, 246, 248, 0.04); }
	.s3 { left: 80px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); }
	.s4 { left: 210px; top: -30px; width: 4px; height: 120%; transform: rotate(5deg); background: rgba(245, 246, 248, 0.04); }

	.date-pill {
		position: absolute;
		left: 16px;
		top: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 13px;
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
	.search {
		position: absolute;
		right: 16px;
		top: 16px;
		width: 32px;
		height: 32px;
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
	.pin-main { left: 38px; top: 88px; }
	.pin-side { right: 30px; top: 240px; opacity: 0.92; }
	.sonar {
		position: absolute;
		inset: -6px 0 auto -6px;
		width: calc(100% + 12px);
		height: 116px;
		border-radius: 16px;
		border: 2px solid rgba(24, 178, 107, 0.5);
		animation: sonar 1.8s ease-out infinite;
	}
	@keyframes sonar {
		0%   { transform: scale(1); opacity: 1; }
		100% { transform: scale(1.3); opacity: 0; }
	}
	.poster {
		width: 84px;
		height: 104px;
		border-radius: 13px;
		overflow: hidden;
		position: relative;
		box-shadow:
			0 0 0 2px #101115,
			0 0 0 3.5px rgba(227, 182, 120, 0.55),
			0 14px 30px -10px rgba(0, 0, 0, 0.8);
	}
	.poster-sm {
		width: 62px;
		height: 78px;
		box-shadow:
			0 0 0 2px #101115,
			0 0 0 3px rgba(195, 168, 240, 0.5),
			0 12px 26px -10px rgba(0, 0, 0, 0.8);
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
	.poster-title.sm {
		bottom: 6px;
		font-size: 9px;
		white-space: nowrap;
	}
	.poster-going {
		position: absolute;
		left: 7px;
		bottom: 6px;
		font-weight: 700;
		font-size: 8px;
		letter-spacing: 0.1em;
		color: #2bce85;
	}
	.pin-tip {
		width: 8px;
		height: 8px;
		background: rgba(227, 182, 120, 0.55);
		transform: rotate(45deg);
		margin-top: -2px;
		border-radius: 1.5px;
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
		box-shadow: 0 0 0 2px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.friends {
		position: absolute;
		left: 128px;
		top: 340px;
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
		box-shadow: 0 0 0 2px #101115;
		background: radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.5), transparent 62%), #17181d;
		color: #e3b678;
	}
	.friend.live {
		box-shadow:
			0 0 0 2px #101115,
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
		left: 132px;
		top: 420px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #18b26b;
		box-shadow:
			0 0 0 4px rgba(24, 178, 107, 0.22),
			0 0 0 8px rgba(24, 178, 107, 0.08);
	}

	.fab {
		position: absolute;
		right: 16px;
		bottom: 78px;
		width: 38px;
		height: 38px;
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
		height: 60px;
		border-top: 0.5px solid rgba(255, 255, 255, 0.08);
		background: rgba(15, 16, 19, 0.9);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
	}
	.tab {
		flex: 1;
		text-align: center;
		font-weight: 600;
		font-size: 10.5px;
		color: rgba(245, 246, 248, 0.38);
	}
	.tab.active {
		font-weight: 700;
		color: #5b85f7;
	}

	.shot-caption {
		font-weight: 600;
		font-size: 12px;
		color: rgba(28, 27, 24, 0.45);
	}

	/* ── beats ── */
	.beats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		border-top: 1px solid rgba(28, 27, 24, 0.1);
		border-bottom: 1px solid rgba(28, 27, 24, 0.1);
	}
	.beat {
		padding: 30px;
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
		font-size: 18px;
		letter-spacing: -0.015em;
		margin: 0;
	}
	.beat p {
		font-size: 13.5px;
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

	/* ── organizers strip ── */
	.org-strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 24px 44px;
		flex-wrap: wrap;
	}
	.org-strip-copy {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.org-seal {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #2d63f5;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.org-strip-copy p {
		font-size: 13.5px;
		line-height: 1.5;
		color: rgba(28, 27, 24, 0.6);
		margin: 0;
	}
	.org-strip-copy strong {
		color: #1c1b18;
	}
	.org-strip-link {
		font-weight: 700;
		font-size: 13.5px;
		color: #2d63f5;
		text-decoration: none;
		flex: none;
	}
	.org-strip-link:hover {
		text-decoration: underline;
	}

	.back {
		padding: 8px 44px 40px;
		font-size: 12.5px;
		color: rgba(28, 27, 24, 0.45);
		text-decoration: none;
	}
	.back:hover {
		color: #2d63f5;
	}

	/* ── responsive ── */
	@media (max-width: 820px) {
		.marco-hero {
			flex-direction: column;
			align-items: stretch;
			padding: 40px 22px 44px;
			gap: 34px;
		}
		.hero-copy {
			align-items: flex-start;
		}
		.phone-wrap {
			align-self: center;
		}
		.beats {
			grid-template-columns: 1fr;
		}
		.beat:not(:last-child) {
			border-right: 0;
			border-bottom: 1px solid rgba(28, 27, 24, 0.1);
		}
		.nav,
		.org-strip {
			padding-left: 22px;
			padding-right: 22px;
		}
		.back {
			padding-left: 22px;
		}
		.cta {
			width: 100%;
		}
		.cta-stack {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.sonar {
			animation: none;
		}
	}
</style>
