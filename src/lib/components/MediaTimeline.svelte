<script lang="ts">
	import MediaCard from "$lib/components/MediaCard.svelte";
	import type { TimelineMedia, TimelineYear } from "$lib/mediaTimeline";

	let { years, onOpenImage }: {
		years: TimelineYear[];
		onOpenImage: (item: TimelineMedia) => void;
	} = $props();
</script>

{#if years.length > 1}
	<nav class="flex flex-wrap gap-2" aria-label="Jump to year">
		{#each years as yearGroup (yearGroup.year)}
			<a
				href="#year-{yearGroup.year}"
				class="border border-[var(--arc-line)] bg-[var(--arc-surface)] px-3 py-1.5 text-[13px] font-bold tracking-[0.1em] text-[var(--arc-ink)] no-underline hover:border-[var(--arc-accent)]"
			>
				{yearGroup.year}
			</a>
		{/each}
	</nav>
{/if}

<div class="timeline">
	{#each years as yearGroup (yearGroup.year)}
		<section id="year-{yearGroup.year}" class="timeline-year">
			<div class="timeline-marker" aria-hidden="true"></div>
			<header class="timeline-year-heading">
				<h2 class="m-0 text-[28px] font-black tracking-[0.05em] text-[var(--arc-ink)] sm:text-[34px]">
					{yearGroup.year}
				</h2>
				<span class="text-[13px] font-bold tracking-[0.1em] text-[var(--arc-muted)]">
					{yearGroup.count} ITEM{yearGroup.count === 1 ? "" : "S"}
				</span>
			</header>

			{#each yearGroup.months as monthGroup (monthGroup.key)}
				<div class="timeline-month">
					<h3 class="m-0 mb-3 text-[14px] font-bold tracking-[0.15em] text-[var(--arc-muted)]">
						{monthGroup.label.toUpperCase()}
					</h3>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each monthGroup.items as item (item.src)}
							<MediaCard {item} {onOpenImage} />
						{/each}
					</div>
				</div>
			{/each}
		</section>
	{/each}
</div>

<style>
	.timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 48px;
		padding-left: 28px;
		border-left: 2px solid var(--arc-line);
		margin-left: 8px;
	}
	.timeline-year {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 28px;
		scroll-margin-top: 96px;
	}
	.timeline-marker {
		position: absolute;
		left: -38px;
		top: 12px;
		width: 18px;
		height: 18px;
		border: 2px solid var(--arc-ink);
		background: var(--arc-accent);
	}
	.timeline-year-heading {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}
	.timeline-month {
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 640px) {
		.timeline {
			padding-left: 18px;
			margin-left: 4px;
		}
		.timeline-marker {
			left: -27px;
			width: 14px;
			height: 14px;
		}
	}
</style>
