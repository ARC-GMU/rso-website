<script lang="ts">
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}
</script>

<Page title="About">
	{#if data.pages && data.pages.length > 0}
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.pages as page}
				<div class="flex w-full min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)]">
					<div class="flex flex-1 flex-col gap-2 p-5">
						<div class="arc-h3 text-lg text-[var(--arc-ink)]">{page.title}</div>
						{#if page.excerpt}
							<p class="arc-note line-clamp-3 flex-1">{stripHtml(page.excerpt)}</p>
						{/if}
						<a href={`/about/${page.slug}`} class="arc-btn mt-3 w-full text-center">
							VIEW DETAILS
						</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<Panel>
			<p class="arc-note">About content coming soon.</p>
		</Panel>
	{/if}

	{#if data.faqs && data.faqs.length > 0}
		<Panel title="FAQ" flush>
			<div class="flex flex-col divide-y divide-[var(--arc-line-soft)]">
				{#each data.faqs as faq}
					<details class="group px-6 py-4">
						<summary
							class="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-[var(--arc-ink)]"
						>
							{faq.question}
							<span class="text-[var(--arc-muted)] transition-transform group-open:rotate-45"
								>+</span
							>
						</summary>
						<p class="mt-2 text-[14px] text-[var(--arc-ink-2)]">{faq.answer}</p>
					</details>
				{/each}
			</div>
		</Panel>
	{/if}
</Page>
