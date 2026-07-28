<script>
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" type="image/svg+xml" href="/app/marco/app-icon.svg" />
	<link rel="apple-touch-icon" href="/app/marco/app-icon.svg" />
</svelte:head>

{@render children()}

<style>
	/* Markdown (privacy / terms) prose styling — Marco paper world.
	   Only .md pages render article.prose; the designed pages are untouched. */
	:global(article.prose) {
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		max-width: 720px;
		margin: 0 auto;
		padding: 80px 28px 120px;
		font-size: 16px;
		line-height: 1.7;
		color: #4a4b50;
	}
	:global(article.prose h1) {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: clamp(2.2rem, 5vw, 3rem);
		color: #1c1d1f;
		letter-spacing: -0.03em;
		margin-bottom: 1.6rem;
		line-height: 1.05;
	}
	:global(article.prose h2) {
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-weight: 600;
		font-size: 1.4rem;
		color: #1c1d1f;
		letter-spacing: -0.02em;
		margin-top: 2.6rem;
		margin-bottom: 0.85rem;
		line-height: 1.2;
	}
	:global(article.prose strong) { color: #1c1d1f; font-weight: 700; }
	:global(article.prose a) { color: #2d63f5; text-decoration: none; }
	:global(article.prose a:hover) { text-decoration: underline; }
	:global(article.prose ul) { padding-left: 1.3rem; margin: 0.8rem 0; }
	:global(article.prose li) { margin: 0.35rem 0; }
	:global(article.prose hr) { border: none; border-top: 1px solid rgba(28, 29, 31, 0.12); margin: 2.5rem 0; }
</style>
