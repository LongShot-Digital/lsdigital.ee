---
title: Privacy Policy
description: Privacy policy for Marco by LongShot Digital. What we collect, what we never collect, and who sees what.
---

**Marco · Plans With Friends**

Last updated: 28 July 2026

<svelte:head><style>html, body { background: #f4f1ea !important; } body::before { display: none; }</style></svelte:head>

## The short version

Marco is a map of plans. We store what's needed to show the right plans to the right people — your profile, your friendships, the events you make and join — and honour the visibility choices you set inside the app. Your phone's GPS position is never sent to our servers. Your address book is never uploaded. We show no ads, and we do not sell your data.

## Data we collect

**Account data**
- Your sign-in identity from Sign in with Apple (a technical identifier, your name, and your email if you chose to share it — Apple's "Hide My Email" works fully with Marco)
- Your phone number, **only if you choose to verify one** (used so friends who already have your number can find you — see "Phone numbers", below)

**Profile data**
- Name, username (handle), status line, and your "tonight" mode
- Your avatar: the character you build, an emoji, or a photo you choose to set
- For organizer accounts: organisation type, city, public links, and verification-call details

**Social data**
- Your friendships and friend requests (including how you connected: search, QR, or contacts)
- Organizers you follow

**Plans and events**
- Events you create or are invited to: title, notes, category, times, visibility, and the event's location (a place the host picks — not anyone's live position)
- Your RSVPs
- For organizers: saved venues and their entry instructions

**Settings and technical data**
- Your privacy settings themselves (we need them to enforce them)
- A push notification token, only when you enable notifications
- Standard short-lived server logs (IP address, timestamps) used for security and keeping the service running

## What we do NOT collect

- **Your GPS location.** The map centres on your position using your phone's location services, entirely on your device. Your coordinates are never transmitted to our servers. The only coordinates we store are the ones a host picks for an event.
- **Your address book.** Contact-based friend finding works by matching salted cryptographic hashes of phone numbers — your contacts are never uploaded or stored on our servers, and you can turn off being findable by phone at any time.
- **Advertising identifiers, tracking pixels, or analytics profiles.** There is no ad SDK and no third-party analytics SDK in Marco.
- **Calendar contents.** If you turn on calendar sync, plans are written to your calendar on your device. We never read your calendar.

## Who sees what — your tiers

Visibility is the product. Inside Marco you control, per audience tier, who sees your presence, your status, and your plans. Events carry their own visibility (public, friends, invite-only) chosen by the host. These choices are enforced on our servers, not just hidden in the interface: data outside your chosen audience is not delivered to other people's devices.

## Phone numbers

Verifying a phone number is optional. If you do, we store the number and a salted hash of it. The hash lets friends who already have your number in their contacts find you on Marco — and only if your "findable by phone" setting allows it. Verification codes are delivered by SMS through Twilio. You can remove your number, or turn off findability, at any time in the app.

## Third-party services

- [Apple Inc.](https://www.apple.com/legal/privacy/) — Sign in with Apple, push notifications, and Apple Maps (map imagery is loaded from Apple, which involves your IP address, like any map app)
- [Twilio Inc.](https://www.twilio.com/en-us/legal/privacy) — SMS delivery for phone verification codes
- [Unsplash](https://unsplash.com/privacy) — event artwork images are loaded from Unsplash's servers, which involves standard web request data
- **Nobody else.** No data brokers, no ad networks, no analytics companies.

## Aggregate insights for organizers

Verified organizers can see how their events perform — always as aggregate, de-identified statistics (for example: total RSVPs over time). Organizers never receive your identity beyond what an event's own visibility already shows (such as an RSVP list you chose to join), and never your browsing behaviour. If we ever introduce optional profile fields (such as age) to make these aggregates more useful, they will be optional, used only in de-identified aggregate form, and this policy will be updated first.

## Payments and tickets (planned)

Marco does not process payments today. When ticketing launches, payments will be handled by a certified payment provider — we will never see or store card numbers — and transaction records will be retained as Estonian accounting law requires. This policy will be updated with the specifics before the feature goes live.

## One more promise

Your live GPS position is not collected, and if we ever offer optional live-location sharing between friends, it will be strictly opt-in per feature — and announced in this policy before it exists.

## Your rights under GDPR

As a Marco user in the EU, you have the right to:

- **Access** — request a copy of the data we hold about you
- **Rectification** — correct inaccurate information
- **Erasure** — delete your account and associated data ("right to be forgotten")
- **Portability** — export your data in a machine-readable format
- **Object** and **restrict** — limit specific processing
- **Withdraw consent** — for any processing based on consent
- **Lodge a complaint** with the Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)

To exercise any of these rights, email [info@letsmarco.com](mailto:info@letsmarco.com). We respond within 30 days.

## Data retention

- **Account, profile, and social data** — kept while your account is active; deleted within 30 days of account deletion
- **Events** — an event you hosted is removed when you delete it or your account; your RSVPs and invitations are removed with your account
- **Server logs** — kept briefly for security and operations, then deleted
- **Push tokens** — removed when you disable notifications or delete the app

## Where your data lives

Our servers are located in Tallinn, Estonia. Your data is stored and processed inside the European Union.

## Security

- All traffic between the app and our servers is encrypted (HTTPS/TLS)
- Sessions use short-lived signed tokens, stored in your device's Keychain
- Phone numbers used for friend matching are additionally stored as salted hashes
- Access to production data is limited to the two people who build Marco

## Children

Marco is not directed at children under 13, and you must be at least 13 to create an account. If you believe a child under 13 is using Marco, contact us and we will delete the account and its data.

## Changes to this policy

If this policy materially changes, we will notify users in the app and update the date at the top.

## Data controller

LongShot Digital OÜ
Registry code: 17437669
Tallinn, Estonia

Email: [info@letsmarco.com](mailto:info@letsmarco.com)

---

[← Back to Marco](/app/marco/)
