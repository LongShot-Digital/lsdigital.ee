<script lang="ts">
	import { onMount } from 'svelte';

	let { to }: { to: string } = $props();

	onMount(() => window.location.replace(to));
</script>

<svelte:head>
	<title>Marco has moved to letsmarco.com</title>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content="0; url={to}" />
</svelte:head>

<main>
	<p>Marco now lives at <a href={to}>letsmarco.com</a> — taking you there…</p>
</main>

<style>
	main {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f4f1ea;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #1c1b18;
		padding: 24px;
		text-align: center;
	}
	a {
		color: #2d63f5;
		font-weight: 700;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
</style>
