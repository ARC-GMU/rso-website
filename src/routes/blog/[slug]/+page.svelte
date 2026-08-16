<script lang="ts">
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "America/New_York"
		});
	}
</script>

<svelte:head>
	<title>{data.post.title} - Autonomous Robotics Club</title>
	<meta name="description" content={data.post.excerpt || data.post.title} />
	{#if data.post.coverImageUrl}
		<meta property="og:image" content={data.post.coverImageUrl} />
	{/if}
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<a href="/blog" class="arc-link">BACK TO BLOG</a>

		<article class="arc-panel mt-6">
			{#if data.post.coverImageUrl}
				<div class="h-64 w-full overflow-hidden border-b border-[var(--arc-line)] md:h-96">
					<img
						src={data.post.coverImageUrl}
						alt={data.post.title}
						class="h-full w-full object-cover"
					/>
				</div>
			{/if}

			<div class="p-8 md:p-10">
				<h1 class="arc-h1">{data.post.title}</h1>

				<div class="arc-label mt-4">
					{formatDate(data.post.publishedAt || data.post.createdAt)} / {data.post.author}
				</div>

				{#if data.post.tags && data.post.tags.length > 0}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each data.post.tags as tag}
							<span
								class="border border-[var(--arc-line)] bg-[var(--arc-fill)] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[var(--arc-muted)] uppercase"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}

				{#if data.post.externalUrl}
					<a
						href={data.post.externalUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="arc-btn mt-6"
					>
						READ ON EXTERNAL SITE
					</a>
				{/if}

				<div
					class="prose prose-sm md:prose-base mt-8 max-w-none border-t border-[var(--arc-line-soft)] pt-8 text-[var(--arc-ink-2)]"
				>
					{@html data.post.content}
				</div>
			</div>
		</article>
	</main>

	<Footer />
</div>
