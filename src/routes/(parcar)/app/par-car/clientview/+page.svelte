<script lang="ts">
	import { fade } from 'svelte/transition';

	// ─── Types ────────────────────────────────────────────────────
	type PhoneScreen = 'home' | 'pick' | 'confirm' | 'booked' | 'liveStatus' | 'ready';
	type TierKey = 'express' | 'full' | 'signature';
	type StatusKey = 'booked' | 'received' | 'washing' | 'drying' | 'ready';

	interface Tier {
		key: TierKey;
		name: string;
		duration: number;
		badge: string;
		price: number;
		blurb: string;
	}

	const tiers: Tier[] = [
		{ key: 'express', name: 'Express Exterior', duration: 30,
		  badge: 'EXTERIOR ONLY', price: 45,
		  blurb: 'Hand wash, wheels & tire shine. Done before the turn.' },
		{ key: 'full', name: 'Full Valet', duration: 60,
		  badge: 'INTERIOR + EXT', price: 85,
		  blurb: 'Hand wash, vacuum, dashboard & leather wipe-down.' },
		{ key: 'signature', name: 'Signature Detail', duration: 90,
		  badge: 'FULL DETAIL', price: 140,
		  blurb: 'Everything in Full Valet, plus clay bar & paint sealant.' }
	];

	const statuses: { key: StatusKey; label: string; sub: string }[] = [
		{ key: 'booked',   label: 'BOOKED',   sub: 'we\'re expecting your car' },
		{ key: 'received', label: 'AT THE LOT', sub: 'the crew has your keys' },
		{ key: 'washing',  label: 'WASHING',  sub: 'hand-wash in progress' },
		{ key: 'drying',   label: 'DRYING',   sub: 'towel-dry & tire dressing' },
		{ key: 'ready',    label: 'READY',    sub: 'parked back in your spot' }
	];

	// ─── State ────────────────────────────────────────────────────
	let phoneScreen = $state<PhoneScreen>('home');
	let phoneTier = $state<TierKey>('full');
	let liveStatus = $state<StatusKey>('washing');
	let tipEur = $state(10);
	let rating = $state(0);

	let selectedTier = $derived(tiers.find((t) => t.key === phoneTier)!);
	let liveIndex = $derived(statuses.findIndex((s) => s.key === liveStatus));

	function selectTier(k: TierKey) { phoneTier = k; }
	function goToPick() { phoneScreen = 'pick'; }
	function goToConfirm() { phoneScreen = 'confirm'; }
	function goToBooked() { phoneScreen = 'booked'; }
	function goToLiveStatus() { phoneScreen = 'liveStatus'; liveStatus = 'received'; }
	function advanceStatus() {
		const idx = statuses.findIndex((s) => s.key === liveStatus);
		if (idx < statuses.length - 1) {
			liveStatus = statuses[idx + 1].key;
			if (liveStatus === 'ready') {
				setTimeout(() => (phoneScreen = 'ready'), 1200);
			}
		}
	}
	function goToReady() { phoneScreen = 'ready'; }
	function setRating(n: number) { rating = n; }
	function submitRating() {
		phoneScreen = 'home';
		phoneTier = 'full';
		liveStatus = 'washing';
		tipEur = 10;
		rating = 0;
	}
	function restart() {
		phoneScreen = 'home';
		phoneTier = 'full';
		liveStatus = 'washing';
		tipEur = 10;
		rating = 0;
	}
</script>

<svelte:head>
	<title>Par Car · Member view — What your members see</title>
	<meta name="description" content="Interactive walkthrough of the Par Car member experience. Book, track, and rate a wash — the way your members will use it." />
</svelte:head>

<div class="cv">
	<!-- ═══════════ Header ═══════════ -->
	<header class="cv-header">
		<a class="brand" href="/app/par-car">
			<span>PAR</span>
			<span class="flag">
				<svg viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
					<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
				</svg>
			</span>
			<span>CAR</span>
		</a>
		<div class="head-links">
			<a href="/app/par-car/clubview">Club view →</a>
			<a href="/app/par-car">Marketing site</a>
		</div>
	</header>

	<!-- ═══════════ Stage ═══════════ -->
	<div class="stage">
		<div class="stage-copy">
			<div class="eyebrow">MEMBER VIEW · INTERACTIVE DEMO</div>
			<h1>This is what your members see.</h1>
			<p class="lede">
				Tap through the flow. Book a wash beside your tee time, drop your keys, track the wash while
				you play, and rate the crew when you walk off 18. All six screens are here.
			</p>

			<ol class="flow-steps">
				<li class:active={phoneScreen === 'home'}>
					<span class="fs-num">01</span>
					<span class="fs-label">Home</span>
				</li>
				<li class:active={phoneScreen === 'pick'}>
					<span class="fs-num">02</span>
					<span class="fs-label">Pick a wash</span>
				</li>
				<li class:active={phoneScreen === 'confirm'}>
					<span class="fs-num">03</span>
					<span class="fs-label">Confirm &amp; pay</span>
				</li>
				<li class:active={phoneScreen === 'booked'}>
					<span class="fs-num">04</span>
					<span class="fs-label">You're all set</span>
				</li>
				<li class:active={phoneScreen === 'liveStatus'}>
					<span class="fs-num">05</span>
					<span class="fs-label">Live status</span>
				</li>
				<li class:active={phoneScreen === 'ready'}>
					<span class="fs-num">06</span>
					<span class="fs-label">Rate the crew</span>
				</li>
			</ol>

			<button class="restart-btn" onclick={restart}>↻ Restart the demo</button>
		</div>

		<!-- ═══════════ Phone ═══════════ -->
		<div class="phone-wrap">
			<div class="phone">
				<div class="phone-screen">
					<!-- Status bar -->
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
								<rect x="0" y="0.5" width="18" height="9" rx="2" stroke="currentColor" stroke-width="1" fill="none" />
								<rect x="2" y="2.5" width="14" height="5" rx="1" fill="currentColor" />
								<rect x="19" y="3" width="2" height="4" rx="0.5" fill="currentColor" />
							</svg>
						</span>
					</div>

					{#if phoneScreen === 'home'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<div class="brand-row">
								<div class="s-brand">
									<span>PAR</span>
									<span class="fl">
										<svg viewBox="0 0 30 60" aria-hidden="true">
											<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
											<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
										</svg>
									</span>
									<span>CAR</span>
								</div>
								<div class="gear-btn" aria-hidden="true">⚙</div>
							</div>

							<div class="greet-block">
								<div class="greet-line">Good morning,</div>
								<div class="greet-name">Robert.</div>
								<div class="greet-meta">Cedar Ridge Country Club · Today</div>
							</div>

							<div class="tee-card">
								<div class="tee-glow"></div>
								<div class="tee-eyebrow">YOUR TEE TIME</div>
								<div class="tee-time">11:36 AM</div>
								<div class="tee-meta">FOURSOME · 18 HOLES</div>
								<button class="tee-cta" onclick={goToPick}>
									<span>Book a wash</span>
									<span class="arrow">→</span>
								</button>
							</div>

							<div class="vehicle-label">YOUR VEHICLE</div>
							<div class="vehicle-mini">
								<div class="vehicle-paint">
									<div class="paint-brand">RANGE ROVER</div>
									<div class="paint-sub">'24 VELAR</div>
								</div>
								<div class="vehicle-info">
									<div class="vehicle-name">Range Rover</div>
									<div class="vehicle-meta">OB Black · 0418 EE</div>
								</div>
								<div class="vehicle-spot">E-14</div>
							</div>
						</div>
					{:else if phoneScreen === 'pick'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<button class="back-btn" onclick={() => (phoneScreen = 'home')}>
								<span class="arr">←</span> Back
							</button>
							<div class="screen-h1">Pick a wash</div>
							<div class="screen-sub">Cedar Ridge · Today</div>

							<div class="tier-list">
								{#each tiers as t}
									<button class="tier-card" class:selected={phoneTier === t.key}
										onclick={() => selectTier(t.key)}>
										<div class="tier-top">
											<div class="tier-name-wrap">
												{#if phoneTier === t.key}
													<div class="tier-check">
														<svg viewBox="0 0 12 10" aria-hidden="true">
															<polyline points="1,5 4.5,8.5 11,1.5" fill="none"
																stroke="currentColor" stroke-width="2"
																stroke-linecap="round" stroke-linejoin="round" />
														</svg>
													</div>
												{/if}
												<div class="tier-name">{t.name}</div>
											</div>
											<div class="tier-price">€{t.price}</div>
										</div>
										<div class="tier-meta">~{t.duration} MIN · {t.badge}</div>
										<div class="tier-blurb">{t.blurb}</div>
									</button>
								{/each}
							</div>

							<button class="screen-cta" onclick={goToConfirm}>
								Continue with {selectedTier.name}
							</button>
						</div>
					{:else if phoneScreen === 'confirm'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<button class="back-btn" onclick={() => (phoneScreen = 'pick')}>
								<span class="arr">←</span> Back
							</button>
							<div class="screen-h1">Confirm wash</div>
							<div class="screen-sub">
								{selectedTier.name} · {selectedTier.duration} min · Today
							</div>

							<div class="form-list">
								<div class="form-row">
									<span class="fr-lbl">VEHICLE</span>
									<span class="fr-val">Range Rover · OB Black</span>
								</div>
								<div class="form-row">
									<span class="fr-lbl">PARKING SPOT</span>
									<span class="fr-val">E-14 · East lot</span>
								</div>
								<div class="form-row">
									<span class="fr-lbl">KEY DROP</span>
									<span class="fr-val">Bag staff</span>
								</div>
								<div class="form-row">
									<span class="fr-lbl">RETURN WINDOW</span>
									<span class="fr-val">11:30 – 2:40</span>
								</div>
								<div class="form-row">
									<span class="fr-lbl">PAY WITH</span>
									<span class="fr-val">Amex ·· 4418</span>
								</div>
							</div>

							<div class="summary-card">
								<div class="summary-row">
									<span class="fr-lbl">SERVICE</span>
									<span class="fr-val">{selectedTier.name}</span>
								</div>
								<div class="summary-row total">
									<span class="fr-lbl">TOTAL</span>
									<span class="fr-val">€{selectedTier.price}.00</span>
								</div>
							</div>

							<button class="screen-cta confirm-pay" onclick={goToBooked}>
								<span>Confirm &amp; pay</span>
								<span>€{selectedTier.price}</span>
							</button>
						</div>
					{:else if phoneScreen === 'booked'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<div class="brand-row">
								<div class="s-brand">
									<span>PAR</span>
									<span class="fl">
										<svg viewBox="0 0 30 60" aria-hidden="true">
											<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
											<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
										</svg>
									</span>
									<span>CAR</span>
								</div>
							</div>

							<div class="success-card">
								<div class="success-glow"></div>
								<div class="check-circle">
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<polyline points="5,12 10,17 19,7" fill="none" stroke="currentColor"
											stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</div>
								<div class="success-title">You're all set.</div>
								<div class="success-sub">We'll text you the moment your car is ready.</div>
							</div>

							<div class="booked-summary">
								<div class="bs-row">
									<span class="fr-lbl">SERVICE</span>
									<span class="fr-val">{selectedTier.name}</span>
								</div>
								<div class="bs-row">
									<span class="fr-lbl">VEHICLE</span>
									<span class="fr-val">Range Rover</span>
								</div>
								<div class="bs-row">
									<span class="fr-lbl">SPOT</span>
									<span class="fr-val">E-14</span>
								</div>
								<div class="bs-row">
									<span class="fr-lbl">TEE TIME</span>
									<span class="fr-val">11:36 AM</span>
								</div>
								<div class="bs-row total">
									<span class="fr-lbl">CHARGED</span>
									<span class="fr-val accent">€{selectedTier.price}.00</span>
								</div>
							</div>

							<div class="bag-note">
								<div class="bn-title">Leave keys with the bag staff.</div>
								<div class="bn-sub">Reference #PC-Q72A.</div>
							</div>

							<button class="screen-cta" onclick={goToLiveStatus}>
								Track your wash →
							</button>
						</div>
					{:else if phoneScreen === 'liveStatus'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<div class="brand-row">
								<div class="s-brand">
									<span>PAR</span>
									<span class="fl">
										<svg viewBox="0 0 30 60" aria-hidden="true">
											<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
											<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
										</svg>
									</span>
									<span>CAR</span>
								</div>
							</div>

							<div class="ls-h1">Your car.</div>
							<div class="ls-sub">
								{statuses.find((s) => s.key === liveStatus)?.sub}
							</div>

							<!-- Progress steps -->
							<div class="progress-stack">
								{#each statuses as s, i}
									<div class="prog-step"
										class:done={i < liveIndex}
										class:current={i === liveIndex}>
										<div class="prog-dot">
											{#if i < liveIndex}
												<svg viewBox="0 0 12 10" aria-hidden="true">
													<polyline points="1,5 4.5,8.5 11,1.5" fill="none"
														stroke="currentColor" stroke-width="2"
														stroke-linecap="round" stroke-linejoin="round" />
												</svg>
											{:else if i === liveIndex}
												<div class="pulse"></div>
											{/if}
										</div>
										<div class="prog-content">
											<div class="prog-label">{s.label}</div>
											<div class="prog-sub">{s.sub}</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Crew card -->
							<div class="crew-card">
								<div class="crew-avatars">
									<div class="crew-avatar">MB</div>
									<div class="crew-avatar">DK</div>
								</div>
								<div class="crew-info">
									<div class="crew-name">Marcus &amp; Dani</div>
									<div class="crew-role">Lead detailer · Interior specialist</div>
								</div>
							</div>

							<!-- Advance button (demo control) -->
							<button class="screen-cta advance"
								onclick={advanceStatus}
								disabled={liveStatus === 'ready'}>
								{#if liveStatus === 'ready'}
									Wash complete →
								{:else}
									▶ Advance status (demo)
								{/if}
							</button>
						</div>
					{:else if phoneScreen === 'ready'}
						<div class="screen" transition:fade={{ duration: 180 }}>
							<div class="brand-row">
								<div class="s-brand">
									<span>PAR</span>
									<span class="fl">
										<svg viewBox="0 0 30 60" aria-hidden="true">
											<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
											<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
										</svg>
									</span>
									<span>CAR</span>
								</div>
							</div>

							<div class="ready-hero">
								<div class="ready-glow"></div>
								<div class="ready-emoji">✨</div>
								<div class="ready-title">Your car is ready.</div>
								<div class="ready-sub">Keys are back at the bag stand · Spot E-14</div>
							</div>

							<!-- Rating -->
							<div class="rating-card">
								<div class="rating-title">How was it?</div>
								<div class="stars">
									{#each Array(5) as _, i}
										<button class="star-btn"
											class:filled={i < rating}
											onclick={() => setRating(i + 1)}>
											★
										</button>
									{/each}
								</div>
							</div>

							<!-- Tip -->
							<div class="tip-card">
								<div class="tip-title">Tip the crew</div>
								<div class="tip-options">
									{#each [0, 5, 10, 20] as amount}
										<button class="tip-btn"
											class:selected={tipEur === amount}
											onclick={() => (tipEur = amount)}>
											€{amount}
										</button>
									{/each}
								</div>
								<div class="tip-hint">100% passed to Marcus &amp; Dani.</div>
							</div>

							<button class="screen-cta"
								onclick={submitRating}
								disabled={rating === 0}>
								{#if rating === 0}
									Rate to close →
								{:else}
									Close &amp; drive home →
								{/if}
							</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="phone-caption">
				Local data only · No sign-in · Fully clickable
			</div>
		</div>
	</div>

	<!-- ═══════════ Footer strip ═══════════ -->
	<footer class="cv-foot">
		<div class="cv-foot-inner">
			<div class="cf-meta">© 2026 LongShot Digital OÜ · Reg. 17437669 · Tallinn</div>
			<div class="cf-links">
				<a href="/app/par-car/clubview">Club view</a>
				<a href="/app/par-car">Marketing site</a>
				<a href="mailto:info@lsdigital.ee">info@lsdigital.ee</a>
			</div>
		</div>
	</footer>
</div>

<style>
	.cv {
		--ink: #1c1a16;
		--ink-2: #595650;
		--ink-3: #9a948a;
		--cream: #f1ece1;
		--cream-deep: #ebe5d6;
		--paper: #faf6ee;
		--line: rgba(28, 26, 22, 0.08);
		--red: #c5392c;
		--gold: #b89456;
		--blue: #2c6f9e;

		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		color: var(--ink);
		background: var(--cream);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
	.cv * {
		box-sizing: border-box;
	}

	/* ─── Header ─── */
	.cv-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 40px;
		border-bottom: 1px solid var(--cream-deep);
	}
	.brand {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 18px;
		letter-spacing: 0.16em;
		color: var(--ink);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.brand .flag {
		width: 0.42em;
		height: 1em;
	}
	.brand .flag svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.head-links {
		display: flex;
		gap: 22px;
	}
	.head-links a {
		font-size: 13px;
		font-weight: 500;
		color: var(--ink-2);
		text-decoration: none;
	}
	.head-links a:hover {
		color: var(--ink);
	}

	/* ─── Stage ─── */
	.stage {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 60px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 60px 40px 40px;
		align-items: center;
	}
	.stage-copy {
		max-width: 460px;
	}
	.eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.28em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 18px;
	}
	.stage-copy h1 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 44px;
		color: var(--ink);
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0 0 20px;
	}
	.lede {
		font-size: 16px;
		color: var(--ink-2);
		line-height: 1.55;
		margin: 0 0 28px;
	}

	.flow-steps {
		list-style: none;
		padding: 0;
		margin: 0 0 24px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.flow-steps li {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 13px;
		color: var(--ink-3);
		transition: background 0.15s, color 0.15s;
	}
	.flow-steps li.active {
		background: var(--ink);
		color: var(--cream);
	}
	.flow-steps li .fs-num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: inherit;
	}
	.flow-steps li .fs-label {
		font-weight: 500;
	}
	.restart-btn {
		background: transparent;
		border: 1px solid var(--ink);
		color: var(--ink);
		padding: 10px 20px;
		border-radius: 999px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.restart-btn:hover {
		background: var(--ink);
		color: var(--cream);
	}

	/* ─── Phone ─── */
	.phone-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.phone {
		width: 340px;
		height: 700px;
		background: #0e0e10;
		border-radius: 52px;
		padding: 12px;
		box-shadow:
			0 40px 100px rgba(28, 26, 22, 0.18),
			0 14px 32px rgba(28, 26, 22, 0.1);
		position: relative;
	}
	.phone::before {
		content: '';
		position: absolute;
		top: 18px;
		left: 50%;
		transform: translateX(-50%);
		width: 110px;
		height: 28px;
		background: #0a0a0c;
		border-radius: 999px;
		z-index: 5;
	}
	.phone-screen {
		width: 100%;
		height: 100%;
		background: #fbf8f1;
		border-radius: 42px;
		overflow: hidden;
		position: relative;
	}
	.phone-caption {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		font-weight: 600;
		text-transform: uppercase;
	}

	.status-bar {
		position: absolute;
		top: 18px;
		left: 0;
		right: 0;
		padding: 0 34px;
		height: 26px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink);
		z-index: 4;
	}
	.status-icons {
		display: inline-flex;
		gap: 7px;
		align-items: center;
		color: var(--ink);
	}
	.status-icons svg {
		height: 11px;
		width: auto;
	}

	.screen {
		position: absolute;
		inset: 0;
		padding: 60px 22px 22px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		overflow-y: auto;
		scrollbar-width: none;
	}
	.screen::-webkit-scrollbar {
		display: none;
	}

	/* Brand row */
	.brand-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.s-brand {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 15px;
		letter-spacing: 0.18em;
		color: var(--ink);
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.s-brand .fl {
		width: 0.42em;
		height: 1em;
	}
	.s-brand .fl svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.gear-btn {
		width: 30px;
		height: 30px;
		border: 1px solid var(--line);
		background: var(--paper);
		border-radius: 9px;
		color: var(--ink);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	/* Home */
	.greet-block {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: 4px;
	}
	.greet-line {
		font-size: 13px;
		color: var(--ink-3);
	}
	.greet-name {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 30px;
		color: var(--ink);
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.greet-meta {
		font-size: 12px;
		color: var(--ink-2);
		margin-top: 5px;
	}

	.tee-card {
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #1c1a16 0%, #2a2620 100%);
		color: var(--cream);
		padding: 20px;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.tee-glow {
		position: absolute;
		top: -60px;
		right: -50px;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background: rgba(197, 57, 44, 0.5);
		filter: blur(40px);
		pointer-events: none;
	}
	.tee-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.22em;
		color: #ff8a7a;
		font-weight: 600;
		position: relative;
	}
	.tee-time {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 32px;
		letter-spacing: -0.03em;
		line-height: 1;
		color: white;
		position: relative;
		margin-top: 4px;
	}
	.tee-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		color: rgba(241, 236, 225, 0.55);
		font-weight: 600;
		margin: 4px 0 14px;
		position: relative;
	}
	.tee-cta {
		background: var(--red);
		color: var(--cream);
		border: none;
		padding: 13px 18px;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		box-shadow: 0 8px 20px rgba(197, 57, 44, 0.42);
		transition: background 0.15s, transform 0.1s;
	}
	.tee-cta:hover {
		background: #a32a1e;
	}
	.tee-cta:active {
		transform: scale(0.98);
	}

	.vehicle-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.2em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: -4px;
	}
	.vehicle-mini {
		display: grid;
		grid-template-columns: 78px 1fr auto;
		gap: 12px;
		align-items: center;
		background: var(--paper);
		border: 1px solid var(--line);
		padding: 10px;
		border-radius: 14px;
	}
	.vehicle-paint {
		width: 78px;
		height: 46px;
		border-radius: 8px;
		background: linear-gradient(135deg, #14141a 0%, #2a2a2e 100%);
		padding: 6px 8px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.paint-brand {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 9px;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.95);
	}
	.paint-sub {
		font-family: 'JetBrains Mono', monospace;
		font-size: 7px;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.55);
		font-weight: 600;
	}
	.vehicle-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		color: var(--ink);
	}
	.vehicle-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		margin-top: 2px;
	}
	.vehicle-spot {
		font-family: 'JetBrains Mono', monospace;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--red);
	}

	/* Back button + screen title */
	.back-btn {
		border: none;
		background: transparent;
		font-size: 13px;
		color: var(--ink-2);
		font-weight: 500;
		padding: 0;
		align-self: flex-start;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.back-btn .arr {
		font-size: 16px;
	}
	.screen-h1 {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 26px;
		color: var(--ink);
		letter-spacing: -0.025em;
		line-height: 1.05;
	}
	.screen-sub {
		font-size: 12px;
		color: var(--ink-2);
		margin-top: -6px;
	}

	.tier-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.tier-card {
		background: var(--paper);
		border: 1.5px solid var(--line);
		border-radius: 14px;
		padding: 12px 14px;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		transition: border-color 0.15s, background 0.15s;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.tier-card.selected {
		border-color: var(--red);
		background: #fffbfa;
		box-shadow: 0 6px 18px rgba(197, 57, 44, 0.15);
	}
	.tier-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tier-name-wrap {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.tier-check {
		width: 16px;
		height: 16px;
		background: var(--red);
		color: var(--cream);
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.tier-check svg {
		width: 8px;
		height: auto;
	}
	.tier-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 15px;
		color: var(--ink);
	}
	.tier-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.16em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.tier-price {
		font-family: 'JetBrains Mono', monospace;
		font-weight: 600;
		font-size: 16px;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.tier-blurb {
		font-size: 11px;
		color: var(--ink-2);
		line-height: 1.45;
	}

	.screen-cta {
		margin-top: auto;
		background: var(--red);
		color: var(--cream);
		border: none;
		padding: 14px;
		border-radius: 14px;
		font-size: 14px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		box-shadow: 0 8px 20px rgba(197, 57, 44, 0.32);
		transition: background 0.15s, transform 0.1s;
	}
	.screen-cta:hover {
		background: #a32a1e;
	}
	.screen-cta:active {
		transform: scale(0.98);
	}
	.screen-cta:disabled {
		background: var(--ink-3);
		box-shadow: none;
		cursor: not-allowed;
	}
	.screen-cta.confirm-pay {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
	}
	.screen-cta.advance {
		background: var(--ink);
		box-shadow: 0 6px 18px rgba(28, 26, 22, 0.3);
	}
	.screen-cta.advance:hover {
		background: #000;
	}

	/* Confirm form */
	.form-list {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.form-list .form-row {
		padding: 10px 14px;
		border-bottom: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.form-list .form-row:last-child {
		border-bottom: none;
	}
	.fr-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.fr-val {
		font-size: 12px;
		color: var(--ink);
		font-weight: 500;
		text-align: right;
	}
	.summary-card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.summary-row {
		padding: 10px 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--line);
	}
	.summary-row:last-child {
		border-bottom: none;
	}
	.summary-row.total .fr-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 16px;
		font-weight: 600;
	}

	/* Booked screen */
	.success-card {
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #1c1a16 0%, #2a2620 100%);
		border-radius: 16px;
		padding: 28px 22px 22px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.success-glow {
		position: absolute;
		top: -120px;
		left: 50%;
		transform: translateX(-50%);
		width: 240px;
		height: 240px;
		border-radius: 50%;
		background: rgba(155, 194, 138, 0.42);
		filter: blur(40px);
		pointer-events: none;
	}
	.check-circle {
		width: 52px;
		height: 52px;
		background: #9bc28a;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12px 30px rgba(155, 194, 138, 0.5);
		position: relative;
		z-index: 1;
	}
	.check-circle svg {
		width: 26px;
		height: 26px;
	}
	.success-title {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 20px;
		color: white;
		letter-spacing: -0.02em;
		position: relative;
		z-index: 1;
		margin-top: 6px;
	}
	.success-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.72);
		max-width: 220px;
		line-height: 1.45;
		position: relative;
		z-index: 1;
	}

	.booked-summary {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.bs-row {
		padding: 8px 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--line);
	}
	.bs-row:last-child {
		border-bottom: none;
	}
	.bs-row.total .fr-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 14px;
		font-weight: 600;
	}
	.fr-val.accent {
		color: var(--red);
	}
	.bag-note {
		background: var(--paper);
		border: 1px dashed rgba(28, 26, 22, 0.22);
		border-radius: 12px;
		padding: 10px 14px;
	}
	.bn-title {
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
	}
	.bn-sub {
		font-size: 11px;
		color: var(--ink-2);
		margin-top: 1px;
	}

	/* Live status */
	.ls-h1 {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 26px;
		color: var(--ink);
		letter-spacing: -0.025em;
	}
	.ls-sub {
		font-size: 12px;
		color: var(--ink-2);
		margin-top: -6px;
	}
	.progress-stack {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 6px 12px;
	}
	.prog-step {
		display: grid;
		grid-template-columns: 28px 1fr;
		align-items: center;
		gap: 12px;
		padding: 10px 4px;
		border-bottom: 1px solid var(--line);
		opacity: 0.5;
	}
	.prog-step:last-child {
		border-bottom: none;
	}
	.prog-step.done {
		opacity: 1;
	}
	.prog-step.current {
		opacity: 1;
	}
	.prog-dot {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #d8d0c0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		position: relative;
	}
	.prog-step.done .prog-dot {
		background: var(--ink);
	}
	.prog-step.done .prog-dot svg {
		width: 10px;
		height: auto;
	}
	.prog-step.current .prog-dot {
		background: var(--red);
	}
	.pulse {
		width: 8px;
		height: 8px;
		background: white;
		border-radius: 50%;
		animation: pulse-dot 1.4s ease-in-out infinite;
	}
	@keyframes pulse-dot {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.5); opacity: 0.5; }
	}
	.prog-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--ink);
	}
	.prog-sub {
		font-size: 11px;
		color: var(--ink-3);
		margin-top: 2px;
	}
	.prog-step.current .prog-label {
		color: var(--red);
	}

	.crew-card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 14px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.crew-avatars {
		display: flex;
	}
	.crew-avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--ink) 0%, #2a2620 100%);
		color: var(--cream);
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.crew-avatar + .crew-avatar {
		margin-left: -8px;
		border: 2px solid var(--paper);
	}
	.crew-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
	}
	.crew-role {
		font-size: 11px;
		color: var(--ink-3);
		margin-top: 2px;
	}

	/* Ready screen */
	.ready-hero {
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #1c1a16 0%, #2a2620 100%);
		color: var(--cream);
		border-radius: 16px;
		padding: 24px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.ready-glow {
		position: absolute;
		top: -110px;
		left: 50%;
		transform: translateX(-50%);
		width: 240px;
		height: 240px;
		border-radius: 50%;
		background: rgba(184, 148, 86, 0.55);
		filter: blur(45px);
		pointer-events: none;
	}
	.ready-emoji {
		font-size: 32px;
		position: relative;
		z-index: 1;
	}
	.ready-title {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.02em;
		color: white;
		position: relative;
		z-index: 1;
		margin-top: 4px;
	}
	.ready-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.72);
		position: relative;
		z-index: 1;
	}
	.rating-card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 14px;
		text-align: center;
	}
	.rating-title {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		color: var(--ink);
		margin-bottom: 10px;
	}
	.stars {
		display: flex;
		justify-content: center;
		gap: 4px;
	}
	.star-btn {
		background: transparent;
		border: none;
		font-size: 30px;
		color: #d8d0c0;
		cursor: pointer;
		padding: 4px;
		transition: color 0.15s, transform 0.1s;
		font-family: inherit;
	}
	.star-btn.filled {
		color: var(--gold);
	}
	.star-btn:hover {
		transform: scale(1.15);
	}
	.tip-card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 14px;
	}
	.tip-title {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		color: var(--ink);
		margin-bottom: 10px;
		text-align: center;
	}
	.tip-options {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}
	.tip-btn {
		padding: 8px 4px;
		border: 1.5px solid var(--line);
		background: var(--cream);
		border-radius: 10px;
		font-family: 'JetBrains Mono', monospace;
		font-weight: 700;
		font-size: 12px;
		color: var(--ink);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}
	.tip-btn.selected {
		border-color: var(--red);
		background: #fffbfa;
		color: var(--red);
	}
	.tip-hint {
		font-size: 10px;
		color: var(--ink-3);
		text-align: center;
		margin-top: 8px;
	}

	/* Footer */
	.cv-foot {
		border-top: 1px solid var(--cream-deep);
		padding: 20px 40px;
		background: var(--cream);
	}
	.cv-foot-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}
	.cf-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		text-transform: uppercase;
	}
	.cf-links {
		display: flex;
		gap: 20px;
	}
	.cf-links a {
		font-size: 12px;
		color: var(--ink-2);
		text-decoration: none;
	}
	.cf-links a:hover {
		color: var(--ink);
	}

	/* Responsive */
	@media (max-width: 900px) {
		.stage {
			grid-template-columns: 1fr;
			gap: 40px;
			padding: 40px 24px;
		}
		.stage-copy {
			max-width: none;
		}
		.stage-copy h1 {
			font-size: 32px;
		}
		.phone {
			transform: scale(0.9);
			transform-origin: center top;
		}
	}
</style>
