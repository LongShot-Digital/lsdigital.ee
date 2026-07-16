<script lang="ts">
	// 1d — one event's analytics. MVP ships the two live-data modules real
	// (RSVPs since publish + going/maybe); the funnel and friend-bring chain
	// render dashed — venues see where it's going without fake numbers.
	const bars = [
		{ day: 'MON', pct: 18 },
		{ day: 'TUE', pct: 30 },
		{ day: 'WED', pct: 26 },
		{ day: 'THU', pct: 52 },
		{ day: 'FRI', pct: 96, spike: '+74' }
	];
</script>

<div class="head">
	<div class="thumb">
		<img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200&q=70&auto=format&fit=crop" alt="" />
	</div>
	<div class="head-meta">
		<h1 class="title">Vinyl night</h1>
		<span class="sub">Tonight · 10 PM · published Mon</span>
	</div>
	<div class="flex-spacer"></div>
	<span class="live-chip"><span class="live-dot"></span>LIVE — UPDATING</span>
</div>

<div class="row">
	<!-- RSVP funnel — post-backend -->
	<section class="card dashed funnel">
		<div class="card-head">
			<span class="card-label dim">RSVP FUNNEL</span>
			<span class="post-backend">POST-BACKEND — NEEDS IMPRESSION TRACKING</span>
		</div>
		<div class="funnel-rows">
			<div class="funnel-row">
				<span class="funnel-name">Map reach</span>
				<div class="funnel-track filled"><span class="funnel-val in">4,820</span></div>
			</div>
			<div class="funnel-row">
				<span class="funnel-name">Poster opens</span>
				<div class="funnel-track"><div class="funnel-bar blue" style="width: 40%"></div><span class="funnel-val" style="left: calc(40% + 10px)">1,904</span></div>
			</div>
			<div class="funnel-row">
				<span class="funnel-name">Going</span>
				<div class="funnel-track"><div class="funnel-bar green" style="width: 12%"></div><span class="funnel-val green-text" style="left: calc(12% + 10px)">212</span></div>
			</div>
			<div class="funnel-row">
				<span class="funnel-name">Maybe</span>
				<div class="funnel-track"><div class="funnel-bar green-soft" style="width: 6%"></div><span class="funnel-val soft" style="left: calc(6% + 10px)">96</span></div>
			</div>
		</div>
		<p class="footnote">Reach = aggregate pin impressions on the map. Never &ldquo;who saw it.&rdquo;</p>
	</section>

	<!-- RSVPs since publish — MVP live data -->
	<section class="card">
		<div class="card-head">
			<span class="card-label dim">RSVPS SINCE PUBLISH</span>
			<span class="mvp-live">MVP — LIVE DATA</span>
		</div>
		<div class="chart">
			{#each bars as bar (bar.day)}
				<div class="col">
					<div class="bar" class:spike={bar.spike} style="height: {bar.pct}%">
						{#if bar.spike}<span class="spike-val">{bar.spike}</span>{/if}
					</div>
					<span class="day" class:green-text={bar.spike}>{bar.day}</span>
				</div>
			{/each}
		</div>
		<p class="footnote">The day-of spike is the story venues know by gut — now on a chart.</p>
	</section>
</div>

<div class="row">
	<!-- friend-bring chain — the sales deck slide -->
	<section class="card cobalt chain">
		<div class="card-head">
			<span class="card-label cobalt-text">HOW PEOPLE CAME — THE FRIEND-BRING CHAIN</span>
			<span class="post-backend">POST-BACKEND</span>
		</div>
		<div class="chain-body">
			<div class="chain-stat">
				<span class="chain-numeral">68%</span>
				<span class="chain-caption">of RSVPs arrived through a friend&rsquo;s plan, not the pin</span>
			</div>
			<div class="chain-rows">
				<div class="chain-row">
					<span class="seed">1</span>
					<svg width="26" height="10" viewBox="0 0 26 10" fill="none" stroke="rgba(91,133,247,0.5)" stroke-width="1.5"><path d="M0 5h20M17 1.5L21 5l-4 3.5" /></svg>
					<span class="brought"></span><span class="brought"></span><span class="brought"></span><span class="brought"></span>
					<span class="chain-note">one RSVP brought 4</span>
				</div>
				<div class="chain-row">
					<span class="seed">1</span>
					<svg width="26" height="10" viewBox="0 0 26 10" fill="none" stroke="rgba(91,133,247,0.5)" stroke-width="1.5"><path d="M0 5h20M17 1.5L21 5l-4 3.5" /></svg>
					<span class="brought"></span><span class="brought"></span>
					<span class="chain-note">avg chain: 1 → 2.4</span>
				</div>
				<p class="chain-privacy">
					<strong>Privacy by design:</strong> chains are counted, never named. The venue learns
					&ldquo;your crowd multiplies&rdquo; — it never learns who is friends with whom. That edge
					data belongs to the attendees.
				</p>
			</div>
		</div>
	</section>

	<!-- check-in verdict -->
	<section class="card dashed verdict">
		<span class="card-label dim">CHECK-IN / DAY-OF VIEW</span>
		<span class="verdict-title">Cut from MVP — deliberately.</span>
		<p class="verdict-body">
			Door check-in implies scanning individuals — a per-person surface we said organizers
			don&rsquo;t get, and hardware/flow work a pilot doesn&rsquo;t need. The day-of story is
			already told by the live going-count on the events board. Revisit when a pilot venue asks
			for it with a concrete door workflow.
		</p>
	</section>
</div>

<p class="page-footnote">
	MVP ships this page with the two live-data modules (RSVPs since publish + going/maybe) real and
	the funnel + chain rendered as dashed previews — venues see where it&rsquo;s going without fake
	numbers.
</p>

<style>
	.head {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.thumb {
		width: 52px;
		height: 66px;
		border-radius: 10px;
		overflow: hidden;
		flex: none;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) contrast(1.06);
		display: block;
	}
	.head-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 28px;
		letter-spacing: -0.025em;
		color: #f5f6f8;
		margin: 0;
	}
	.sub {
		font-weight: 500;
		font-size: 13px;
		color: rgba(236, 237, 240, 0.5);
	}
	.flex-spacer {
		flex: 1;
	}
	.live-chip {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 8px 15px;
		border-radius: 999px;
		background: rgba(24, 178, 107, 0.12);
		border: 1px solid rgba(24, 178, 107, 0.4);
		font-weight: 700;
		font-size: 12px;
		letter-spacing: 0.1em;
		color: #2bce85;
	}
	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #18b26b;
	}

	.row {
		display: flex;
		gap: 18px;
	}
	@media (max-width: 980px) {
		.row {
			flex-direction: column;
		}
	}

	.card {
		flex: 1;
		padding: 20px 22px;
		border-radius: 18px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.card.dashed {
		border: 1px dashed rgba(255, 255, 255, 0.2);
	}
	.card.cobalt {
		border: 1px solid rgba(45, 99, 245, 0.35);
	}
	.funnel {
		flex: 1.15;
		gap: 16px;
	}
	.chain {
		flex: 1.5;
	}
	.verdict {
		background: #101115;
		border: 1px dashed rgba(255, 255, 255, 0.18);
		gap: 10px;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}
	.card-label {
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.16em;
	}
	.card-label.dim {
		color: rgba(245, 246, 248, 0.4);
	}
	.card-label.cobalt-text {
		color: #5b85f7;
	}
	.post-backend {
		border: 1px dashed rgba(255, 255, 255, 0.28);
		border-radius: 6px;
		padding: 2px 8px;
		font-weight: 600;
		font-size: 10px;
		letter-spacing: 0.08em;
		color: rgba(236, 237, 240, 0.45);
	}
	.mvp-live {
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.1em;
		color: #2bce85;
	}

	/* funnel */
	.funnel-rows {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.funnel-row {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.funnel-name {
		width: 110px;
		flex: none;
		font-weight: 600;
		font-size: 13px;
		color: rgba(236, 237, 240, 0.6);
	}
	.funnel-track {
		flex: 1;
		height: 30px;
		position: relative;
	}
	.funnel-track.filled {
		border-radius: 8px;
		background: rgba(91, 133, 247, 0.22);
	}
	.funnel-bar {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 8px;
	}
	.funnel-bar.blue {
		background: rgba(91, 133, 247, 0.38);
	}
	.funnel-bar.green {
		background: #18b26b;
	}
	.funnel-bar.green-soft {
		background: rgba(24, 178, 107, 0.35);
	}
	.funnel-val {
		position: absolute;
		top: 5px;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 14px;
		color: #f5f6f8;
	}
	.funnel-val.in {
		right: 10px;
	}
	.funnel-val.green-text {
		color: #2bce85;
	}
	.funnel-val.soft {
		color: rgba(245, 246, 248, 0.75);
	}

	/* bar chart */
	.chart {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 150px;
		padding-top: 6px;
	}
	.col {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 6px;
	}
	.bar {
		width: 100%;
		border-radius: 6px 6px 0 0;
		background: rgba(91, 133, 247, 0.3);
		position: relative;
	}
	.bar.spike {
		background: #18b26b;
	}
	.col:nth-child(4) .bar {
		background: rgba(91, 133, 247, 0.45);
	}
	.spike-val {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 12px;
		color: #2bce85;
	}
	.day {
		font-weight: 600;
		font-size: 10.5px;
		color: rgba(236, 237, 240, 0.4);
	}
	.day.green-text {
		font-weight: 700;
		color: #2bce85;
	}

	/* chain */
	.chain-body {
		display: flex;
		align-items: center;
		gap: 30px;
	}
	@media (max-width: 700px) {
		.chain-body {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
	}
	.chain-stat {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: none;
	}
	.chain-numeral {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 44px;
		letter-spacing: -0.03em;
		color: #f5f6f8;
	}
	.chain-caption {
		font-weight: 600;
		font-size: 12px;
		line-height: 1.4;
		color: rgba(236, 237, 240, 0.55);
		max-width: 170px;
	}
	.chain-rows {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.chain-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.seed {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: rgba(91, 133, 247, 0.25);
		border: 1px solid rgba(91, 133, 247, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 11px;
		color: #5b85f7;
		flex: none;
	}
	.brought {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: rgba(24, 178, 107, 0.2);
		border: 1px solid rgba(24, 178, 107, 0.45);
		flex: none;
	}
	.chain-note {
		font-weight: 600;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.55);
	}
	.chain-privacy {
		font-weight: 400;
		font-size: 12px;
		line-height: 1.55;
		color: rgba(236, 237, 240, 0.4);
		max-width: 420px;
		margin: 0;
	}
	.chain-privacy strong {
		color: rgba(236, 237, 240, 0.65);
	}

	/* verdict */
	.verdict-title {
		font-weight: 600;
		font-size: 15px;
		color: rgba(236, 237, 240, 0.7);
	}
	.verdict-body {
		font-weight: 400;
		font-size: 13px;
		line-height: 1.6;
		color: rgba(236, 237, 240, 0.5);
		margin: 0;
	}

	.footnote {
		font-weight: 400;
		font-size: 12px;
		line-height: 1.5;
		color: rgba(236, 237, 240, 0.4);
		margin: 0;
	}
	.page-footnote {
		font-weight: 400;
		font-size: 12.5px;
		line-height: 1.5;
		color: rgba(236, 237, 240, 0.4);
		margin: 0;
	}
</style>
