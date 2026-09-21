<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import type { PageData } from "./$types";

	type ActivityCard = {
		key: string;
		kind: "post" | "update";
		title: string;
		summary: string;
		image: string;
		href: string;
		external: boolean;
		meta: string;
		date: number;
	};

	let { data }: { data: PageData } = $props();

	function stripHtml(html: string): string {
		return html
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	}

	function formatDate(value: string | number) {
		if (!value) return "";
		return new Date(value).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "America/New_York"
		});
	}

	function postCard(post: any): ActivityCard {
		const posted = post.publishedAt || post.createdAt;
		return {
			key: `post-${post.id ?? post.slug}`,
			kind: "post",
			title: post.title ?? "",
			summary: post.excerpt || stripHtml(post.content ?? ""),
			image: post.coverImageUrl ?? "",
			href: post.externalUrl || `/activity/blog/${post.slug}`,
			external: Boolean(post.externalUrl),
			meta: [formatDate(posted), post.author].filter(Boolean).join(" / "),
			date: new Date(posted || 0).getTime()
		};
	}

	function updateCard(update: any): ActivityCard {
		return {
			key: `update-${update.id}`,
			kind: "update",
			title: update.title ?? "",
			summary: stripHtml(update.body ?? ""),
			image: (update.images ?? [])[0] ?? "",
			href: `/projects/${update.projectSlug || update.projectId}`,
			external: false,
			meta: [formatDate(update.postedAt), update.author].filter(Boolean).join(" / "),
			date: new Date(update.postedAt || 0).getTime()
		};
	}

	let cards = $derived(
		[
			...(data.posts ?? []).map(postCard),
			...(data.updates ?? []).map(updateCard)
		].sort((a, b) => b.date - a.date)
	);

	let projectNames = $derived(
		new Map((data.updates ?? []).map((update: any) => [`update-${update.id}`, update.projectName]))
	);
</script>

<Page title="Activity">
	{#if cards.length === 0}
		<Panel>
			<p class="arc-note">Nothing posted yet.</p>
		</Panel>
	{:else}
		<Panel title="LATEST FROM THE CLUB">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each cards as card (card.key)}
					<a
						href={card.href}
						target={card.external ? "_blank" : undefined}
						rel={card.external ? "noopener noreferrer" : undefined}
						class="flex min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] no-underline hover:border-[var(--arc-accent)]"
					>
						{#if card.image}
							<img
								src={card.image}
								alt={card.title}
								class="h-44 w-full border-b border-[var(--arc-line)] object-cover"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div
								class="flex h-44 w-full items-center justify-center border-b border-[var(--arc-line)] bg-[var(--arc-surface)]"
							>
								<Icon
									icon={card.kind === "post" ? "mdi:text-box-outline" : "mdi:bullhorn-outline"}
									class="h-12 w-12 text-[var(--arc-line)]"
								/>
							</div>
						{/if}

						<div class="flex flex-1 flex-col gap-2 p-5">
							<div class="flex flex-wrap items-center gap-2">
								<span
									class="border px-2 py-0.5 text-[11px] font-bold tracking-[0.1em] {card.kind ===
									'post'
										? 'border-[var(--arc-line)] text-[var(--arc-muted)]'
										: 'border-[var(--arc-accent)] text-[var(--arc-accent)]'}"
								>
									{card.kind === "post" ? "BLOG" : "PROJECT UPDATE"}
								</span>
								{#if card.kind === "update" && projectNames.get(card.key)}
									<span class="arc-label text-[var(--arc-muted)]">
										{projectNames.get(card.key)}
									</span>
								{/if}
							</div>

							<div class="arc-h3 text-lg text-[var(--arc-ink)]">{card.title}</div>
							<div class="arc-label text-[var(--arc-muted-2)]">{card.meta}</div>

							{#if card.summary}
								<p class="arc-note line-clamp-3 flex-1">{card.summary}</p>
							{:else}
								<div class="flex-1"></div>
							{/if}

							<span class="arc-link mt-2 inline-flex items-center gap-1">
								{card.kind === "post" ? "READ POST" : "VIEW PROJECT"}
								<Icon icon="mdi:chevron-right" class="text-base" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</Panel>
	{/if}
</Page>
