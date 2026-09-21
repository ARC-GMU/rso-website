<script lang="ts">
	import Icon from "@iconify/svelte";
	import { invalidateAll } from "$app/navigation";
	import RichEditor from "$lib/components/RichEditor.svelte";
	import {
		deleteProjectUpdate,
		member,
		postProjectUpdate,
		uploadUpdateImage,
		type ProjectUpdate
	} from "$lib/memberSession";

	let {
		projectId,
		updates = [],
		canPost = false
	}: { projectId: string; updates?: ProjectUpdate[]; canPost?: boolean } = $props();

	let composing = $state(false);
	let title = $state("");
	let body = $state("");
	let images = $state<string[]>([]);
	let saving = $state(false);
	let uploading = $state(false);
	let errorMessage = $state("");
	let fileInput: HTMLInputElement | undefined = $state();

	function reset() {
		title = "";
		body = "";
		images = [];
		errorMessage = "";
	}

	async function handleImage(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;

		errorMessage = "";
		uploading = true;
		try {
			images = [...images, await uploadUpdateImage(file)];
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			uploading = false;
		}
	}

	function removeImage(url: string) {
		images = images.filter((image) => image !== url);
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = "";

		if (!title.trim()) {
			errorMessage = "Give the update a title.";
			return;
		}

		saving = true;
		try {
			await postProjectUpdate({ projectId, title: title.trim(), body, images });
			reset();
			composing = false;
			await invalidateAll();
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			saving = false;
		}
	}

	async function remove(update: ProjectUpdate) {
		if (!confirm(`Delete your update "${update.title}"?`)) return;

		try {
			await deleteProjectUpdate(update.id);
			await invalidateAll();
		} catch (e: any) {
			errorMessage = e.message;
		}
	}

	function formatDate(value: string) {
		if (!value) return "";
		return new Date(value).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	}

	function isMine(update: ProjectUpdate) {
		return Boolean($member?.id) && update.authorMemberId === $member?.id;
	}

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";
</script>

<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
	<div class="flex flex-wrap items-baseline justify-between gap-4">
		<h2 class="arc-h2">PROJECT UPDATES</h2>
		{#if canPost && !composing}
			<button class="arc-btn-small cursor-pointer" onclick={() => (composing = true)}>
				<Icon icon="mdi:plus" class="inline-block align-text-bottom" />
				POST AN UPDATE
			</button>
		{/if}
	</div>

	{#if errorMessage}
		<div class="mt-4 text-[14px] font-bold text-[var(--arc-warn)]">{errorMessage}</div>
	{/if}

	{#if canPost && composing}
		<form class="mt-6 flex flex-col gap-4 border border-[var(--arc-line)] p-5" onsubmit={submit}>
			<label class="flex flex-col gap-2">
				<span class="arc-label">TITLE</span>
				<input class={inputClass} type="text" bind:value={title} maxlength="120" required />
			</label>

			<div class="flex flex-col gap-2">
				<span class="arc-label">UPDATE</span>
				<RichEditor bind:content={body} placeholder="What did the team get done?" />
			</div>

			<div class="flex flex-col gap-3">
				<span class="arc-label">IMAGES</span>
				{#if images.length > 0}
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{#each images as image (image)}
							<div class="border border-[var(--arc-line)]">
								<img src={image} alt="Update" class="h-24 w-full object-cover" />
								<button
									type="button"
									class="w-full cursor-pointer border-t border-[var(--arc-line)] py-1 text-[12px] font-bold text-[var(--arc-warn)]"
									onclick={() => removeImage(image)}
								>
									REMOVE
								</button>
							</div>
						{/each}
					</div>
				{/if}

				<button
					type="button"
					class="arc-btn-small cursor-pointer self-start"
					onclick={() => fileInput?.click()}
					disabled={uploading}
				>
					<Icon icon="mdi:image-plus" class="inline-block align-text-bottom" />
					{uploading ? "UPLOADING..." : "ADD IMAGE"}
				</button>

				<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handleImage}
				/>
			</div>

			<div class="flex flex-wrap gap-3">
				<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={saving}>
					{saving ? "POSTING..." : "POST UPDATE"}
				</button>
				<button
					type="button"
					class="arc-btn-ghost cursor-pointer"
					onclick={() => {
						reset();
						composing = false;
					}}
				>
					CANCEL
				</button>
			</div>
		</form>
	{/if}

	{#if updates.length === 0}
		<p class="arc-note mt-6">No updates posted yet.</p>
	{:else}
		<div class="mt-6 flex flex-col gap-6">
			{#each updates as update (update.id)}
				<article class="border-l-2 border-[var(--arc-accent)] pl-5">
					<div class="flex flex-wrap items-baseline justify-between gap-3">
						<h3 class="arc-h3 text-[18px] text-[var(--arc-ink)]">{update.title}</h3>
						{#if isMine(update)}
							<button
								class="cursor-pointer text-[12px] font-bold tracking-[0.08em] text-[var(--arc-warn)]"
								onclick={() => remove(update)}
							>
								DELETE
							</button>
						{/if}
					</div>

					<div class="arc-note mt-1">
						{formatDate(update.postedAt)}{update.author ? ` · ${update.author}` : ""}
					</div>

					{#if update.body}
						<div
							class="prose prose-sm md:prose-base mt-3 max-w-none text-[var(--arc-ink-2)] prose-p:my-2 prose-li:my-0"
						>
							{@html update.body}
						</div>
					{/if}

					{#if (update.images ?? []).length > 0}
						<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
							{#each update.images as image (image)}
								<img
									src={image}
									alt={update.title}
									class="h-40 w-full border border-[var(--arc-line)] object-cover"
									loading="lazy"
									decoding="async"
								/>
							{/each}
						</div>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</section>
