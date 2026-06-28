<script>
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@300;400;500;600&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" type="image/svg+xml" href="/app/marco/app-icon.svg" />
	<link rel="apple-touch-icon" href="/app/marco/app-icon.svg" />
</svelte:head>

{@render children()}
