<script lang="ts">
	import { formatMediaDate, type TimelineMedia } from "$lib/mediaTimeline";

	let { item, onOpenImage }: {
		item: TimelineMedia;
		onOpenImage: (item: TimelineMedia) => void;
	} = $props();
</script>

<figure class="arc-panel m-0 overflow-hidden p-0">
	{#if item.kind === "image"}
		<button
			class="block w-full cursor-pointer border-none bg-transparent p-0"
			onclick={() => onOpenImage(item)}
			aria-label="Open {item.altText}"
		>
			<img
				src={item.src}
				alt={item.altText}
				class="h-48 w-full object-cover sm:h-52"
				loading="lazy"
				decoding="async"
			/>
		</button>
	{:else}
		<video controls preload="metadata" class="aspect-video w-full bg-black">
			<source src={item.src} />
			<track kind="captions" />
		</video>
	{/if}
	<figcaption class="flex flex-col gap-1 px-4 py-3">
		<span class="text-[12px] font-bold tracking-[0.1em] text-[var(--arc-muted)]">
			{formatMediaDate(item).toUpperCase()}
		</span>
		{#if item.caption}
			<span class="text-[14px] text-[var(--arc-ink)]">{item.caption}</span>
		{/if}
	</figcaption>
</figure>
