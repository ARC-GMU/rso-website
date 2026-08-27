<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, type Partner } from "$lib/theme/content";

	let partners = $state<Partner[]>([]);
	let loading = $state(true);

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/club/about`, { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				partners = data.partners ?? [];
			}
		} catch (e) {
			console.error("Error fetching partners:", e);
		} finally {
			loading = false;
		}
	});
</script>

<Page title="Partners">
	<Panel>
		{#if loading}
			<p class="arc-note">Loading...</p>
		{:else if partners.length === 0}
			<p class="arc-note">No partners available.</p>
		{:else}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each partners as partner}
					<a
						href="/partner/{partner.slug}"
						class="flex w-full min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] no-underline hover:border-[var(--arc-accent)]"
					>
						<div class="flex h-32 w-full items-center justify-center border-b border-[var(--arc-line)] bg-[var(--arc-surface)] p-6">
							{#if partner.imageUrl}
								<img
									src={partner.imageUrl}
									alt={partner.name}
									class="max-h-full max-w-full object-contain"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<Icon icon="mdi:image-outline" class="h-12 w-12 text-[var(--arc-line)]" />
							{/if}
						</div>
						<div class="flex flex-1 flex-col gap-2 p-5">
							<div class="arc-h3 text-lg text-[var(--arc-ink)]">{partner.name}</div>
							{#if partner.bio}
								<p class="arc-note line-clamp-3 flex-1">{stripHtml(partner.bio)}</p>
							{/if}
							<span class="arc-link mt-1 self-start">VIEW PARTNER</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</Panel>
</Page>
