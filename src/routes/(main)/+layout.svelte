<script>
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>LongShot Digital</title>
	<meta
		name="description"
		content="LongShot Digital — a boutique iOS studio building premium mobile applications. Based in Tallinn and Barcelona."
	/>
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon/lsd-32.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon/lsd-180.png" />
</svelte:head>

<div class="page">
	{@render children()}
	<Footer />
</div>
