<script lang="ts">
	import { board, newId, type BoardEvent } from './board.svelte';

	type Tab = 'upcoming' | 'drafts' | 'past';
	let tab = $state<Tab>('upcoming');

	const upcoming = $derived(board.events.filter((e) => e.status === 'live' || e.status === 'published'));
	const drafts = $derived(board.events.filter((e) => e.status === 'draft'));
	const past = $derived(board.events.filter((e) => e.status === 'past'));
	const shown = $derived(tab === 'upcoming' ? upcoming : tab === 'drafts' ? drafts : past);

	// ── Composer modal (the app's poster composer, desktop cut) ──────────
	let editing = $state<BoardEvent | null>(null); // null = closed
	let isNew = $state(false);
	let form = $state({
		title: '',
		when: '',
		place: '',
		photo: '',
		category: 'MUSIC',
		invitePill: false,
		categoryChip: true,
		hostRow: true
	});
	let copied = $state(false);

	function openComposer(ev: BoardEvent | null) {
		isNew = ev === null;
		editing = ev ?? {
			id: newId(),
			title: '',
			when: '',
			photo: null,
			status: 'draft',
			going: 0,
			maybe: 0,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		};
		form = {
			title: editing.title,
			when: editing.when,
			place: editing.place,
			photo: editing.photo ?? '',
			category: editing.category,
			invitePill: editing.invitePill,
			categoryChip: editing.categoryChip,
			hostRow: editing.hostRow
		};
		copied = false;
	}

	function saveComposer(publish: boolean) {
		if (!editing) return;
		editing.title = form.title || 'Untitled';
		editing.when = form.when || 'No date yet';
		editing.place = form.place;
		editing.photo = form.photo || null;
		editing.category = form.category;
		editing.invitePill = form.invitePill;
		editing.categoryChip = form.categoryChip;
		editing.hostRow = form.hostRow;
		if (editing.status === 'draft') {
			const missing: string[] = [];
			if (!editing.photo) missing.push('photo');
			if (!form.when) missing.push('date');
			editing.missing = missing.length ? missing.join(', ') : 'end time';
			if (publish && editing.photo && form.when) {
				editing.status = 'published';
				editing.missing = undefined;
			}
		}
		if (isNew) {
			board.events = [...board.events, editing];
			if (editing.status === 'draft') tab = 'drafts';
		}
		editing = null;
	}

	/// Clones everything except the date — the weekly-night workflow in one click.
	function duplicateAsTemplate(ev: BoardEvent) {
		const copy: BoardEvent = {
			...ev,
			id: newId(),
			when: 'No date yet',
			status: 'draft',
			going: 0,
			maybe: 0,
			missing: 'date'
		};
		board.events = [...board.events, copy];
		tab = 'drafts';
	}

	function deleteDraft(ev: BoardEvent) {
		board.events = board.events.filter((e) => e.id !== ev.id);
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(`https://marco.app/e/${editing?.id ?? ''}`);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard unavailable — no-op */
		}
	}
</script>

<div class="ghost" aria-hidden="true">FRI</div>

<div class="header">
	<h1 class="title">Events</h1>
	<div class="tabs" role="tablist">
		<button class="tab" class:active={tab === 'upcoming'} role="tab" aria-selected={tab === 'upcoming'} onclick={() => (tab = 'upcoming')}>Upcoming · {upcoming.length}</button>
		<button class="tab" class:active={tab === 'drafts'} role="tab" aria-selected={tab === 'drafts'} onclick={() => (tab = 'drafts')}>Drafts · {drafts.length}</button>
		<button class="tab" class:active={tab === 'past'} role="tab" aria-selected={tab === 'past'} onclick={() => (tab = 'past')}>Past · {board.pastCount}</button>
	</div>
	<div class="flex-spacer"></div>
	<button class="new-event" onclick={() => openComposer(null)}>
		<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>
		New event
	</button>
</div>

<div class="grid">
	{#each shown as ev (ev.id)}
		{#if ev.status === 'draft'}
			<article class="card draft">
				<div class="photo draft-photo">
					<span class="chip draft-chip">DRAFT</span>
					<div class="photo-caption">
						<div class="photo-title dim">{ev.title}</div>
						<div class="photo-when dimmer">{ev.when}</div>
					</div>
				</div>
				<div class="body">
					<div class="missing">Missing: {ev.missing}. Publish when ready.</div>
					<div class="actions">
						<button class="btn primary" onclick={() => openComposer(ev)}>Continue editing</button>
						<button class="btn icon" aria-label="Delete draft" onclick={() => deleteDraft(ev)}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(236,237,240,0.7)" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
						</button>
					</div>
				</div>
			</article>
		{:else}
			<article class="card">
				<div class="photo">
					{#if ev.photo}
						<img src={ev.photo} alt="" loading="lazy" />
					{/if}
					<div class="scrim"></div>
					{#if ev.status === 'live'}
						<span class="chip live-chip"><span class="live-dot"></span>LIVE TONIGHT</span>
					{:else if ev.status === 'published'}
						<span class="chip published-chip">PUBLISHED</span>
					{/if}
					<div class="photo-caption">
						<div class="photo-title">{ev.title}</div>
						<div class="photo-when">{ev.when}</div>
					</div>
				</div>
				<div class="body">
					<div class="counts">
						<span class="stat" class:green={ev.status === 'live'}>{ev.going.toLocaleString('en-US')}</span><span class="count-label">going</span>
						<span class="stat soft">{ev.maybe.toLocaleString('en-US')}</span><span class="count-label">maybe</span>
					</div>
					<div class="actions">
						{#if ev.status === 'past'}
							<a class="btn" href="/app/marco/console/analytics">Analytics</a>
						{:else}
							<button class="btn" onclick={() => openComposer(ev)}>Edit</button>
							<a class="btn" href="/app/marco/console/analytics">Analytics</a>
						{/if}
						<button class="btn icon" aria-label="Duplicate as template" title="Duplicate as template" onclick={() => duplicateAsTemplate(ev)}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(236,237,240,0.7)" stroke-width="1.9"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
						</button>
					</div>
				</div>
			</article>
		{/if}
	{/each}
</div>

{#if tab === 'past'}
	<div class="past-note">Showing the latest — {board.pastCount} events total since joining Marco.</div>
{/if}

<!-- ── Composer modal: form left, live poster preview right ── -->
{#if editing}
	<div class="overlay" role="presentation" onclick={(e) => { if (e.target === e.currentTarget) editing = null; }}>
		<div class="modal" role="dialog" aria-modal="true" aria-label={isNew ? 'New event' : 'Edit event'}>
			<div class="pane form-pane">
				<div class="modal-head">
					<span class="modal-title">{isNew ? 'New event' : 'Edit event'}</span>
					<button class="close" aria-label="Close" onclick={() => (editing = null)}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(236,237,240,0.7)" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
					</button>
				</div>

				<label class="field">
					<span class="field-label">TITLE</span>
					<input type="text" bind:value={form.title} placeholder="Vinyl night" />
				</label>
				<div class="field-row">
					<label class="field">
						<span class="field-label">WHEN</span>
						<input type="text" bind:value={form.when} placeholder="Fri · 10 PM" />
					</label>
					<label class="field">
						<span class="field-label">CATEGORY</span>
						<select bind:value={form.category}>
							<option>MUSIC</option>
							<option>PARTY</option>
							<option>CHILL</option>
							<option>FOOD</option>
							<option>SPORT</option>
						</select>
					</label>
				</div>
				<label class="field">
					<span class="field-label">PLACE</span>
					<input type="text" bind:value={form.place} placeholder="Le Motel" />
				</label>
				<label class="field">
					<span class="field-label">PHOTO URL</span>
					<input type="url" bind:value={form.photo} placeholder="https://…" />
				</label>

				<div class="toggles">
					<label class="toggle"><input type="checkbox" bind:checked={form.invitePill} /><span>Invite pill</span></label>
					<label class="toggle"><input type="checkbox" bind:checked={form.categoryChip} /><span>Category chip</span></label>
					<label class="toggle"><input type="checkbox" bind:checked={form.hostRow} /><span>Host row</span></label>
				</div>

				<div class="modal-actions">
					{#if editing.status === 'draft'}
						<button class="btn" onclick={() => saveComposer(false)}>Save draft</button>
						<button class="btn primary grow" disabled={!form.photo || !form.when || !form.title} onclick={() => saveComposer(true)}>Publish</button>
					{:else}
						<button class="btn primary grow" onclick={() => saveComposer(false)}>Save changes</button>
					{/if}
				</div>
				<div class="modal-quick">
					<button class="btn" onclick={copyLink}>{copied ? 'Copied ✓' : 'Copy link'}</button>
				</div>
			</div>

			<div class="pane preview-pane">
				<span class="preview-label">LIVE POSTER PREVIEW</span>
				<div class="poster">
					{#if form.photo}
						<img src={form.photo} alt="" />
					{:else}
						<div class="poster-empty"></div>
					{/if}
					<div class="poster-scrim"></div>
					{#if form.categoryChip}
						<span class="poster-chip">{form.category}</span>
					{/if}
					{#if form.invitePill}
						<span class="poster-invite">YOU'RE INVITED</span>
					{/if}
					<div class="poster-caption">
						<div class="poster-title">{form.title || 'Untitled'}</div>
						<div class="poster-when">{form.when || 'No date yet'}{form.place ? ` · ${form.place}` : ''}</div>
						{#if form.hostRow}
							<div class="poster-host">
								<span class="poster-tile">LM<span class="poster-seal"><svg width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg></span></span>
								<span class="poster-host-name">Le Motel · <em>Verified</em></span>
							</div>
						{/if}
					</div>
					<div class="poster-footer">
						<span class="poster-brand">
							<span class="poster-aperture"></span>
							marco
						</span>
						<span class="poster-qr" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,246,248,0.8)" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1" /></svg>
						</span>
					</div>
				</div>
				<span class="preview-note">The preview <em>is</em> the share asset.</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.ghost {
		position: absolute;
		right: 24px;
		top: 14px;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 110px;
		letter-spacing: -0.03em;
		color: rgba(245, 246, 248, 0.04);
		pointer-events: none;
		user-select: none;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 18px;
		flex-wrap: wrap;
		position: relative;
	}
	.title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 32px;
		letter-spacing: -0.025em;
		color: #f5f6f8;
		margin: 0;
	}
	.tabs {
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 12px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.07);
	}
	.tab {
		padding: 7px 16px;
		border-radius: 9px;
		border: 0;
		background: transparent;
		font-family: inherit;
		font-weight: 600;
		font-size: 13px;
		color: rgba(236, 237, 240, 0.55);
		cursor: pointer;
	}
	.tab.active {
		background: #2d63f5;
		font-weight: 700;
		color: #fff;
	}
	.flex-spacer {
		flex: 1;
	}
	.new-event {
		height: 42px;
		padding: 0 20px;
		border-radius: 12px;
		border: 0;
		background: #2d63f5;
		box-shadow: 0 10px 26px -8px rgba(45, 99, 245, 0.6);
		display: flex;
		align-items: center;
		gap: 9px;
		font-family: inherit;
		font-weight: 700;
		font-size: 14.5px;
		color: #fff;
		cursor: pointer;
	}
	.new-event:hover {
		background: #3a6ef6;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
		position: relative;
	}
	@media (max-width: 1200px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 700px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.card {
		border-radius: 18px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.card.draft {
		background: #101115;
		border: 1px dashed rgba(255, 255, 255, 0.18);
	}

	.photo {
		height: 150px;
		position: relative;
		background: #101115;
	}
	.photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.1) 30%, rgba(15, 16, 19, 0.9) 100%);
	}
	.draft-photo {
		background:
			radial-gradient(120% 70% at 85% -8%, rgba(201, 141, 60, 0.28), rgba(201, 141, 60, 0) 58%),
			#17181d;
	}

	.chip {
		position: absolute;
		left: 12px;
		top: 11px;
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 5px 11px;
		border-radius: 999px;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.14em;
	}
	.live-chip {
		background: rgba(24, 178, 107, 0.16);
		border: 1px solid rgba(24, 178, 107, 0.45);
		backdrop-filter: blur(6px);
		color: #2bce85;
	}
	.live-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #18b26b;
	}
	.published-chip {
		background: rgba(15, 16, 19, 0.55);
		backdrop-filter: blur(6px);
		color: #f5f6f8;
	}
	.draft-chip {
		background: rgba(255, 255, 255, 0.05);
		border: 1px dashed rgba(255, 255, 255, 0.25);
		color: rgba(236, 237, 240, 0.55);
	}

	.photo-caption {
		position: absolute;
		left: 14px;
		bottom: 11px;
		right: 14px;
	}
	.photo-title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 19px;
		letter-spacing: -0.02em;
		color: #f5f6f8;
	}
	.photo-title.dim {
		color: rgba(245, 246, 248, 0.8);
	}
	.photo-when {
		font-weight: 500;
		font-size: 12px;
		color: rgba(245, 246, 248, 0.6);
	}
	.photo-when.dimmer {
		color: rgba(245, 246, 248, 0.45);
	}

	.body {
		padding: 14px 16px 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.counts {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.stat {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 22px;
		color: #f5f6f8;
	}
	.stat.green {
		color: #2bce85;
	}
	.stat.soft {
		color: rgba(245, 246, 248, 0.75);
		margin-left: 10px;
	}
	.count-label {
		font-weight: 600;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.5);
	}
	.missing {
		font-weight: 400;
		font-size: 12.5px;
		line-height: 1.5;
		color: rgba(236, 237, 240, 0.45);
	}

	.actions {
		display: flex;
		gap: 8px;
	}
	.btn {
		flex: 1;
		text-align: center;
		padding: 9px 0;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-family: inherit;
		font-weight: 600;
		font-size: 12.5px;
		color: #f5f6f8;
		cursor: pointer;
		text-decoration: none;
	}
	.btn:hover {
		background: rgba(255, 255, 255, 0.09);
	}
	.btn.primary {
		background: #2d63f5;
		border: 0;
		font-weight: 700;
		color: #fff;
	}
	.btn.primary:hover {
		background: #3a6ef6;
	}
	.btn.primary:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.btn.icon {
		flex: none;
		width: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.past-note {
		font-weight: 400;
		font-size: 12.5px;
		color: rgba(236, 237, 240, 0.4);
	}

	/* ── Modal ── */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(8, 9, 11, 0.72);
		backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		z-index: 60;
	}
	.modal {
		display: flex;
		gap: 0;
		width: min(880px, 100%);
		max-height: calc(100vh - 48px);
		border-radius: 20px;
		background: #101115;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.85);
		overflow: hidden;
	}
	.pane {
		padding: 26px 28px;
		display: flex;
		flex-direction: column;
		gap: 13px;
	}
	.form-pane {
		flex: 1.15;
		overflow-y: auto;
	}
	.preview-pane {
		flex: 1;
		background: #17181d;
		border-left: 1px solid rgba(255, 255, 255, 0.07);
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.modal-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 4px;
	}
	.modal-title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.02em;
		color: #f5f6f8;
	}
	.close {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		flex: 1;
	}
	.field-row {
		display: flex;
		gap: 10px;
	}
	.field-label {
		font-weight: 700;
		font-size: 10.5px;
		letter-spacing: 0.14em;
		color: rgba(245, 246, 248, 0.35);
	}
	.field input,
	.field select {
		height: 42px;
		border-radius: 11px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.09);
		padding: 0 14px;
		font-family: inherit;
		font-weight: 600;
		font-size: 14px;
		color: #f5f6f8;
		outline: none;
	}
	.field input:focus,
	.field select:focus {
		border-color: rgba(45, 99, 245, 0.6);
	}
	.field input::placeholder {
		color: rgba(236, 237, 240, 0.3);
		font-weight: 500;
	}

	.toggles {
		display: flex;
		gap: 14px;
		padding-top: 2px;
		flex-wrap: wrap;
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 7px;
		font-weight: 600;
		font-size: 12.5px;
		color: rgba(236, 237, 240, 0.7);
		cursor: pointer;
	}
	.toggle input {
		accent-color: #2d63f5;
	}

	.modal-actions {
		display: flex;
		gap: 8px;
		padding-top: 6px;
	}
	.modal-actions .btn {
		flex: none;
		padding: 11px 18px;
	}
	.modal-actions .btn.grow {
		flex: 1;
	}
	.modal-quick {
		display: flex;
		gap: 8px;
	}
	.modal-quick .btn {
		flex: none;
		padding: 9px 16px;
	}

	/* ── Poster preview (the app's poster grammar) ── */
	.preview-label {
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.16em;
		color: rgba(245, 246, 248, 0.4);
	}
	.poster {
		width: 250px;
		height: 340px;
		border-radius: 16px;
		overflow: hidden;
		position: relative;
		background: #101115;
		box-shadow:
			0 0 0 2px #101115,
			0 0 0 3.5px rgba(195, 168, 240, 0.55),
			0 20px 44px -14px rgba(0, 0, 0, 0.8);
	}
	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.poster-empty {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(120% 70% at 85% -8%, rgba(201, 141, 60, 0.28), rgba(201, 141, 60, 0) 58%),
			#17181d;
	}
	.poster-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(15, 16, 19, 0.05) 30%, rgba(15, 16, 19, 0.92) 100%);
	}
	.poster-chip {
		position: absolute;
		left: 12px;
		top: 12px;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(15, 16, 19, 0.55);
		backdrop-filter: blur(6px);
		font-weight: 700;
		font-size: 9px;
		letter-spacing: 0.14em;
		color: #f5f6f8;
	}
	.poster-invite {
		position: absolute;
		right: 12px;
		top: 12px;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(45, 99, 245, 0.85);
		font-weight: 700;
		font-size: 9px;
		letter-spacing: 0.12em;
		color: #fff;
	}
	.poster-caption {
		position: absolute;
		left: 14px;
		right: 14px;
		bottom: 46px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.poster-title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 24px;
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: #f5f6f8;
	}
	.poster-when {
		font-weight: 500;
		font-size: 12px;
		color: rgba(245, 246, 248, 0.65);
	}
	.poster-host {
		display: flex;
		align-items: center;
		gap: 7px;
		padding-top: 4px;
	}
	.poster-tile {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background:
			radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.4), transparent 62%),
			#17181d;
		border: 1px solid rgba(255, 255, 255, 0.14);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 8px;
		color: #c3a8f0;
		position: relative;
		flex: none;
	}
	.poster-seal {
		position: absolute;
		right: -3px;
		bottom: -3px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2d63f5;
		box-shadow: 0 0 0 1.5px #101115;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.poster-host-name {
		font-weight: 600;
		font-size: 11px;
		color: rgba(245, 246, 248, 0.8);
	}
	.poster-host-name em {
		font-style: normal;
		color: #5b85f7;
	}
	.poster-footer {
		position: absolute;
		left: 14px;
		right: 12px;
		bottom: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.poster-brand {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 12px;
		color: rgba(245, 246, 248, 0.85);
	}
	.poster-aperture {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2.5px solid #2d63f5;
		position: relative;
		display: inline-block;
	}
	.poster-aperture::after {
		content: '';
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #18b26b;
		right: -1px;
		bottom: -1px;
	}
	.poster-qr {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.preview-note {
		font-weight: 400;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.45);
	}
	.preview-note em {
		font-style: italic;
		color: rgba(236, 237, 240, 0.7);
	}

	@media (max-width: 820px) {
		.modal {
			flex-direction: column;
			overflow-y: auto;
		}
		.preview-pane {
			border-left: 0;
			border-top: 1px solid rgba(255, 255, 255, 0.07);
			padding-bottom: 30px;
		}
	}
</style>
