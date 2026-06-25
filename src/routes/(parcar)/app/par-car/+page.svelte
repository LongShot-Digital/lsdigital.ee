<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// ─── Sticky-nav scroll state ────────────────────────────────────
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

	// ─── Interactive phone simulator ────────────────────────────────
	// Mirrors the real iOS app flow: Home → Pick → Confirm → Booked
	type PhoneScreen = 'home' | 'pick' | 'confirm' | 'booked';
	type TierKey = 'express' | 'full' | 'signature';

	interface Tier {
		key: TierKey;
		name: string;
		duration: string;
		price: number;
		blurb: string;
	}

	const tiers: Tier[] = [
		{
			key: 'express',
			name: 'Express Exterior',
			duration: '~30 min',
			price: 45,
			blurb: 'Hand wash, wheels, tire shine.'
		},
		{
			key: 'full',
			name: 'Full Valet',
			duration: '~60 min',
			price: 85,
			blurb: 'Interior + exterior detail.'
		},
		{
			key: 'signature',
			name: 'Signature Detail',
			duration: '~90 min',
			price: 140,
			blurb: 'Full detail + paint sealant.'
		}
	];

	let phoneScreen = $state<PhoneScreen>('home');
	let phoneTier = $state<TierKey>('full');

	let selectedTier = $derived(tiers.find((t) => t.key === phoneTier)!);

	function selectTier(k: TierKey) {
		phoneTier = k;
	}
	function goToPick() {
		phoneScreen = 'pick';
	}
	function goToConfirm() {
		phoneScreen = 'confirm';
	}
	function goToBooked() {
		phoneScreen = 'booked';
	}
	function restartPhone() {
		phoneScreen = 'home';
		phoneTier = 'full';
	}

	// ─── Earnings calculator ─────────────────────────────────────────
	let calcWashes = $state(200);
	let calcTicket = $state(85);

	let monthlySpend = $derived(calcWashes * calcTicket);
	let monthlyClub = $derived(Math.round(monthlySpend * 0.2));
	let annualClub = $derived(monthlyClub * 12);

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<svelte:head>
	<title>Par Car — Premium car care, while you play</title>
	<meta
		name="description"
		content="A new member amenity for golf clubs. Members book a wash beside their tee time; our crew handles everything on the lot during the round. By the 18th, the car is clean."
	/>
</svelte:head>

<div class="pc">
	<!-- ──────── Navigation ──────── -->
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

	<!-- ──────── Hero with interactive phone ──────── -->
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
					<p class="hero-hint">↗ Tap through the demo on the right to see the member's flow.</p>
				</div>

				<!-- Interactive phone — mirrors the real iOS app -->
				<div class="hero-visual">
					<div class="phone" aria-label="Par Car app demo">
						<div class="phone-screen">
							<!-- Status bar (decorative) -->
							<div class="status-bar">
								<span>9:41</span>
								<span class="status-icons">
									<svg viewBox="0 0 16 10" aria-hidden="true">
										<rect x="0" y="3" width="3" height="7" rx="0.5" fill="currentColor" />
										<rect x="4.5" y="2" width="3" height="8" rx="0.5" fill="currentColor" />
										<rect x="9" y="1" width="3" height="9" rx="0.5" fill="currentColor" />
										<rect x="13.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
									</svg>
									<svg viewBox="0 0 22 10" aria-hidden="true">
										<rect
											x="0"
											y="0.5"
											width="18"
											height="9"
											rx="2"
											stroke="currentColor"
											stroke-width="1"
											fill="none"
										/>
										<rect x="2" y="2.5" width="14" height="5" rx="1" fill="currentColor" />
										<rect x="19" y="3" width="2" height="4" rx="0.5" fill="currentColor" />
									</svg>
								</span>
							</div>

							{#if phoneScreen === 'home'}
								<div class="screen" transition:fade={{ duration: 180 }}>
									<div class="screen-brand">
										<span>PAR</span>
										<span class="fl">
											<svg viewBox="0 0 30 60" aria-hidden="true">
												<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
												<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
											</svg>
										</span>
										<span>CAR</span>
									</div>
									<div class="screen-greet">Welcome back, Jaan</div>

									<div class="tee-card">
										<div class="tee-eyebrow">YOUR TEE TIME · TODAY</div>
										<div class="tee-time">11:36 AM</div>
										<div class="tee-meta">MAARDU GOLF CLUB · 4 PLAYERS</div>
										<button class="tee-cta" onclick={goToPick}>Book a wash →</button>
									</div>

									<div class="vehicle-mini">
										<div class="vehicle-paint"></div>
										<div class="vehicle-info">
											<div class="vehicle-name">Range Rover</div>
											<div class="vehicle-meta">Velar · OB Black</div>
										</div>
									</div>
								</div>
							{:else if phoneScreen === 'pick'}
								<div class="screen" transition:fade={{ duration: 180 }}>
									<div class="screen-nav">
										<button class="back" onclick={() => (phoneScreen = 'home')}
											aria-label="Back">←</button
										>
										<span>Pick a wash</span>
									</div>

									<div class="tier-list">
										{#each tiers as t}
											<button
												class="tier-card"
												class:selected={phoneTier === t.key}
												onclick={() => selectTier(t.key)}
											>
												<div class="tier-top">
													<div>
														<div class="tier-name">{t.name}</div>
														<div class="tier-meta">{t.duration}</div>
													</div>
													<div class="tier-price">€{t.price}</div>
												</div>
												<div class="tier-blurb">{t.blurb}</div>
												{#if phoneTier === t.key}
													<div class="tier-check">
														<svg viewBox="0 0 12 10" aria-hidden="true">
															<polyline
																points="1,5 4.5,8.5 11,1.5"
																fill="none"
																stroke="currentColor"
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
															/>
														</svg>
													</div>
												{/if}
											</button>
										{/each}
									</div>

									<button class="screen-cta" onclick={goToConfirm}>Continue →</button>
								</div>
							{:else if phoneScreen === 'confirm'}
								<div class="screen" transition:fade={{ duration: 180 }}>
									<div class="screen-nav">
										<button
											class="back"
											onclick={() => (phoneScreen = 'pick')}
											aria-label="Back">←</button
										>
										<span>Confirm wash</span>
									</div>

									<div class="confirm-summary">
										<div class="cs-eyebrow">YOUR WASH</div>
										<div class="cs-name">{selectedTier.name}</div>
										<div class="cs-meta">{selectedTier.duration} · €{selectedTier.price}</div>
									</div>

									<div class="form-rows">
										<div class="form-row">
											<span class="fr-lbl">Vehicle</span>
											<span class="fr-val">Range Rover Velar</span>
										</div>
										<div class="form-row">
											<span class="fr-lbl">Parking spot</span>
											<span class="fr-val">Row B · #14</span>
										</div>
										<div class="form-row">
											<span class="fr-lbl">Key drop</span>
											<span class="fr-val">Bag staff</span>
										</div>
										<div class="form-row">
											<span class="fr-lbl">Return by</span>
											<span class="fr-val">3:45 PM</span>
										</div>
									</div>

									<button class="screen-cta" onclick={goToBooked}>
										Confirm & pay €{selectedTier.price}
									</button>
								</div>
							{:else if phoneScreen === 'booked'}
								<div class="screen" transition:fade={{ duration: 180 }}>
									<div class="booked-stage">
										<div class="check-circle">
											<svg viewBox="0 0 24 24" aria-hidden="true">
												<polyline
													points="5,12 10,17 19,7"
													fill="none"
													stroke="currentColor"
													stroke-width="2.4"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</div>
										<div class="booked-title">You're all set</div>
										<div class="booked-sub">
											We've got your {selectedTier.name.toLowerCase()} booked for today.
										</div>

										<div class="booked-card">
											<div class="bc-row">
												<span class="fr-lbl">Tee time</span>
												<span class="fr-val">11:36 AM</span>
											</div>
											<div class="bc-row">
												<span class="fr-lbl">Charged</span>
												<span class="fr-val accent">€{selectedTier.price}</span>
											</div>
										</div>

										<button class="restart" onclick={restartPhone}>↻ Run demo again</button>
									</div>
								</div>
							{/if}
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
						rate the wash from your phone — that's it.
					</p>
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

				<!-- Interactive calculator (replaces the speculative number stack) -->
				<aside class="calculator">
					<div class="calc-eyebrow">EARNINGS CALCULATOR</div>
					<h4>Try numbers from your own club</h4>
					<p class="calc-intro">
						The club keeps 20% of every wash. Drag the sliders to see what that looks like at your
						volume.
					</p>

					<div class="calc-row">
						<div class="calc-label">
							<span>Washes per month</span>
							<span class="calc-val">{calcWashes}</span>
						</div>
						<input
							type="range"
							min="20"
							max="500"
							step="10"
							bind:value={calcWashes}
							aria-label="Washes per month"
						/>
						<div class="calc-scale"><span>20</span><span>500</span></div>
					</div>

					<div class="calc-row">
						<div class="calc-label">
							<span>Average ticket</span>
							<span class="calc-val">€{calcTicket}</span>
						</div>
						<input
							type="range"
							min="45"
							max="140"
							step="5"
							bind:value={calcTicket}
							aria-label="Average ticket price in euros"
						/>
						<div class="calc-scale"><span>€45</span><span>€140</span></div>
					</div>

					<div class="calc-result">
						<div class="calc-result-row primary">
							<span class="lbl">Club share / month</span>
							<span class="val">€{fmt(monthlyClub)}</span>
						</div>
						<div class="calc-result-row">
							<span class="lbl">Club share / year</span>
							<span class="val">€{fmt(annualClub)}</span>
						</div>
						<div class="calc-result-row dim">
							<span class="lbl">Total member spend / month</span>
							<span class="val">€{fmt(monthlySpend)}</span>
						</div>
					</div>

					<p class="calc-note">
						Illustrative only. Real numbers depend on actual member adoption at your club.
					</p>
				</aside>
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

	<!-- ──────── Final CTA (the one dark moment) ──────── -->
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
					href="mailto:info@lsdigital.ee?subject=Par%20Car%20%C2%B7%20Partnership%20enquiry"
					>Email info@lsdigital.ee</a
				>
				<a class="btn btn-secondary" href="/">More about LongShot Digital</a>
			</div>
		</div>
	</section>

	<!-- ──────── Footer ──────── -->
	<footer>
		<div class="footer-meta">
			© 2026 LongShot Digital OÜ · Reg. 17437669 · Tallinn
		</div>
		<div class="footer-links">
			<a href="/">LSD</a>
			<a href="/app/grid-life">Grid Life</a>
			<a href="/app/par-car/legal">Legal</a>
			<a href="mailto:info@lsdigital.ee">info@lsdigital.ee</a>
		</div>
	</footer>
</div>

<style>
	/* ════════════════════════════════════════════════════════════════
	   Design rules: single cream background; warm-white panels for
	   "objects"; red used sparingly; dark final-CTA as the one shift.
	   ════════════════════════════════════════════════════════════════ */

	.pc {
		--ink: #1c1a16;
		--ink-2: #595650;
		--ink-3: #9a948a;
		--cream: #f1ece1;
		--cream-deep: #ebe5d6;
		--paper: #faf6ee;
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
	.pc .hero-hint {
		margin-top: 22px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
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
		border: 1px solid transparent;
		cursor: pointer;
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

	/* ─────────────────────── Phone (interactive) ─────────────────────── */
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
		top: 14px;
		left: 50%;
		transform: translateX(-50%);
		width: 92px;
		height: 24px;
		background: #0a0a0c;
		border-radius: 999px;
		z-index: 5;
	}
	.pc .phone-screen {
		width: 100%;
		height: 100%;
		background: var(--cream);
		border-radius: 36px;
		overflow: hidden;
		position: relative;
	}

	.pc .status-bar {
		position: absolute;
		top: 14px;
		left: 0;
		right: 0;
		padding: 0 28px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
		z-index: 4;
	}
	.pc .status-icons {
		display: inline-flex;
		gap: 6px;
		align-items: center;
		color: var(--ink);
	}
	.pc .status-icons svg {
		height: 10px;
		width: auto;
	}

	/* Common screen styles */
	.pc .screen {
		position: absolute;
		inset: 0;
		padding: 56px 18px 18px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	/* Common nav bar inside screens */
	.pc .screen-nav {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-bottom: 4px;
	}
	.pc .screen-nav .back {
		width: 28px;
		height: 28px;
		border: none;
		background: transparent;
		font-size: 20px;
		line-height: 1;
		color: var(--ink);
		cursor: pointer;
		padding: 0;
	}
	.pc .screen-nav span {
		font-family: 'Spectral', serif;
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
	}

	/* ─── Home screen ─── */
	.pc .screen-brand {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		letter-spacing: 0.18em;
		color: var(--ink);
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.pc .screen-brand .fl {
		width: 0.42em;
		height: 1em;
	}
	.pc .screen-brand .fl svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.pc .screen-greet {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 18px;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.pc .tee-card {
		background: var(--ink);
		color: var(--cream);
		padding: 18px;
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.pc .tee-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.2em;
		color: rgba(241, 236, 225, 0.6);
		font-weight: 600;
	}
	.pc .tee-time {
		font-family: 'Spectral', serif;
		font-weight: 400;
		font-size: 32px;
		letter-spacing: -0.02em;
		line-height: 1;
	}
	.pc .tee-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.16em;
		color: rgba(241, 236, 225, 0.5);
		font-weight: 600;
		margin-bottom: 8px;
	}
	.pc .tee-cta {
		background: var(--red);
		color: var(--cream);
		border: none;
		padding: 10px 14px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		align-self: flex-start;
	}
	.pc .tee-cta:hover {
		background: #a32a1e;
	}
	.pc .tee-cta:active {
		transform: scale(0.96);
	}
	.pc .vehicle-mini {
		display: flex;
		gap: 10px;
		align-items: center;
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 12px;
		border-radius: 12px;
		margin-top: auto;
	}
	.pc .vehicle-paint {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: linear-gradient(135deg, #1c1a16 0%, #2a2722 100%);
		flex-shrink: 0;
	}
	.pc .vehicle-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
	}
	.pc .vehicle-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		text-transform: uppercase;
	}

	/* ─── Pick screen ─── */
	.pc .tier-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 4px;
	}
	.pc .tier-card {
		position: relative;
		background: var(--paper);
		border: 1.5px solid var(--line);
		border-radius: 12px;
		padding: 12px;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		transition: border-color 0.15s, transform 0.1s;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.pc .tier-card:hover {
		border-color: rgba(28, 26, 22, 0.2);
	}
	.pc .tier-card:active {
		transform: scale(0.98);
	}
	.pc .tier-card.selected {
		border-color: var(--red);
		background: rgba(197, 57, 44, 0.04);
	}
	.pc .tier-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.pc .tier-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
	}
	.pc .tier-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		text-transform: uppercase;
	}
	.pc .tier-price {
		font-family: 'JetBrains Mono', monospace;
		font-weight: 600;
		font-size: 16px;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.pc .tier-blurb {
		font-size: 10px;
		color: var(--ink-2);
		line-height: 1.4;
	}
	.pc .tier-check {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 16px;
		height: 16px;
		background: var(--red);
		color: var(--cream);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pc .tier-check svg {
		width: 9px;
		height: auto;
	}

	/* Shared bottom CTA */
	.pc .screen-cta {
		margin-top: auto;
		background: var(--ink);
		color: var(--cream);
		border: none;
		padding: 12px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
	}
	.pc .screen-cta:hover {
		background: #000;
	}
	.pc .screen-cta:active {
		transform: scale(0.98);
	}

	/* ─── Confirm screen ─── */
	.pc .confirm-summary {
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 12px;
		border-radius: 12px;
	}
	.pc .cs-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 4px;
	}
	.pc .cs-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 16px;
		color: var(--ink);
	}
	.pc .cs-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		margin-top: 2px;
	}
	.pc .form-rows {
		display: flex;
		flex-direction: column;
	}
	.pc .form-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		border-bottom: 1px solid var(--line);
	}
	.pc .form-row:last-child {
		border-bottom: none;
	}
	.pc .fr-lbl {
		font-size: 11px;
		color: var(--ink-3);
		font-weight: 500;
	}
	.pc .fr-val {
		font-size: 12px;
		color: var(--ink);
		font-weight: 500;
	}
	.pc .fr-val.accent {
		color: var(--red);
		font-family: 'JetBrains Mono', monospace;
		font-weight: 600;
	}

	/* ─── Booked screen ─── */
	.pc .booked-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
		padding-top: 30px;
		height: 100%;
	}
	.pc .check-circle {
		width: 64px;
		height: 64px;
		background: var(--red);
		color: var(--cream);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.pc .check-circle svg {
		width: 32px;
		height: 32px;
	}
	@keyframes pop {
		0% {
			transform: scale(0.6);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	.pc .booked-title {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 22px;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.pc .booked-sub {
		font-size: 12px;
		color: var(--ink-2);
		max-width: 200px;
		line-height: 1.4;
	}
	.pc .booked-card {
		width: 100%;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px;
		margin-top: 6px;
	}
	.pc .bc-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 0;
	}
	.pc .restart {
		margin-top: auto;
		background: transparent;
		color: var(--ink-2);
		border: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
		padding: 8px;
		transition: color 0.15s;
	}
	.pc .restart:hover {
		color: var(--ink);
	}

	/* ─────────────────────── Sections ─────────────────────── */
	.pc section {
		padding: 96px 0;
		border-top: 1px solid var(--cream-deep);
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

	/* ─────────────────────── Calculator ─────────────────────── */
	.pc .calculator {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 28px 26px 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.pc .calc-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 600;
	}
	.pc .calculator h4 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 22px;
		color: var(--ink);
		margin: 0;
		letter-spacing: -0.01em;
	}
	.pc .calc-intro {
		font-size: 14px;
		color: var(--ink-2);
		margin: 0;
		line-height: 1.5;
	}
	.pc .calc-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.pc .calc-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.pc .calc-label span:first-child {
		font-size: 13px;
		color: var(--ink-2);
		font-weight: 500;
	}
	.pc .calc-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.pc .calc-scale {
		display: flex;
		justify-content: space-between;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		color: var(--ink-3);
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	/* Custom slider styling */
	.pc input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		background: var(--cream-deep);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
		margin: 0;
	}
	.pc input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 22px;
		height: 22px;
		background: var(--ink);
		border-radius: 50%;
		cursor: grab;
		transition: transform 0.15s, box-shadow 0.15s;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
	.pc input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.12);
	}
	.pc input[type='range']::-webkit-slider-thumb:active {
		cursor: grabbing;
		background: var(--red);
	}
	.pc input[type='range']::-moz-range-thumb {
		width: 22px;
		height: 22px;
		background: var(--ink);
		border-radius: 50%;
		border: none;
		cursor: grab;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
	.pc input[type='range']:focus-visible::-webkit-slider-thumb {
		outline: 2px solid var(--red);
		outline-offset: 2px;
	}

	.pc .calc-result {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--line);
		border-radius: 10px;
		overflow: hidden;
		margin-top: 6px;
	}
	.pc .calc-result-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		background: var(--paper);
		padding: 14px 16px;
	}
	.pc .calc-result-row .lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		font-weight: 600;
	}
	.pc .calc-result-row .val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 22px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.pc .calc-result-row.primary {
		background: var(--ink);
	}
	.pc .calc-result-row.primary .lbl {
		color: rgba(241, 236, 225, 0.6);
	}
	.pc .calc-result-row.primary .val {
		font-size: 30px;
		color: var(--red);
	}
	.pc .calc-result-row.dim .val {
		color: var(--ink-2);
		font-size: 18px;
	}
	.pc .calc-note {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.04em;
		color: var(--ink-3);
		line-height: 1.5;
		margin: 0;
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

	/* Final CTA */
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
