<script>
	import { page } from '$app/state';
</script>

<section class="error-page">
	<p class="error-code">{page.status}</p>
	<h1 class="error-headline">Page not found</h1>
	<p class="error-sub">The page you're looking for doesn't exist or has been moved.</p>
	<a href="/" class="error-link">Back to home</a>
</section>

<style>
	.error-page {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 60px clamp(24px, 6vw, 80px);
	}

	.error-code {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(5rem, 15vw, 10rem);
		line-height: 1;
		color: var(--ink-faint);
		opacity: 0.4;
		margin-bottom: 8px;
	}

	.error-headline {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		color: var(--ink);
		margin-bottom: 12px;
	}

	.error-sub {
		font-family: var(--sans);
		font-weight: 300;
		font-size: 0.95rem;
		color: var(--ink-muted);
		margin-bottom: 36px;
	}

	.error-link {
		font-family: var(--sans);
		font-weight: 500;
		font-size: 0.82rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink);
		text-decoration: none;
		border-bottom: 1px solid var(--accent-soft);
		padding-bottom: 2px;
		transition: border-color 0.25s ease;
	}

	.error-link:hover {
		border-bottom-color: var(--accent);
	}
</style>
