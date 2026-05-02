<script lang="ts">
	import { onMount } from "svelte";

	type Image = { src: string; caption: string; date: string };
	type Video = { src: string; title: string; date: string };

	let images = $state<Image[]>([]);
	let videos = $state<Video[]>([]);
	let loading = $state(true);
	let activeTab = $state<"images" | "videos">("images");
	let lightboxOpen = $state(false);
	let lightboxSrc = $state("");
	let lightboxCaption = $state("");

	onMount(async () => {
		try {
			const res = await fetch(
				"https://manage.autonomousrobotics.club/api/public/media",
				{ cache: "no-store" },
			);
			if (res.ok) {
				const data = await res.json();
				const mediaList: any[] = data.media || [];

				images = mediaList
					.filter((m) => m.category === "image")
					.map((m) => ({
						src: m.url,
						caption: m.originalName
							.replace(/\.[^/.]+$/, "")
							.replace(/[-_]/g, " "),
						date: m.uploadedAt ? m.uploadedAt.split("T")[0] : "",
					}))
					.sort((a, b) => b.date.localeCompare(a.date));

				videos = mediaList
					.filter((m) => m.category === "video")
					.map((m) => ({
						src: m.url,
						title: m.originalName
							.replace(/\.[^/.]+$/, "")
							.replace(/[-_]/g, " "),
						date: m.uploadedAt ? m.uploadedAt.split("T")[0] : "",
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
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}
</script>

<div class="super-container">
	<div class="config-category">
		<h2>MEDIA GALLERY</h2>

		{#if loading}
			<p class="text-sm text-[#555]">Loading...</p>
		{:else}
			<div
				class="flex gap-0 border border-black mb-5 mt-4"
				style="width: fit-content;"
			>
				<button
					class="px-5 py-2 font-bold text-sm font-mono border-none cursor-pointer {activeTab ===
					'images'
						? 'bg-black text-white'
						: 'bg-[#eee] text-black hover:bg-[#ddd]'}"
					onclick={() => (activeTab = "images")}
				>
					IMAGES ({images.length})
				</button>
				<button
					class="px-5 py-2 font-bold text-sm font-mono border-none border-l border-black cursor-pointer {activeTab ===
					'videos'
						? 'bg-black text-white'
						: 'bg-[#eee] text-black hover:bg-[#ddd]'}"
					onclick={() => (activeTab = "videos")}
				>
					VIDEOS ({videos.length})
				</button>
			</div>

			{#if activeTab === "images"}
				{#if images.length === 0}
					<div class="hardware-box">
						<p>No images available.</p>
					</div>
				{:else}
					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
					>
						{#each images as img}
							<button
								class="border border-black bg-[#f8f8f8] p-0 cursor-pointer overflow-hidden group block w-full text-left"
								onclick={() => openLightbox(img.src, img.caption)}
							>
								<div class="w-full h-48 overflow-hidden">
									<img
										src={img.src}
										alt={img.caption}
										class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			{/if}

			{#if activeTab === "videos"}
				{#if videos.length === 0}
					<div class="hardware-box">
						<p>No videos available.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{#each videos as vid}
							<div
								class="border border-black bg-[#f8f8f8] overflow-hidden"
							>
								<div class="w-full aspect-video">
									<video controls class="w-full h-full">
										<source src={vid.src} />
										<track kind="captions" />
									</video>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>

{#if lightboxOpen}
	<div
		class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer"
			aria-label="Close background"
			onclick={closeLightbox}
		></button>

		<button
			class="absolute top-4 right-4 text-white font-bold text-2xl bg-transparent border-none cursor-pointer z-50 hover:text-gray-300"
			onclick={closeLightbox}
			aria-label="Close lightbox"
		>
			✕
		</button>
		<div class="relative max-w-4xl max-h-[90vh] w-full pointer-events-none">
			<img
				src={lightboxSrc}
				alt={lightboxCaption}
				class="w-full max-h-[80vh] object-contain pointer-events-auto"
			/>
		</div>
	</div>
{/if}
