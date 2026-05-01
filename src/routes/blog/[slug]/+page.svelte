<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<svelte:head>
    <title>{data.post.title} | ARC Blog</title>
    <meta name="description" content={data.post.excerpt || data.post.title} />
    {#if data.post.coverImageUrl}
        <meta property="og:image" content={data.post.coverImageUrl} />
    {/if}
</svelte:head>

<div class="super-container">
    <div class="mb-4">
        <a href="/blog" class="text-sm font-bold no-underline hover:underline flex items-center gap-1 w-fit">
            &larr; BACK TO BLOG
        </a>
    </div>

    <div class="config-category">
        {#if data.post.coverImageUrl}
            <div class="w-full h-64 md:h-96 mb-6 border border-black overflow-hidden">
                <img 
                    src={data.post.coverImageUrl} 
                    alt={data.post.title}
                    class="w-full h-full object-cover"
                />
            </div>
        {/if}
        
        <h1 class="text-3xl md:text-4xl mb-2 font-bold uppercase">{data.post.title}</h1>
        
        <div class="text-sm text-[#555] mb-8 pb-4 border-b border-black">
            <span>Published on {formatDate(data.post.publishedAt || data.post.createdAt)}</span>
            <span class="mx-2">•</span>
            <span>By {data.post.author}</span>
            {#if data.post.tags && data.post.tags.length > 0}
                <div class="mt-2 flex flex-wrap gap-2">
                    {#each data.post.tags as tag}
                        <span class="bg-[#eee] px-2 py-1 text-xs border border-black uppercase">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="prose prose-sm md:prose-base max-w-none font-mono">
            {@html data.post.content}
        </div>
    </div>
</div>