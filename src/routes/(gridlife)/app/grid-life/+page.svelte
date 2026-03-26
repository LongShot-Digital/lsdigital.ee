<script lang="ts">
	import { onMount } from 'svelte';

	let activeTab = $state('countdowns');

	const tabs = [
		{ id: 'countdowns', label: 'Countdowns' },
		{ id: 'habits', label: 'Habits' },
		{ id: 'streaks', label: 'Streaks' },
		{ id: 'progress', label: 'Progress' },
		{ id: 'milestones', label: 'Milestones' }
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		document.querySelectorAll('.reveal').forEach((el) => {
			observer.observe(el);
		});

		const navEl = document.querySelector<HTMLElement>('.gl nav');
		const onScroll = () => {
			if (navEl) {
				navEl.style.boxShadow = window.scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none';
			}
		};
		window.addEventListener('scroll', onScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});

	function scrollTo(e: Event, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Grid Life — Habits, Streaks & Countdowns</title>
	<meta
		name="description"
		content="Grid Life turns your habits, streaks, and countdowns into something beautiful. Track progress, challenge friends, and make every day visible."
	/>
</svelte:head>

<div class="gl">
	<!-- Navigation -->
	<nav>
		<a href="/app/grid-life" class="nav-logo">
			<img src="/app/grid-life/app-icon.png" alt="Grid Life" class="nav-logo-icon" />
			<span class="nav-logo-text">Grid Life</span>
		</a>
		<div class="nav-links">
			<a href="#features" onclick={(e) => scrollTo(e, 'features')}>Features</a>
			<a href="#groups" onclick={(e) => scrollTo(e, 'groups')}>Groups</a>
			<a href="#widgets" onclick={(e) => scrollTo(e, 'widgets')}>Widgets</a>
			<a
				href="https://apps.apple.com/us/app/grid-life-make-it-count/id6759627693"
				class="nav-cta app-store-badge"
			>
				<img src="/app/grid-life/app-store-badge.svg" alt="Download on the App Store" />
			</a>
		</div>
	</nav>

	<!-- Hero -->
	<section class="hero">
		<div class="hero-dots" aria-hidden="true">
			{#each Array(100) as _}<span></span>{/each}
		</div>

		<span class="hero-badge">Now on the App Store</span>

		<h1>Track habits.<br />Build streaks.<br /><em>Challenge friends.</em></h1>

		<p class="hero-sub">
			Grid Life turns your countdowns, habits, and streaks into something you can see, share, and
			hold each other to.
		</p>

		<div class="hero-actions">
			<a
				href="https://apps.apple.com/us/app/grid-life-make-it-count/id6759627693"
				class="app-store-badge"
			>
				<img src="/app/grid-life/app-store-badge.svg" alt="Download on the App Store" />
			</a>
			<a href="#features" class="btn-secondary" onclick={(e) => scrollTo(e, 'features')}
				>See features</a
			>
		</div>

		<div class="hero-phone">
			<img
				src="/app/grid-life/hero.png"
				alt="Grid Life countdown view showing marathon training progress"
			/>
		</div>
	</section>

	<!-- Features with Tabs -->
	<section class="features" id="features">
		<div class="features-header reveal">
			<p class="section-label">Features</p>
			<h2>One app, three ways to track</h2>
		</div>

		<div class="feature-tabs reveal">
			{#each tabs as tab}
				<button
					class="feature-tab"
					class:active={activeTab === tab.id}
					onclick={() => (activeTab = tab.id)}>{tab.label}</button
				>
			{/each}
		</div>

		<!-- Countdowns Panel -->
		{#if activeTab === 'countdowns'}
			<div class="feature-panel active">
				<div class="feature-text">
					<h3>Count down to what matters</h3>
					<p>
						Turn any stretch of time into a beautiful dot grid. Every filled dot is a day done.
						Every empty dot is a day ahead. One glance and you know exactly where you stand.
					</p>
					<div class="feature-detail">
						<div class="feature-detail-icon">&#8728;</div>
						<span class="feature-detail-text"
							>Trips, race days, product launches, graduation — if it has a start and an end, Grid
							Life makes it visual.</span
						>
					</div>
				</div>
				<div class="feature-phone">
					<img src="/app/grid-life/feature-countdowns.png" alt="Countdown dot grid" />
				</div>
			</div>
		{/if}

		<!-- Habits Panel -->
		{#if activeTab === 'habits'}
			<div class="feature-panel active">
				<div class="feature-text">
					<h3>Build routines that stick</h3>
					<p>
						Set daily, weekly, or monthly goals. Add sub-habits to break big goals into smaller
						pieces. Check in with a tap, track your completion rate, and see your progress build
						over time.
					</p>
					<div class="feature-detail">
						<div class="feature-detail-icon">&#10003;</div>
						<span class="feature-detail-text"
							>Sub-habits like "Run 5km", "Read 15min", "Meditate" — all tracked in one Space with
							progress bars and weekly goals.</span
						>
					</div>
				</div>
				<div class="feature-phone">
					<img
						src="/app/grid-life/feature-habits.png"
						alt="Habit tracking with sub-habits and progress ring"
					/>
				</div>
			</div>
		{/if}

		<!-- Streaks Panel -->
		{#if activeTab === 'streaks'}
			<div class="feature-panel active">
				<div class="feature-text">
					<h3>Don't break the chain</h3>
					<p>
						Start a streak, check in daily, and watch the dots fill in. Miss a day and it resets.
						Simple, visual, and just enough pressure to keep you going.
					</p>
					<div class="feature-detail">
						<div class="feature-detail-icon">&#128293;</div>
						<span class="feature-detail-text"
							>Your current streak, longest streak, and weekly check-in view — all on one screen.</span
						>
					</div>
				</div>
				<div class="feature-phone">
					<img
						src="/app/grid-life/feature-streaks.png"
						alt="Streak tracking with fire emoji dots"
					/>
				</div>
			</div>
		{/if}

		<!-- Progress Panel -->
		{#if activeTab === 'progress'}
			<div class="feature-panel active">
				<div class="feature-text">
					<h3>Know where you stand</h3>
					<p>
						See all your Spaces at a glance — active countdowns, habit completion rates, and streak
						lengths. Total days tracked, progress bars, and a summary that keeps you focused.
					</p>
					<div class="feature-detail">
						<div class="feature-detail-icon">&#9632;</div>
						<span class="feature-detail-text"
							>Breakdown by type: Countdowns, Habits, Streaks — each with its own progress bar and
							percentage.</span
						>
					</div>
				</div>
				<div class="feature-phone">
					<img
						src="/app/grid-life/feature-progress.png"
						alt="Progress summary showing all spaces"
					/>
				</div>
			</div>
		{/if}

		<!-- Milestones Panel -->
		{#if activeTab === 'milestones'}
			<div class="feature-panel active">
				<div class="feature-text">
					<h3>Mark the days that matter</h3>
					<p>
						Add milestones to any Space. See them on a calendar, plan ahead, and look back at what
						you've accomplished. Perfect for training plans, project deadlines, and personal goals.
					</p>
					<div class="feature-detail">
						<div class="feature-detail-icon">&#128197;</div>
						<span class="feature-detail-text"
							>Calendar view with milestones across all your Spaces. Tap any day to add notes and
							track completion.</span
						>
					</div>
				</div>
				<div class="feature-phone">
					<img src="/app/grid-life/feature-milestones.png" alt="Milestones calendar view" />
				</div>
			</div>
		{/if}
	</section>

	<!-- Groups / Accountability Section -->
	<section class="groups-section" id="groups">
		<div class="groups-inner">
			<div class="groups-visual reveal">
				<div class="groups-mockup">
					<img src="/app/grid-life/groups.png" alt="Progress and groups view" />
					<div class="float-card card-1">
						<strong>Emma</strong> just checked in &#128170;
					</div>
					<div class="float-card card-2">
						&#127942; You're <strong>#1</strong> this week
					</div>
				</div>
			</div>
			<div class="groups-text reveal">
				<p class="section-label" style="text-align:left;">Friend Groups</p>
				<h2>Hold each other accountable</h2>
				<p>
					Create a group, invite your friends, and compete on shared goals. A live leaderboard keeps
					everyone honest — whether it's a fitness challenge, a no-sugar streak, or a daily reading
					habit.
				</p>
				<div class="groups-features">
					<div class="groups-feature-item">
						<span class="icon">&#128101;</span>
						Create groups & invite friends
					</div>
					<div class="groups-feature-item">
						<span class="icon">&#127942;</span>
						Live leaderboards & rankings
					</div>
					<div class="groups-feature-item">
						<span class="icon">&#128276;</span>
						See when friends check in
					</div>
					<div class="groups-feature-item">
						<span class="icon">&#127919;</span>
						Shared goals & challenges
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Widgets Section -->
	<section class="widgets-section" id="widgets">
		<div class="reveal">
			<p class="section-label">Always Visible</p>
			<h2>Widgets that belong on your Home Screen</h2>
			<p>
				Small, medium, and large widgets. Automated lock screen wallpapers via Shortcuts. Your
				progress, always one glance away.
			</p>
		</div>
		<div class="widgets-image reveal">
			<img src="/app/grid-life/widgets.png" alt="Grid Life widgets on iPhone home screen" />
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="closing" id="download">
		<div class="closing-dots" aria-hidden="true">
			<svg width="600" height="200" viewBox="0 0 600 200" fill="none">
				{#each Array(8) as _, r}
					{#each Array(24) as _, c}
						<circle
							cx={c * 25 + 12}
							cy={r * 25 + 12}
							r="4"
							fill={r * 24 + c < 100 ? '#F5A623' : '#DDD8D0'}
						/>
					{/each}
				{/each}
			</svg>
		</div>
		<div class="reveal">
			<h2>Every day counts.<br /><em>Make them visible.</em></h2>
			<p>Countdowns, habits, streaks, and friends — all in one beautifully simple app.</p>
			<a
				href="https://apps.apple.com/us/app/grid-life-make-it-count/id6759627693"
				class="app-store-badge"
			>
				<img src="/app/grid-life/app-store-badge.svg" alt="Download on the App Store" />
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer>
		<div class="footer-left">
			<span>&copy; 2026 LongShot Digital O&Uuml;</span>
		</div>
		<div class="footer-links">
			<a href="/app/grid-life/legal">Legal</a>
			<a href="mailto:info+gridlifeapp@lsdigital.ee">Contact</a>
		</div>
	</footer>
</div>

<style>
	/* ── Scoped Grid Life Theme ── */
	.gl {
		--bg: #faf8f5;
		--bg-warm: #f5efe6;
		--bg-cream: #ede5d8;
		--ink: #1a1714;
		--ink-soft: #3d3730;
		--ink-muted: #8a8278;
		--ink-faint: #b5aea4;
		--accent: #f5a623;
		--accent-warm: #e8942a;
		--accent-glow: rgba(245, 166, 35, 0.15);
		--accent-soft: rgba(245, 166, 35, 0.08);
		--card-bg: rgba(255, 253, 249, 0.6);
		--card-border: rgba(0, 0, 0, 0.06);
		--glass: rgba(255, 253, 249, 0.4);
		--serif: 'Fraunces', Georgia, serif;
		--sans: 'DM Sans', system-ui, sans-serif;

		font-family: var(--sans);
		color: var(--ink);
		background: var(--bg);
		line-height: 1.6;
		position: relative;
		z-index: 1;
	}

	.gl::before {
		content: '';
		position: fixed;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
		pointer-events: none;
		z-index: 0;
	}

	::selection {
		background: var(--accent);
		color: #fff;
	}

	/* ── Animations ── */
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(32px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.reveal {
		opacity: 0;
		transform: translateY(32px);
		transition:
			opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(.reveal.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	/* ── Navigation ── */
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 16px clamp(24px, 5vw, 60px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(250, 248, 245, 0.8);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--ink);
	}

	.nav-logo-icon {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		object-fit: cover;
	}

	.nav-logo-text {
		font-family: var(--sans);
		font-weight: 600;
		font-size: 1rem;
		letter-spacing: -0.01em;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.nav-links a {
		font-family: var(--sans);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--ink-muted);
		text-decoration: none;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: var(--ink);
	}

	.nav-cta {
		display: inline-flex;
		align-items: center;
		padding: 0 !important;
		background: none !important;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
	}

	.nav-cta:hover {
		transform: translateY(-1px);
	}

	.nav-cta img {
		height: 36px;
		width: auto;
		display: block;
	}

	/* ── Hero ── */
	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 120px clamp(24px, 6vw, 80px) 80px;
		position: relative;
		overflow: hidden;
	}

	.hero-dots {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		gap: 18px;
		opacity: 0.06;
		pointer-events: none;
	}

	.hero-dots span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: var(--accent-soft);
		border: 1px solid rgba(245, 166, 35, 0.15);
		border-radius: 100px;
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--accent-warm);
		margin-bottom: 28px;
		animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
	}

	.hero h1 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2.6rem, 7vw, 4.8rem);
		line-height: 1.08;
		color: var(--ink);
		max-width: 720px;
		letter-spacing: -0.03em;
		animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
	}

	.hero h1 em {
		font-style: italic;
		color: var(--accent);
	}

	.hero-sub {
		font-family: var(--sans);
		font-weight: 400;
		font-size: clamp(1rem, 1.8vw, 1.15rem);
		color: var(--ink-muted);
		margin-top: 24px;
		max-width: 480px;
		line-height: 1.65;
		animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 40px;
		animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
	}

	.app-store-badge {
		display: inline-block;
		transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.app-store-badge:hover {
		transform: translateY(-2px);
	}

	.app-store-badge img {
		height: 48px;
		width: auto;
		display: block;
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 14px 24px;
		background: transparent;
		color: var(--ink-soft);
		border: 1px solid var(--card-border);
		border-radius: 100px;
		font-family: var(--sans);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.btn-secondary:hover {
		background: var(--card-bg);
		border-color: rgba(0, 0, 0, 0.1);
	}

	.hero-phone {
		margin-top: 64px;
		position: relative;
		animation: fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
	}

	.hero-phone img {
		width: min(320px, 70vw);
		border-radius: 36px;
		box-shadow:
			0 30px 80px rgba(0, 0, 0, 0.12),
			0 0 0 1px rgba(0, 0, 0, 0.04);
	}

	.hero-phone::after {
		content: '';
		position: absolute;
		bottom: -40px;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 40px;
		background: radial-gradient(ellipse, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
	}

	/* ── Features Tabs Section ── */
	.features {
		padding: clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px);
		max-width: 1100px;
		margin: 0 auto;
	}

	.features-header {
		text-align: center;
		margin-bottom: 56px;
	}

	.section-label {
		font-family: var(--sans);
		font-weight: 600;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 16px;
	}

	.features-header h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2rem, 4.5vw, 3rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		max-width: 600px;
		margin: 0 auto;
	}

	.feature-tabs {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 56px;
		flex-wrap: wrap;
	}

	.feature-tab {
		padding: 12px 24px;
		border: 1.5px solid var(--card-border);
		border-radius: 100px;
		background: var(--card-bg);
		font-family: var(--sans);
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--ink-muted);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		user-select: none;
	}

	.feature-tab:hover {
		border-color: rgba(0, 0, 0, 0.12);
		color: var(--ink-soft);
		transform: translateY(-1px);
	}

	.feature-tab.active {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}

	.feature-panel {
		display: none;
		align-items: center;
		gap: clamp(40px, 6vw, 80px);
	}

	.feature-panel.active {
		display: grid;
		grid-template-columns: 1fr 1fr;
		animation: fadeIn 0.5s ease;
	}

	.feature-text {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.feature-text h3 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.feature-text p {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 1rem;
		color: var(--ink-muted);
		line-height: 1.7;
		max-width: 420px;
	}

	.feature-detail {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		background: var(--accent-soft);
		border-radius: 14px;
		margin-top: 4px;
	}

	.feature-detail-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 1rem;
		flex-shrink: 0;
	}

	.feature-detail-text {
		font-size: 0.88rem;
		color: var(--ink-soft);
		font-weight: 400;
		line-height: 1.5;
	}

	.feature-phone {
		display: flex;
		justify-content: center;
	}

	.feature-phone img {
		width: min(280px, 60vw);
		border-radius: 32px;
		box-shadow:
			0 24px 64px rgba(0, 0, 0, 0.1),
			0 0 0 1px rgba(0, 0, 0, 0.04);
		transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.feature-phone img:hover {
		transform: scale(1.02);
	}

	/* ── Social Proof / Groups Section ── */
	.groups-section {
		padding: clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px);
		background: var(--bg-warm);
		position: relative;
	}

	.groups-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(40px, 6vw, 80px);
		align-items: center;
	}

	.groups-visual {
		display: flex;
		justify-content: center;
	}

	.groups-mockup {
		position: relative;
		width: min(300px, 65vw);
	}

	.groups-mockup img {
		width: 100%;
		border-radius: 32px;
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1);
	}

	.float-card {
		position: absolute;
		padding: 12px 16px;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 14px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.04);
		font-family: var(--sans);
		font-size: 0.8rem;
		color: var(--ink-soft);
		white-space: nowrap;
		animation: float 4s ease-in-out infinite;
	}

	.float-card.card-1 {
		top: 26%;
		right: -30px;
		animation-delay: 0s;
	}

	.float-card.card-2 {
		top: 33%;
		right: -30px;
		animation-delay: 1.5s;
	}

	.float-card strong {
		color: var(--accent);
		font-weight: 600;
	}

	.groups-text h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2rem, 4.5vw, 3rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		margin-bottom: 20px;
		line-height: 1.1;
	}

	.groups-text p {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 1rem;
		color: var(--ink-muted);
		line-height: 1.7;
		max-width: 440px;
		margin-bottom: 24px;
	}

	.groups-features {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.groups-feature-item {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--sans);
		font-size: 0.92rem;
		color: var(--ink-soft);
		font-weight: 400;
	}

	.groups-feature-item .icon {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--accent-glow);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	/* ── Widgets Section ── */
	.widgets-section {
		padding: clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px);
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}

	.widgets-section h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2rem, 4.5vw, 3rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		margin-bottom: 16px;
	}

	.widgets-section p {
		font-family: var(--sans);
		font-size: 1rem;
		color: var(--ink-muted);
		max-width: 480px;
		margin: 0 auto 48px;
		line-height: 1.65;
	}

	.widgets-image {
		width: min(320px, 70vw);
		margin: 0 auto;
		border-radius: 36px;
		overflow: hidden;
		box-shadow:
			0 30px 80px rgba(0, 0, 0, 0.12),
			0 0 0 1px rgba(0, 0, 0, 0.04);
	}

	.widgets-image img {
		width: 100%;
		display: block;
	}

	/* ── Closing CTA ── */
	.closing {
		padding: clamp(100px, 14vh, 180px) clamp(24px, 6vw, 80px);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.closing-dots {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.04;
		pointer-events: none;
	}

	.closing h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2.2rem, 5.5vw, 3.8rem);
		color: var(--ink);
		letter-spacing: -0.03em;
		max-width: 620px;
		margin: 0 auto 16px;
		line-height: 1.1;
		position: relative;
	}

	.closing h2 em {
		color: var(--accent);
		font-style: italic;
	}

	.closing p {
		font-family: var(--sans);
		font-size: 1rem;
		color: var(--ink-muted);
		max-width: 400px;
		margin: 0 auto 36px;
		line-height: 1.65;
	}

	/* ── Footer ── */
	footer {
		padding: clamp(40px, 6vh, 60px) clamp(24px, 6vw, 80px);
		border-top: 1px solid rgba(0, 0, 0, 0.06);
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer-left {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	.footer-left span {
		font-family: var(--sans);
		font-size: 0.8rem;
		color: var(--ink-faint);
	}

	.footer-links {
		display: flex;
		gap: 24px;
	}

	.footer-links a {
		font-family: var(--sans);
		font-size: 0.8rem;
		color: var(--ink-muted);
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: var(--ink);
	}

	/* ── Responsive ── */
	@media (max-width: 768px) {
		nav {
			padding: 12px 20px;
		}
		.nav-links a:not(.nav-cta) {
			display: none;
		}

		.feature-panel.active {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.feature-text {
			align-items: center;
		}
		.feature-text p {
			max-width: 100%;
		}
		.feature-phone {
			order: -1;
		}
		.feature-detail {
			justify-content: center;
		}

		.groups-inner {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.groups-text p {
			max-width: 100%;
			margin-left: auto;
			margin-right: auto;
		}
		.groups-features {
			align-items: center;
		}
		.groups-visual {
			order: -1;
		}

		.float-card.card-1 {
			right: -10px;
			top: 26%;
		}
		.float-card.card-2 {
			left: auto;
			right: -10px;
			top: 33%;
			bottom: auto;
		}

		footer {
			flex-direction: column;
			gap: 16px;
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.feature-tabs {
			gap: 6px;
		}
		.feature-tab {
			padding: 10px 18px;
			font-size: 0.82rem;
		}
		.hero-actions {
			flex-direction: column;
		}
	}
</style>
