<script>
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>LongShot Digital</title>
	<meta name="description" content="LongShot Digital — a boutique iOS studio building premium mobile applications. Based in Tallinn and Barcelona.">
</svelte:head>

<div class="page">
	{@render children()}
	<Footer />
</div>
