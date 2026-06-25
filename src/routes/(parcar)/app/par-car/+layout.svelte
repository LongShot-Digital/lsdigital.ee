<script>
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" type="image/png" sizes="180x180" href="/app/par-car/app-icon.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/app/par-car/app-icon.png" />
</svelte:head>

<div class="parcar-ctx">
	{@render children()}
</div>

<style>
	/* Parent shell for ALL /app/par-car routes — gives the cream base.
	   Child pages with their own wrappers (.pc, .legal) override as needed. */
	.parcar-ctx {
		background: #f1ece1;
		color: #1c1a16;
		min-height: 100vh;
	}

	/* Markdown (privacy / terms) prose styling — Par Car typography. */
	.parcar-ctx :global(.prose) {
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		max-width: 720px;
		margin: 0 auto;
		padding: 80px 28px 120px;
		font-size: 16px;
		line-height: 1.7;
		color: #595650;
	}
	.parcar-ctx :global(.prose h1) {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		color: #1c1a16;
		letter-spacing: -0.02em;
		margin-bottom: 1.6rem;
		line-height: 1.05;
	}
	.parcar-ctx :global(.prose h2) {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 600;
		font-size: 1.45rem;
		color: #1c1a16;
		letter-spacing: -0.01em;
		margin-top: 2.6rem;
		margin-bottom: 0.85rem;
		line-height: 1.2;
	}
	.parcar-ctx :global(.prose h3) {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 600;
		font-size: 1.15rem;
		color: #1c1a16;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.parcar-ctx :global(.prose p) {
		margin-bottom: 1rem;
	}
	.parcar-ctx :global(.prose strong) {
		color: #1c1a16;
		font-weight: 600;
	}
	.parcar-ctx :global(.prose em) {
		font-style: italic;
	}
	.parcar-ctx :global(.prose a) {
		color: #c5392c;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		transition: color 0.15s;
	}
	.parcar-ctx :global(.prose a:hover) {
		color: #a32a1e;
	}
	.parcar-ctx :global(.prose ul),
	.parcar-ctx :global(.prose ol) {
		margin: 0 0 1.2rem 1.5rem;
		padding: 0;
	}
	.parcar-ctx :global(.prose li) {
		margin-bottom: 0.5rem;
	}
	.parcar-ctx :global(.prose hr) {
		border: none;
		border-top: 1px solid #e8e1cf;
		margin: 2.5rem 0;
	}
</style>
