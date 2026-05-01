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

<div class="super-container">
    <div class="config-category">
        <h2>CLUB BLOG</h2>

        {#if data.posts && data.posts.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {#each data.posts as post}
                    <div class="border border-black bg-[#f8f8f8] flex flex-col h-full hover:bg-[#eee] transition-colors">
                        {#if post.coverImageUrl}
                            <a href={`/blog/${post.slug}`} class="w-full h-48 overflow-hidden block border-b border-black">
                                <img
                                    src={post.coverImageUrl}
                                    alt={post.title}
                                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </a>
                        {/if}
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="m-0 text-xl font-bold mb-2">
                                <a href={`/blog/${post.slug}`} class="text-black no-underline hover:underline">
                                    {post.title}
                                </a>
                            </h3>
                            <div class="text-xs text-[#555] mb-3">
                                {formatDate(post.publishedAt || post.createdAt)} • By {post.author}
                            </div>
                            <p class="text-sm m-0 mb-4 flex-1">
                                {post.excerpt || ""}
                            </p>
                            <a href={`/blog/${post.slug}`} class="mt-auto block">
                                <button class="edit-btn w-full">READ MORE</button>
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="hardware-box">
                <p>No blog posts available at this time.</p>
            </div>
        {/if}
    </div>
</div>