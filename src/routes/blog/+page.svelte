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
			day: "numeric",
			timeZone: "America/New_York"
		});
	}
</script>

<Page title="Blog">
	{#if data.posts && data.posts.length > 0}
		<div class="flex flex-col gap-3">
			{#each data.posts as post}
				<article class="arc-panel flex flex-col sm:flex-row">
					{#if post.coverImageUrl}
						<a
							href={postHref(post)}
							target={post.externalUrl ? "_blank" : undefined}
							rel="noopener noreferrer"
							class="block h-44 w-full shrink-0 overflow-hidden border-b border-[var(--arc-line)] sm:h-auto sm:w-36 sm:border-r sm:border-b-0"
						>
							<img
								src={post.coverImageUrl}
								alt={post.title}
								class="h-full w-full object-cover"
							/>
						</a>
					{/if}
					<div class="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-4 sm:gap-1">
						<h2 class="arc-h2 text-base">
							<a
								href={postHref(post)}
								target={post.externalUrl ? "_blank" : undefined}
								rel="noopener noreferrer"
								class="text-[var(--arc-ink)] no-underline hover:text-[var(--arc-accent)]"
							>
								{post.title}
							</a>
						</h2>
						<div class="arc-label">
							{formatDate(post.publishedAt || post.createdAt)} / {post.author}
						</div>
						<p class="arc-note line-clamp-2 text-sm sm:line-clamp-1">{post.excerpt || ""}</p>
						<a
							href={postHref(post)}
							target={post.externalUrl ? "_blank" : undefined}
							rel="noopener noreferrer"
							class="arc-btn-ghost mt-2 w-full text-center px-3 py-1.5 text-xs sm:mt-1 sm:w-auto sm:self-start sm:py-1"
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
