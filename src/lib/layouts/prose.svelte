<script>
	let { title = '', description = '', children } = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title} — LongShot Digital</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<article class="prose">
	{#if title}
		<h1>{title}</h1>
	{/if}
	{@render children()}
</article>
