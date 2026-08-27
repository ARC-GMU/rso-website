<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import MemberSignIn from "$lib/components/MemberSignIn.svelte";
	import {
		member,
		loadProfile,
		saveProfile,
		changePassword,
		uploadPhoto,
		logout
	} from "$lib/memberSession";

	const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Alumni"];

	let loading = $state(true);
	let photoInput: HTMLInputElement;

	let name = $state("");
	let email = $state("");
	let major = $state("");
	let year = $state("");
	let profileMessage = $state("");
	let profileError = $state("");
	let savingProfile = $state(false);

	let currentPassword = $state("");
	let newPassword = $state("");
	let confirmPassword = $state("");
	let passwordMessage = $state("");
	let passwordError = $state("");
	let savingPassword = $state(false);

	let photoError = $state("");
	let uploadingPhoto = $state(false);

	onMount(async () => {
		await loadProfile();
		loading = false;
	});

	$effect(() => {
		const profile = $member;
		if (!profile) return;
		name = profile.name;
		email = profile.email;
		major = profile.major ?? "";
		year = profile.year ?? "";
	});

	async function submitProfile(event: SubmitEvent) {
		event.preventDefault();
		profileMessage = "";
		profileError = "";
		savingProfile = true;
		try {
			await saveProfile({ name, email, major, year });
			profileMessage = "Saved.";
		} catch (e: any) {
			profileError = e.message;
		} finally {
			savingProfile = false;
		}
	}

	async function submitPassword(event: SubmitEvent) {
		event.preventDefault();
		passwordMessage = "";
		passwordError = "";

		if (newPassword !== confirmPassword) {
			passwordError = "The new passwords do not match.";
			return;
		}

		savingPassword = true;
		try {
			await changePassword(currentPassword, newPassword);
			passwordMessage = "Password changed.";
			currentPassword = "";
			newPassword = "";
			confirmPassword = "";
		} catch (e: any) {
			passwordError = e.message;
		} finally {
			savingPassword = false;
		}
	}

	async function handlePhoto(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		photoError = "";
		uploadingPhoto = true;
		try {
			await uploadPhoto(file);
		} catch (e: any) {
			photoError = e.message;
		} finally {
			uploadingPhoto = false;
			if (photoInput) photoInput.value = "";
		}
	}

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";
</script>

<Page title="My Account" heading="My Account">
	{#if loading}
		<Panel flush>
			<div class="px-6 py-12 text-center text-[15px] font-medium text-[var(--arc-muted)]">
				LOADING...
			</div>
		</Panel>
	{:else if !$member}
		<MemberSignIn />
	{:else}
		<Panel flush>
			<div class="flex flex-wrap items-center gap-6 px-6 py-6">
				{#if $member.photoUrl}
					<img
						src={$member.photoUrl}
						alt={$member.name}
						class="h-24 w-24 rounded-full border border-[var(--arc-line)] object-cover"
					/>
				{:else}
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--arc-line)] bg-[var(--arc-fill)]"
					>
						<Icon icon="mdi:account" class="text-4xl text-[var(--arc-faint)]" />
					</div>
				{/if}

				<div class="flex-1">
					<div class="text-[22px] font-bold text-[var(--arc-ink)]">{$member.name}</div>
					<div class="mt-1 font-mono text-[14px] font-bold text-[var(--arc-accent)]">
						{$member.clubId}
					</div>
					<div class="mt-1 text-[14px] font-medium text-[var(--arc-muted)]">
						{$member.email}
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<button
						class="arc-btn-small cursor-pointer"
						onclick={() => photoInput.click()}
						disabled={uploadingPhoto}
					>
						<Icon icon="mdi:camera" class="inline-block align-text-bottom" />
						{uploadingPhoto ? "UPLOADING..." : "CHANGE PHOTO"}
					</button>
					<button class="arc-btn-small cursor-pointer" onclick={logout}>SIGN OUT</button>
				</div>

				<input
					bind:this={photoInput}
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handlePhoto}
				/>
			</div>
			{#if photoError}
				<div class="px-6 pb-4 text-[14px] font-bold text-[var(--arc-warn)]">{photoError}</div>
			{/if}
		</Panel>

		<Panel title="DETAILS" flush>
			<form class="flex flex-col gap-5 px-6 py-6" onsubmit={submitProfile}>
				{#if profileError}
					<div class="text-[14px] font-bold text-[var(--arc-warn)]">{profileError}</div>
				{:else if profileMessage}
					<div class="text-[14px] font-bold text-[var(--arc-accent)]">{profileMessage}</div>
				{/if}

				<label class="flex flex-col gap-2">
					<span class="arc-label">NAME</span>
					<input class={inputClass} type="text" bind:value={name} required />
				</label>

				<label class="flex flex-col gap-2">
					<span class="arc-label">GMU EMAIL</span>
					<input class={inputClass} type="email" bind:value={email} required />
				</label>

				<div class="grid gap-5 sm:grid-cols-2">
					<label class="flex flex-col gap-2">
						<span class="arc-label">MAJOR</span>
						<input class={inputClass} type="text" bind:value={major} />
					</label>
					<label class="flex flex-col gap-2">
						<span class="arc-label">YEAR</span>
						<select class={inputClass} bind:value={year}>
							<option value="">—</option>
							{#each YEARS as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</label>
				</div>

				<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={savingProfile}>
					{savingProfile ? "SAVING..." : "SAVE DETAILS"}
				</button>
			</form>
		</Panel>

		<Panel title="PASSWORD" flush>
			<form class="flex flex-col gap-5 px-6 py-6" onsubmit={submitPassword}>
				{#if passwordError}
					<div class="text-[14px] font-bold text-[var(--arc-warn)]">{passwordError}</div>
				{:else if passwordMessage}
					<div class="text-[14px] font-bold text-[var(--arc-accent)]">{passwordMessage}</div>
				{/if}

				<label class="flex flex-col gap-2">
					<span class="arc-label">CURRENT PASSWORD</span>
					<input class={inputClass} type="password" bind:value={currentPassword} required />
				</label>

				<label class="flex flex-col gap-2">
					<span class="arc-label">NEW PASSWORD</span>
					<input class={inputClass} type="password" bind:value={newPassword} minlength="8" required />
				</label>

				<label class="flex flex-col gap-2">
					<span class="arc-label">CONFIRM NEW PASSWORD</span>
					<input class={inputClass} type="password" bind:value={confirmPassword} minlength="8" required />
				</label>

				<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={savingPassword}>
					{savingPassword ? "SAVING..." : "CHANGE PASSWORD"}
				</button>
			</form>
		</Panel>
	{/if}
</Page>
