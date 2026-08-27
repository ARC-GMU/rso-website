<script lang="ts">
	import { onMount } from "svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot } from "$lib/theme/content";

	type Image = { src: string; caption: string; date: string };
	type Video = { src: string; title: string; date: string };

	let images = $state<Image[]>([]);
	let videos = $state<Video[]>([]);
	let loading = $state(true);
	let activeTab = $state<"images" | "videos">("images");
	let lightboxSrc = $state("");
	let lightboxCaption = $state("");

	function cleanName(originalName: string) {
		return originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
	}

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/media`, { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				const mediaList: any[] = data.media || [];

				images = mediaList
					.filter((item) => item.category === "image")
					.map((item) => ({
						src: item.url,
						caption: cleanName(item.originalName),
						date: item.uploadedAt ? item.uploadedAt.split("T")[0] : ""
					}))
					.sort((a, b) => b.date.localeCompare(a.date));

				videos = mediaList
					.filter((item) => item.category === "video")
					.map((item) => ({
						src: item.url,
						title: cleanName(item.originalName),
						date: item.uploadedAt ? item.uploadedAt.split("T")[0] : ""
					}))
					.sort((a, b) => b.date.localeCompare(a.date));
			}
		} catch (e) {
			console.error("Error fetching media:", e);
		} finally {
			loading = false;
		}
	});

	function openLightbox(src: string, caption: string) {
		lightboxSrc = src;
		lightboxCaption = caption;
	}

	function closeLightbox() {
		lightboxSrc = "";
		lightboxCaption = "";
	}
</script>

<Page title="Media" heading="Media Gallery">
	{#if loading}
		<Panel>
			<p class="arc-note">Loading...</p>
		</Panel>
	{:else}
		<div class="flex flex-wrap gap-3">
			<button
				class="cursor-pointer border px-5 py-2.5 text-[13px] font-bold tracking-[0.1em] {activeTab ===
				'images'
					? 'border-[var(--arc-ink)] bg-[var(--arc-ink)] text-[var(--arc-invert-text)]'
					: 'border-[var(--arc-line)] bg-[var(--arc-surface)] text-[var(--arc-ink)] hover:border-[var(--arc-accent)]'}"
				onclick={() => (activeTab = "images")}
			>
				IMAGES ({images.length})
			</button>
			<button
				class="cursor-pointer border px-5 py-2.5 text-[13px] font-bold tracking-[0.1em] {activeTab ===
				'videos'
					? 'border-[var(--arc-ink)] bg-[var(--arc-ink)] text-[var(--arc-invert-text)]'
					: 'border-[var(--arc-line)] bg-[var(--arc-surface)] text-[var(--arc-ink)] hover:border-[var(--arc-accent)]'}"
				onclick={() => (activeTab = "videos")}
			>
				VIDEOS ({videos.length})
			</button>
		</div>

		{#if activeTab === "images"}
			{#if images.length === 0}
				<Panel>
					<p class="arc-note">No images available.</p>
				</Panel>
			{:else}
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each images as image}
						<button
							class="arc-panel block w-full cursor-pointer overflow-hidden p-0 text-left"
							onclick={() => openLightbox(image.src, image.caption)}
						>
							<img
								src={image.src}
								alt={image.caption}
								class="h-48 w-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</button>
					{/each}
				</div>
			{/if}
		{:else if videos.length === 0}
			<Panel>
				<p class="arc-note">No videos available.</p>
			</Panel>
		{:else}
			<div class="grid gap-5 lg:grid-cols-2">
				{#each videos as video}
					<div class="arc-panel overflow-hidden">
						<video controls class="aspect-video w-full">
							<source src={video.src} />
							<track kind="captions" />
						</video>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</Page>

{#if lightboxSrc}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 h-full w-full cursor-pointer border-none bg-transparent"
			aria-label="Close image"
			onclick={closeLightbox}
		></button>
		<button
			class="absolute top-4 right-4 z-50 cursor-pointer border-none bg-transparent px-3 py-2 text-[13px] font-bold tracking-[0.1em] text-white hover:text-[#a3d9b8]"
			onclick={closeLightbox}
		>
			CLOSE
		</button>
		<img
			src={lightboxSrc}
			alt={lightboxCaption}
			class="pointer-events-none max-h-[85vh] w-auto max-w-full object-contain"
		/>
	</div>
{/if}
