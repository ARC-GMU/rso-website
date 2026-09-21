<script lang="ts">
	import Icon from "@iconify/svelte";
	import { deleteMedia, member, uploadMedia, type MemberMedia } from "$lib/memberSession";

	const MAX_ITEMS = 12;

	let fileInput: HTMLInputElement | undefined = $state();
	let caption = $state("");
	let uploading = $state(false);
	let errorMessage = $state("");

	let gallery = $derived(($member?.gallery ?? []) as MemberMedia[]);
	let full = $derived(gallery.length >= MAX_ITEMS);

	async function handleFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;

		errorMessage = "";
		uploading = true;
		try {
			await uploadMedia(file, caption);
			caption = "";
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			uploading = false;
		}
	}

	async function remove(item: MemberMedia) {
		if (!confirm("Remove this from your profile?")) return;

		errorMessage = "";
		try {
			await deleteMedia(item.url);
		} catch (e: any) {
			errorMessage = e.message;
		}
	}
</script>

<div class="flex flex-col gap-6 px-6 py-6">
	{#if errorMessage}
		<div class="text-[14px] font-bold text-[var(--arc-warn)]">{errorMessage}</div>
	{/if}

	<div class="flex flex-col gap-3 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-5">
		<div class="arc-label">ADD TO YOUR PROFILE</div>
		<p class="arc-note m-0">
			Images and videos of what you have built. {gallery.length} of {MAX_ITEMS} used.
		</p>

		<input
			class="w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[15px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]"
			type="text"
			bind:value={caption}
			maxlength="200"
			placeholder="Caption (optional)"
		/>

		<button
			class="arc-btn cursor-pointer disabled:opacity-60"
			onclick={() => fileInput?.click()}
			disabled={uploading || full}
		>
			<Icon icon="mdi:upload" class="inline-block align-text-bottom" />
			{uploading ? "UPLOADING..." : full ? "PROFILE FULL" : "UPLOAD IMAGE OR VIDEO"}
		</button>

		<input
			bind:this={fileInput}
			type="file"
			accept="image/*,video/*"
			class="hidden"
			onchange={handleFile}
		/>
	</div>

	{#if gallery.length === 0}
		<div class="flex flex-col items-center gap-3 py-8 text-center">
			<Icon icon="mdi:image-multiple-outline" class="text-5xl text-[var(--arc-faint)]" />
			<p class="m-0 max-w-[420px] text-[15px] leading-[1.7] text-[var(--arc-muted)]">
				Nothing here yet. Anything you upload shows on your public profile.
			</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each gallery as item (item.url)}
				<div class="flex flex-col border border-[var(--arc-line)] bg-[var(--arc-surface)]">
					{#if item.type === "video"}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video src={item.url} controls class="h-44 w-full bg-black object-contain"></video>
					{:else}
						<img
							src={item.url}
							alt={item.caption || "Member upload"}
							class="h-44 w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					{/if}

					<div class="flex items-center justify-between gap-3 p-4">
						<span class="min-w-0 flex-1 text-[14px] font-medium text-[var(--arc-muted)]">
							{item.caption || (item.type === "video" ? "Video" : "Image")}
						</span>
						<button class="arc-btn-small cursor-pointer" onclick={() => remove(item)}>
							<Icon icon="mdi:trash-can-outline" class="inline-block align-text-bottom" />
							REMOVE
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
