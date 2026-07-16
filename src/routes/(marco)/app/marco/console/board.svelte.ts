// Mock Le Motel board — client-side only until the backend lands.
// One shared $state so edits/duplicates survive navigation between
// console screens within a session.

export type EventStatus = 'live' | 'published' | 'draft' | 'past';

export interface BoardEvent {
	id: number;
	title: string;
	when: string; // display string — "Tonight · 10 PM"
	photo: string | null;
	status: EventStatus;
	going: number;
	maybe: number;
	category: string;
	place: string;
	missing?: string; // drafts only — "photo, end time"
	// poster toggles (mirror the app's share composer)
	invitePill: boolean;
	categoryChip: boolean;
	hostRow: boolean;
}

const img = (id: string) =>
	`https://images.unsplash.com/${id}?w=700&q=75&auto=format&fit=crop`;

let nextId = 100;
export const newId = () => nextId++;

export const board = $state({
	pastCount: 48,
	events: [
		{
			id: 1,
			title: 'Vinyl night',
			when: 'Tonight · 10 PM',
			photo: img('photo-1543007630-9710e4a00a20'),
			status: 'live',
			going: 86,
			maybe: 31,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 2,
			title: 'Modular synth live set',
			when: 'Sat · 9 PM',
			photo: img('photo-1470229722913-7c0e2dbbafd3'),
			status: 'published',
			going: 142,
			maybe: 58,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 3,
			title: 'Sunday listening bar',
			when: 'Sun · 7 PM',
			photo: img('photo-1514320291840-2e0a9bf2a9ae'),
			status: 'published',
			going: 38,
			maybe: 22,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 4,
			title: 'Jazz kissa — open decks',
			when: 'Thu · 8 PM',
			photo: img('photo-1415201364774-f6f0bb35f28f'),
			status: 'published',
			going: 54,
			maybe: 19,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 5,
			title: 'Disquaire day takeover',
			when: 'Fri 24 · 10 PM',
			photo: img('photo-1493225457124-a3eb161ffa5f'),
			status: 'published',
			going: 97,
			maybe: 40,
			category: 'PARTY',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 6,
			title: 'Ambient morning',
			when: 'Sat 25 · 11 AM',
			photo: img('photo-1459749411175-04bf5292ceea'),
			status: 'published',
			going: 26,
			maybe: 14,
			category: 'CHILL',
			place: 'Le Motel — courtyard',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 7,
			title: 'NYE — save the date',
			when: 'Dec 31 · no photo yet',
			photo: null,
			status: 'draft',
			going: 0,
			maybe: 0,
			category: 'PARTY',
			place: 'Le Motel',
			missing: 'photo, end time',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 8,
			title: 'Courtyard season opening',
			when: 'No date yet',
			photo: null,
			status: 'draft',
			going: 0,
			maybe: 0,
			category: 'PARTY',
			place: 'Le Motel — courtyard',
			missing: 'date, photo',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 9,
			title: 'Closing of the season',
			when: 'Jun 21 · 10 PM',
			photo: img('photo-1516450360452-9312f5e86fc7'),
			status: 'past',
			going: 1240,
			maybe: 210,
			category: 'PARTY',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 10,
			title: 'Fête de la musique — all night',
			when: 'Jun 20 · 8 PM',
			photo: img('photo-1506157786151-b8491531f063'),
			status: 'past',
			going: 640,
			maybe: 122,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		},
		{
			id: 11,
			title: 'Vinyl night',
			when: 'Jun 13 · 10 PM',
			photo: img('photo-1543007630-9710e4a00a20'),
			status: 'past',
			going: 91,
			maybe: 28,
			category: 'MUSIC',
			place: 'Le Motel',
			invitePill: false,
			categoryChip: true,
			hostRow: true
		}
	] as BoardEvent[]
});
