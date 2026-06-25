<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 40;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollTo(e: Event, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Par Car — Premium car care, while you play</title>
	<meta
		name="description"
		content="A new member amenity for golf clubs. Members book a wash beside their tee time; our crew handles everything on the lot during the round. By the 18th, the car is clean."
	/>
</svelte:head>

<div class="pc">
	<!-- ──────── Navigation ────────
	     Outer <nav> is full-bleed sticky bar. Transparent at top of the
	     page, gains a translucent cream background + subtle shadow only
	     after the user has scrolled past the hero (40 px). -->
	<nav class:scrolled>
		<div class="nav-inner">
			<a class="logo" href="/app/par-car">
				<img src="/app/par-car/app-icon.png" alt="Par Car" class="logo-icon" />
				<span class="logo-text">
					<span>PAR</span>
					<span class="flag">
						<svg viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
							<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
						</svg>
					</span>
					<span>CAR</span>
				</span>
			</a>
			<div class="nav-links">
				<a href="#how" onclick={(e) => scrollTo(e, 'how')}>How it works</a>
				<a href="#clubs" onclick={(e) => scrollTo(e, 'clubs')}>For clubs</a>
				<a href="#pricing" onclick={(e) => scrollTo(e, 'pricing')}>Pricing</a>
				<a href="#contact" onclick={(e) => scrollTo(e, 'contact')} class="nav-cta">Talk to us</a>
			</div>
		</div>
	</nav>

	<!-- ──────── Hero ──────── -->
	<section class="hero" id="top">
		<div class="container">
			<div class="hero-grid">
				<div>
					<div class="eyebrow">A NEW MEMBER AMENITY FOR GOLF CLUBS</div>
					<h1>We wash the car <em>while you play.</em></h1>
					<p class="hero-sub">
						Members book a wash beside their tee time. Our crew handles everything on the club's lot
						during the round. By the time they walk off the 18th, the car is clean, photographed,
						and ready in its spot.
					</p>
					<div class="hero-ctas">
						<a class="btn btn-primary" href="#contact" onclick={(e) => scrollTo(e, 'contact')}
							>Bring Par Car to your club →</a
						>
						<a class="btn btn-secondary" href="#how" onclick={(e) => scrollTo(e, 'how')}
							>See how it works</a
						>
					</div>
				</div>
				<div class="hero-visual">
					<div class="phone">
						<div class="phone-screen">
							<div class="phone-icon">
								<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path
										d="M50 13 C50 13 74 45 74 62 A24 24 0 1 1 26 62 C26 45 50 13 50 13 Z"
										fill="#F1ECE1"
									/>
									<rect x="47" y="47" width="1.9" height="28" fill="#1C1A16" />
									<path d="M48.9 48 L62 52 L48.9 56 Z" fill="#1C1A16" />
								</svg>
							</div>
							<span class="phone-line">
								<span>PAR</span>
								<span class="fl">
									<svg viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
										<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
									</svg>
								</span>
								<span>CAR</span>
							</span>
							<div class="phone-body">Premium car care<br />While you play</div>
							<div class="phone-cta">Book a wash →</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ──────── How it works ──────── -->
	<section id="how">
		<div class="container">
			<div class="section-head">
				<div>
					<div class="section-eyebrow">HOW IT WORKS</div>
					<h2 class="section-title">One booking, three things happen <em>while you play.</em></h2>
				</div>
			</div>
			<div class="steps">
				<div class="step">
					<div class="num">01 · BOOK</div>
					<h3>Book a wash alongside your tee time.</h3>
					<p>
						Open the Par Car app, pick a tier, confirm. 30 seconds. Card on file, no friction. Drop
						your keys with the bag staff on the way to the first tee.
					</p>
				</div>
				<div class="step">
					<div class="num">02 · WE WASH</div>
					<h3>Our crew handles everything on the lot.</h3>
					<p>
						We bring the rig, the water, the products, the staff. The car is washed, photographed,
						and parked back in its spot — usually well before you reach the turn.
					</p>
				</div>
				<div class="step">
					<div class="num">03 · DRIVE HOME CLEAN</div>
					<h3>Walk off 18 to a clean car.</h3>
					<p>
						You get a text the moment it's ready. Keys are back at the bag stand. Tip the crew and
						rate the wash from your phone — that's it.</p
					>
				</div>
			</div>
		</div>
	</section>

	<!-- ──────── For clubs ──────── -->
	<section id="clubs">
		<div class="container">
			<div class="section-head">
				<div>
					<div class="section-eyebrow">FOR CLUBS</div>
					<h2 class="section-title">A new high-end amenity, <em>at zero cost to the club.</em></h2>
				</div>
			</div>

			<div class="clubs-grid">
				<div class="clubs-list">
					<div class="item">
						<div class="num">01</div>
						<div>
							<h4>20% of every wash, settled monthly.</h4>
							<p>
								Direct SEPA transfer on the 5th business day, accompanied by an itemised statement.
								No minimum during the pilot — you earn from washes that actually happen.
							</p>
						</div>
					</div>
					<div class="item">
						<div class="num">02</div>
						<div>
							<h4>Zero staff hours, zero capital.</h4>
							<p>
								We bring the mobile rig, water reclamation, insurance, crew, signage. The club
								provides ~6 parking spots during operating hours and a single member intro at
								launch. That's it.
							</p>
						</div>
					</div>
					<div class="item">
						<div class="num">03</div>
						<div>
							<h4>Caddiemaster gets a dashboard.</h4>
							<p>
								Web console shows every car currently on property, current status, expected return
								time. Five minutes of training. No iOS app to install for your staff.
							</p>
						</div>
					</div>
					<div class="item">
						<div class="num">04</div>
						<div>
							<h4>14 days notice, either side. No penalty.</h4>
							<p>
								The 90-day pilot is built to make saying yes easy. If it doesn't fit your members,
								your operations, or your image — end it. We pack up within a week.
							</p>
						</div>
					</div>
				</div>

				<div class="numbers-stack">
					<div class="num-card">
						<div class="lbl">Projected monthly amenity revenue to the club</div>
						<div class="val accent">€6,960</div>
					</div>
					<div class="num-card">
						<div class="lbl">Projected year-one earnings</div>
						<div class="val">€83,500</div>
					</div>
					<div class="num-card">
						<div class="lbl">Member adoption in first 90 days</div>
						<div class="val">41%</div>
					</div>
					<div class="num-card">
						<div class="lbl">Club capital required · Staff hours</div>
						<div class="val">€0</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ──────── Pricing ──────── -->
	<section id="pricing">
		<div class="container">
			<div class="section-head">
				<div>
					<div class="section-eyebrow">MEMBER PRICING</div>
					<h2 class="section-title">
						Three tiers. <em>Members choose what their car needs today.</em>
					</h2>
				</div>
			</div>
			<div class="tiers">
				<div class="tier">
					<h3>Express Exterior</h3>
					<div class="meta">~30 MIN · EXTERIOR ONLY</div>
					<div class="price">€45</div>
					<p>Hand wash, wheels &amp; tire shine. Done before the turn.</p>
				</div>
				<div class="tier">
					<h3>Full Valet</h3>
					<div class="meta">~60 MIN · INTERIOR + EXTERIOR</div>
					<div class="price">€85</div>
					<p>Hand wash, interior vacuum, dashboard &amp; leather wipe-down, tire dressing.</p>
				</div>
				<div class="tier">
					<h3>Signature Detail</h3>
					<div class="meta">~90 MIN · FULL DETAIL</div>
					<div class="price">€140</div>
					<p>Everything in Full Valet, plus clay bar, leather conditioning &amp; paint sealant.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ──────── Final CTA (the one dark moment on the page) ──────── -->
	<section class="final-cta" id="contact">
		<div class="container">
			<div class="section-eyebrow gold">TALK TO US</div>
			<h2>30 minutes. Not a pitch. <em>An exploration.</em></h2>
			<p>
				If you run a club and want to see how Par Car would actually work at your lot — let's talk.
				We walk through the app, the numbers, the operations, and listen to what you'd need to say
				yes.
			</p>
			<div class="hero-ctas centered">
				<a
					class="btn btn-primary"
					href="mailto:info+parcar@lsdigital.ee?subject=Par%20Car%20%C2%B7%20Partnership%20enquiry"
					>Email info+parcar@lsdigital.ee</a
				>
				<a class="btn btn-secondary" href="/">More about LongShot Digital</a>
			</div>
		</div>
	</section>

	<!-- ──────── Footer ──────── -->
	<footer>
		<div class="footer-meta">© 2026 LongShot Digital OÜ · Tallinn</div>
		<div class="footer-links">
			<a href="/">LSD</a>
			<a href="/app/grid-life">Grid Life</a>
			<a href="/app/par-car/legal">Legal</a>
			<a href="mailto:info+parcar@lsdigital.ee">Contact</a>
		</div>
	</footer>
</div>

<style>
	/* ════════════════════════════════════════════════════════════════
	   Design discipline (the redesign rules):
	   · ONE base background everywhere — warm cream. No section-by-section
	     colour shifts except the single dark final-CTA (the dramatic moment).
	   · Panels (cards, tiers, KPI numbers) sit on cream as warm-white
	     surfaces with thin hairline borders. No solid colour blocks behind
	     entire sections.
	   · Red used sparingly: brand flag, italic emphasis in headlines (the
	     "voice" moments), the one accented KPI, the in-phone CTA.
	     Section eyebrows, list numbers, etc. go to neutral grey.
	   · Nav is transparent at top of page; only becomes opaque cream +
	     blur + subtle shadow after the user scrolls past the hero.
	   ════════════════════════════════════════════════════════════════ */

	.pc {
		--ink: #1c1a16;
		--ink-2: #595650;
		--ink-3: #9a948a;
		--cream: #f1ece1;
		--cream-deep: #ebe5d6; /* hairline rule */
		--paper: #faf6ee; /* warm white panels */
		--line: rgba(28, 26, 22, 0.08);
		--red: #c5392c;
		--gold: #b89456;

		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		color: var(--ink);
		background: var(--cream);
		font-size: 16px;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
		min-height: 100vh;
		position: relative;
		z-index: 1;
	}

	.pc * {
		box-sizing: border-box;
	}

	.pc .container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 32px;
	}

	/* ─────────────────────── Navigation ─────────────────────── */
	.pc nav {
		position: sticky;
		top: 0;
		z-index: 50;
		width: 100%;
		background: transparent;
		border-bottom: 1px solid transparent;
		transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
		padding-top: env(safe-area-inset-top, 0);
	}
	.pc nav.scrolled {
		background: rgba(241, 236, 225, 0.82);
		backdrop-filter: saturate(180%) blur(20px);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		border-bottom-color: var(--line);
		box-shadow: 0 1px 24px rgba(28, 26, 22, 0.04);
	}

	.pc .nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 16px 32px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.pc .logo {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--ink);
	}
	.pc .logo-icon {
		width: 30px;
		height: 30px;
		border-radius: 7px;
		object-fit: cover;
	}
	.pc .logo-text {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 15px;
		letter-spacing: 0.16em;
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.pc .flag,
	.pc .fl {
		display: inline-block;
	}
	.pc .flag {
		width: 0.42em;
		height: 1em;
	}
	.pc .flag svg,
	.pc .fl svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	.pc .nav-links {
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.pc .nav-links a {
		font-size: 13.5px;
		color: var(--ink-2);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.15s;
	}
	.pc .nav-links a:hover {
		color: var(--ink);
	}

	/* Pill CTA — much less template-y than a sharp rectangle */
	.pc .nav-cta {
		background: var(--ink);
		color: var(--cream);
		padding: 9px 18px;
		font-size: 13px;
		font-weight: 600;
		border-radius: 999px;
		transition: background 0.15s, transform 0.15s;
	}
	.pc .nav-cta:hover {
		background: #000;
		color: var(--cream);
		transform: translateY(-1px);
	}

	/* ─────────────────────── Hero ─────────────────────── */
	.pc .hero {
		padding: 96px 0 80px;
	}
	.pc .hero-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 64px;
		align-items: center;
	}
	.pc .eyebrow,
	.pc .section-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 24px;
	}
	.pc h1 {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 400;
		font-size: clamp(40px, 6vw, 64px);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 0;
	}
	.pc h1 em {
		color: var(--red);
		font-style: italic;
		font-weight: 500;
	}
	.pc .hero-sub {
		margin-top: 24px;
		font-size: 18px;
		color: var(--ink-2);
		max-width: 480px;
		line-height: 1.55;
	}
	.pc .hero-ctas {
		margin-top: 32px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.pc .hero-ctas.centered {
		justify-content: center;
	}
	.pc .btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 22px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		border-radius: 999px;
		transition: all 0.15s;
	}
	.pc .btn-primary {
		background: var(--ink);
		color: var(--cream);
	}
	.pc .btn-primary:hover {
		background: #000;
		transform: translateY(-1px);
	}
	.pc .btn-secondary {
		background: transparent;
		color: var(--ink);
		border: 1px solid var(--ink);
	}
	.pc .btn-secondary:hover {
		background: var(--ink);
		color: var(--cream);
	}

	/* Hero phone visual */
	.pc .hero-visual {
		display: flex;
		justify-content: center;
	}
	.pc .phone {
		width: 280px;
		height: 560px;
		background: #0e0e10;
		border-radius: 44px;
		padding: 10px;
		box-shadow:
			0 32px 80px rgba(28, 26, 22, 0.14),
			0 10px 28px rgba(28, 26, 22, 0.08);
		position: relative;
	}
	.pc .phone::before {
		content: '';
		position: absolute;
		top: 18px;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		height: 22px;
		background: #0a0a0c;
		border-radius: 999px;
		z-index: 5;
	}
	.pc .phone-screen {
		width: 100%;
		height: 100%;
		background: var(--cream);
		border-radius: 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
		padding: 60px 24px;
	}
	.pc .phone-icon {
		width: 84px;
		height: 84px;
		background: var(--ink);
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
	}
	.pc .phone-icon svg {
		width: 56%;
		height: 56%;
	}
	.pc .phone-line {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 18px;
		letter-spacing: 0.18em;
		color: var(--ink);
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.pc .phone-body {
		font-size: 11px;
		color: var(--ink-3);
		font-family: 'JetBrains Mono', monospace;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		text-align: center;
	}
	.pc .phone-cta {
		margin-top: 8px;
		background: var(--red);
		color: var(--cream);
		padding: 10px 18px;
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
	}

	/* ─────────────────────── Sections (all on cream) ─────────────────────── */
	.pc section {
		padding: 96px 0;
		border-top: 1px solid var(--cream-deep); /* hairline between sections */
	}
	.pc .hero,
	.pc .final-cta {
		border-top: none;
	}

	.pc .section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 56px;
	}
	.pc .section-title {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--ink);
		max-width: 720px;
		margin: 0;
	}
	.pc .section-title em {
		font-style: italic;
		font-weight: 500;
	}

	/* Steps */
	.pc .steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 40px;
	}
	.pc .step .num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.32em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 16px;
	}
	.pc .step h3 {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 24px;
		color: var(--ink);
		margin: 0 0 12px;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.pc .step p {
		font-size: 15px;
		color: var(--ink-2);
		line-height: 1.6;
		margin: 0;
	}

	/* For clubs */
	.pc .clubs-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 72px;
		align-items: start;
	}
	.pc .clubs-list {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	.pc .clubs-list .item {
		display: grid;
		grid-template-columns: 48px 1fr;
		gap: 16px;
		align-items: start;
	}
	.pc .clubs-list .num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		color: var(--ink-3);
		font-weight: 600;
		letter-spacing: 0.18em;
		padding-top: 5px;
	}
	.pc .clubs-list h4 {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 20px;
		color: var(--ink);
		margin: 0 0 6px;
		letter-spacing: -0.01em;
	}
	.pc .clubs-list p {
		font-size: 14.5px;
		color: var(--ink-2);
		margin: 0;
		line-height: 1.6;
	}

	.pc .numbers-stack {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.pc .num-card {
		background: var(--paper);
		padding: 22px 26px;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		border: 1px solid var(--line);
		border-radius: 14px;
		gap: 16px;
	}
	.pc .num-card .lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 600;
		max-width: 200px;
		line-height: 1.5;
	}
	.pc .num-card .val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 32px;
		color: var(--ink);
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.pc .num-card .val.accent {
		color: var(--red);
	}

	/* Pricing */
	.pc .tiers {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.pc .tier {
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 30px 28px 32px;
		border-radius: 16px;
	}
	.pc .tier h3 {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 22px;
		color: var(--ink);
		letter-spacing: -0.01em;
		margin: 0 0 4px;
	}
	.pc .tier .meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 22px;
	}
	.pc .tier .price {
		font-family: 'JetBrains Mono', monospace;
		font-size: 34px;
		color: var(--ink);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: 14px;
	}
	.pc .tier p {
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.55;
		margin: 0;
	}

	/* Final CTA — the only dark moment on the page */
	.pc .final-cta {
		background: var(--ink);
		color: var(--cream);
		padding: 96px 0;
		text-align: center;
	}
	.pc .final-cta .container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pc .section-eyebrow.gold {
		color: var(--gold);
	}
	.pc .final-cta h2 {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 400;
		font-size: clamp(28px, 4.5vw, 44px);
		line-height: 1.15;
		letter-spacing: -0.01em;
		color: var(--cream);
		margin: 16px 0 14px;
		max-width: 720px;
	}
	.pc .final-cta h2 em {
		color: var(--gold);
		font-style: italic;
		font-weight: 500;
	}
	.pc .final-cta p {
		font-size: 16px;
		color: rgba(241, 236, 225, 0.7);
		max-width: 560px;
		margin: 0 0 36px;
		line-height: 1.6;
	}
	.pc .final-cta .btn-primary {
		background: var(--cream);
		color: var(--ink);
	}
	.pc .final-cta .btn-primary:hover {
		background: #fff;
		color: var(--ink);
	}
	.pc .final-cta .btn-secondary {
		color: var(--cream);
		border-color: rgba(241, 236, 225, 0.4);
	}
	.pc .final-cta .btn-secondary:hover {
		background: var(--cream);
		color: var(--ink);
		border-color: var(--cream);
	}

	/* Footer */
	.pc footer {
		max-width: 1100px;
		margin: 0 auto;
		padding: 36px 32px 56px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 20px;
	}
	.pc .footer-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--ink-3);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.pc .footer-links {
		display: flex;
		gap: 22px;
		flex-wrap: wrap;
	}
	.pc .footer-links a {
		font-size: 12px;
		color: var(--ink-2);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.15s;
	}
	.pc .footer-links a:hover {
		color: var(--ink);
	}

	/* Responsive */
	@media (max-width: 880px) {
		.pc .hero-grid,
		.pc .clubs-grid {
			grid-template-columns: 1fr;
			gap: 48px;
		}
		.pc section {
			padding: 72px 0;
		}
		.pc .hero {
			padding: 72px 0 56px;
		}
	}
	@media (max-width: 800px) {
		.pc .steps {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.pc .tiers {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 640px) {
		.pc .nav-links a:not(.nav-cta) {
			display: none;
		}
		.pc .nav-inner {
			padding: 14px 24px;
		}
		.pc .container {
			padding: 0 24px;
		}
	}
</style>
