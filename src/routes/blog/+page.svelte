<script lang="ts">
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function postHref(post: { slug: string; externalUrl?: string }) {
		return post.externalUrl || `/blog/${post.slug}`;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}
</script>

<Page title="Blog" heading="Club Blog">
	{#if data.posts && data.posts.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post}
				<article class="arc-panel flex flex-col">
					{#if post.coverImageUrl}
						<a
							href={postHref(post)}
							target={post.externalUrl ? "_blank" : undefined}
							rel="noopener noreferrer"
							class="block h-48 overflow-hidden border-b border-[#d5dad5]"
						>
							<img
								src={post.coverImageUrl}
								alt={post.title}
								class="h-full w-full object-cover"
							/>
						</a>
					{/if}
					<div class="flex flex-1 flex-col p-6">
						<h2 class="arc-h2">
							<a
								href={postHref(post)}
								target={post.externalUrl ? "_blank" : undefined}
								rel="noopener noreferrer"
								class="text-[#16211c] no-underline hover:text-[#006633]"
							>
								{post.title}
							</a>
						</h2>
						<div class="arc-label mt-3">
							{formatDate(post.publishedAt || post.createdAt)} / {post.author}
						</div>
						<p class="arc-note mt-4 flex-1">{post.excerpt || ""}</p>
						<a
							href={postHref(post)}
							target={post.externalUrl ? "_blank" : undefined}
							rel="noopener noreferrer"
							class="arc-btn-ghost mt-6"
						>
							{post.externalUrl ? "READ ON EXTERNAL SITE" : "READ MORE"}
						</a>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<Panel>
			<p class="arc-note">No blog posts available at this time.</p>
		</Panel>
	{/if}
</Page>
