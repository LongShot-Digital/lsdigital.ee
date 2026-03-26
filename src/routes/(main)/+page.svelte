<script lang="ts">
	import { onMount } from 'svelte';

	let formVisible = $state(true);
	let formSuccess = $state(false);
	let appsOpen = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		formVisible = false;
		formSuccess = true;
	}

	function toggleApps() {
		appsOpen = !appsOpen;
	}

	function closeApps(e: Event) {
		if (!(e.target as HTMLElement).closest('.apps-menu')) {
			appsOpen = false;
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						(entry.target as HTMLElement).style.animationPlayState = 'running';
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		document.querySelectorAll<HTMLElement>('.anim-up, .anim-fade, .anim-scale').forEach((el) => {
			if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
				el.style.animationPlayState = 'paused';
				observer.observe(el);
			}
		});

		return () => observer.disconnect();
	});
</script>

<svelte:window onclick={closeApps} />

<div class="apps-menu">
	<button class="apps-trigger" onclick={toggleApps} aria-label="Our apps">
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
		</svg>
	</button>

	{#if appsOpen}
		<div class="apps-dropdown">
			<span class="apps-label">Our Apps</span>
			<a href="/app/grid-life" class="apps-item">
				<img src="/app/grid-life/app-icon.png" alt="Grid Life" class="apps-item-icon" />
				<div class="apps-item-text">
					<span class="apps-item-name">Grid Life</span>
					<span class="apps-item-desc">Habits, streaks & countdowns</span>
				</div>
			</a>
		</div>
	{/if}
</div>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-headline anim-up d2">We build apps<br />that <em>feel</em> right.</h1>
		<p class="hero-sub anim-up d3">
			iOS apps, built lean and launched loud. v1 is never the finish line.
		</p>
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
			<p class="pillar-desc">
				From concept to interactive prototype. We shape ideas into interfaces that feel intuitive
				and look unmistakably premium.
			</p>
		</div>
		<div class="pillar anim-scale d2">
			<div class="pillar-number">02</div>
			<h3 class="pillar-title">iOS Development</h3>
			<p class="pillar-desc">
				Native Swift and SwiftUI. Built for the Apple ecosystem from the ground up — no shortcuts,
				no cross-platform compromises.
			</p>
		</div>
		<div class="pillar anim-scale d3">
			<div class="pillar-number">03</div>
			<h3 class="pillar-title">Launch &amp; Iterate</h3>
			<p class="pillar-desc">
				App Store strategy, analytics, and ongoing refinement. We don't disappear after launch — we
				help find the right audience.
			</p>
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
				<input type="text" name="name" placeholder="Name" required />
				<input type="email" name="email" placeholder="Email" required />
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

<style>
	.apps-menu {
		position: fixed;
		top: 24px;
		right: 24px;
		z-index: 1000;
	}

	.apps-trigger {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: rgba(255, 253, 249, 0.55);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.apps-trigger:hover {
		background: rgba(255, 253, 249, 0.8);
		transform: scale(1.05);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.apps-trigger svg {
		width: 20px;
		height: 20px;
		color: var(--ink-soft);
	}

	.apps-dropdown {
		position: absolute;
		top: 54px;
		right: 0;
		min-width: 260px;
		background: rgba(255, 253, 249, 0.75);
		backdrop-filter: blur(40px) saturate(180%);
		-webkit-backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 16px;
		box-shadow:
			0 12px 48px rgba(0, 0, 0, 0.12),
			0 0 0 0.5px rgba(0, 0, 0, 0.04);
		padding: 8px;
		animation: dropIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes dropIn {
		from {
			opacity: 0;
			transform: translateY(-8px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.apps-label {
		display: block;
		font-family: var(--sans);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-faint);
		padding: 8px 12px 6px;
	}

	.apps-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		border-radius: 10px;
		text-decoration: none;
		color: var(--ink);
		transition: background 0.2s ease;
	}

	.apps-item:hover {
		background: rgba(0, 0, 0, 0.04);
	}

	.apps-item-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		object-fit: cover;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.apps-item-text {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.apps-item-name {
		font-family: var(--sans);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--ink);
	}

	.apps-item-desc {
		font-family: var(--sans);
		font-weight: 300;
		font-size: 0.75rem;
		color: var(--ink-muted);
	}
</style>
