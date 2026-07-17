<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();

	const BASE = '/app/marco/console';
	const isActive = (href: string) => {
		const path = page.url.pathname.replace(/\/$/, '');
		return href === BASE ? path === BASE : path.startsWith(href);
	};
</script>

<svelte:head>
	<title>Le Motel — Marco console</title>
	<style>
		html,
		body {
			background: #0f1013;
		}
	</style>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="console">
	<aside class="sidebar">
		<div class="org">
			<div class="org-tile">
				LM
				<span class="seal" aria-hidden="true">
					<svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
				</span>
			</div>
			<div class="org-meta">
				<span class="org-name">Le Motel</span>
				<span class="org-sub">Venue · Paris</span>
			</div>
		</div>

		<a class="nav-item" class:active={isActive(BASE)} href={BASE}>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
			Events
		</a>
		<a class="nav-item" class:active={isActive(`${BASE}/analytics`)} href="{BASE}/analytics">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>
			Analytics
		</a>
		<a class="nav-item" class:active={isActive(`${BASE}/settings`)} href="{BASE}/settings">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z" /></svg>
			Settings
		</a>

		<div class="spacer"></div>

		<div class="verified-card">
			<span class="dot"></span>
			<div class="verified-meta">
				<span class="verified-title">Verified organizer</span>
				<span class="verified-sub">since June 2026</span>
			</div>
		</div>
	</aside>

	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.console {
		display: flex;
		min-height: 100vh;
		min-height: 100dvh;
		background: #0f1013;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
		color: #f5f6f8;
	}

	.sidebar {
		width: 230px;
		flex: none;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
		background: #101115;
		display: flex;
		flex-direction: column;
		padding: 22px 16px 18px;
		gap: 6px;
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100dvh;
	}

	.org {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 0 8px 18px;
	}
	.org-tile {
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background:
			radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.4), transparent 62%),
			#17181d;
		border: 1px solid rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 14px;
		color: #c3a8f0;
		position: relative;
		flex: none;
	}
	.seal {
		position: absolute;
		right: -4px;
		bottom: -4px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #2d63f5;
		box-shadow: 0 0 0 2px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.org-meta {
		display: flex;
		flex-direction: column;
	}
	.org-name {
		font-weight: 700;
		font-size: 14.5px;
		color: #f5f6f8;
	}
	.org-sub {
		font-weight: 400;
		font-size: 11px;
		color: rgba(236, 237, 240, 0.4);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 10px 12px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 14px;
		color: rgba(236, 237, 240, 0.55);
		text-decoration: none;
		transition: background 0.12s ease, color 0.12s ease;
	}
	.nav-item:hover {
		background: rgba(255, 255, 255, 0.04);
		color: rgba(236, 237, 240, 0.8);
	}
	.nav-item.active {
		background: rgba(45, 99, 245, 0.13);
		border: 1px solid rgba(45, 99, 245, 0.35);
		font-weight: 700;
		color: #f5f6f8;
		padding: 9px 11px;
	}
	.nav-item.active svg {
		color: #5b85f7;
	}

	.spacer {
		flex: 1;
	}

	.verified-card {
		padding: 12px 12px;
		border-radius: 12px;
		background: rgba(24, 178, 107, 0.08);
		border: 1px solid rgba(24, 178, 107, 0.3);
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.verified-card .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #18b26b;
		flex: none;
	}
	.verified-meta {
		display: flex;
		flex-direction: column;
	}
	.verified-title {
		font-weight: 700;
		font-size: 12px;
		color: #2bce85;
	}
	.verified-sub {
		font-weight: 400;
		font-size: 11px;
		color: rgba(236, 237, 240, 0.45);
	}

	.content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		padding: 30px 34px;
		gap: 22px;
		position: relative;
	}

	@media (max-width: 860px) {
		.console {
			flex-direction: column;
		}
		.sidebar {
			width: 100%;
			height: auto;
			position: static;
			flex-direction: row;
			align-items: center;
			padding: 14px 16px;
			border-right: 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		}
		.org {
			padding: 0 8px 0 0;
		}
		.org-meta {
			display: none;
		}
		.verified-card {
			display: none;
		}
		.content {
			padding: 22px 18px;
		}
	}
</style>
