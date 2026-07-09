<script lang="ts">
	import { onMount } from 'svelte';

	// ─── Live clock ───────────────────────────────────────────────
	let now = $state(new Date());
	onMount(() => {
		const t = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(t);
	});

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function formatTime(d: Date) {
		let h = d.getHours();
		const m = d.getMinutes();
		const s = d.getSeconds();
		const ampm = h >= 12 ? 'PM' : 'AM';
		h = h % 12 || 12;
		return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${ampm}`;
	}
	function formatDate(d: Date) {
		return `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
	}

	// ─── Nav state ────────────────────────────────────────────────
	let currentNav = $state<'live' | 'earnings' | 'settings'>('live');

	// ─── Data model ───────────────────────────────────────────────
	type Status = 'booked' | 'received' | 'washing' | 'drying' | 'ready' | 'pickedUp';
	type Tier = 'express' | 'full' | 'signature';

	interface Booking {
		id: string;
		memberName: string;
		vehicleYear: number;
		vehicleMake: string;
		vehicleModel: string;
		vehicleColor: string;
		plate: string;
		spot: string;
		tier: Tier;
		price: number;
		teeTime: string;
		returnWindow: string;
		status: Status;
		crew?: string;
		startedAt?: string;
		readyAt?: string;
		pickedUpAt?: string;
		rating?: number;
	}

	// Fictional but tasteful — matches the Robert-Whitcomb-of-Cedar-Ridge
	// naming convention used elsewhere.
	const bookings: Booking[] = [
		// ─── READY FOR PICKUP (2) ───
		{
			id: 'PC-A31F', memberName: 'Robert Whitcomb',
			vehicleYear: 2024, vehicleMake: 'Range Rover', vehicleModel: 'Velar',
			vehicleColor: 'Obsidian Black', plate: '0418 EE',
			spot: 'E-14', tier: 'full', price: 85,
			teeTime: '8:12 AM', returnWindow: '11:20 – 2:15',
			status: 'ready', crew: 'Marcus & Dani',
			startedAt: '9:04 AM', readyAt: '10:03 AM'
		},
		{
			id: 'PC-B72C', memberName: 'Katherine Ellsworth',
			vehicleYear: 2023, vehicleMake: 'Audi', vehicleModel: 'RS6 Avant',
			vehicleColor: 'Nardo Grey', plate: '271 CGR',
			spot: 'W-08', tier: 'signature', price: 140,
			teeTime: '8:24 AM', returnWindow: '11:30 – 2:30',
			status: 'ready', crew: 'Priit & Anna',
			startedAt: '9:16 AM', readyAt: '10:41 AM'
		},

		// ─── IN PROGRESS · WASHING/DRYING (5) ───
		{
			id: 'PC-C41K', memberName: 'Thomas Ashworth',
			vehicleYear: 2024, vehicleMake: 'BMW', vehicleModel: 'X5 M60i',
			vehicleColor: 'Alpine White', plate: '992 TMB',
			spot: 'E-08', tier: 'full', price: 85,
			teeTime: '9:00 AM', returnWindow: '12:10 – 3:00',
			status: 'drying', crew: 'Marcus & Dani',
			startedAt: '10:12 AM'
		},
		{
			id: 'PC-D18M', memberName: 'Elizabeth Marchand',
			vehicleYear: 2023, vehicleMake: 'Volvo', vehicleModel: 'XC90 Recharge',
			vehicleColor: 'Crystal White Pearl', plate: '146 EMR',
			spot: 'N-22', tier: 'express', price: 45,
			teeTime: '9:12 AM', returnWindow: '12:20 – 2:40',
			status: 'washing', crew: 'Priit & Anna',
			startedAt: '10:31 AM'
		},
		{
			id: 'PC-E55N', memberName: 'Henry Winston',
			vehicleYear: 2024, vehicleMake: 'Audi', vehicleModel: 'Q7 55 TFSI',
			vehicleColor: 'Mythos Black', plate: '830 HWN',
			spot: 'S-05', tier: 'signature', price: 140,
			teeTime: '9:24 AM', returnWindow: '12:30 – 3:20',
			status: 'washing', crew: 'Marcus & Dani',
			startedAt: '10:44 AM'
		},
		{
			id: 'PC-F09P', memberName: 'James Kellner',
			vehicleYear: 2024, vehicleMake: 'Porsche', vehicleModel: 'Cayenne S',
			vehicleColor: 'Jet Black Metallic', plate: '408 JMK',
			spot: 'E-19', tier: 'full', price: 85,
			teeTime: '9:36 AM', returnWindow: '12:40 – 3:20',
			status: 'washing', crew: 'Priit & Anna',
			startedAt: '10:52 AM'
		},
		{
			id: 'PC-G26Q', memberName: 'Margaret Coleridge',
			vehicleYear: 2022, vehicleMake: 'Mercedes-Benz', vehicleModel: 'S 500',
			vehicleColor: 'Selenite Grey', plate: '513 MCL',
			spot: 'W-14', tier: 'signature', price: 140,
			teeTime: '9:48 AM', returnWindow: '12:50 – 3:40',
			status: 'drying', crew: 'Marcus & Dani',
			startedAt: '10:38 AM'
		},

		// ─── RECEIVED · car at lot, not yet started (3) ───
		{
			id: 'PC-H82R', memberName: 'William Pemberton',
			vehicleYear: 2024, vehicleMake: 'Lexus', vehicleModel: 'LX 600',
			vehicleColor: 'Eminent White Pearl', plate: '107 WPB',
			spot: 'N-08', tier: 'full', price: 85,
			teeTime: '10:00 AM', returnWindow: '1:00 – 3:45',
			status: 'received'
		},
		{
			id: 'PC-J47S', memberName: 'Charles Ashton',
			vehicleYear: 2023, vehicleMake: 'Range Rover', vehicleModel: 'Sport SVR',
			vehicleColor: 'Carpathian Grey', plate: '625 CHA',
			spot: 'E-04', tier: 'express', price: 45,
			teeTime: '10:12 AM', returnWindow: '1:10 – 3:20',
			status: 'received'
		},
		{
			id: 'PC-K90T', memberName: 'Andrew Sinclair',
			vehicleYear: 2023, vehicleMake: 'Mercedes-AMG', vehicleModel: 'GT 63',
			vehicleColor: 'Obsidian Black', plate: '774 ASR',
			spot: 'W-02', tier: 'signature', price: 140,
			teeTime: '10:24 AM', returnWindow: '1:20 – 4:00',
			status: 'received'
		},

		// ─── BOOKED · not yet at lot (3) ───
		{
			id: 'PC-L13U', memberName: 'David Brookline',
			vehicleYear: 2024, vehicleMake: 'BMW', vehicleModel: '7 Series 750e',
			vehicleColor: 'Carbon Black Metallic', plate: '319 DBK',
			spot: '—', tier: 'full', price: 85,
			teeTime: '11:36 AM', returnWindow: '2:40 – 5:20',
			status: 'booked'
		},
		{
			id: 'PC-M64V', memberName: 'Michael Farley',
			vehicleYear: 2024, vehicleMake: 'Porsche', vehicleModel: 'Panamera GTS',
			vehicleColor: 'Chalk', plate: '882 MFY',
			spot: '—', tier: 'signature', price: 140,
			teeTime: '11:48 AM', returnWindow: '2:50 – 5:40',
			status: 'booked'
		},
		{
			id: 'PC-N75W', memberName: 'Alexander Vardanyan',
			vehicleYear: 2023, vehicleMake: 'Audi', vehicleModel: 'e-tron GT',
			vehicleColor: 'Mythos Black', plate: '204 AVD',
			spot: '—', tier: 'express', price: 45,
			teeTime: '12:00 PM', returnWindow: '3:00 – 5:15',
			status: 'booked'
		},

		// ─── COMPLETED TODAY (4) ───
		{
			id: 'PC-P29X', memberName: 'Peter Halloway',
			vehicleYear: 2023, vehicleMake: 'BMW', vehicleModel: 'X7 M60i',
			vehicleColor: 'Alpine White', plate: '640 PHW',
			spot: 'E-11', tier: 'full', price: 85,
			teeTime: '7:00 AM', returnWindow: '10:00 – 1:00',
			status: 'pickedUp',
			startedAt: '8:04 AM', readyAt: '9:01 AM', pickedUpAt: '11:03 AM',
			rating: 5
		},
		{
			id: 'PC-Q88Y', memberName: 'Frederick Lassiter',
			vehicleYear: 2024, vehicleMake: 'Range Rover', vehicleModel: 'Autobiography',
			vehicleColor: 'Santorini Black', plate: '395 FLS',
			spot: 'W-01', tier: 'signature', price: 140,
			teeTime: '7:12 AM', returnWindow: '10:20 – 1:40',
			status: 'pickedUp',
			startedAt: '8:16 AM', readyAt: '9:44 AM', pickedUpAt: '11:12 AM',
			rating: 5
		},
		{
			id: 'PC-R33Z', memberName: 'Nathaniel Rowe',
			vehicleYear: 2022, vehicleMake: 'Porsche', vehicleModel: 'Taycan Turbo',
			vehicleColor: 'Volcano Grey', plate: '158 NRW',
			spot: 'E-15', tier: 'express', price: 45,
			teeTime: '7:24 AM', returnWindow: '10:30 – 1:15',
			status: 'pickedUp',
			startedAt: '8:22 AM', readyAt: '8:56 AM', pickedUpAt: '10:47 AM',
			rating: 4
		},
		{
			id: 'PC-S45A', memberName: 'Julian Bartholomew',
			vehicleYear: 2024, vehicleMake: 'Mercedes-Benz', vehicleModel: 'GLE 580',
			vehicleColor: 'Selenite Grey', plate: '271 JBW',
			spot: 'N-10', tier: 'full', price: 85,
			teeTime: '7:48 AM', returnWindow: '11:00 – 1:45',
			status: 'pickedUp',
			startedAt: '8:41 AM', readyAt: '9:42 AM', pickedUpAt: '11:38 AM',
			rating: 5
		}
	];

	// ─── Derived: sections + KPIs ─────────────────────────────────
	const readyBookings = $derived(bookings.filter((b) => b.status === 'ready'));
	const inProgressBookings = $derived(
		bookings.filter((b) => b.status === 'washing' || b.status === 'drying')
	);
	const receivedBookings = $derived(bookings.filter((b) => b.status === 'received'));
	const scheduledBookings = $derived(bookings.filter((b) => b.status === 'booked'));
	const completedToday = $derived(bookings.filter((b) => b.status === 'pickedUp'));

	const carsOnProperty = $derived(
		bookings.filter((b) =>
			['received', 'washing', 'drying', 'ready'].includes(b.status)
		).length
	);
	const revenueToday = $derived(
		bookings.filter((b) => b.status !== 'booked').reduce((sum, b) => sum + b.price, 0)
	);
	const clubShare = $derived(Math.round(revenueToday * 0.2));

	// ─── Tier + status helpers ────────────────────────────────────
	const tierLabel: Record<Tier, string> = {
		express: 'Express Exterior',
		full: 'Full Valet',
		signature: 'Signature Detail'
	};
	const tierBadge: Record<Tier, string> = {
		express: '30 MIN',
		full: '60 MIN',
		signature: '90 MIN'
	};
	const statusLabel: Record<Status, string> = {
		booked: 'BOOKED',
		received: 'AT LOT',
		washing: 'WASHING',
		drying: 'DRYING',
		ready: 'READY',
		pickedUp: 'PICKED UP'
	};

	// ─── Paint-color map (mirrors iOS VehiclePaintMap) ──────────
	function paintColor(name: string): string {
		const n = name.toLowerCase();
		if (n.includes('jet') && n.includes('black')) return '#0E0E10';
		if (n.includes('carbon')) return '#1E1E22';
		if (n.includes('obsidian')) return '#14141A';
		if (n.includes('santorini')) return '#16161A';
		if (n.includes('black')) return '#1A1A1C';
		if (n.includes('alpine') || n.includes('crystal') || n.includes('eminent')) return '#F1EFE8';
		if (n.includes('pearl')) return '#F2EEE5';
		if (n.includes('white')) return '#ECEAE3';
		if (n.includes('nardo') || n.includes('chalk')) return '#B6B6B6';
		if (n.includes('silver')) return '#B8B8BC';
		if (n.includes('selenite') || n.includes('brilliant')) return '#9A9A9E';
		if (n.includes('granite') || n.includes('graphite')) return '#4A4A4E';
		if (n.includes('carpathian')) return '#595A5E';
		if (n.includes('volcano')) return '#42434A';
		if (n.includes('mythos')) return '#232328';
		if (n.includes('grey') || n.includes('gray')) return '#6E6E72';
		return '#404048';
	}
	function isPaintLight(name: string): boolean {
		const n = name.toLowerCase();
		return (
			n.includes('white') ||
			n.includes('pearl') ||
			n.includes('alpine') ||
			n.includes('crystal') ||
			n.includes('eminent') ||
			n.includes('silver') ||
			n.includes('nardo') ||
			n.includes('chalk')
		);
	}
</script>

<svelte:head>
	<title>Par Car · Console — Cedar Ridge Country Club</title>
	<meta name="description" content="Par Car caddiemaster console — real-time live board of members' washes on property." />
</svelte:head>

<div class="console">
	<!-- ═════════════ SIDEBAR ═════════════ -->
	<aside class="sidebar">
		<div class="brand">
			<div class="brand-mark">
				<span>PAR</span>
				<span class="flag">
					<svg viewBox="0 0 30 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<rect x="13" y="6" width="3" height="48" fill="#C5392C" />
						<path d="M16 8 L28 14 L16 20 Z" fill="#C5392C" />
					</svg>
				</span>
				<span>CAR</span>
			</div>
			<div class="brand-sub">CADDIEMASTER CONSOLE</div>
		</div>

		<div class="club-card">
			<div class="club-label">SIGNED IN</div>
			<div class="club-name">Cedar Ridge Country Club</div>
			<div class="club-meta">Member since Feb 2026</div>
		</div>

		<nav>
			<button
				class:active={currentNav === 'live'}
				onclick={() => (currentNav = 'live')}
			>
				<span class="dot"></span>
				<span>Live board</span>
				<span class="badge">{carsOnProperty}</span>
			</button>
			<button
				class:active={currentNav === 'earnings'}
				onclick={() => (currentNav = 'earnings')}
			>
				<span class="icon">€</span>
				<span>Earnings</span>
			</button>
			<button disabled>
				<span class="icon">◦</span>
				<span>Members</span>
				<span class="soon">SOON</span>
			</button>
			<button disabled>
				<span class="icon">◦</span>
				<span>Reports</span>
				<span class="soon">SOON</span>
			</button>
			<button
				class:active={currentNav === 'settings'}
				onclick={() => (currentNav = 'settings')}
			>
				<span class="icon">⚙</span>
				<span>Settings</span>
			</button>
		</nav>

		<div class="side-foot">
			<div class="side-support">
				<div class="ss-label">SUPPORT</div>
				<a href="mailto:info@lsdigital.ee">info@lsdigital.ee</a>
			</div>
			<div class="side-ver">v0.5.3 · Pilot</div>
		</div>
	</aside>

	<!-- ═════════════ MAIN ═════════════ -->
	<main>
		{#if currentNav === 'live'}
			<div class="content">
				<!-- ─── Page header ─── -->
				<div class="page-head">
					<div>
						<div class="head-eyebrow">TODAY · {formatDate(now).toUpperCase()}</div>
						<h1>Live board</h1>
					</div>
					<div class="head-right">
						<div class="clock">{formatTime(now)}</div>
						<div class="last-updated">
							<span class="live-dot"></span> Live
						</div>
					</div>
				</div>

				<!-- ─── KPI row ─── -->
				<div class="kpi-grid">
					<div class="kpi">
						<div class="kpi-lbl">CARS ON PROPERTY</div>
						<div class="kpi-val">{carsOnProperty}</div>
						<div class="kpi-sub">
							{inProgressBookings.length} washing · {readyBookings.length} ready
						</div>
					</div>
					<div class="kpi accent">
						<div class="kpi-lbl">READY FOR PICKUP</div>
						<div class="kpi-val">{readyBookings.length}</div>
						<div class="kpi-sub">action needed</div>
					</div>
					<div class="kpi">
						<div class="kpi-lbl">REVENUE TODAY</div>
						<div class="kpi-val">€{revenueToday.toLocaleString('en-US')}</div>
						<div class="kpi-sub">
							{bookings.filter((b) => b.status !== 'booked').length} washes billed
						</div>
					</div>
					<div class="kpi highlight">
						<div class="kpi-lbl">YOUR SHARE · 20%</div>
						<div class="kpi-val">€{clubShare.toLocaleString('en-US')}</div>
						<div class="kpi-sub">settles on the 5th</div>
					</div>
				</div>

				<!-- ─── Ready for pickup (urgent) ─── -->
				{#if readyBookings.length > 0}
					<section class="section ready-section">
						<div class="section-head">
							<h2>
								<span class="status-pill ready">READY</span>
								Ready for pickup
							</h2>
							<span class="count">{readyBookings.length}</span>
						</div>
						<div class="rows">
							{#each readyBookings as b (b.id)}
								<div class="row row-ready">
									<div class="paint-tile" style="background: {paintColor(b.vehicleColor)}">
										<div class="paint-brand" style:color={isPaintLight(b.vehicleColor) ? '#1c1a16' : 'rgba(255,255,255,0.95)'}>
											{b.vehicleMake.toUpperCase()}
										</div>
										<div class="paint-sub" style:color={isPaintLight(b.vehicleColor) ? '#595650' : 'rgba(255,255,255,0.62)'}>
											'{String(b.vehicleYear).slice(-2)} {b.vehicleModel.toUpperCase()}
										</div>
									</div>
									<div class="col-member">
										<div class="member-name">{b.memberName}</div>
										<div class="member-meta">
											{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} · {b.plate}
										</div>
									</div>
									<div class="col-spot">
										<div class="col-lbl">SPOT</div>
										<div class="spot-val">{b.spot}</div>
									</div>
									<div class="col-status">
										<div class="status-pill ready">{statusLabel[b.status]}</div>
										<div class="col-sub">since {b.readyAt}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- ─── In progress ─── -->
				<section class="section">
					<div class="section-head">
						<h2>
							<span class="status-pill washing">IN PROGRESS</span>
							Washing &amp; drying
						</h2>
						<span class="count">{inProgressBookings.length}</span>
					</div>
					<div class="rows">
						{#each inProgressBookings as b (b.id)}
							<div class="row">
								<div class="paint-tile" style="background: {paintColor(b.vehicleColor)}">
									<div class="paint-brand" style:color={isPaintLight(b.vehicleColor) ? '#1c1a16' : 'rgba(255,255,255,0.95)'}>
										{b.vehicleMake.toUpperCase()}
									</div>
									<div class="paint-sub" style:color={isPaintLight(b.vehicleColor) ? '#595650' : 'rgba(255,255,255,0.62)'}>
										'{String(b.vehicleYear).slice(-2)} {b.vehicleModel.toUpperCase()}
									</div>
								</div>
								<div class="col-member">
									<div class="member-name">{b.memberName}</div>
									<div class="member-meta">
										{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} · {b.plate}
									</div>
								</div>
								<div class="col-spot">
									<div class="col-lbl">SPOT</div>
									<div class="spot-val">{b.spot}</div>
								</div>
								<div class="col-status">
									<div class="status-pill {b.status}">{statusLabel[b.status]}</div>
									<div class="col-sub">started {b.startedAt}</div>
								</div>
								<div class="col-tier">
									<div class="tier-name">{tierLabel[b.tier]}</div>
									<div class="tier-meta">{tierBadge[b.tier]} · {b.crew}</div>
								</div>
								<div class="col-price">€{b.price}</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- ─── At the lot, waiting for crew ─── -->
				{#if receivedBookings.length > 0}
					<section class="section">
						<div class="section-head">
							<h2>
								<span class="status-pill received">AT LOT</span>
								Awaiting crew
							</h2>
							<span class="count">{receivedBookings.length}</span>
						</div>
						<div class="rows">
							{#each receivedBookings as b (b.id)}
								<div class="row">
									<div class="paint-tile" style="background: {paintColor(b.vehicleColor)}">
										<div class="paint-brand" style:color={isPaintLight(b.vehicleColor) ? '#1c1a16' : 'rgba(255,255,255,0.95)'}>
											{b.vehicleMake.toUpperCase()}
										</div>
										<div class="paint-sub" style:color={isPaintLight(b.vehicleColor) ? '#595650' : 'rgba(255,255,255,0.62)'}>
											'{String(b.vehicleYear).slice(-2)} {b.vehicleModel.toUpperCase()}
										</div>
									</div>
									<div class="col-member">
										<div class="member-name">{b.memberName}</div>
										<div class="member-meta">
											{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} · {b.plate}
										</div>
									</div>
									<div class="col-spot">
										<div class="col-lbl">SPOT</div>
										<div class="spot-val">{b.spot}</div>
									</div>
									<div class="col-status">
										<div class="status-pill received">{statusLabel[b.status]}</div>
										<div class="col-sub">tee {b.teeTime}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- ─── Scheduled (later today) ─── -->
				{#if scheduledBookings.length > 0}
					<section class="section">
						<div class="section-head">
							<h2>
								<span class="status-pill booked">SCHEDULED</span>
								Booked, not yet on property
							</h2>
							<span class="count">{scheduledBookings.length}</span>
						</div>
						<div class="rows">
							{#each scheduledBookings as b (b.id)}
								<div class="row row-scheduled">
									<div class="paint-tile" style="background: {paintColor(b.vehicleColor)}">
										<div class="paint-brand" style:color={isPaintLight(b.vehicleColor) ? '#1c1a16' : 'rgba(255,255,255,0.95)'}>
											{b.vehicleMake.toUpperCase()}
										</div>
										<div class="paint-sub" style:color={isPaintLight(b.vehicleColor) ? '#595650' : 'rgba(255,255,255,0.62)'}>
											'{String(b.vehicleYear).slice(-2)} {b.vehicleModel.toUpperCase()}
										</div>
									</div>
									<div class="col-member">
										<div class="member-name">{b.memberName}</div>
										<div class="member-meta">
											{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} · {b.plate}
										</div>
									</div>
									<div class="col-spot">
										<div class="col-lbl">TEE</div>
										<div class="spot-val">{b.teeTime}</div>
									</div>
									<div class="col-status">
										<div class="status-pill booked">{statusLabel[b.status]}</div>
										<div class="col-sub">return {b.returnWindow}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- ─── Completed today ─── -->
				<section class="section muted">
					<div class="section-head">
						<h2>
							<span class="status-pill picked">DONE</span>
							Completed today
						</h2>
						<span class="count">{completedToday.length}</span>
					</div>
					<div class="rows">
						{#each completedToday as b (b.id)}
							<div class="row row-completed">
								<div class="paint-tile" style="background: {paintColor(b.vehicleColor)}">
									<div class="paint-brand" style:color={isPaintLight(b.vehicleColor) ? '#1c1a16' : 'rgba(255,255,255,0.95)'}>
										{b.vehicleMake.toUpperCase()}
									</div>
									<div class="paint-sub" style:color={isPaintLight(b.vehicleColor) ? '#595650' : 'rgba(255,255,255,0.62)'}>
										'{String(b.vehicleYear).slice(-2)} {b.vehicleModel.toUpperCase()}
									</div>
								</div>
								<div class="col-member">
									<div class="member-name">{b.memberName}</div>
									<div class="member-meta">
										{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} · {b.plate}
									</div>
								</div>
								<div class="col-spot">
									<div class="col-lbl">PICKED UP</div>
									<div class="spot-val">{b.pickedUpAt}</div>
								</div>
								<div class="col-status">
									<div class="stars">
										{#each Array(5) as _, i}
											<span class="star" class:filled={i < (b.rating ?? 0)}>★</span>
										{/each}
									</div>
									<div class="col-sub">wash: {b.startedAt} → {b.readyAt}</div>
								</div>
								<div class="col-tier">
									<div class="tier-name">{tierLabel[b.tier]}</div>
									<div class="tier-meta">{tierBadge[b.tier]}</div>
								</div>
								<div class="col-price">€{b.price}</div>
							</div>
						{/each}
					</div>
				</section>
			</div>
		{:else if currentNav === 'earnings'}
			<!-- ═════════════ EARNINGS ═════════════ -->
			<div class="content">
				<div class="page-head">
					<div>
						<div class="head-eyebrow">JUNE · 2026</div>
						<h1>Earnings</h1>
					</div>
					<div class="head-right">
						<div class="clock">{formatTime(now)}</div>
					</div>
				</div>

				<div class="earnings-hero">
					<div class="eh-left">
						<div class="eh-eyebrow">JUNE PAYOUT · SETTLES JULY 5</div>
						<div class="eh-val">€6,942</div>
						<div class="eh-sub">
							20% of €34,710 gross across 412 washes this month
						</div>
					</div>
					<div class="eh-right">
						<div class="eh-chart">
							<!-- Simple sparkline-style bars for last 6 months -->
							{#each [4200, 5100, 5800, 6100, 6480, 6942] as v, i}
								<div class="bar" style="height: {(v / 7000) * 100}%">
									<div class="bar-val">€{(v / 1000).toFixed(1)}k</div>
								</div>
							{/each}
						</div>
						<div class="eh-months">
							<span>Jan</span><span>Feb</span><span>Mar</span>
							<span>Apr</span><span>May</span><span>Jun</span>
						</div>
					</div>
				</div>

				<div class="earnings-grid">
					<div class="stat-card">
						<div class="stat-lbl">MEMBERS SERVED</div>
						<div class="stat-val">247</div>
						<div class="stat-sub">of ~420 active · 59%</div>
					</div>
					<div class="stat-card">
						<div class="stat-lbl">AVG WASHES / MEMBER</div>
						<div class="stat-val">1.67</div>
						<div class="stat-sub">per month</div>
					</div>
					<div class="stat-card">
						<div class="stat-lbl">AVG TICKET</div>
						<div class="stat-val">€84.25</div>
						<div class="stat-sub">across all tiers</div>
					</div>
					<div class="stat-card">
						<div class="stat-lbl">NPS · MEMBER SAT</div>
						<div class="stat-val">72</div>
						<div class="stat-sub">28 / 39 rated 5★</div>
					</div>
				</div>

				<div class="tier-breakdown">
					<h3>Tier mix this month</h3>
					<div class="tier-bar">
						<div class="tb-slice express" style="width: 32%">
							<span>Express · 32%</span>
						</div>
						<div class="tb-slice full" style="width: 51%">
							<span>Full Valet · 51%</span>
						</div>
						<div class="tb-slice signature" style="width: 17%">
							<span>Signature · 17%</span>
						</div>
					</div>
					<div class="tier-notes">
						<div>132 Express washes · €5,940 gross</div>
						<div>210 Full Valets · €17,850 gross</div>
						<div>70 Signature Details · €9,800 gross</div>
					</div>
				</div>
			</div>
		{:else if currentNav === 'settings'}
			<div class="content">
				<div class="page-head">
					<div>
						<div class="head-eyebrow">SETTINGS</div>
						<h1>Club configuration</h1>
					</div>
				</div>
				<div class="settings-list">
					<div class="setting-row">
						<div>
							<div class="setting-name">Payout account</div>
							<div class="setting-sub">SEPA · EE38 2200 2210 2014 5685 · Nordea Bank</div>
						</div>
						<span class="verified">VERIFIED</span>
					</div>
					<div class="setting-row">
						<div>
							<div class="setting-name">Reserved parking</div>
							<div class="setting-sub">6 spots · East and West lots (rows E, W)</div>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
					<div class="setting-row">
						<div>
							<div class="setting-name">Operating hours</div>
							<div class="setting-sub">Mon–Sun · 7:00 AM – 6:00 PM</div>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
					<div class="setting-row">
						<div>
							<div class="setting-name">Caddiemaster contact</div>
							<div class="setting-sub">Andres Kask · andres@cedarridge.example</div>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
					<div class="setting-row">
						<div>
							<div class="setting-name">Notifications</div>
							<div class="setting-sub">SMS on ready + daily summary at 6 PM</div>
						</div>
						<button class="edit-btn">Edit</button>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	/* ════════════════════════════════════════════════════════════════
	   Par Car Console — desktop dashboard for the caddiemaster / club.
	   Design register: warm-cream base (matches marketing site), thin
	   hairlines instead of hard borders, Spectral for the branding
	   moments + Inter for UI + JetBrains Mono for numbers/ids/time.
	   Status colours: red for READY (urgent action), amber for at-lot,
	   blue for washing/drying, muted for booked/picked-up.
	   ════════════════════════════════════════════════════════════════ */

	.console {
		--ink: #1c1a16;
		--ink-2: #595650;
		--ink-3: #9a948a;
		--ink-4: #b4ada2;
		--cream: #f1ece1;
		--cream-2: #ebe5d6;
		--paper: #faf6ee;
		--paper-2: #ffffff;
		--line: rgba(28, 26, 22, 0.08);
		--line-2: rgba(28, 26, 22, 0.14);
		--red: #c5392c;
		--red-soft: rgba(197, 57, 44, 0.08);
		--amber: #b57420;
		--amber-soft: rgba(181, 116, 32, 0.1);
		--blue: #2c6f9e;
		--blue-soft: rgba(44, 111, 158, 0.08);
		--green: #4a7c40;
		--green-soft: rgba(74, 124, 64, 0.12);
		--gold: #b89456;

		display: grid;
		grid-template-columns: 260px 1fr;
		min-height: 100vh;
		background: var(--cream);
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		color: var(--ink);
		font-size: 14px;
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
		position: relative;
		z-index: 1;
	}

	.console * {
		box-sizing: border-box;
	}

	/* ═══════════════ SIDEBAR ═══════════════ */
	.sidebar {
		background: #ecdaba00;
		background: linear-gradient(180deg, #ebe5d6 0%, #e5dcc7 100%);
		border-right: 1px solid var(--line-2);
		padding: 24px 18px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.brand {
		padding: 6px 6px 12px;
	}
	.brand-mark {
		font-family: 'Spectral', Georgia, serif;
		font-weight: 500;
		font-size: 20px;
		letter-spacing: 0.16em;
		color: var(--ink);
		display: inline-flex;
		align-items: center;
		gap: 0.42em;
	}
	.brand-mark .flag {
		width: 0.42em;
		height: 1em;
		display: inline-block;
	}
	.brand-mark .flag svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.brand-sub {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.28em;
		color: var(--ink-3);
		font-weight: 600;
		margin-top: 6px;
	}

	.club-card {
		background: var(--paper);
		border: 1px solid var(--line-2);
		border-radius: 10px;
		padding: 12px 14px;
	}
	.club-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.22em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 4px;
	}
	.club-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		color: var(--ink);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.club-meta {
		font-size: 10px;
		color: var(--ink-3);
		margin-top: 4px;
	}

	.sidebar nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: 4px;
	}
	.sidebar nav button {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 12px;
		border: none;
		background: transparent;
		color: var(--ink-2);
		font-size: 13px;
		font-weight: 500;
		font-family: inherit;
		text-align: left;
		border-radius: 7px;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.sidebar nav button:hover:not(:disabled) {
		background: rgba(28, 26, 22, 0.04);
		color: var(--ink);
	}
	.sidebar nav button.active {
		background: var(--ink);
		color: var(--cream);
	}
	.sidebar nav button:disabled {
		color: var(--ink-4);
		cursor: not-allowed;
	}
	.sidebar nav button .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--red);
		flex-shrink: 0;
	}
	.sidebar nav button.active .dot {
		background: var(--cream);
	}
	.sidebar nav button .icon {
		width: 14px;
		text-align: center;
		font-size: 12px;
		color: var(--ink-3);
	}
	.sidebar nav button.active .icon {
		color: var(--cream);
	}
	.sidebar nav button span:nth-child(2) {
		flex: 1;
	}
	.sidebar nav button .badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		background: var(--red);
		color: var(--cream);
		padding: 1px 6px;
		border-radius: 999px;
		min-width: 20px;
		text-align: center;
	}
	.sidebar nav button.active .badge {
		background: var(--cream);
		color: var(--ink);
	}
	.sidebar nav button .soon {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.14em;
		color: var(--ink-4);
		font-weight: 600;
	}

	.side-foot {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.side-support {
		background: rgba(28, 26, 22, 0.04);
		padding: 10px 12px;
		border-radius: 8px;
	}
	.ss-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.24em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 3px;
	}
	.side-support a {
		font-size: 11px;
		color: var(--ink);
		text-decoration: none;
		font-weight: 500;
	}
	.side-support a:hover {
		text-decoration: underline;
	}
	.side-ver {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.16em;
		color: var(--ink-3);
		font-weight: 600;
		text-align: center;
		padding: 4px;
	}

	/* ═══════════════ MAIN ═══════════════ */
	main {
		overflow-x: auto;
	}
	.content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 28px 32px 60px;
	}

	.page-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 24px;
		gap: 20px;
	}
	.head-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.28em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 6px;
	}
	.page-head h1 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 32px;
		color: var(--ink);
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0;
	}
	.head-right {
		text-align: right;
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.clock {
		font-family: 'JetBrains Mono', monospace;
		font-size: 16px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.last-updated {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.live-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--red);
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.35; }
	}

	/* ─── KPI grid ─── */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-bottom: 28px;
	}
	.kpi {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: relative;
		overflow: hidden;
	}
	.kpi.accent {
		background: var(--red);
		color: var(--cream);
		border-color: var(--red);
	}
	.kpi.highlight {
		background: var(--ink);
		color: var(--cream);
		border-color: var(--ink);
	}
	.kpi-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.24em;
		font-weight: 600;
		color: var(--ink-3);
	}
	.kpi.accent .kpi-lbl {
		color: rgba(241, 236, 225, 0.7);
	}
	.kpi.highlight .kpi-lbl {
		color: var(--gold);
	}
	.kpi-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 34px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.kpi.accent .kpi-val,
	.kpi.highlight .kpi-val {
		color: var(--cream);
	}
	.kpi-sub {
		font-size: 11px;
		color: var(--ink-3);
	}
	.kpi.accent .kpi-sub {
		color: rgba(241, 236, 225, 0.75);
	}
	.kpi.highlight .kpi-sub {
		color: rgba(241, 236, 225, 0.65);
	}

	/* ─── Section ─── */
	.section {
		margin-bottom: 28px;
	}
	.section.muted {
		opacity: 0.72;
	}
	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.section-head h2 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 18px;
		color: var(--ink);
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
	}
	.section-head .count {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
	}

	/* ─── Status pills ─── */
	.status-pill {
		display: inline-flex;
		align-items: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.16em;
		padding: 3px 8px;
		border-radius: 999px;
		background: var(--ink-4);
		color: white;
	}
	.status-pill.ready {
		background: var(--red);
		color: var(--cream);
	}
	.status-pill.washing,
	.status-pill.drying {
		background: var(--blue);
		color: white;
	}
	.status-pill.received {
		background: var(--amber);
		color: white;
	}
	.status-pill.booked {
		background: rgba(28, 26, 22, 0.55);
		color: var(--cream);
	}
	.status-pill.picked {
		background: rgba(28, 26, 22, 0.35);
		color: var(--cream);
	}

	/* ─── Booking rows ─── */
	.rows {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 80px 1.6fr 90px 1.3fr 1.4fr 60px;
		gap: 16px;
		align-items: center;
		padding: 10px 16px;
		border-bottom: 1px solid var(--line);
	}
	.row:last-child {
		border-bottom: none;
	}
	.row-ready {
		background: var(--red-soft);
	}
	.row-scheduled {
		opacity: 0.85;
	}
	.row-completed {
		opacity: 0.75;
	}

	.paint-tile {
		width: 68px;
		height: 42px;
		border-radius: 6px;
		padding: 5px 7px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(0, 0, 0, 0.15);
	}
	.paint-brand {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 9px;
		letter-spacing: 0.05em;
		line-height: 1;
	}
	.paint-sub {
		font-family: 'JetBrains Mono', monospace;
		font-size: 6.5px;
		letter-spacing: 0.1em;
		font-weight: 600;
	}

	.member-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 15px;
		color: var(--ink);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.member-meta {
		font-size: 11px;
		color: var(--ink-3);
		margin-top: 3px;
		font-variant-numeric: tabular-nums;
	}

	.col-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.2em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 2px;
	}
	.col-spot .spot-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 16px;
		font-weight: 600;
		color: var(--red);
		letter-spacing: 0.02em;
	}
	.row-scheduled .col-spot .spot-val,
	.row-completed .col-spot .spot-val {
		color: var(--ink);
		font-size: 13px;
	}

	.col-status {
		display: flex;
		flex-direction: column;
		gap: 3px;
		align-items: flex-start;
	}
	.col-sub {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--ink-3);
	}
	.col-tier .tier-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
	}
	.col-tier .tier-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.14em;
		color: var(--ink-3);
		font-weight: 600;
		text-transform: uppercase;
		margin-top: 2px;
	}
	.col-price {
		font-family: 'JetBrains Mono', monospace;
		font-size: 18px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.02em;
		text-align: right;
	}

	.stars {
		display: inline-flex;
		gap: 1px;
	}
	.star {
		color: var(--ink-4);
		font-size: 13px;
	}
	.star.filled {
		color: var(--gold);
	}

	/* ═══════════════ EARNINGS ═══════════════ */
	.earnings-hero {
		background: var(--ink);
		color: var(--cream);
		border-radius: 16px;
		padding: 32px 40px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: center;
		margin-bottom: 24px;
	}
	.eh-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.28em;
		color: var(--gold);
		font-weight: 600;
		margin-bottom: 12px;
	}
	.eh-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 56px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--cream);
	}
	.eh-sub {
		font-size: 14px;
		color: rgba(241, 236, 225, 0.65);
		margin-top: 12px;
		line-height: 1.5;
	}
	.eh-chart {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
		height: 140px;
		align-items: flex-end;
	}
	.bar {
		background: linear-gradient(180deg, var(--gold), rgba(184, 148, 86, 0.55));
		border-radius: 4px 4px 0 0;
		position: relative;
		min-height: 20px;
	}
	.bar-val {
		position: absolute;
		top: -18px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 600;
		color: rgba(241, 236, 225, 0.75);
	}
	.eh-months {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
		margin-top: 8px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.16em;
		color: rgba(241, 236, 225, 0.5);
		font-weight: 600;
		text-align: center;
	}

	.earnings-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-bottom: 28px;
	}
	.stat-card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 16px 18px;
	}
	.stat-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.24em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 6px;
	}
	.stat-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 28px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.02em;
		line-height: 1;
	}
	.stat-sub {
		font-size: 11px;
		color: var(--ink-3);
		margin-top: 4px;
	}

	.tier-breakdown {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 20px 24px;
	}
	.tier-breakdown h3 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 15px;
		color: var(--ink);
		margin: 0 0 12px;
	}
	.tier-bar {
		display: flex;
		height: 34px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--line);
	}
	.tb-slice {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
		font-weight: 600;
		color: white;
		overflow: hidden;
	}
	.tb-slice.express {
		background: var(--blue);
	}
	.tb-slice.full {
		background: var(--ink);
	}
	.tb-slice.signature {
		background: var(--gold);
	}
	.tb-slice span {
		white-space: nowrap;
	}
	.tier-notes {
		margin-top: 12px;
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--ink-3);
	}

	/* ═══════════════ SETTINGS ═══════════════ */
	.settings-list {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 20px;
		border-bottom: 1px solid var(--line);
	}
	.setting-row:last-child {
		border-bottom: none;
	}
	.setting-name {
		font-weight: 600;
		color: var(--ink);
		font-size: 14px;
	}
	.setting-sub {
		font-size: 12px;
		color: var(--ink-3);
		margin-top: 3px;
	}
	.verified {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		color: var(--green);
		font-weight: 600;
		background: var(--green-soft);
		padding: 4px 10px;
		border-radius: 999px;
	}
	.edit-btn {
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--ink);
		padding: 6px 14px;
		border-radius: 999px;
		font-family: inherit;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}
	.edit-btn:hover {
		background: rgba(28, 26, 22, 0.06);
	}

	/* ═══════════════ Responsive ═══════════════ */
	@media (max-width: 1080px) {
		.kpi-grid,
		.earnings-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.row {
			grid-template-columns: 68px 1.6fr 80px 1.2fr 1fr 50px;
			gap: 10px;
		}
	}
	@media (max-width: 820px) {
		.console {
			grid-template-columns: 1fr;
		}
		.sidebar {
			position: static;
			height: auto;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 14px 18px;
			gap: 10px;
		}
		.brand,
		.club-card,
		.side-foot {
			flex: 1;
			min-width: 160px;
		}
		.sidebar nav {
			flex-direction: row;
			flex-wrap: wrap;
			flex-basis: 100%;
		}
		.content {
			padding: 20px 20px 40px;
		}
		.row {
			grid-template-columns: 60px 1.4fr 70px 1fr;
			gap: 10px;
		}
		.col-tier,
		.col-price {
			display: none;
		}
		.earnings-hero {
			grid-template-columns: 1fr;
			padding: 24px;
		}
	}
</style>
