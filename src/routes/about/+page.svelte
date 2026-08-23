<script lang="ts">
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
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

<Page title="About">
	{#if data.about.content}
		<Panel flush>
			<div class="prose prose-sm md:prose-base max-w-none p-6 text-[var(--arc-ink-2)]">
				{@html data.about.content}
			</div>
		</Panel>
	{/if}

	{#if data.about.updatedAt}
		<p class="arc-label">
			Last updated {formatDate(data.about.updatedAt)}{data.about.author
				? ` / ${data.about.author}`
				: ""}
		</p>
	{/if}

	{#if data.about.faqs && data.about.faqs.length > 0}
		<Panel title="FAQ" flush>
			<div class="flex flex-col divide-y divide-[var(--arc-line-soft)]">
				{#each data.about.faqs as faq}
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

	{#if !data.about.content && (!data.about.faqs || data.about.faqs.length === 0)}
		<p class="arc-table-empty">About content coming soon.</p>
	{/if}
</Page>
