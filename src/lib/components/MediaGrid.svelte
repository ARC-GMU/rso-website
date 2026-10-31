<script lang="ts">
	import MediaCard from "$lib/components/MediaCard.svelte";
	import type { TimelineMedia } from "$lib/mediaTimeline";

	let { items, onOpenImage }: {
		items: TimelineMedia[];
		onOpenImage: (item: TimelineMedia) => void;
	} = $props();

	let newestFirst = $derived([...items].sort((a, b) => b.date.getTime() - a.date.getTime()));
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each newestFirst as item (item.src)}
		<MediaCard {item} {onOpenImage} />
	{/each}
</div>
