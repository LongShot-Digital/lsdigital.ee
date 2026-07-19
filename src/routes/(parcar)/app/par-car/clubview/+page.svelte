<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	// ═══════════ Types ═══════════
	type Status = 'booked' | 'received' | 'washing' | 'drying' | 'ready' | 'pickedUp';
	type Tier = 'express' | 'full' | 'signature';
	type FilterKey = 'all' | 'action' | 'active' | 'scheduled' | 'completed';
	type ToastKind = 'info' | 'success' | 'warning' | 'error';
	type ActivityKind =
		| 'status_advance'
		| 'status_revert'
		| 'crew_reassigned'
		| 'message_sent'
		| 'note_added'
		| 'cancelled'
		| 'settings_updated'
		| 'system';
	type SettingKey =
		| 'payoutAccount'
		| 'reservedParking'
		| 'operatingHours'
		| 'caddiemasterContact'
		| 'notifications';

	interface Booking {
		id: string;
		memberName: string;
		memberPhone: string;
		memberSince: string;
		memberID: string;
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
		bookedAt: string;
		receivedAt?: string;
		startedAt?: string;
		readyAt?: string;
		pickedUpAt?: string;
		rating?: number;
		tipEur?: number;
		note?: string;
	}

	interface Toast {
		id: number;
		msg: string;
		kind: ToastKind;
	}

	interface Activity {
		id: number;
		at: Date;
		kind: ActivityKind;
		memberName?: string;
		bookingId?: string;
		details: string;
	}

	interface MessageTemplate {
		title: string;
		body: string;
	}

	interface InboxItem {
		id: number;
		at: Date;
		kind: 'booking' | 'rating' | 'payment' | 'system';
		title: string;
		body: string;
		bookingId?: string;
		read: boolean;
	}

	// ═══════════ Constants ═══════════
	const statusOrder: Status[] = ['booked', 'received', 'washing', 'drying', 'ready', 'pickedUp'];
	const statusLabel: Record<Status, string> = {
		booked: 'BOOKED',
		received: 'AT LOT',
		washing: 'WASHING',
		drying: 'DRYING',
		ready: 'READY',
		pickedUp: 'PICKED UP'
	};
	const advanceLabel: Record<Status, string> = {
		booked: 'Mark as received',
		received: 'Start washing',
		washing: 'Move to drying',
		drying: 'Mark ready for pickup',
		ready: 'Mark picked up',
		pickedUp: '—'
	};
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
	const crewChoices = ['Marcus & Dani', 'Priit & Anna', 'Kalev & Elias'];

	const activityKindLabel: Record<ActivityKind, string> = {
		status_advance: 'STATUS',
		status_revert: 'REVERT',
		crew_reassigned: 'CREW',
		message_sent: 'SMS',
		note_added: 'NOTE',
		cancelled: 'CANCEL',
		settings_updated: 'SETTINGS',
		system: 'SYSTEM'
	};

	const settingLabel: Record<SettingKey, string> = {
		payoutAccount: 'Payout account',
		reservedParking: 'Reserved parking',
		operatingHours: 'Operating hours',
		caddiemasterContact: 'Caddiemaster contact',
		notifications: 'Notifications'
	};

	const messageTemplates: MessageTemplate[] = [
		{
			title: 'Your car is ready',
			body: 'Hi %name%, your %vehicle% is washed and back at spot %spot%. Keys are at the bag stand. See you next round.'
		},
		{
			title: 'Just started washing',
			body: 'Hi %name%, we just started on your %vehicle%. Expect it ready in ~%dur% min.'
		},
		{
			title: 'Running 10–15 min late',
			body: 'Hi %name%, your wash will be ~15 min later than expected — sorry for the wait. We\'ll ping you the moment it\'s ready.'
		},
		{
			title: 'Payment issue',
			body: 'Hi %name%, we had trouble with your card on file. Could you check your Par Car app when you have a moment? We\'ll hold the car ready until then.'
		}
	];

	// ═══════════ Clock ═══════════
	let now = $state(new Date());
	onMount(() => {
		const t = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(t);
	});

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function formatClock(d: Date) {
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
	function currentHHMM(): string {
		let h = now.getHours();
		const m = now.getMinutes();
		const ampm = h >= 12 ? 'PM' : 'AM';
		h = h % 12 || 12;
		return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
	}

	// ═══════════ UI state ═══════════
	let currentNav = $state<'live' | 'activity' | 'earnings' | 'settings'>('live');
	let searchQuery = $state('');
	let activeFilter = $state<FilterKey>('all');
	let selectedBookingId = $state<string | null>(null);
	let autoSim = $state(false);
	let toasts = $state<Toast[]>([]);
	let toastCounter = 0;

	// Confirmation dialogs
	let confirmingRevert = $state<{ id: string; toStatus: Status } | null>(null);
	let confirmingCancel = $state<string | null>(null);
	let showingCrewMenu = $state(false);
	let showingContactMenu = $state(false);

	// Notes editor state
	let editingNoteFor = $state<string | null>(null);
	let noteDraft = $state('');

	// Settings state (editable)
	let settings = $state<Record<SettingKey, string>>({
		payoutAccount: 'EE38 2200 2210 2014 5685 · Nordea Bank',
		reservedParking: '6 spots · East and West lots (rows E, W)',
		operatingHours: 'Mon–Sun · 7:00 AM – 6:00 PM',
		caddiemasterContact: 'Andres Kask · andres@cedarridge.example',
		notifications: 'SMS on ready + daily summary at 6 PM'
	});
	let editingSettingKey = $state<SettingKey | null>(null);
	let settingDraft = $state('');

	// Activity log (audit trail)
	let activityCounter = 100;
	let activityLog = $state<Activity[]>([
		{ id: 5, at: new Date(Date.now() - 4 * 60_000), kind: 'status_advance',
			memberName: 'Katherine Ellsworth', bookingId: 'PC-B72C',
			details: 'Advanced to READY' },
		{ id: 4, at: new Date(Date.now() - 12 * 60_000), kind: 'message_sent',
			memberName: 'Robert Whitcomb', bookingId: 'PC-A31F',
			details: 'SMS · "Your car is ready"' },
		{ id: 3, at: new Date(Date.now() - 25 * 60_000), kind: 'crew_reassigned',
			memberName: 'Henry Winston', bookingId: 'PC-E55N',
			details: 'Crew reassigned to Marcus & Dani' },
		{ id: 2, at: new Date(Date.now() - 45 * 60_000), kind: 'status_advance',
			memberName: 'Thomas Ashworth', bookingId: 'PC-C41K',
			details: 'Advanced to DRYING' },
		{ id: 1, at: new Date(Date.now() - 3 * 60 * 60_000), kind: 'system',
			details: 'Auto-summary sent: 3 washes completed, €395 gross' }
	]);

	// Notifications inbox (the operator's attention queue — different from
	// the audit trail: this is "what needs me", the log is "what happened")
	let showInbox = $state(false);
	let inboxCounter = 10;
	let inbox = $state<InboxItem[]>([
		{ id: 3, at: new Date(Date.now() - 9 * 60_000), kind: 'booking',
			title: 'New booking', body: 'David Brookline · Full Valet · tee 11:36 AM',
			bookingId: 'PC-L13U', read: false },
		{ id: 2, at: new Date(Date.now() - 31 * 60_000), kind: 'rating',
			title: 'New 5★ rating', body: 'Frederick Lassiter · Signature Detail · tipped €20',
			bookingId: 'PC-Q88Y', read: false },
		{ id: 1, at: new Date(Date.now() - 2 * 60 * 60_000), kind: 'system',
			title: 'Morning summary', body: '3 washes completed before 11 AM · €395 gross',
			read: true }
	]);
	let unreadCount = $derived(inbox.filter((i) => !i.read).length);

	function addInbox(
		kind: InboxItem['kind'],
		title: string,
		body: string,
		bookingId?: string
	) {
		inbox = [
			{ id: ++inboxCounter, at: new Date(now), kind, title, body, bookingId, read: false },
			...inbox
		].slice(0, 30);
	}
	function openInboxItem(item: InboxItem) {
		item.read = true;
		if (item.bookingId) {
			const found = bookings.find((b) => b.id === item.bookingId);
			if (found) {
				showInbox = false;
				currentNav = 'live';
				selectBooking(item.bookingId);
			}
		}
	}
	function markAllRead() {
		for (const i of inbox) i.read = true;
	}

	// ─── Exports ──────────────────────────────────────────────────
	function exportCSV() {
		const header = ['Booking ID', 'Member', 'Vehicle', 'Plate', 'Spot', 'Service',
			'Price EUR', 'Tee time', 'Status', 'Booked', 'Received', 'Wash started',
			'Ready', 'Picked up', 'Rating', 'Tip EUR', 'Crew'];
		const rows = bookings.map((b) => [
			b.id, b.memberName,
			`${b.vehicleYear} ${b.vehicleMake} ${b.vehicleModel}`,
			b.plate, b.spot, tierLabel[b.tier], b.price, b.teeTime,
			statusLabel[b.status], b.bookedAt, b.receivedAt ?? '', b.startedAt ?? '',
			b.readyAt ?? '', b.pickedUpAt ?? '', b.rating ?? '', b.tipEur ?? '', b.crew ?? ''
		]);
		const csv = [header, ...rows]
			.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
			.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `parcar-daily-${now.toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		logActivity('system', 'Day exported to CSV');
		toast('CSV downloaded', 'success');
	}
	function printDaily() {
		logActivity('system', 'Daily report printed');
		window.print();
	}

	// ═══════════ Booking data (mutable state) ═══════════
	let bookings = $state<Booking[]>([
		// ─── READY FOR PICKUP (2) ───
		{
			id: 'PC-A31F', memberName: 'Robert Whitcomb',
			memberPhone: '+372 5620 8845', memberSince: 'Jan 2024', memberID: '0418',
			vehicleYear: 2024, vehicleMake: 'Range Rover', vehicleModel: 'Velar',
			vehicleColor: 'Obsidian Black', plate: '0418 EE',
			spot: 'E-14', tier: 'full', price: 85,
			teeTime: '8:12 AM', returnWindow: '11:20 – 2:15',
			status: 'ready', crew: 'Marcus & Dani',
			bookedAt: '7:41 AM',
			receivedAt: '8:36 AM', startedAt: '9:04 AM', readyAt: '10:03 AM'
		},
		{
			id: 'PC-B72C', memberName: 'Katherine Ellsworth',
			memberPhone: '+372 5514 3092', memberSince: 'May 2023', memberID: '0271',
			vehicleYear: 2023, vehicleMake: 'Audi', vehicleModel: 'RS6 Avant',
			vehicleColor: 'Nardo Grey', plate: '271 CGR',
			spot: 'W-08', tier: 'signature', price: 140,
			teeTime: '8:24 AM', returnWindow: '11:30 – 2:30',
			status: 'ready', crew: 'Priit & Anna',
			bookedAt: '7:52 AM',
			receivedAt: '8:48 AM', startedAt: '9:16 AM', readyAt: '10:41 AM'
		},

		// ─── IN PROGRESS · WASHING/DRYING (4) ───
		{
			id: 'PC-C41K', memberName: 'Thomas Ashworth',
			memberPhone: '+372 5011 8452', memberSince: 'Oct 2024', memberID: '0992',
			vehicleYear: 2024, vehicleMake: 'BMW', vehicleModel: 'X5 M60i',
			vehicleColor: 'Alpine White', plate: '992 TMB',
			spot: 'E-08', tier: 'full', price: 85,
			teeTime: '9:00 AM', returnWindow: '12:10 – 3:00',
			status: 'drying', crew: 'Marcus & Dani',
			bookedAt: '8:31 AM',
			receivedAt: '9:24 AM', startedAt: '10:12 AM'
		},
		{
			id: 'PC-D18M', memberName: 'Elizabeth Marchand',
			memberPhone: '+372 5820 3140', memberSince: 'Mar 2022', memberID: '0146',
			vehicleYear: 2023, vehicleMake: 'Volvo', vehicleModel: 'XC90 Recharge',
			vehicleColor: 'Crystal White Pearl', plate: '146 EMR',
			spot: 'N-22', tier: 'express', price: 45,
			teeTime: '9:12 AM', returnWindow: '12:20 – 2:40',
			status: 'washing', crew: 'Priit & Anna',
			bookedAt: '8:42 AM',
			receivedAt: '9:36 AM', startedAt: '10:31 AM'
		},
		{
			id: 'PC-E55N', memberName: 'Henry Winston',
			memberPhone: '+372 5348 6221', memberSince: 'Nov 2023', memberID: '0830',
			vehicleYear: 2024, vehicleMake: 'Audi', vehicleModel: 'Q7 55 TFSI',
			vehicleColor: 'Mythos Black', plate: '830 HWN',
			spot: 'S-05', tier: 'signature', price: 140,
			teeTime: '9:24 AM', returnWindow: '12:30 – 3:20',
			status: 'washing', crew: 'Marcus & Dani',
			bookedAt: '8:55 AM',
			receivedAt: '9:48 AM', startedAt: '10:44 AM'
		},
		{
			id: 'PC-F09P', memberName: 'James Kellner',
			memberPhone: '+372 5145 8080', memberSince: 'Feb 2024', memberID: '0408',
			vehicleYear: 2024, vehicleMake: 'Porsche', vehicleModel: 'Cayenne S',
			vehicleColor: 'Jet Black Metallic', plate: '408 JMK',
			spot: 'E-19', tier: 'full', price: 85,
			teeTime: '9:36 AM', returnWindow: '12:40 – 3:20',
			status: 'washing', crew: 'Priit & Anna',
			bookedAt: '9:04 AM',
			receivedAt: '10:00 AM', startedAt: '10:52 AM'
		},

		// ─── RECEIVED · car at lot, awaiting crew (3) ───
		{
			id: 'PC-H82R', memberName: 'William Pemberton',
			memberPhone: '+372 5090 4110', memberSince: 'Aug 2024', memberID: '0107',
			vehicleYear: 2024, vehicleMake: 'Lexus', vehicleModel: 'LX 600',
			vehicleColor: 'Eminent White Pearl', plate: '107 WPB',
			spot: 'N-08', tier: 'full', price: 85,
			teeTime: '10:00 AM', returnWindow: '1:00 – 3:45',
			status: 'received',
			bookedAt: '9:23 AM', receivedAt: '10:15 AM'
		},
		{
			id: 'PC-J47S', memberName: 'Charles Ashton',
			memberPhone: '+372 5687 2211', memberSince: 'Apr 2025', memberID: '0625',
			vehicleYear: 2023, vehicleMake: 'Range Rover', vehicleModel: 'Sport SVR',
			vehicleColor: 'Carpathian Grey', plate: '625 CHA',
			spot: 'E-04', tier: 'express', price: 45,
			teeTime: '10:12 AM', returnWindow: '1:10 – 3:20',
			status: 'received',
			bookedAt: '9:38 AM', receivedAt: '10:28 AM'
		},
		{
			id: 'PC-K90T', memberName: 'Andrew Sinclair',
			memberPhone: '+372 5442 9074', memberSince: 'Jul 2023', memberID: '0774',
			vehicleYear: 2023, vehicleMake: 'Mercedes-AMG', vehicleModel: 'GT 63',
			vehicleColor: 'Obsidian Black', plate: '774 ASR',
			spot: 'W-02', tier: 'signature', price: 140,
			teeTime: '10:24 AM', returnWindow: '1:20 – 4:00',
			status: 'received',
			bookedAt: '9:50 AM', receivedAt: '10:42 AM'
		},

		// ─── BOOKED · not yet at lot (3) ───
		{
			id: 'PC-L13U', memberName: 'David Brookline',
			memberPhone: '+372 5231 6633', memberSince: 'Dec 2024', memberID: '0319',
			vehicleYear: 2024, vehicleMake: 'BMW', vehicleModel: '7 Series 750e',
			vehicleColor: 'Carbon Black Metallic', plate: '319 DBK',
			spot: '—', tier: 'full', price: 85,
			teeTime: '11:36 AM', returnWindow: '2:40 – 5:20',
			status: 'booked', bookedAt: '9:15 AM'
		},
		{
			id: 'PC-M64V', memberName: 'Michael Farley',
			memberPhone: '+372 5807 5581', memberSince: 'Sep 2024', memberID: '0882',
			vehicleYear: 2024, vehicleMake: 'Porsche', vehicleModel: 'Panamera GTS',
			vehicleColor: 'Chalk', plate: '882 MFY',
			spot: '—', tier: 'signature', price: 140,
			teeTime: '11:48 AM', returnWindow: '2:50 – 5:40',
			status: 'booked', bookedAt: '9:32 AM'
		},
		{
			id: 'PC-N75W', memberName: 'Alexander Vardanyan',
			memberPhone: '+372 5116 9024', memberSince: 'Mar 2024', memberID: '0204',
			vehicleYear: 2023, vehicleMake: 'Audi', vehicleModel: 'e-tron GT',
			vehicleColor: 'Mythos Black', plate: '204 AVD',
			spot: '—', tier: 'express', price: 45,
			teeTime: '12:00 PM', returnWindow: '3:00 – 5:15',
			status: 'booked', bookedAt: '9:58 AM'
		},

		// ─── COMPLETED TODAY (4) ───
		{
			id: 'PC-P29X', memberName: 'Peter Halloway',
			memberPhone: '+372 5400 1120', memberSince: 'Jun 2022', memberID: '0640',
			vehicleYear: 2023, vehicleMake: 'BMW', vehicleModel: 'X7 M60i',
			vehicleColor: 'Alpine White', plate: '640 PHW',
			spot: 'E-11', tier: 'full', price: 85,
			teeTime: '7:00 AM', returnWindow: '10:00 – 1:00',
			status: 'pickedUp', crew: 'Marcus & Dani',
			bookedAt: '6:14 AM',
			receivedAt: '7:22 AM', startedAt: '8:04 AM',
			readyAt: '9:01 AM', pickedUpAt: '11:03 AM',
			rating: 5, tipEur: 10
		},
		{
			id: 'PC-Q88Y', memberName: 'Frederick Lassiter',
			memberPhone: '+372 5772 4485', memberSince: 'Feb 2023', memberID: '0395',
			vehicleYear: 2024, vehicleMake: 'Range Rover', vehicleModel: 'Autobiography',
			vehicleColor: 'Santorini Black', plate: '395 FLS',
			spot: 'W-01', tier: 'signature', price: 140,
			teeTime: '7:12 AM', returnWindow: '10:20 – 1:40',
			status: 'pickedUp', crew: 'Priit & Anna',
			bookedAt: '6:22 AM',
			receivedAt: '7:34 AM', startedAt: '8:16 AM',
			readyAt: '9:44 AM', pickedUpAt: '11:12 AM',
			rating: 5, tipEur: 20
		},
		{
			id: 'PC-R33Z', memberName: 'Nathaniel Rowe',
			memberPhone: '+372 5001 4478', memberSince: 'Nov 2024', memberID: '0158',
			vehicleYear: 2022, vehicleMake: 'Porsche', vehicleModel: 'Taycan Turbo',
			vehicleColor: 'Volcano Grey', plate: '158 NRW',
			spot: 'E-15', tier: 'express', price: 45,
			teeTime: '7:24 AM', returnWindow: '10:30 – 1:15',
			status: 'pickedUp', crew: 'Kalev & Elias',
			bookedAt: '6:40 AM',
			receivedAt: '7:44 AM', startedAt: '8:22 AM',
			readyAt: '8:56 AM', pickedUpAt: '10:47 AM',
			rating: 4, tipEur: 5
		},
		{
			id: 'PC-S45A', memberName: 'Julian Bartholomew',
			memberPhone: '+372 5390 6614', memberSince: 'Aug 2022', memberID: '0271',
			vehicleYear: 2024, vehicleMake: 'Mercedes-Benz', vehicleModel: 'GLE 580',
			vehicleColor: 'Selenite Grey', plate: '271 JBW',
			spot: 'N-10', tier: 'full', price: 85,
			teeTime: '7:48 AM', returnWindow: '11:00 – 1:45',
			status: 'pickedUp', crew: 'Marcus & Dani',
			bookedAt: '7:03 AM',
			receivedAt: '8:12 AM', startedAt: '8:41 AM',
			readyAt: '9:42 AM', pickedUpAt: '11:38 AM',
			rating: 5, tipEur: 15
		}
	]);

	// ═══════════ Actions ═══════════
	function toast(msg: string, kind: ToastKind = 'info') {
		const id = ++toastCounter;
		toasts = [...toasts, { id, msg, kind }];
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3200);
	}

	function logActivity(
		kind: ActivityKind,
		details: string,
		booking?: Booking
	) {
		const id = ++activityCounter;
		activityLog = [
			{
				id,
				at: new Date(now),
				kind,
				memberName: booking?.memberName,
				bookingId: booking?.id,
				details
			},
			...activityLog
		].slice(0, 100);
	}

	function nextStatus(s: Status): Status | null {
		const i = statusOrder.indexOf(s);
		return i < 0 || i >= statusOrder.length - 1 ? null : statusOrder[i + 1];
	}
	function prevStatus(s: Status): Status | null {
		const i = statusOrder.indexOf(s);
		return i <= 0 ? null : statusOrder[i - 1];
	}

	function advanceStatus(id: string) {
		const b = bookings.find((x) => x.id === id);
		if (!b) return;
		const next = nextStatus(b.status);
		if (!next) return;
		b.status = next;
		const t = currentHHMM();
		if (next === 'received') b.receivedAt = t;
		if (next === 'washing') b.startedAt = t;
		if (next === 'ready') b.readyAt = t;
		if (next === 'pickedUp') {
			b.pickedUpAt = t;
			if (!b.rating) b.rating = 5;
			if (b.tipEur === undefined) b.tipEur = 10;
		}
		if (!b.crew && (next === 'received' || next === 'washing')) {
			b.crew = crewChoices[0];
		}
		logActivity('status_advance', `Advanced to ${statusLabel[next]}`, b);
		toast(`${b.memberName} · ${statusLabel[next]}`, 'success');
		if (next === 'ready') {
			addInbox('booking', 'Ready for pickup',
				`${b.memberName} · ${b.vehicleMake} ${b.vehicleModel} at ${b.spot}`, b.id);
		}
		if (next === 'pickedUp') {
			addInbox('rating', `New ${b.rating}★ rating`,
				`${b.memberName} · ${tierLabel[b.tier]}${b.tipEur ? ` · tipped €${b.tipEur}` : ''}`, b.id);
		}
	}

	function requestRevert(id: string) {
		const b = bookings.find((x) => x.id === id);
		if (!b) return;
		const prev = prevStatus(b.status);
		if (!prev) return;
		confirmingRevert = { id, toStatus: prev };
	}
	function performRevert() {
		if (!confirmingRevert) return;
		const b = bookings.find((x) => x.id === confirmingRevert!.id);
		if (b) {
			b.status = confirmingRevert.toStatus;
			logActivity(
				'status_revert',
				`Reverted to ${statusLabel[confirmingRevert.toStatus]}`,
				b
			);
			toast(`${b.memberName} → ${statusLabel[confirmingRevert.toStatus]}`, 'warning');
		}
		confirmingRevert = null;
	}

	function reassignCrew(id: string, crew: string) {
		const b = bookings.find((x) => x.id === id);
		if (!b) return;
		b.crew = crew;
		showingCrewMenu = false;
		logActivity('crew_reassigned', `Crew set to ${crew}`, b);
		toast(`Crew set to ${crew}`, 'info');
	}

	function sendMessageTemplate(id: string, template: MessageTemplate) {
		const b = bookings.find((x) => x.id === id);
		if (!b) return;
		showingContactMenu = false;
		logActivity('message_sent', `SMS · "${template.title}"`, b);
		toast(`SMS sent to ${b.memberName} · "${template.title}"`, 'success');
	}

	function renderTemplate(template: MessageTemplate, b: Booking): string {
		const first = b.memberName.split(' ')[0];
		const vehicle = `${b.vehicleMake} ${b.vehicleModel}`;
		const dur = tierBadge[b.tier];
		return template.body
			.replace(/%name%/g, first)
			.replace(/%vehicle%/g, vehicle)
			.replace(/%spot%/g, b.spot)
			.replace(/%dur%/g, dur);
	}

	function startEditNote(bookingId: string) {
		const b = bookings.find((x) => x.id === bookingId);
		if (!b) return;
		editingNoteFor = bookingId;
		noteDraft = b.note ?? '';
	}
	function saveNote() {
		if (!editingNoteFor) return;
		const b = bookings.find((x) => x.id === editingNoteFor);
		if (b) {
			b.note = noteDraft.trim() || undefined;
			logActivity('note_added', b.note ? 'Note updated' : 'Note cleared', b);
			toast(`Note ${b.note ? 'saved' : 'cleared'} for ${b.memberName}`, 'success');
		}
		editingNoteFor = null;
	}
	function cancelEditNote() {
		editingNoteFor = null;
	}

	function startEditSetting(key: SettingKey) {
		editingSettingKey = key;
		settingDraft = settings[key];
	}
	function saveSetting() {
		if (!editingSettingKey) return;
		const key = editingSettingKey;
		const oldVal = settings[key];
		if (settingDraft.trim() && settingDraft !== oldVal) {
			settings[key] = settingDraft.trim();
			logActivity('settings_updated', `${settingLabel[key]} updated`);
			toast(`${settingLabel[key]} saved`, 'success');
		}
		editingSettingKey = null;
	}
	function cancelEditSetting() {
		editingSettingKey = null;
	}

	function requestCancel(id: string) {
		confirmingCancel = id;
	}
	function performCancel() {
		if (!confirmingCancel) return;
		const b = bookings.find((x) => x.id === confirmingCancel);
		if (b) {
			logActivity('cancelled', `Booking cancelled`, b);
			bookings = bookings.filter((x) => x.id !== confirmingCancel);
			toast(`Cancelled: ${b.memberName}`, 'warning');
		}
		if (selectedBookingId === confirmingCancel) selectedBookingId = null;
		confirmingCancel = null;
	}

	function selectBooking(id: string) {
		selectedBookingId = id;
		showingCrewMenu = false;
		showingContactMenu = false;
		editingNoteFor = null;
	}
	function closeModal() {
		selectedBookingId = null;
		showingCrewMenu = false;
		showingContactMenu = false;
		editingNoteFor = null;
	}

	function formatActivityTime(d: Date): string {
		const diffMs = now.getTime() - d.getTime();
		const mins = Math.floor(diffMs / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins} min ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) {
			const rem = mins % 60;
			return rem === 0 ? `${hrs}h ago` : `${hrs}h ${rem}m ago`;
		}
		const days = Math.floor(hrs / 24);
		return `${days}d ago`;
	}
	function formatActivityAbs(d: Date): string {
		let h = d.getHours();
		const m = d.getMinutes();
		const ampm = h >= 12 ? 'PM' : 'AM';
		h = h % 12 || 12;
		return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
	}

	function toggleAutoSim() {
		autoSim = !autoSim;
		toast(autoSim ? 'Auto-advance ON · every 15 seconds' : 'Auto-advance OFF', 'info');
	}

	// Auto-sim effect
	$effect(() => {
		if (!autoSim) return;
		const timer = setInterval(() => {
			const candidates = bookings.filter(
				(b) => b.status !== 'pickedUp' && nextStatus(b.status) !== null
			);
			if (candidates.length === 0) return;
			const chosen = candidates[Math.floor(Math.random() * candidates.length)];
			advanceStatus(chosen.id);
		}, 15000);
		return () => clearInterval(timer);
	});

	// ═══════════ Derived ═══════════
	let selectedBooking = $derived(bookings.find((b) => b.id === selectedBookingId));

	let filteredBookings = $derived.by(() => {
		let list = bookings;
		const q = searchQuery.trim().toLowerCase();
		if (q) {
			list = list.filter(
				(b) =>
					b.memberName.toLowerCase().includes(q) ||
					b.plate.toLowerCase().includes(q) ||
					b.spot.toLowerCase().includes(q) ||
					b.id.toLowerCase().includes(q) ||
					b.vehicleModel.toLowerCase().includes(q) ||
					b.vehicleMake.toLowerCase().includes(q)
			);
		}
		if (activeFilter === 'action') {
			list = list.filter((b) => b.status === 'ready' || b.status === 'received');
		} else if (activeFilter === 'active') {
			list = list.filter((b) => b.status === 'washing' || b.status === 'drying');
		} else if (activeFilter === 'scheduled') {
			list = list.filter((b) => b.status === 'booked');
		} else if (activeFilter === 'completed') {
			list = list.filter((b) => b.status === 'pickedUp');
		}
		return list;
	});

	let readyList = $derived(filteredBookings.filter((b) => b.status === 'ready'));
	let progressList = $derived(
		filteredBookings.filter((b) => b.status === 'washing' || b.status === 'drying')
	);
	let receivedList = $derived(filteredBookings.filter((b) => b.status === 'received'));
	let scheduledList = $derived(filteredBookings.filter((b) => b.status === 'booked'));
	let completedList = $derived(filteredBookings.filter((b) => b.status === 'pickedUp'));

	let carsOnProperty = $derived(
		bookings.filter((b) =>
			['received', 'washing', 'drying', 'ready'].includes(b.status)
		).length
	);
	let readyCount = $derived(bookings.filter((b) => b.status === 'ready').length);
	let actionCount = $derived(readyCount + bookings.filter((b) => b.status === 'received').length);
	let revenueToday = $derived(
		bookings.filter((b) => b.status !== 'booked').reduce((s, b) => s + b.price, 0)
	);
	let clubShare = $derived(Math.round(revenueToday * 0.2));

	// Animated KPI numbers — count toward the new value instead of snapping.
	// Restrained: 450–550ms ease-out, no bounce.
	const kpiCars = tweened(0, { duration: 450, easing: cubicOut });
	const kpiReady = tweened(0, { duration: 450, easing: cubicOut });
	const kpiRevenue = tweened(0, { duration: 550, easing: cubicOut });
	const kpiShare = tweened(0, { duration: 550, easing: cubicOut });
	$effect(() => { kpiCars.set(carsOnProperty); });
	$effect(() => { kpiReady.set(readyCount); });
	$effect(() => { kpiRevenue.set(revenueToday); });
	$effect(() => { kpiShare.set(clubShare); });

	// ═══════════ Helpers ═══════════
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

	/// First token of the model — "911 Carrera" → "911" (plaque thumb label).
	function modelShort(m: string): string {
		return m.split(' ')[0] || m;
	}

	function parseHHMM(s: string): Date | null {
		if (!s) return null;
		const m = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
		if (!m) return null;
		let h = parseInt(m[1]);
		const min = parseInt(m[2]);
		const isPM = m[3].toUpperCase() === 'PM';
		if (isPM && h < 12) h += 12;
		if (!isPM && h === 12) h = 0;
		const d = new Date(now);
		d.setHours(h, min, 0, 0);
		return d;
	}

	function timeSince(hhmm?: string): string {
		if (!hhmm) return '—';
		const then = parseHHMM(hhmm);
		if (!then) return '—';
		const diffMs = now.getTime() - then.getTime();
		const mins = Math.max(0, Math.floor(diffMs / 60000));
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins} min ago`;
		const hrs = Math.floor(mins / 60);
		const rem = mins % 60;
		return rem === 0 ? `${hrs}h ago` : `${hrs}h ${rem}m ago`;
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
			<div class="club-meta">Andres Kask · Caddiemaster</div>
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
				class:active={currentNav === 'activity'}
				onclick={() => (currentNav = 'activity')}
			>
				<span class="icon">◈</span>
				<span>Activity log</span>
				<span class="badge subtle">{activityLog.length}</span>
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

		<!-- Auto-sim toggle -->
		<div class="autosim">
			<div class="autosim-head">
				<div class="autosim-label">
					<div class="autosim-name">AUTO-ADVANCE</div>
					<div class="autosim-sub">Simulate live traffic</div>
				</div>
				<button class="toggle" class:on={autoSim} onclick={toggleAutoSim}>
					<div class="toggle-knob"></div>
				</button>
			</div>
		</div>

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
						<button class="tool-btn" onclick={exportCSV}>Export CSV</button>
						<button class="tool-btn" onclick={printDaily}>Print report</button>
						<div class="bell-wrap">
							<button
								class="bell"
								class:has-unread={unreadCount > 0}
								onclick={() => (showInbox = !showInbox)}
								aria-label="Notifications"
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
									<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
									<path d="M13.7 21a2 2 0 0 1-3.4 0" />
								</svg>
								{#if unreadCount > 0}
									<span class="bell-badge">{unreadCount}</span>
								{/if}
							</button>
							{#if showInbox}
								<div
									class="inbox-backdrop"
									onclick={() => (showInbox = false)}
									role="button"
									tabindex="-1"
								></div>
								<div class="inbox" transition:fly={{ y: -6, duration: 160 }}>
									<div class="inbox-head">
										<span>Notifications</span>
										<button class="link-btn" onclick={markAllRead}>Mark all read</button>
									</div>
									{#each inbox as item (item.id)}
										<button
											class="inbox-row"
											class:unread={!item.read}
											onclick={() => openInboxItem(item)}
										>
											<span class="ib-dot {item.kind}"></span>
											<span class="ib-body">
												<span class="ib-title">{item.title}</span>
												<span class="ib-text">{item.body}</span>
											</span>
											<span class="ib-time">{formatActivityTime(item.at)}</span>
										</button>
									{/each}
									{#if inbox.length === 0}
										<div class="inbox-empty">All caught up.</div>
									{/if}
								</div>
							{/if}
						</div>
						<div class="clock">{formatClock(now)}</div>
						<div class="last-updated">
							<span class="live-dot"></span>
							{autoSim ? 'Auto · live' : 'Live'}
						</div>
					</div>
				</div>

				<!-- ─── Search + filters ─── -->
				<div class="tools">
					<div class="search-wrap">
						<span class="search-icon">⌕</span>
						<input
							type="text"
							class="search"
							placeholder="Search name, plate, spot, or booking ID…"
							bind:value={searchQuery}
						/>
						{#if searchQuery}
							<button class="clear-btn" onclick={() => (searchQuery = '')}>✕</button>
						{/if}
					</div>
					<div class="filter-chips">
						<button
							class="chip"
							class:on={activeFilter === 'all'}
							onclick={() => (activeFilter = 'all')}
						>All <span class="chip-c">{bookings.length}</span></button>
						<button
							class="chip"
							class:on={activeFilter === 'action'}
							class:accent={actionCount > 0 && activeFilter !== 'action'}
							onclick={() => (activeFilter = 'action')}
						>Action <span class="chip-c">{actionCount}</span></button>
						<button
							class="chip"
							class:on={activeFilter === 'active'}
							onclick={() => (activeFilter = 'active')}
						>Washing <span class="chip-c">{progressList.length}</span></button>
						<button
							class="chip"
							class:on={activeFilter === 'scheduled'}
							onclick={() => (activeFilter = 'scheduled')}
						>Scheduled <span class="chip-c">{scheduledList.length}</span></button>
						<button
							class="chip"
							class:on={activeFilter === 'completed'}
							onclick={() => (activeFilter = 'completed')}
						>Completed <span class="chip-c">{completedList.length}</span></button>
					</div>
				</div>

				<!-- ─── KPI row ─── -->
				<div class="kpi-grid">
					<div class="kpi">
						<div class="kpi-lbl">CARS ON PROPERTY</div>
						<div class="kpi-val">{Math.round($kpiCars)}</div>
						<div class="kpi-sub">
							{progressList.length} washing · {readyCount} ready
						</div>
					</div>
					<div class="kpi accent">
						<div class="kpi-lbl">READY FOR PICKUP</div>
						<div class="kpi-val">{Math.round($kpiReady)}</div>
						<div class="kpi-sub">action needed</div>
					</div>
					<div class="kpi">
						<div class="kpi-lbl">REVENUE TODAY</div>
						<div class="kpi-val">€{Math.round($kpiRevenue).toLocaleString('en-US')}</div>
						<div class="kpi-sub">
							{bookings.filter((b) => b.status !== 'booked').length} washes billed
						</div>
					</div>
					<div class="kpi highlight">
						<div class="kpi-lbl">YOUR SHARE · 20%</div>
						<div class="kpi-val">€{Math.round($kpiShare).toLocaleString('en-US')}</div>
						<div class="kpi-sub">settles on the 5th</div>
					</div>
				</div>

				<!-- ─── Sections ─── -->
				{#if readyList.length > 0}
					<section class="section ready-section">
						<div class="section-head">
							<h2>
								<span class="status-pill ready">READY</span>
								Ready for pickup
							</h2>
							<span class="count">{readyList.length}</span>
						</div>
						<div class="rows">
							{#each readyList as b (b.id)}
								<button
									class="row row-ready"
									in:fly={{ y: 6, duration: 200 }}
									out:fade={{ duration: 140 }}
									onclick={() => selectBooking(b.id)}
								>
									<div class="paint-tile">
										<div
											class="pt-bar"
											class:light={isPaintLight(b.vehicleColor)}
											style="background: {paintColor(b.vehicleColor)}"
										></div>
										<div class="pt-bd">
											<span class="pt-l1">{modelShort(b.vehicleModel)}</span>
											<span class="pt-l2">{b.plate}</span>
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
										<div class="col-sub">since {b.readyAt} · {timeSince(b.readyAt)}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
									<div class="col-chev">›</div>
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if progressList.length > 0}
					<section class="section">
						<div class="section-head">
							<h2>
								<span class="status-pill washing">IN PROGRESS</span>
								Washing &amp; drying
							</h2>
							<span class="count">{progressList.length}</span>
						</div>
						<div class="rows">
							{#each progressList as b (b.id)}
								<button
									class="row"
									in:fly={{ y: 6, duration: 200 }}
									out:fade={{ duration: 140 }}
									onclick={() => selectBooking(b.id)}
								>
									<div class="paint-tile">
										<div
											class="pt-bar"
											class:light={isPaintLight(b.vehicleColor)}
											style="background: {paintColor(b.vehicleColor)}"
										></div>
										<div class="pt-bd">
											<span class="pt-l1">{modelShort(b.vehicleModel)}</span>
											<span class="pt-l2">{b.plate}</span>
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
										<div class="col-sub">{timeSince(b.startedAt)} · {b.crew ?? '—'}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
									<div class="col-chev">›</div>
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if receivedList.length > 0}
					<section class="section">
						<div class="section-head">
							<h2>
								<span class="status-pill received">AT LOT</span>
								Awaiting crew
							</h2>
							<span class="count">{receivedList.length}</span>
						</div>
						<div class="rows">
							{#each receivedList as b (b.id)}
								<button
									class="row"
									in:fly={{ y: 6, duration: 200 }}
									out:fade={{ duration: 140 }}
									onclick={() => selectBooking(b.id)}
								>
									<div class="paint-tile">
										<div
											class="pt-bar"
											class:light={isPaintLight(b.vehicleColor)}
											style="background: {paintColor(b.vehicleColor)}"
										></div>
										<div class="pt-bd">
											<span class="pt-l1">{modelShort(b.vehicleModel)}</span>
											<span class="pt-l2">{b.plate}</span>
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
										<div class="col-sub">arrived {timeSince(b.receivedAt)}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
									<div class="col-chev">›</div>
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if scheduledList.length > 0}
					<section class="section">
						<div class="section-head">
							<h2>
								<span class="status-pill booked">SCHEDULED</span>
								Booked, not yet on property
							</h2>
							<span class="count">{scheduledList.length}</span>
						</div>
						<div class="rows">
							{#each scheduledList as b (b.id)}
								<button
									class="row row-scheduled"
									in:fly={{ y: 6, duration: 200 }}
									out:fade={{ duration: 140 }}
									onclick={() => selectBooking(b.id)}
								>
									<div class="paint-tile">
										<div
											class="pt-bar"
											class:light={isPaintLight(b.vehicleColor)}
											style="background: {paintColor(b.vehicleColor)}"
										></div>
										<div class="pt-bd">
											<span class="pt-l1">{modelShort(b.vehicleModel)}</span>
											<span class="pt-l2">{b.plate}</span>
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
									<div class="col-chev">›</div>
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if completedList.length > 0}
					<section class="section muted">
						<div class="section-head">
							<h2>
								<span class="status-pill picked">DONE</span>
								Completed today
							</h2>
							<span class="count">{completedList.length}</span>
						</div>
						<div class="rows">
							{#each completedList as b (b.id)}
								<button
									class="row row-completed"
									in:fly={{ y: 6, duration: 200 }}
									out:fade={{ duration: 140 }}
									onclick={() => selectBooking(b.id)}
								>
									<div class="paint-tile">
										<div
											class="pt-bar"
											class:light={isPaintLight(b.vehicleColor)}
											style="background: {paintColor(b.vehicleColor)}"
										></div>
										<div class="pt-bd">
											<span class="pt-l1">{modelShort(b.vehicleModel)}</span>
											<span class="pt-l2">{b.plate}</span>
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
										<div class="col-sub">tip €{b.tipEur ?? 0} · {b.crew ?? '—'}</div>
									</div>
									<div class="col-tier">
										<div class="tier-name">{tierLabel[b.tier]}</div>
										<div class="tier-meta">{tierBadge[b.tier]}</div>
									</div>
									<div class="col-price">€{b.price}</div>
									<div class="col-chev">›</div>
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if filteredBookings.length === 0}
					<div class="empty">
						<div class="empty-h">Nothing matches.</div>
						<div class="empty-sub">Try clearing the search or the filter.</div>
					</div>
				{/if}
			</div>
		{:else if currentNav === 'earnings'}
			<div class="content">
				<div class="page-head">
					<div>
						<div class="head-eyebrow">JUNE · 2026</div>
						<h1>Earnings</h1>
					</div>
					<div class="head-right">
						<div class="clock">{formatClock(now)}</div>
					</div>
				</div>

				<div class="earnings-hero">
					<div class="eh-left">
						<div class="eh-eyebrow">JUNE PAYOUT · SETTLES JULY 5</div>
						<div class="eh-val">€6,942</div>
						<div class="eh-sub">20% of €34,710 gross across 412 washes this month</div>
					</div>
					<div class="eh-right">
						<!-- Estonian season: Jan–Mar the course is closed, April is the
						     soft opening, June is peak. No revenue bars in winter. -->
						<div class="eh-chart">
							{#each [0, 0, 0, 2100, 5400, 6942] as v}
								<div class="bar" class:off={v === 0} style="height: {(v / 7000) * 100}%">
									<div class="bar-val">{v === 0 ? '—' : `€${(v / 1000).toFixed(1)}k`}</div>
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
		{:else if currentNav === 'activity'}
			<div class="content">
				<div class="page-head">
					<div>
						<div class="head-eyebrow">AUDIT TRAIL · LAST 100 EVENTS</div>
						<h1>Activity log</h1>
					</div>
					<div class="head-right">
						<div class="clock">{formatClock(now)}</div>
						<div class="last-updated">
							<span class="live-dot"></span> {activityLog.length} events
						</div>
					</div>
				</div>

				<div class="activity-list">
					{#each activityLog as a (a.id)}
						<div class="activity-row">
							<div class="a-time">
								<div class="a-abs">{formatActivityAbs(a.at)}</div>
								<div class="a-rel">{formatActivityTime(a.at)}</div>
							</div>
							<div class="a-badge {a.kind}">{activityKindLabel[a.kind]}</div>
							<div class="a-body">
								<div class="a-details">{a.details}</div>
								{#if a.memberName}
									<div class="a-sub">
										<button
											class="a-link"
											onclick={() => {
												if (a.bookingId) {
													const found = bookings.find((b) => b.id === a.bookingId);
													if (found) {
														currentNav = 'live';
														selectBooking(a.bookingId);
													} else {
														toast('This booking has been cancelled', 'info');
													}
												}
											}}
										>{a.memberName} · {a.bookingId}</button>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div class="a-note">
					Every operator action is logged locally. In production this stream feeds
					the audit trail available to LSD support + the club owner.
				</div>
			</div>
		{:else if currentNav === 'settings'}
			<div class="content">
				<div class="page-head">
					<div>
						<div class="head-eyebrow">SETTINGS · EDIT INLINE</div>
						<h1>Club configuration</h1>
					</div>
				</div>
				<div class="settings-list">
					{#each Object.entries(settings) as [key, value] (key)}
						{@const skey = key as SettingKey}
						<div class="setting-row" class:editing={editingSettingKey === skey}>
							<div class="setting-info">
								<div class="setting-name">{settingLabel[skey]}</div>
								{#if editingSettingKey === skey}
									<input
										class="setting-input"
										bind:value={settingDraft}
										onkeydown={(e) => {
											if (e.key === 'Enter') saveSetting();
											if (e.key === 'Escape') cancelEditSetting();
										}}
									/>
								{:else}
									<div class="setting-sub">{value}</div>
								{/if}
							</div>
							{#if editingSettingKey === skey}
								<div class="setting-actions">
									<button class="edit-btn" onclick={cancelEditSetting}>Cancel</button>
									<button class="edit-btn primary" onclick={saveSetting}>Save</button>
								</div>
							{:else}
								<div class="setting-actions">
									{#if skey === 'payoutAccount'}
										<span class="verified">VERIFIED</span>
									{/if}
									<button class="edit-btn" onclick={() => startEditSetting(skey)}>Edit</button>
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="settings-note">
					Changes are stored locally for the demo. In production they sync to the
					club's account at LongShot Digital OÜ.
				</div>
			</div>
		{/if}
	</main>

	<!-- ═════════════ PRINT-ONLY DAILY REPORT ═════════════
	     Hidden on screen; @media print hides the console chrome and
	     shows only this clean A4-friendly summary. -->
	<div class="print-report" aria-hidden="true">
		<div class="pr-head">
			<div class="pr-brand">PAR CAR · DAILY REPORT</div>
			<div class="pr-meta">
				Cedar Ridge Country Club — {formatDate(now)}, printed {formatClock(now)}
			</div>
		</div>
		<div class="pr-kpis">
			<div><b>{bookings.filter((b) => b.status !== 'booked').length}</b> washes billed</div>
			<div><b>€{revenueToday.toLocaleString('en-US')}</b> gross revenue</div>
			<div><b>€{clubShare.toLocaleString('en-US')}</b> club share (20%)</div>
			<div><b>{carsOnProperty}</b> cars on property at print time</div>
		</div>
		<table class="pr-table">
			<thead>
				<tr>
					<th>ID</th><th>Member</th><th>Vehicle</th><th>Spot</th><th>Service</th>
					<th>Status</th><th>Ready</th><th>Picked up</th><th>Rating</th>
					<th class="pr-right">Price</th>
				</tr>
			</thead>
			<tbody>
				{#each bookings as b (b.id)}
					<tr>
						<td>{b.id}</td>
						<td>{b.memberName}</td>
						<td>{b.vehicleYear} {b.vehicleMake} {b.vehicleModel}</td>
						<td>{b.spot}</td>
						<td>{tierLabel[b.tier]}</td>
						<td>{statusLabel[b.status]}</td>
						<td>{b.readyAt ?? '—'}</td>
						<td>{b.pickedUpAt ?? '—'}</td>
						<td>{b.rating ? '★'.repeat(b.rating) : '—'}</td>
						<td class="pr-right">€{b.price}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="pr-foot">
			LongShot Digital OÜ · Reg. 17437669 · info@lsdigital.ee ·
			Settlement: 20% of gross via SEPA on the 5th business day of the following month.
		</div>
	</div>

	<!-- ═════════════ BOOKING DETAIL DRAWER ═════════════ -->
	{#if selectedBooking}
		<div
			class="drawer-backdrop"
			onclick={closeModal}
			role="button"
			tabindex="-1"
			transition:fade={{ duration: 150 }}
		></div>
		<aside
			class="drawer"
			transition:fly={{ x: 480, duration: 240 }}
		>
			<!-- Head -->
			<div class="drawer-head">
				<div>
					<div class="drawer-eyebrow">BOOKING · {selectedBooking.id}</div>
					<div class="drawer-title">{selectedBooking.memberName}</div>
				</div>
				<button class="drawer-close" onclick={closeModal} aria-label="Close">×</button>
			</div>

			<!-- Status action bar -->
			<div class="drawer-status">
				<div class="ds-left">
					<div class="ds-lbl">CURRENT STATUS</div>
					<div class="status-pill {selectedBooking.status}">{statusLabel[selectedBooking.status]}</div>
				</div>
				<div class="ds-actions">
					{#if nextStatus(selectedBooking.status)}
						<button class="btn-advance" onclick={() => advanceStatus(selectedBooking!.id)}>
							{advanceLabel[selectedBooking.status]} →
						</button>
					{:else}
						<div class="ds-done">Complete · picked up at {selectedBooking.pickedUpAt}</div>
					{/if}
					{#if prevStatus(selectedBooking.status)}
						<button class="btn-revert" onclick={() => requestRevert(selectedBooking!.id)}>
							↺ Revert to {statusLabel[prevStatus(selectedBooking.status)!]}
						</button>
					{/if}
				</div>
			</div>

			<!-- Member -->
			<section class="drawer-section">
				<div class="ds-h">MEMBER</div>
				<div class="ds-rows">
					<div class="ds-row">
						<span class="ds-k">Name</span>
						<span class="ds-v">{selectedBooking.memberName}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Member ID</span>
						<span class="ds-v mono">#{selectedBooking.memberID}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Phone</span>
						<span class="ds-v mono">{selectedBooking.memberPhone}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Member since</span>
						<span class="ds-v">{selectedBooking.memberSince}</span>
					</div>
				</div>
				<div class="contact-wrap">
					<button
						class="drawer-action"
						onclick={() => (showingContactMenu = !showingContactMenu)}
					>
						✉ Send message to member
					</button>
					{#if showingContactMenu}
						<div class="contact-menu" transition:fade={{ duration: 120 }}>
							<div class="cm-head">TEMPLATES · TAP TO SEND</div>
							{#each messageTemplates as t}
								<button
									class="cm-row"
									onclick={() => sendMessageTemplate(selectedBooking!.id, t)}
								>
									<div class="cm-title">{t.title}</div>
									<div class="cm-body">{renderTemplate(t, selectedBooking!)}</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</section>

			<!-- Vehicle -->
			<section class="drawer-section">
				<div class="ds-h">VEHICLE</div>
				<div class="drawer-vehicle">
					<div class="dv-paint">
						<div
							class="pt-bar"
							class:light={isPaintLight(selectedBooking.vehicleColor)}
							style="background: {paintColor(selectedBooking.vehicleColor)}"
						></div>
						<div class="pt-bd">
							<span class="dv-l1">{modelShort(selectedBooking.vehicleModel)}</span>
							<span class="dv-l2">{selectedBooking.plate}</span>
						</div>
					</div>
					<div class="dv-info">
						<div class="dv-name">
							{selectedBooking.vehicleYear} {selectedBooking.vehicleMake} {selectedBooking.vehicleModel}
						</div>
						<div class="dv-meta">
							{selectedBooking.vehicleColor} · <span class="mono">{selectedBooking.plate}</span>
						</div>
					</div>
				</div>
			</section>

			<!-- Booking details -->
			<section class="drawer-section">
				<div class="ds-h">BOOKING</div>
				<div class="ds-rows">
					<div class="ds-row">
						<span class="ds-k">Service</span>
						<span class="ds-v">{tierLabel[selectedBooking.tier]}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Charge</span>
						<span class="ds-v mono price-accent">€{selectedBooking.price}.00</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Tee time</span>
						<span class="ds-v">{selectedBooking.teeTime}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Return window</span>
						<span class="ds-v">{selectedBooking.returnWindow}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Parking spot</span>
						<span class="ds-v mono spot-accent">{selectedBooking.spot}</span>
					</div>
					<div class="ds-row">
						<span class="ds-k">Key drop</span>
						<span class="ds-v">Bag staff</span>
					</div>
				</div>
			</section>

			<!-- Crew -->
			<section class="drawer-section">
				<div class="ds-h">CREW</div>
				<div class="crew-line">
					<div class="ds-v">{selectedBooking.crew ?? 'Not assigned yet'}</div>
					<button class="link-btn" onclick={() => (showingCrewMenu = !showingCrewMenu)}>
						{selectedBooking.crew ? 'Reassign' : 'Assign'}
					</button>
				</div>
				{#if showingCrewMenu}
					<div class="crew-menu" transition:fade={{ duration: 120 }}>
						{#each crewChoices as crew}
							<button
								class:current={selectedBooking.crew === crew}
								onclick={() => reassignCrew(selectedBooking!.id, crew)}
							>
								{crew}
								{#if selectedBooking.crew === crew}
									<span class="check-inline">✓</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Notes -->
			<section class="drawer-section">
				<div class="ds-h-row">
					<div class="ds-h">NOTES</div>
					{#if editingNoteFor !== selectedBooking.id}
						<button class="link-btn" onclick={() => startEditNote(selectedBooking!.id)}>
							{selectedBooking.note ? 'Edit' : 'Add note'}
						</button>
					{/if}
				</div>
				{#if editingNoteFor === selectedBooking.id}
					<textarea
						class="note-editor"
						bind:value={noteDraft}
						placeholder="e.g. Member requested extra tire dressing. Prefers pro shop key drop."
						rows="3"
					></textarea>
					<div class="note-actions">
						<button class="dialog-btn" onclick={cancelEditNote}>Cancel</button>
						<button class="dialog-btn warn" onclick={saveNote}>Save note</button>
					</div>
				{:else if selectedBooking.note}
					<div class="note-view">{selectedBooking.note}</div>
				{:else}
					<div class="note-empty">No notes yet · Anything the crew should know about this member?</div>
				{/if}
			</section>

			<!-- Timeline -->
			<section class="drawer-section">
				<div class="ds-h">TIMELINE</div>
				<div class="timeline">
					<div class="tl-row done">
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">BOOKED</div>
							<div class="tl-time">at {selectedBooking.bookedAt} · via Par Car app</div>
						</div>
					</div>
					<div class="tl-row" class:done={statusOrder.indexOf(selectedBooking.status) >= 1}>
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">AT LOT</div>
							<div class="tl-time">
								{selectedBooking.receivedAt ? `at ${selectedBooking.receivedAt}` : 'waiting'}
							</div>
						</div>
					</div>
					<div class="tl-row" class:done={statusOrder.indexOf(selectedBooking.status) >= 2}>
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">WASHING</div>
							<div class="tl-time">
								{selectedBooking.startedAt ? `started ${selectedBooking.startedAt}` : 'waiting'}
							</div>
						</div>
					</div>
					<div class="tl-row" class:done={statusOrder.indexOf(selectedBooking.status) >= 3}>
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">DRYING</div>
							<div class="tl-time">
								{statusOrder.indexOf(selectedBooking.status) >= 3 ? 'in progress' : 'waiting'}
							</div>
						</div>
					</div>
					<div class="tl-row" class:done={statusOrder.indexOf(selectedBooking.status) >= 4}>
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">READY</div>
							<div class="tl-time">
								{selectedBooking.readyAt ? `since ${selectedBooking.readyAt}` : 'waiting'}
							</div>
						</div>
					</div>
					<div class="tl-row" class:done={selectedBooking.status === 'pickedUp'}>
						<div class="tl-dot"></div>
						<div class="tl-body">
							<div class="tl-lbl">PICKED UP</div>
							<div class="tl-time">
								{selectedBooking.pickedUpAt ? `at ${selectedBooking.pickedUpAt}` : 'waiting'}
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Rating & tip (if completed) -->
			{#if selectedBooking.status === 'pickedUp' && selectedBooking.rating}
				<section class="drawer-section">
					<div class="ds-h">MEMBER FEEDBACK</div>
					<div class="ds-rows">
						<div class="ds-row">
							<span class="ds-k">Rating</span>
							<span class="ds-v">
								<span class="stars-lg">
									{#each Array(5) as _, i}
										<span class="star" class:filled={i < (selectedBooking.rating ?? 0)}>★</span>
									{/each}
								</span>
							</span>
						</div>
						<div class="ds-row">
							<span class="ds-k">Tip</span>
							<span class="ds-v mono">€{selectedBooking.tipEur ?? 0}</span>
						</div>
					</div>
				</section>
			{/if}

			<!-- Danger -->
			<section class="drawer-section danger">
				<div class="ds-h danger">DANGER ZONE</div>
				<button class="drawer-action danger-action" onclick={() => requestCancel(selectedBooking!.id)}>
					Cancel booking
				</button>
				<div class="ds-note">
					Cancels the booking and refunds via Stripe. The member will be notified.
				</div>
			</section>
		</aside>
	{/if}

	<!-- ═════════════ CONFIRM · REVERT ═════════════ -->
	{#if confirmingRevert}
		<div class="dialog-backdrop" onclick={() => (confirmingRevert = null)} role="button" tabindex="-1" transition:fade={{ duration: 120 }}></div>
		<div class="dialog" transition:fade={{ duration: 120 }}>
			<div class="dialog-h">Revert status?</div>
			<div class="dialog-body">
				This moves the booking back to <b>{statusLabel[confirmingRevert.toStatus]}</b>. Use this only
				if you advanced a status by mistake.
			</div>
			<div class="dialog-actions">
				<button class="dialog-btn" onclick={() => (confirmingRevert = null)}>Cancel</button>
				<button class="dialog-btn warn" onclick={performRevert}>Yes, revert</button>
			</div>
		</div>
	{/if}

	<!-- ═════════════ CONFIRM · CANCEL BOOKING ═════════════ -->
	{#if confirmingCancel}
		<div class="dialog-backdrop" onclick={() => (confirmingCancel = null)} role="button" tabindex="-1" transition:fade={{ duration: 120 }}></div>
		<div class="dialog" transition:fade={{ duration: 120 }}>
			<div class="dialog-h">Cancel this booking?</div>
			<div class="dialog-body">
				The booking will be removed and the member notified. Their payment is refunded via Stripe
				within 5–10 business days.
			</div>
			<div class="dialog-actions">
				<button class="dialog-btn" onclick={() => (confirmingCancel = null)}>Keep booking</button>
				<button class="dialog-btn danger" onclick={performCancel}>Cancel booking</button>
			</div>
		</div>
	{/if}

	<!-- ═════════════ TOASTS ═════════════ -->
	<div class="toasts">
		{#each toasts as t (t.id)}
			<div class="toast {t.kind}" transition:fly={{ y: 40, duration: 220 }}>
				<span class="toast-dot"></span>
				{t.msg}
			</div>
		{/each}
	</div>
</div>

<style>
	/* ════════════════════════════════════════════════════════════════
	   Par Car Console — desktop dashboard, real-operator powers.
	   Warm-cream base, dashboard-grade density. Drawer-based detail
	   view; toasts bottom-right; confirm dialogs centered.
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
		--blue: #2c6f9e;
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
	.console * { box-sizing: border-box; }

	/* ═══════════════ SIDEBAR ═══════════════ */
	.sidebar {
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
	.brand { padding: 6px 6px 12px; }
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
	.brand-mark .flag svg { width: 100%; height: 100%; display: block; }
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
	.club-meta { font-size: 10px; color: var(--ink-3); margin-top: 4px; }

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
	.sidebar nav button:disabled { color: var(--ink-4); cursor: not-allowed; }
	.sidebar nav button .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--red);
		flex-shrink: 0;
	}
	.sidebar nav button.active .dot { background: var(--cream); }
	.sidebar nav button .icon {
		width: 14px;
		text-align: center;
		font-size: 12px;
		color: var(--ink-3);
	}
	.sidebar nav button.active .icon { color: var(--cream); }
	.sidebar nav button span:nth-child(2) { flex: 1; }
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
	.sidebar nav button.active .badge { background: var(--cream); color: var(--ink); }
	.sidebar nav button .badge.subtle {
		background: rgba(28, 26, 22, 0.1);
		color: var(--ink-2);
	}
	.sidebar nav button.active .badge.subtle { background: rgba(241, 236, 225, 0.2); color: var(--cream); }
	.sidebar nav button .soon {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.14em;
		color: var(--ink-4);
		font-weight: 600;
	}

	/* Auto-sim toggle */
	.autosim {
		background: rgba(28, 26, 22, 0.04);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 10px 12px;
	}
	.autosim-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.autosim-name {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.22em;
		color: var(--ink);
		font-weight: 700;
	}
	.autosim-sub {
		font-size: 10px;
		color: var(--ink-3);
		margin-top: 2px;
	}
	.toggle {
		width: 36px;
		height: 20px;
		border-radius: 999px;
		background: var(--ink-4);
		border: none;
		cursor: pointer;
		position: relative;
		transition: background 0.2s;
		padding: 0;
		flex-shrink: 0;
	}
	.toggle.on { background: var(--red); }
	.toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
		transition: left 0.2s;
	}
	.toggle.on .toggle-knob { left: 18px; }

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
	.side-support a { font-size: 11px; color: var(--ink); text-decoration: none; font-weight: 500; }
	.side-support a:hover { text-decoration: underline; }
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
	main { overflow-x: auto; }
	.content { max-width: 1400px; margin: 0 auto; padding: 28px 32px 60px; }

	.page-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 20px;
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

	/* ─── Tools (search + filters) ─── */
	.tools {
		display: flex;
		gap: 14px;
		align-items: center;
		margin-bottom: 22px;
		flex-wrap: wrap;
	}
	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 260px;
		max-width: 460px;
	}
	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--ink-3);
		font-size: 14px;
	}
	.search {
		width: 100%;
		padding: 10px 34px 10px 34px;
		border: 1px solid var(--line-2);
		background: var(--paper-2);
		border-radius: 999px;
		font-family: inherit;
		font-size: 13px;
		color: var(--ink);
		transition: border-color 0.15s;
	}
	.search:focus { outline: none; border-color: var(--ink); }
	.clear-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		border: none;
		background: rgba(28, 26, 22, 0.1);
		color: var(--ink-2);
		border-radius: 50%;
		cursor: pointer;
		font-size: 11px;
		padding: 0;
	}
	.clear-btn:hover { background: rgba(28, 26, 22, 0.18); }

	.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
	.chip {
		border: 1px solid var(--line-2);
		background: var(--paper);
		color: var(--ink-2);
		font-family: inherit;
		font-size: 12px;
		font-weight: 500;
		padding: 7px 14px;
		border-radius: 999px;
		cursor: pointer;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.chip:hover { background: rgba(28, 26, 22, 0.04); color: var(--ink); }
	.chip.on { background: var(--ink); color: var(--cream); border-color: var(--ink); }
	.chip.accent { border-color: var(--red); color: var(--red); }
	.chip.accent:hover { background: var(--red-soft); }
	.chip-c {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 700;
		background: rgba(28, 26, 22, 0.08);
		padding: 1px 6px;
		border-radius: 999px;
		min-width: 20px;
		text-align: center;
	}
	.chip.on .chip-c { background: rgba(241, 236, 225, 0.2); color: var(--cream); }

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
	}
	.kpi.accent { background: var(--red); color: var(--cream); border-color: var(--red); }
	.kpi.highlight { background: var(--ink); color: var(--cream); border-color: var(--ink); }
	.kpi-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.24em;
		font-weight: 600;
		color: var(--ink-3);
	}
	.kpi.accent .kpi-lbl { color: rgba(241, 236, 225, 0.7); }
	.kpi.highlight .kpi-lbl { color: var(--gold); }
	.kpi-val {
		font-family: 'JetBrains Mono', monospace;
		font-size: 34px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.kpi.accent .kpi-val, .kpi.highlight .kpi-val { color: var(--cream); }
	.kpi-sub { font-size: 11px; color: var(--ink-3); }
	.kpi.accent .kpi-sub { color: rgba(241, 236, 225, 0.75); }
	.kpi.highlight .kpi-sub { color: rgba(241, 236, 225, 0.65); }

	/* ─── Sections ─── */
	.section { margin-bottom: 28px; }
	.section.muted { opacity: 0.72; }
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

	/* Status pills */
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
	.status-pill.ready { background: var(--red); color: var(--cream); }
	.status-pill.washing, .status-pill.drying { background: var(--blue); color: white; }
	.status-pill.received { background: var(--amber); color: white; }
	.status-pill.booked { background: rgba(28, 26, 22, 0.55); color: var(--cream); }
	.status-pill.picked, .status-pill.pickedUp { background: rgba(28, 26, 22, 0.35); color: var(--cream); }

	/* Rows */
	.rows {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 80px 1.6fr 90px 1.4fr 1.3fr 60px 20px;
		gap: 14px;
		align-items: center;
		padding: 10px 16px;
		border-bottom: 1px solid var(--line);
		background: transparent;
		border-left: none;
		border-right: none;
		border-top: none;
		cursor: pointer;
		text-align: left;
		width: 100%;
		font-family: inherit;
		color: inherit;
		transition: background 0.12s;
	}
	.row:last-child { border-bottom: none; }
	.row:hover { background: rgba(28, 26, 22, 0.02); }
	.row-ready { background: var(--red-soft); }
	.row-ready:hover { background: rgba(197, 57, 44, 0.12); }
	.row-scheduled { opacity: 0.85; }
	.row-completed { opacity: 0.72; }

	/* Plaque thumbnail (VehicleArt approach E): warm-white spec plate,
	   paint present only as the lacquered edge bar. */
	.paint-tile {
		width: 68px;
		height: 42px;
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		background: var(--paper);
		box-shadow: inset 0 0 0 1px var(--line-2);
	}
	.pt-bar {
		width: 7px;
		flex: none;
		position: relative;
	}
	.pt-bar::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 55%);
	}
	.pt-bar.light {
		box-shadow: inset 0 0 0 1px rgba(28, 26, 22, 0.14);
	}
	.pt-bd {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 8px;
		min-width: 0;
	}
	.pt-l1 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 11px;
		color: var(--ink);
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.pt-l2 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 6.5px;
		letter-spacing: 0.1em;
		color: rgba(28, 26, 22, 0.5);
		font-weight: 600;
		margin-top: 2px;
		white-space: nowrap;
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
	.row-scheduled .col-spot .spot-val, .row-completed .col-spot .spot-val {
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
	.col-chev {
		color: var(--ink-3);
		font-size: 18px;
		font-weight: 400;
	}
	.stars { display: inline-flex; gap: 1px; }
	.star { color: var(--ink-4); font-size: 13px; }
	.star.filled { color: var(--gold); }

	.empty {
		background: var(--paper);
		border: 1px dashed var(--line-2);
		border-radius: 12px;
		padding: 60px 30px;
		text-align: center;
	}
	.empty-h {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 20px;
		color: var(--ink);
		margin-bottom: 6px;
	}
	.empty-sub { color: var(--ink-3); font-size: 13px; }

	/* ═══════════════ DETAIL DRAWER ═══════════════ */
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(28, 26, 22, 0.4);
		z-index: 60;
	}
	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		width: 480px;
		max-width: 100vw;
		height: 100vh;
		background: var(--cream);
		box-shadow: -20px 0 40px rgba(28, 26, 22, 0.14);
		z-index: 61;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.drawer-head {
		padding: 24px 26px 16px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 1px solid var(--line);
	}
	.drawer-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.28em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 4px;
	}
	.drawer-title {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 22px;
		color: var(--ink);
		letter-spacing: -0.01em;
		line-height: 1.15;
	}
	.drawer-close {
		width: 32px;
		height: 32px;
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--ink);
		border-radius: 8px;
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
		padding: 0;
	}
	.drawer-close:hover { background: rgba(28, 26, 22, 0.05); }

	.drawer-status {
		background: var(--paper);
		padding: 18px 26px;
		border-bottom: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.ds-left { display: flex; align-items: center; gap: 12px; }
	.ds-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.22em;
		color: var(--ink-3);
		font-weight: 600;
	}
	.ds-actions { display: flex; flex-direction: column; gap: 8px; }
	.btn-advance {
		background: var(--red);
		color: var(--cream);
		border: none;
		padding: 12px 18px;
		border-radius: 10px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
		box-shadow: 0 4px 12px rgba(197, 57, 44, 0.28);
	}
	.btn-advance:hover { background: #a32a1e; }
	.btn-revert {
		background: transparent;
		color: var(--ink-2);
		border: 1px solid var(--line-2);
		padding: 8px 14px;
		border-radius: 999px;
		font-family: inherit;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.btn-revert:hover { background: rgba(28, 26, 22, 0.05); color: var(--ink); }
	.ds-done {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.16em;
		color: var(--green);
		font-weight: 600;
		background: var(--green-soft);
		padding: 10px 14px;
		border-radius: 8px;
		text-align: center;
	}

	.drawer-section {
		padding: 18px 26px;
		border-bottom: 1px solid var(--line);
	}
	.drawer-section.danger { border-bottom: none; }
	.ds-h {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.28em;
		color: var(--ink-3);
		font-weight: 600;
		margin-bottom: 12px;
	}
	.ds-h.danger { color: var(--red); }
	.ds-rows { display: flex; flex-direction: column; }
	.ds-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 6px 0;
		border-bottom: 1px solid var(--line);
	}
	.ds-row:last-child { border-bottom: none; }
	.ds-k { color: var(--ink-3); font-size: 12px; }
	.ds-v { color: var(--ink); font-size: 13px; font-weight: 500; text-align: right; }
	.ds-v.mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }
	.price-accent { color: var(--red); font-size: 15px !important; font-weight: 600 !important; }
	.spot-accent { color: var(--red); font-weight: 600 !important; }

	.drawer-action {
		width: 100%;
		background: var(--ink);
		color: var(--cream);
		border: none;
		padding: 12px 16px;
		border-radius: 10px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		margin-top: 12px;
		transition: background 0.15s;
	}
	.drawer-action:hover { background: #000; }
	.drawer-action.danger-action {
		background: transparent;
		border: 1px solid var(--red);
		color: var(--red);
	}
	.drawer-action.danger-action:hover { background: var(--red-soft); }
	.ds-note { font-size: 11px; color: var(--ink-3); margin-top: 8px; line-height: 1.5; }

	.drawer-vehicle {
		display: grid;
		grid-template-columns: 92px 1fr;
		gap: 14px;
		align-items: center;
	}
	.dv-paint {
		width: 92px;
		height: 58px;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		background: var(--paper);
		box-shadow: inset 0 0 0 1px var(--line-2);
	}
	.dv-paint .pt-bar {
		width: 9px;
	}
	.dv-l1 {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
		line-height: 1.1;
	}
	.dv-l2 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.12em;
		color: rgba(28, 26, 22, 0.5);
		font-weight: 600;
		margin-top: 3px;
	}
	.dv-name {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 15px;
		color: var(--ink);
	}
	.dv-meta { font-size: 12px; color: var(--ink-3); margin-top: 3px; }
	.mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.03em; }

	.ds-h-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.ds-h-row .ds-h { margin-bottom: 0; }

	/* Contact template menu */
	.contact-wrap { position: relative; }
	.contact-menu {
		margin-top: 10px;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 10px;
		overflow: hidden;
	}
	.cm-head {
		padding: 10px 14px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.22em;
		color: var(--ink-3);
		font-weight: 600;
		background: rgba(28, 26, 22, 0.03);
		border-bottom: 1px solid var(--line);
	}
	.cm-row {
		display: block;
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--line);
		text-align: left;
		padding: 12px 14px;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.12s;
	}
	.cm-row:last-child { border-bottom: none; }
	.cm-row:hover { background: rgba(28, 26, 22, 0.04); }
	.cm-title {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 13px;
		color: var(--ink);
		margin-bottom: 3px;
	}
	.cm-body {
		font-size: 11px;
		color: var(--ink-2);
		line-height: 1.5;
	}

	/* Notes */
	.note-editor {
		width: 100%;
		background: var(--paper);
		border: 1px solid var(--line-2);
		border-radius: 8px;
		padding: 10px 12px;
		font-family: inherit;
		font-size: 13px;
		color: var(--ink);
		resize: vertical;
		min-height: 70px;
		transition: border-color 0.15s;
	}
	.note-editor:focus { outline: none; border-color: var(--ink); }
	.note-actions {
		display: flex;
		gap: 6px;
		justify-content: flex-end;
		margin-top: 8px;
	}
	.note-view {
		background: var(--paper);
		border-left: 3px solid var(--amber);
		padding: 10px 14px;
		font-size: 13px;
		color: var(--ink);
		line-height: 1.5;
		border-radius: 0 8px 8px 0;
	}
	.note-empty {
		font-size: 12px;
		color: var(--ink-3);
		font-style: italic;
	}

	.crew-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.link-btn {
		background: transparent;
		border: none;
		color: var(--red);
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		padding: 4px 8px;
	}
	.link-btn:hover { text-decoration: underline; }
	.crew-menu {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
	}
	.crew-menu button {
		background: transparent;
		border: none;
		text-align: left;
		padding: 10px 14px;
		font-family: inherit;
		font-size: 13px;
		color: var(--ink);
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.crew-menu button:hover { background: rgba(28, 26, 22, 0.05); }
	.crew-menu button.current { color: var(--red); font-weight: 600; }
	.check-inline { color: var(--red); }

	/* Timeline */
	.timeline {
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.tl-row {
		display: grid;
		grid-template-columns: 20px 1fr;
		gap: 12px;
		padding: 8px 0;
		opacity: 0.5;
		position: relative;
	}
	.tl-row.done { opacity: 1; }
	.tl-row:not(:last-child)::before {
		content: '';
		position: absolute;
		left: 9px;
		top: 24px;
		bottom: -4px;
		width: 2px;
		background: var(--line);
	}
	.tl-row.done:not(:last-child)::before { background: var(--ink); }
	.tl-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--ink-4);
		margin-top: 4px;
		z-index: 1;
	}
	.tl-row.done .tl-dot { background: var(--ink); }
	.tl-lbl {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.16em;
		font-weight: 700;
		color: var(--ink);
	}
	.tl-time { font-size: 11px; color: var(--ink-3); margin-top: 2px; }

	.stars-lg .star { font-size: 15px; }

	/* ═══════════════ CONFIRM DIALOGS ═══════════════ */
	.dialog-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(28, 26, 22, 0.5);
		z-index: 80;
	}
	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 420px;
		max-width: calc(100vw - 40px);
		background: var(--paper);
		border-radius: 14px;
		box-shadow: 0 20px 60px rgba(28, 26, 22, 0.24);
		z-index: 81;
		padding: 26px;
	}
	.dialog-h {
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 20px;
		color: var(--ink);
		margin-bottom: 10px;
		letter-spacing: -0.01em;
	}
	.dialog-body { font-size: 13px; color: var(--ink-2); line-height: 1.5; margin-bottom: 18px; }
	.dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
	.dialog-btn {
		background: transparent;
		border: 1px solid var(--line-2);
		color: var(--ink);
		padding: 10px 18px;
		border-radius: 999px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
	}
	.dialog-btn:hover { background: rgba(28, 26, 22, 0.05); }
	.dialog-btn.warn { background: var(--amber); color: white; border-color: var(--amber); }
	.dialog-btn.warn:hover { background: #935e1a; }
	.dialog-btn.danger { background: var(--red); color: white; border-color: var(--red); }
	.dialog-btn.danger:hover { background: #a32a1e; }

	/* ═══════════════ TOASTS ═══════════════ */
	.toasts {
		position: fixed;
		bottom: 24px;
		right: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 90;
		max-width: 360px;
	}
	.toast {
		background: var(--ink);
		color: var(--cream);
		padding: 12px 16px 12px 14px;
		border-radius: 10px;
		box-shadow: 0 12px 28px rgba(28, 26, 22, 0.24);
		font-size: 13px;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border-left: 3px solid var(--ink-3);
	}
	.toast.success { border-left-color: #9bc28a; }
	.toast.warning { border-left-color: var(--amber); }
	.toast.error { border-left-color: var(--red); }
	.toast-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.7;
		flex-shrink: 0;
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
	.eh-sub { font-size: 14px; color: rgba(241, 236, 225, 0.65); margin-top: 12px; line-height: 1.5; }
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
	.bar.off {
		opacity: 0.22;
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
	.stat-card { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; }
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
	.stat-sub { font-size: 11px; color: var(--ink-3); margin-top: 4px; }
	.tier-breakdown { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 20px 24px; }
	.tier-breakdown h3 { font-family: 'Spectral', serif; font-weight: 500; font-size: 15px; color: var(--ink); margin: 0 0 12px; }
	.tier-bar { display: flex; height: 34px; border-radius: 8px; overflow: hidden; border: 1px solid var(--line); }
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
	.tb-slice.express { background: var(--blue); }
	.tb-slice.full { background: var(--ink); }
	.tb-slice.signature { background: var(--gold); }
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
	.settings-list { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 20px;
		border-bottom: 1px solid var(--line);
	}
	.setting-row:last-child { border-bottom: none; }
	.setting-name { font-weight: 600; color: var(--ink); font-size: 14px; }
	.setting-sub { font-size: 12px; color: var(--ink-3); margin-top: 3px; }
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
	}
	.edit-btn:hover { background: rgba(28, 26, 22, 0.06); }
	.edit-btn.primary {
		background: var(--red);
		color: var(--cream);
		border-color: var(--red);
	}
	.edit-btn.primary:hover { background: #a32a1e; }
	.setting-row.editing { background: rgba(197, 57, 44, 0.03); }
	.setting-info { flex: 1; }
	.setting-actions { display: flex; gap: 6px; align-items: center; }
	.setting-input {
		width: 100%;
		background: white;
		border: 1px solid var(--red);
		border-radius: 8px;
		padding: 8px 12px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		color: var(--ink);
		margin-top: 4px;
	}
	.setting-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(197, 57, 44, 0.15); }
	.settings-note {
		margin-top: 16px;
		font-size: 12px;
		color: var(--ink-3);
		text-align: center;
	}

	/* ═══════════════ ACTIVITY LOG ═══════════════ */
	.activity-list {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.activity-row {
		display: grid;
		grid-template-columns: 100px 90px 1fr;
		gap: 16px;
		padding: 12px 20px;
		border-bottom: 1px solid var(--line);
		align-items: center;
	}
	.activity-row:last-child { border-bottom: none; }
	.a-time { display: flex; flex-direction: column; }
	.a-abs {
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.a-rel {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--ink-3);
		margin-top: 2px;
	}
	.a-badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.18em;
		padding: 4px 8px;
		border-radius: 999px;
		text-align: center;
		background: var(--ink-4);
		color: white;
	}
	.a-badge.status_advance { background: var(--blue); }
	.a-badge.status_revert { background: var(--amber); }
	.a-badge.crew_reassigned { background: var(--ink-3); color: white; }
	.a-badge.message_sent { background: #4a7c40; }
	.a-badge.note_added { background: var(--gold); color: var(--ink); }
	.a-badge.cancelled { background: var(--red); }
	.a-badge.settings_updated { background: var(--ink); color: var(--cream); }
	.a-badge.system { background: rgba(28, 26, 22, 0.4); color: var(--cream); }
	.a-details {
		font-size: 14px;
		color: var(--ink);
		font-weight: 500;
	}
	.a-sub {
		font-size: 11px;
		color: var(--ink-3);
		margin-top: 3px;
	}
	.a-link {
		background: transparent;
		border: none;
		color: var(--ink-2);
		font-family: inherit;
		font-size: 11px;
		padding: 0;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: rgba(28, 26, 22, 0.15);
		text-underline-offset: 3px;
	}
	.a-link:hover { color: var(--red); text-decoration-color: var(--red); }
	.a-note {
		margin-top: 16px;
		padding: 14px 20px;
		background: var(--paper);
		border: 1px dashed var(--line-2);
		border-radius: 10px;
		font-size: 12px;
		color: var(--ink-3);
		line-height: 1.55;
	}

	/* ═══════════════ MICRO-INTERACTIONS ═══════════════
	   Restrained by design: short durations, small distances, no bounce.
	   This is a professional console, not a consumer toy. */
	.console button:not(:disabled):active {
		transform: scale(0.985);
	}
	.live-dot {
		position: relative;
	}
	.live-dot::after {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 1px solid var(--red);
		opacity: 0;
		animation: ripple 3s ease-out infinite;
	}
	@keyframes ripple {
		0% { transform: scale(0.6); opacity: 0.5; }
		55% { transform: scale(1.6); opacity: 0; }
		100% { opacity: 0; }
	}

	/* ═══════════════ HEADER TOOLS · EXPORT + BELL ═══════════════ */
	.tool-btn {
		border: 1px solid var(--line-2);
		background: var(--paper);
		color: var(--ink-2);
		font-family: inherit;
		font-size: 12px;
		font-weight: 500;
		padding: 8px 14px;
		border-radius: 999px;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		white-space: nowrap;
	}
	.tool-btn:hover {
		background: rgba(28, 26, 22, 0.05);
		color: var(--ink);
	}
	.bell-wrap {
		position: relative;
	}
	.bell {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid var(--line-2);
		background: var(--paper);
		color: var(--ink-3);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		transition: color 0.15s, background 0.15s;
		padding: 0;
	}
	.bell:hover {
		background: rgba(28, 26, 22, 0.05);
		color: var(--ink);
	}
	.bell.has-unread {
		color: var(--ink);
	}
	.bell svg {
		width: 17px;
		height: 17px;
	}
	.bell-badge {
		position: absolute;
		top: -5px;
		right: -5px;
		background: var(--red);
		color: var(--cream);
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 700;
		padding: 1px 5px;
		border-radius: 999px;
		min-width: 16px;
		text-align: center;
	}
	.inbox-backdrop {
		position: fixed;
		inset: 0;
		background: transparent;
		z-index: 65;
	}
	.inbox {
		position: absolute;
		top: 44px;
		right: 0;
		width: 340px;
		background: var(--paper);
		border: 1px solid var(--line-2);
		border-radius: 12px;
		box-shadow: 0 16px 40px rgba(28, 26, 22, 0.16);
		z-index: 66;
		overflow: hidden;
		text-align: left;
	}
	.inbox-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px;
		border-bottom: 1px solid var(--line);
		font-family: 'Spectral', serif;
		font-weight: 500;
		font-size: 14px;
		color: var(--ink);
	}
	.inbox-row {
		display: grid;
		grid-template-columns: 10px 1fr auto;
		gap: 10px;
		width: 100%;
		padding: 11px 14px;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--line);
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		align-items: start;
		transition: background 0.12s;
	}
	.inbox-row:last-child {
		border-bottom: none;
	}
	.inbox-row:hover {
		background: rgba(28, 26, 22, 0.03);
	}
	.inbox-row.unread {
		background: rgba(197, 57, 44, 0.04);
	}
	.ib-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		margin-top: 5px;
		background: var(--ink-4);
	}
	.ib-dot.booking { background: var(--blue); }
	.ib-dot.rating { background: var(--gold); }
	.ib-dot.payment { background: var(--red); }
	.ib-body {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.ib-title {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink);
	}
	.ib-text {
		font-size: 11.5px;
		color: var(--ink-2);
		line-height: 1.45;
	}
	.ib-time {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		color: var(--ink-3);
		font-weight: 600;
		margin-top: 4px;
		white-space: nowrap;
	}
	.inbox-empty {
		padding: 22px;
		text-align: center;
		font-size: 12px;
		color: var(--ink-3);
	}

	/* ═══════════════ PRINT · DAILY REPORT ═══════════════ */
	.print-report {
		display: none;
	}
	.pr-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 2px solid #1c1a16;
		padding-bottom: 10px;
		margin-bottom: 14px;
	}
	.pr-brand {
		font-family: 'JetBrains Mono', monospace;
		font-weight: 700;
		letter-spacing: 0.2em;
		font-size: 13px;
		color: #1c1a16;
	}
	.pr-meta {
		font-size: 11px;
		color: #595650;
	}
	.pr-kpis {
		display: flex;
		gap: 26px;
		font-size: 12px;
		margin-bottom: 16px;
		color: #1c1a16;
	}
	.pr-kpis b {
		font-family: 'JetBrains Mono', monospace;
		font-size: 14px;
	}
	.pr-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 10.5px;
		color: #1c1a16;
	}
	.pr-table th {
		text-align: left;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8.5px;
		letter-spacing: 0.12em;
		color: #595650;
		border-bottom: 1px solid #1c1a16;
		padding: 4px 6px;
	}
	.pr-table td {
		padding: 5px 6px;
		border-bottom: 1px solid rgba(28, 26, 22, 0.15);
	}
	.pr-right {
		text-align: right;
	}
	.pr-foot {
		margin-top: 16px;
		font-size: 9px;
		color: #595650;
	}
	@media print {
		.console {
			display: block;
			background: white;
		}
		.sidebar,
		.console main,
		.drawer,
		.drawer-backdrop,
		.dialog,
		.dialog-backdrop,
		.toasts,
		.inbox,
		.inbox-backdrop {
			display: none !important;
		}
		.print-report {
			display: block;
			padding: 24px 8px;
			font-family: 'Inter', sans-serif;
		}
	}

	/* ═══════════════ Responsive ═══════════════ */
	@media (max-width: 1080px) {
		.kpi-grid, .earnings-grid { grid-template-columns: repeat(2, 1fr); }
		.row { grid-template-columns: 68px 1.6fr 80px 1.3fr 1fr 50px 20px; gap: 10px; }
	}
	@media (max-width: 820px) {
		.console { grid-template-columns: 1fr; }
		.sidebar {
			position: static;
			height: auto;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 14px 18px;
			gap: 10px;
		}
		.brand, .club-card, .autosim, .side-foot { flex: 1; min-width: 160px; }
		.sidebar nav { flex-direction: row; flex-wrap: wrap; flex-basis: 100%; }
		.content { padding: 20px 20px 40px; }
		.row { grid-template-columns: 60px 1.4fr 70px 1fr 20px; gap: 10px; }
		.col-tier, .col-price { display: none; }
		.earnings-hero { grid-template-columns: 1fr; padding: 24px; }
		.drawer { width: 100%; }
	}
</style>
