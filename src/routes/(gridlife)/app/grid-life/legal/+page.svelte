<svelte:head>
	<title>Legal — Grid Life</title>
	<meta
		name="description"
		content="Privacy Policy and Terms & Conditions for Grid Life by LongShot Digital."
	/>
</svelte:head>

<div class="legal">
	<nav>
		<a href="/app/grid-life" class="nav-logo">
			<img src="/app/grid-life/app-icon.png" alt="Grid Life" class="nav-logo-icon" />
			<span class="nav-logo-text">Grid Life</span>
		</a>
	</nav>

	<section class="legal-hero">
		<h1>Legal</h1>
		<p>Everything you need to know about how Grid Life handles your data and the terms of use.</p>
	</section>

	<section class="legal-cards">
		<a href="mailto:info+gridlifeapp@lsdigital.ee" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					/><polyline points="22,6 12,13 2,6" /></svg
				>
			</div>
			<h2>Support</h2>
			<p>For questions, feedback, or support requests, reach out and we'll get back to you.</p>
			<span class="card-link">info+gridlifeapp@lsdigital.ee</span>
		</a>
		<a href="/app/grid-life/privacy" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg
				>
			</div>
			<h2>Privacy Policy</h2>
			<p>How we handle your data — spoiler: everything stays on your device.</p>
			<span class="card-link">Read Privacy Policy &rarr;</span>
		</a>
		<a href="/app/grid-life/terms" class="legal-card">
			<div class="card-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline
						points="14 2 14 8 20 8"
					/><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline
						points="10 9 9 9 8 9"
					/></svg
				>
			</div>
			<h2>Terms & Conditions</h2>
			<p>The rules of the road for using Grid Life.</p>
			<span class="card-link">Read Terms & Conditions &rarr;</span>
		</a>
	</section>

	<footer>
		<span>&copy; 2026 LongShot Digital O&Uuml;</span>
		<a href="mailto:info+gridlifeapp@lsdigital.ee">Contact</a>
	</footer>
</div>

<style>
	:root {
		--sans: 'DM Sans', system-ui, -apple-system, sans-serif;
		--serif: 'Fraunces', Georgia, serif;
		--bg: #faf8f5;
		--ink: #1a1714;
		--ink-soft: #3d3730;
		--ink-muted: #8a8279;
		--accent: #e8a83e;
	}

	.legal {
		min-height: 100vh;
		background: var(--bg);
		display: flex;
		flex-direction: column;
	}

	nav {
		padding: 20px clamp(24px, 6vw, 80px);
		display: flex;
		align-items: center;
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

	.legal-hero {
		text-align: center;
		padding: clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px) clamp(40px, 6vh, 60px);
	}

	.legal-hero h1 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		color: var(--ink);
		letter-spacing: -0.02em;
		margin-bottom: 16px;
	}

	.legal-hero p {
		font-family: var(--sans);
		font-size: 1.1rem;
		color: var(--ink-muted);
		max-width: 480px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.legal-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 clamp(24px, 6vw, 80px) clamp(80px, 12vh, 140px);
	}

	.legal-card {
		background: #fff;
		border-radius: 20px;
		padding: 36px 32px;
		text-decoration: none;
		color: var(--ink);
		border: 1px solid rgba(0, 0, 0, 0.06);
		transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		display: flex;
		flex-direction: column;
	}

	.legal-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
		border-color: rgba(0, 0, 0, 0.08);
	}

	.card-icon {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: linear-gradient(135deg, rgba(232, 168, 62, 0.12), rgba(232, 168, 62, 0.06));
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}

	.card-icon svg {
		width: 24px;
		height: 24px;
		color: var(--accent);
	}

	.legal-card h2 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1.4rem;
		letter-spacing: -0.01em;
		margin-bottom: 8px;
	}

	.legal-card p {
		font-family: var(--sans);
		font-size: 0.9rem;
		color: var(--ink-muted);
		line-height: 1.6;
		flex: 1;
		margin-bottom: 20px;
	}

	.card-link {
		font-family: var(--sans);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--accent);
	}

	@media (min-width: 640px) {
		.legal-cards {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	footer {
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

	footer a {
		color: var(--ink-muted);
		text-decoration: none;
	}

	footer a:hover {
		color: var(--ink);
	}
</style>
