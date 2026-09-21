<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function categoryIcon(kind: string) {
		return kind === "files" ? "mdi:file-download-outline" : "mdi:link-variant";
	}

	function countLabel(count: number, kind: string) {
		const noun = kind === "files" ? "file" : "link";
		return `${count} ${noun}${count === 1 ? "" : "s"}`;
	}
</script>

<Page title="Resources">
	{#if data.categories.length === 0}
		<Panel>
			<p class="arc-note">No resources available yet.</p>
		</Panel>
	{:else}
		<Panel title="RESOURCE CATEGORIES">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.categories as category (category.slug)}
					<a
						href="/resources/{category.slug}"
						class="flex min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] p-6 no-underline hover:border-[var(--arc-accent)]"
					>
						<Icon
							icon={categoryIcon(category.kind)}
							class="text-3xl text-[var(--arc-accent)]"
						/>
						<div class="arc-h3 mt-4 text-[17px] text-[var(--arc-ink)]">
							{category.name.toUpperCase()}
						</div>
						<p class="arc-note mt-2 flex-1">{countLabel(category.count, category.kind)}</p>
						<span class="arc-link mt-4 inline-flex items-center gap-1">
							OPEN
							<Icon icon="mdi:chevron-right" class="text-base" />
						</span>
					</a>
				{/each}
			</div>
		</Panel>
	{/if}
</Page>
