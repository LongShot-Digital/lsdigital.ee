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

{@render children()}
