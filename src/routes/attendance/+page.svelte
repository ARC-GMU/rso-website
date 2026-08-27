<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot } from "$lib/theme/content";
	import { member, loadProfile } from "$lib/memberSession";

	type MeetingStatus = {
		open: boolean;
		title?: string;
		date?: string;
		location?: string;
	};

	let status = $state<MeetingStatus>({ open: false });
	let checking = $state(true);

	let clubId = $state("");
	let email = $state("");
	let code = $state("");

	let submitting = $state(false);
	let errorMessage = $state("");
	let signedInAs = $state("");
	let alreadySignedIn = $state(false);

	async function loadStatus() {
		try {
			const res = await fetch(`${apiRoot}/public/checkin/status`, { cache: "no-store" });
			if (res.ok) status = await res.json();
		} catch {
			status = { open: false };
		} finally {
			checking = false;
		}
	}

	onMount(async () => {
		await Promise.all([loadStatus(), loadProfile()]);
	});

	$effect(() => {
		if (!$member) return;
		clubId = $member.clubId;
		email = $member.email;
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = "";
		submitting = true;

		try {
			const res = await fetch(`${apiRoot}/public/checkin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ clubId, email, code })
			});

			if (!res.ok) {
				errorMessage = (await res.text()).trim() || "Sign in failed, try again.";
				return;
			}

			const data = await res.json();
			signedInAs = data.name;
			alreadySignedIn = data.alreadySignedIn;
		} catch {
			errorMessage = "Could not reach the sign in service.";
		} finally {
			submitting = false;
		}
	}

	function signInAgain() {
		signedInAs = "";
		code = "";
		if (!$member) {
			clubId = "";
			email = "";
		}
		loadStatus();
	}

	function formatDate(value?: string) {
		if (!value) return "";
		return new Date(value).toLocaleString(undefined, {
			weekday: "long",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	}

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";
</script>

<Page title="Meeting Sign In" heading="Meeting Sign In">
	{#if signedInAs}
		<Panel flush>
			<div class="flex flex-col items-center gap-4 px-6 py-12 text-center">
				<Icon
					icon={alreadySignedIn ? "mdi:check-circle-outline" : "mdi:check-circle"}
					class="text-6xl text-[var(--arc-accent)]"
				/>
				<div class="text-[22px] font-bold text-[var(--arc-ink)]">
					{alreadySignedIn ? "You were already signed in" : "You are signed in"}
				</div>
				<div class="text-[15px] font-medium text-[var(--arc-muted)]">
					{signedInAs}{status.title ? ` — ${status.title}` : ""}
				</div>
				<button class="arc-btn-ghost mt-2 cursor-pointer" onclick={signInAgain}>
					SIGN IN SOMEONE ELSE
				</button>
			</div>
		</Panel>
	{:else if checking}
		<Panel flush>
			<div class="px-6 py-12 text-center text-[15px] font-medium text-[var(--arc-muted)]">
				CHECKING FOR AN OPEN MEETING...
			</div>
		</Panel>
	{:else if !status.open}
		<Panel flush>
			<div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
				<Icon icon="mdi:calendar-clock" class="text-5xl text-[var(--arc-faint)]" />
				<div class="text-[18px] font-bold text-[var(--arc-ink)]">
					No meeting is open for sign in
				</div>
				<p class="m-0 max-w-[420px] text-[15px] leading-[1.7] text-[var(--arc-muted)]">
					An officer opens sign in at the start of each meeting. Check back once the
					meeting has started, or ask an officer for help.
				</p>
			</div>
		</Panel>
	{:else}
		<Panel flush>
			<div class="border-b border-[var(--arc-line)] px-6 py-5">
				<div class="arc-label">SIGNING IN TO</div>
				<div class="mt-1 text-[20px] font-bold text-[var(--arc-ink)]">{status.title}</div>
				<div class="mt-1 text-[14px] font-medium text-[var(--arc-muted)]">
					{formatDate(status.date)}{status.location ? ` · ${status.location}` : ""}
				</div>
			</div>

			<form class="flex flex-col gap-5 px-6 py-6" onsubmit={submit}>
				{#if errorMessage}
					<div
						class="border border-[var(--arc-warn)] px-4 py-3 text-[14px] font-bold text-[var(--arc-warn)]"
					>
						{errorMessage}
					</div>
				{/if}

				{#if $member}
					<div class="border border-[var(--arc-line)] bg-[var(--arc-fill)] px-4 py-3">
						<div class="arc-label">SIGNING IN AS</div>
						<div class="mt-1 text-[16px] font-bold text-[var(--arc-ink)]">
							{$member.name}
						</div>
						<div class="font-mono text-[13px] font-bold text-[var(--arc-accent)]">
							{$member.clubId}
						</div>
					</div>
				{:else}
					<label class="flex flex-col gap-2">
						<span class="arc-label">CLUB ID</span>
						<input
							class={inputClass}
							type="text"
							bind:value={clubId}
							placeholder="ARC-XXXX"
							autocomplete="off"
							autocapitalize="characters"
							required
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="arc-label">GMU EMAIL</span>
						<input
							class={inputClass}
							type="email"
							bind:value={email}
							placeholder="name@gmu.edu"
							autocomplete="email"
							required
						/>
					</label>
				{/if}

				<label class="flex flex-col gap-2">
					<span class="arc-label">MEETING CODE</span>
					<input
						class="{inputClass} text-center text-[24px] font-bold tracking-[0.3em]"
						type="text"
						bind:value={code}
						placeholder="------"
						autocomplete="off"
						autocapitalize="characters"
						required
					/>
					<span class="text-[13px] font-medium text-[var(--arc-muted-2)]">
						Shown on the screen at the meeting.
					</span>
				</label>

				<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={submitting}>
					{submitting ? "SIGNING IN..." : "SIGN IN"}
				</button>
			</form>
		</Panel>

		<Panel flush>
			<div class="px-6 py-5">
				<div class="arc-label">DO NOT HAVE A CLUB ID?</div>
				<p class="m-0 mt-2 text-[15px] leading-[1.7] text-[var(--arc-muted)]">
					Club IDs are issued once when you join. Ask an officer at the meeting and they
					can add you to the directory and give you yours.
				</p>
				{#if !$member}
					<a class="arc-link mt-3 inline-block" href="/account">
						SIGN IN TO FILL THIS IN AUTOMATICALLY
					</a>
				{/if}
			</div>
		</Panel>
	{/if}
</Page>
