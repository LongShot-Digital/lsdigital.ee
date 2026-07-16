<script lang="ts">
	// 1e — owner-only for MVP. The editor row + invite button render dashed:
	// a pilot venue is one person with a laptop.
	let name = $state('Le Motel');
	let type = $state('Venue');
	let city = $state('Paris');
	let home = $state('8 Passage Josset, 75011 Paris');
	let links = $state('instagram.com/lemotelparis · lemotel.fr');
	let saved = $state(false);

	function save() {
		saved = true;
		setTimeout(() => (saved = false), 1800);
	}
</script>

<h1 class="title">Settings</h1>

<div class="columns">
	<!-- public profile -->
	<section class="card profile">
		<span class="card-label">PUBLIC PROFILE</span>
		<div class="profile-body">
			<div class="logo-col">
				<div class="logo-tile">LM</div>
				<button class="upload">Upload logo</button>
			</div>
			<div class="fields">
				<label class="field">
					<span class="field-label">NAME</span>
					<input type="text" bind:value={name} />
				</label>
				<div class="field-row">
					<label class="field">
						<span class="field-label">TYPE</span>
						<select bind:value={type}>
							<option>Venue</option>
							<option>Promoter</option>
							<option>Community</option>
							<option>Brand</option>
						</select>
					</label>
					<label class="field">
						<span class="field-label">CITY</span>
						<input type="text" bind:value={city} />
					</label>
				</div>
				<label class="field">
					<span class="field-label">HOME LOCATION · WHERE YOUR PINS DEFAULT</span>
					<div class="input-with-icon">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(236,237,240,0.5)" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
						<input type="text" bind:value={home} />
					</div>
				</label>
				<label class="field">
					<span class="field-label">LINKS</span>
					<input type="text" bind:value={links} />
				</label>
			</div>
		</div>
		<div class="save-row">
			<button class="save" onclick={save}>{saved ? 'Saved ✓' : 'Save changes'}</button>
		</div>
	</section>

	<div class="right-col">
		<!-- verification — the console's trust anchor -->
		<section class="card verification">
			<div class="verification-head">
				<span class="card-label green">VERIFICATION</span>
				<span class="seal">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M4.5 12.5l5 5L19.5 7" /></svg>
				</span>
			</div>
			<span class="verified-line">Verified · June 12, 2026</span>
			<p class="verification-body">
				Confirmed on a call with Sam (Marco). Verification covers this organization and its team
				members. Changing your name or type re-triggers a quick human review — that&rsquo;s the
				deal that keeps the map clean.
			</p>
		</section>

		<!-- team -->
		<section class="card team">
			<div class="team-head">
				<span class="card-label">TEAM</span>
				<span class="invite-editor">
					<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="rgba(236,237,240,0.55)" stroke-width="2" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>
					Invite editor · POST-BACKEND
				</span>
			</div>
			<div class="member">
				<span class="avatar theo">TM</span>
				<div class="member-meta">
					<span class="member-name">Théo Marchand</span>
					<span class="member-sub">theo@lemotel.fr · you</span>
				</div>
				<span class="role owner">OWNER</span>
			</div>
			<div class="member pending">
				<span class="avatar lena">LF</span>
				<div class="member-meta">
					<span class="member-name">Lena Ferri</span>
					<span class="member-sub">lena@lemotel.fr · invited</span>
				</div>
				<span class="role editor">EDITOR</span>
			</div>
			<p class="team-note">
				Editors publish and edit events; only the owner touches settings, team and verification.
				Two roles is enough for a pilot — resist the permissions matrix.
			</p>
		</section>
	</div>
</div>

<style>
	.title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 32px;
		letter-spacing: -0.025em;
		color: #f5f6f8;
		margin: 0;
	}

	.columns {
		display: flex;
		gap: 18px;
		align-items: flex-start;
	}
	@media (max-width: 980px) {
		.columns {
			flex-direction: column;
		}
		.columns > * {
			width: 100%;
		}
	}

	.card {
		padding: 22px 24px;
		border-radius: 18px;
		background: #17181d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.profile {
		flex: 1.2;
	}
	.right-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.card-label {
		font-weight: 700;
		font-size: 11px;
		letter-spacing: 0.16em;
		color: rgba(245, 246, 248, 0.4);
	}
	.card-label.green {
		color: #2bce85;
	}

	.profile-body {
		display: flex;
		gap: 18px;
		align-items: flex-start;
	}
	@media (max-width: 560px) {
		.profile-body {
			flex-direction: column;
		}
	}
	.logo-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		flex: none;
	}
	.logo-tile {
		width: 88px;
		height: 88px;
		border-radius: 22px;
		background:
			radial-gradient(120% 120% at 76% 6%, rgba(154, 111, 225, 0.4), transparent 62%),
			#101115;
		border: 1px solid rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 30px;
		color: #c3a8f0;
	}
	.upload {
		border: 0;
		background: none;
		font-family: inherit;
		font-weight: 600;
		font-size: 11.5px;
		color: #5b85f7;
		cursor: pointer;
		padding: 0;
	}

	.fields {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 11px;
		min-width: 0;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		flex: 1;
		min-width: 0;
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
		background: #101115;
		border: 1px solid rgba(255, 255, 255, 0.09);
		padding: 0 14px;
		font-family: inherit;
		font-weight: 600;
		font-size: 14px;
		color: #f5f6f8;
		outline: none;
		width: 100%;
	}
	.field input:focus,
	.field select:focus {
		border-color: rgba(45, 99, 245, 0.6);
	}
	.input-with-icon {
		position: relative;
		display: flex;
		align-items: center;
	}
	.input-with-icon svg {
		position: absolute;
		left: 14px;
		pointer-events: none;
	}
	.input-with-icon input {
		padding-left: 36px;
		font-weight: 500;
		color: rgba(236, 237, 240, 0.8);
	}

	.save-row {
		display: flex;
		justify-content: flex-end;
	}
	.save {
		padding: 10px 22px;
		border-radius: 11px;
		border: 0;
		background: #2d63f5;
		font-family: inherit;
		font-weight: 700;
		font-size: 13.5px;
		color: #fff;
		cursor: pointer;
	}
	.save:hover {
		background: #3a6ef6;
	}

	.verification {
		background: rgba(24, 178, 107, 0.06);
		border: 1px solid rgba(24, 178, 107, 0.35);
		gap: 12px;
	}
	.verification-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.seal {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #2d63f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.verified-line {
		font-weight: 600;
		font-size: 16px;
		color: #f5f6f8;
	}
	.verification-body {
		font-weight: 400;
		font-size: 13px;
		line-height: 1.6;
		color: rgba(236, 237, 240, 0.55);
		margin: 0;
	}

	.team {
		gap: 6px;
	}
	.team-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 8px;
		gap: 10px;
		flex-wrap: wrap;
	}
	.invite-editor {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 7px 14px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px dashed rgba(255, 255, 255, 0.22);
		font-weight: 600;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.55);
	}
	.member {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 11px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}
	.member.pending {
		opacity: 0.65;
		padding-bottom: 4px;
	}
	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 13px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		flex: none;
	}
	.avatar.theo {
		background:
			radial-gradient(120% 120% at 76% 6%, rgba(228, 156, 66, 0.4), transparent 62%),
			#17181d;
		color: #e3b678;
	}
	.avatar.lena {
		background:
			radial-gradient(120% 120% at 76% 6%, rgba(223, 106, 152, 0.4), transparent 62%),
			#17181d;
		color: #e59fbe;
	}
	.member-meta {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}
	.member-name {
		font-weight: 600;
		font-size: 14px;
		color: #f5f6f8;
	}
	.member-sub {
		font-weight: 400;
		font-size: 12px;
		color: rgba(236, 237, 240, 0.45);
	}
	.role {
		padding: 4px 11px;
		border-radius: 999px;
		font-weight: 700;
		font-size: 10px;
		letter-spacing: 0.12em;
		flex: none;
	}
	.role.owner {
		background: rgba(45, 99, 245, 0.14);
		border: 1px solid rgba(45, 99, 245, 0.35);
		color: #5b85f7;
	}
	.role.editor {
		background: rgba(255, 255, 255, 0.05);
		border: 1px dashed rgba(255, 255, 255, 0.25);
		color: rgba(236, 237, 240, 0.5);
	}
	.team-note {
		font-weight: 400;
		font-size: 12px;
		line-height: 1.55;
		color: rgba(236, 237, 240, 0.4);
		padding-top: 8px;
		margin: 0;
	}
</style>
