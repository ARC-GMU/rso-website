<script lang="ts">
	let { src, title }: { src: string; title: string } = $props();

	let open = $state(false);
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
		role="dialog"
		aria-modal="true"
	>
		<div class="flex h-[90vh] w-full max-w-5xl flex-col border border-[var(--arc-ink)] bg-[var(--arc-surface)]">
			<div
				class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--arc-line)] bg-[var(--arc-fill)] px-5 py-3"
			>
				<span class="text-[13px] font-bold tracking-[0.08em]">{title}</span>
				<div class="flex gap-2">
					<a href={src} download class="arc-btn-small">DOWNLOAD</a>
					<a href={src} target="_blank" rel="noopener noreferrer" class="arc-btn-small">
						OPEN IN TAB
					</a>
					<button class="arc-btn-small cursor-pointer" onclick={() => (open = false)}>
						CLOSE
					</button>
				</div>
			</div>
			<iframe {src} {title} class="w-full flex-1 border-none"></iframe>
		</div>
	</div>
{/if}

<button class="arc-btn-small cursor-pointer" onclick={() => (open = true)}>VIEW</button>
