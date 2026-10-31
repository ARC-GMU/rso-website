<script lang="ts">
	import { onMount } from "svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import MediaTimeline from "$lib/components/MediaTimeline.svelte";
	import { apiRoot } from "$lib/theme/content";
	import {
		buildTimeline,
		formatMediaDate,
		toTimelineMedia,
		type TimelineMedia
	} from "$lib/mediaTimeline";

	type MediaFilter = "all" | "image" | "video";

	const filters: { value: MediaFilter; label: string }[] = [
		{ value: "all", label: "ALL" },
		{ value: "image", label: "IMAGES" },
		{ value: "video", label: "VIDEOS" }
	];

	let media = $state<TimelineMedia[]>([]);
	let loading = $state(true);
	let activeFilter = $state<MediaFilter>("all");
	let lightboxItem = $state<TimelineMedia | null>(null);

	let visibleMedia = $derived(
		activeFilter === "all" ? media : media.filter((item) => item.kind === activeFilter)
	);
	let years = $derived(buildTimeline(visibleMedia));

	function filterCount(filter: MediaFilter): number {
		return filter === "all" ? media.length : media.filter((item) => item.kind === filter).length;
	}

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/media`, { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				media = (data.media || [])
					.map(toTimelineMedia)
					.filter((item: TimelineMedia | null): item is TimelineMedia => item !== null);
			}
		} catch (e) {
			console.error("Error fetching media:", e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (lightboxItem = null)} />

<Page title="Media" heading="Media Gallery">
	{#if loading}
		<Panel>
			<p class="arc-note">Loading...</p>
		</Panel>
	{:else}
		<div class="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap">
			{#each filters as filter (filter.value)}
				<button
					class="cursor-pointer border px-4 py-2.5 sm:px-5 text-[13px] font-bold tracking-[0.1em] {activeFilter ===
					filter.value
						? 'border-[var(--arc-ink)] bg-[var(--arc-ink)] text-[var(--arc-invert-text)]'
						: 'border-[var(--arc-line)] bg-[var(--arc-surface)] text-[var(--arc-ink)] hover:border-[var(--arc-accent)]'}"
					onclick={() => (activeFilter = filter.value)}
				>
					{filter.label} ({filterCount(filter.value)})
				</button>
			{/each}
		</div>

		{#if years.length === 0}
			<Panel>
				<p class="arc-note">Nothing has been shared here yet.</p>
			</Panel>
		{:else}
			<MediaTimeline {years} onOpenImage={(item) => (lightboxItem = item)} />
		{/if}
	{/if}
</Page>

{#if lightboxItem}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 h-full w-full cursor-pointer border-none bg-transparent"
			aria-label="Close image"
			onclick={() => (lightboxItem = null)}
		></button>
		<button
			class="absolute top-4 right-4 z-50 cursor-pointer border-none bg-transparent px-3 py-2 text-[13px] font-bold tracking-[0.1em] text-white hover:text-[#a3d9b8]"
			onclick={() => (lightboxItem = null)}
		>
			CLOSE
		</button>
		<figure class="pointer-events-none m-0 flex max-w-full flex-col items-center">
			<img
				src={lightboxItem.src}
				alt={lightboxItem.altText}
				class="max-h-[78vh] w-auto max-w-full object-contain"
			/>
			<figcaption class="mt-3 flex max-w-2xl flex-col items-center gap-1 text-center text-white">
				<span class="text-[12px] font-bold tracking-[0.1em] text-[#a3d9b8]">
					{formatMediaDate(lightboxItem).toUpperCase()}
				</span>
				{#if lightboxItem.caption}
					<span class="text-[14px]">{lightboxItem.caption}</span>
				{/if}
			</figcaption>
		</figure>
	</div>
{/if}
