<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let activeTab = $state<"images" | "videos">("images");

    let lightboxOpen = $state(false);
    let lightboxSrc = $state("");
    let lightboxCaption = $state("");

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
                IMAGES ({data.images.length})
            </button>
            <button
                class="px-5 py-2 font-bold text-sm font-mono border-none border-l border-black cursor-pointer {activeTab ===
                'videos'
                    ? 'bg-black text-white'
                    : 'bg-[#eee] text-black hover:bg-[#ddd]'}"
                onclick={() => (activeTab = "videos")}
            >
                VIDEOS ({data.videos.length})
            </button>
        </div>

        {#if activeTab === "images"}
            {#if data.images.length === 0}
                <div class="hardware-box">
                    <p>No images found from server.</p>
                </div>
            {:else}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {#each data.images as img}
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
            {#if data.videos.length === 0}
                <div class="hardware-box">
                    <p>No videos found from server.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {#each data.videos as vid}
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
