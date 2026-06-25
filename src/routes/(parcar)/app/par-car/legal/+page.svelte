<svelte:head>
	<title>Legal — Par Car</title>
	<meta
		name="description"
		content="Privacy Policy and Terms & Conditions for Par Car by LongShot Digital."
	/>
</svelte:head>

<div class="legal">
	<nav>
		<a href="/app/par-car" class="nav-logo">
			<img src="/app/par-car/app-icon.png" alt="Par Car" class="nav-logo-icon" />
			<span class="nav-logo-text">
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
	</nav>

	<section class="legal-hero">
		<h1>Legal</h1>
		<p>
			Everything you need to know about how Par Car handles your data, your vehicle, and the
			service itself.
		</p>
	</section>

	<section class="legal-cards">
		<a href="mailto:info@lsdigital.ee" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
					<polyline points="22,6 12,13 2,6" />
				</svg>
			</div>
			<h2>Support</h2>
			<p>
				Questions, feedback, or help with a booking — we get back to you within one business day.
			</p>
			<span class="card-link">info@lsdigital.ee</span>
		</a>

		<a href="/app/par-car/privacy" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
			</div>
			<h2>Privacy Policy</h2>
			<p>
				What we collect, why, and who sees it. Clubs receive only aggregate reporting — never
				individual member records.
			</p>
			<span class="card-link">Read Privacy Policy &rarr;</span>
		</a>

		<a href="/app/par-car/terms" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14 2 14 8 20 8" />
					<line x1="16" y1="13" x2="8" y2="13" />
					<line x1="16" y1="17" x2="8" y2="17" />
					<polyline points="10 9 9 9 8 9" />
				</svg>
			</div>
			<h2>Terms &amp; Conditions</h2>
			<p>
				How the service works, what you agree to, and how we handle cancellations, weather,
				vehicle damage, and the club partnership.
			</p>
			<span class="card-link">Read Terms &amp; Conditions &rarr;</span>
		</a>
	</section>

	<footer>
		<span>&copy; 2026 LongShot Digital O&Uuml; &middot; Reg. 17437669</span>
		<a href="mailto:info@lsdigital.ee">info@lsdigital.ee</a>
	</footer>
</div>

<style>
	.legal {
		--sans: 'Inter', system-ui, -apple-system, sans-serif;
		--serif: 'Spectral', Georgia, serif;
		--bg: #f1ece1;
		--paper: #faf6ee;
		--ink: #1c1a16;
		--ink-soft: #595650;
		--ink-muted: #9a948a;
		--accent: #c5392c;
		--line: rgba(28, 26, 22, 0.08);

		min-height: 100vh;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		font-family: var(--sans);
		color: var(--ink);
	}

	.legal nav {
		padding: 20px clamp(24px, 6vw, 80px);
		padding-top: max(20px, env(safe-area-inset-top, 20px));
		display: flex;
		align-items: center;
	}

	.legal .nav-logo {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--ink);
	}

	.legal .nav-logo-icon {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		object-fit: cover;
	}

	.legal .nav-logo-text {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1rem;
		letter-spacing: 0.16em;
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}

	.legal .flag {
		width: 0.42em;
		height: 1em;
		display: inline-block;
	}
	.legal .flag svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	.legal .legal-hero {
		text-align: center;
		padding: clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px) clamp(40px, 6vh, 60px);
	}

	.legal .legal-hero h1 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		margin-bottom: 16px;
	}

	.legal .legal-hero p {
		font-family: var(--sans);
		font-size: 1.05rem;
		color: var(--ink-muted);
		max-width: 520px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.legal .legal-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 clamp(24px, 6vw, 80px) clamp(80px, 12vh, 140px);
	}

	.legal .legal-card {
		background: var(--paper);
		border-radius: 18px;
		padding: 32px 30px;
		text-decoration: none;
		color: var(--ink);
		border: 1px solid var(--line);
		transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		display: flex;
		flex-direction: column;
	}

	.legal .legal-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 16px 40px rgba(28, 26, 22, 0.08);
		border-color: rgba(28, 26, 22, 0.12);
	}

	.legal .card-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: linear-gradient(135deg, rgba(197, 57, 44, 0.12), rgba(197, 57, 44, 0.05));
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}

	.legal .card-icon svg {
		width: 22px;
		height: 22px;
		color: var(--accent);
	}

	.legal .legal-card h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1.35rem;
		letter-spacing: -0.01em;
		margin-bottom: 8px;
	}

	.legal .legal-card p {
		font-family: var(--sans);
		font-size: 0.9rem;
		color: var(--ink-muted);
		line-height: 1.6;
		flex: 1;
		margin-bottom: 18px;
	}

	.legal .card-link {
		font-family: var(--sans);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--accent);
	}

	@media (min-width: 720px) {
		.legal .legal-cards {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.legal footer {
		margin-top: auto;
		padding: 32px clamp(24px, 6vw, 80px);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 24px;
		font-family: var(--sans);
		font-size: 0.8rem;
		color: var(--ink-muted);
	}

	.legal footer a {
		color: var(--ink-muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	.legal footer a:hover {
		color: var(--ink);
	}
</style>
