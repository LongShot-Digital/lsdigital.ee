<script>
	import { onMount } from 'svelte';

	let formVisible = $state(true);
	let formSuccess = $state(false);

	function handleSubmit(e) {
		e.preventDefault();
		formVisible = false;
		formSuccess = true;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.style.animationPlayState = 'running';
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		document.querySelectorAll('.anim-up, .anim-fade, .anim-scale').forEach((el) => {
			if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
				el.style.animationPlayState = 'paused';
				observer.observe(el);
			}
		});

		return () => observer.disconnect();
	});
</script>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-headline anim-up d2">We build apps<br>that <em>feel</em> right.</h1>
		<p class="hero-sub anim-up d3">iOS apps, built lean and launched loud. v1 is never the finish line.</p>
	</div>
	<div class="scroll-hint anim-fade d5">
		<div class="arrow"></div>
	</div>
</section>

<section class="what-we-do">
	<p class="section-label anim-up">What We Do</p>
	<div class="pillars">
		<div class="pillar anim-scale d1">
			<div class="pillar-number">01</div>
			<h3 class="pillar-title">Design &amp; Prototyping</h3>
			<p class="pillar-desc">From concept to interactive prototype. We shape ideas into interfaces that feel intuitive and look unmistakably premium.</p>
		</div>
		<div class="pillar anim-scale d2">
			<div class="pillar-number">02</div>
			<h3 class="pillar-title">iOS Development</h3>
			<p class="pillar-desc">Native Swift and SwiftUI. Built for the Apple ecosystem from the ground up — no shortcuts, no cross-platform compromises.</p>
		</div>
		<div class="pillar anim-scale d3">
			<div class="pillar-number">03</div>
			<h3 class="pillar-title">Launch &amp; Iterate</h3>
			<p class="pillar-desc">App Store strategy, analytics, and ongoing refinement. We don't disappear after launch — we help find the right audience.</p>
		</div>
	</div>
</section>

<section class="values">
	<div class="values-list">
		<div class="value-item anim-up d1">
			<span class="value-word">Launch</span>
			<div class="value-line"></div>
			<span class="value-sub">Build fast, ship faster</span>
		</div>
		<div class="value-item anim-up d2">
			<span class="value-word">Surface</span>
			<div class="value-line"></div>
			<span class="value-sub">Get seen by the right people</span>
		</div>
		<div class="value-item anim-up d3">
			<span class="value-word">Double down</span>
			<div class="value-line"></div>
			<span class="value-sub">Iterate on what works</span>
		</div>
	</div>
</section>

<section class="contact">
	<h2 class="contact-headline anim-up">Have something in mind?</h2>
	<p class="contact-sub anim-up">Tell us about your idea. We'd love to hear it.</p>
	{#if formVisible}
	<form class="contact-form anim-up d1" onsubmit={handleSubmit}>
		<div class="form-row">
			<input type="text" name="name" placeholder="Name" required>
			<input type="email" name="email" placeholder="Email" required>
		</div>
		<textarea name="message" placeholder="Tell us about your project..." required></textarea>
		<button type="submit" class="submit-btn">Send Message</button>
	</form>
	{/if}
	{#if formSuccess}
	<div class="form-success visible">
		<p>Thank you — we'll be in touch soon.</p>
	</div>
	{/if}
</section>
