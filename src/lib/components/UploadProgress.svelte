<script lang="ts">
	let { percent = 0, label = "UPLOADING" }: { percent?: number; label?: string } = $props();
</script>

<div class="flex items-center gap-3">
	<div class="h-2 w-full max-w-[240px] border border-[var(--arc-line)] bg-[var(--arc-fill)]">
		<div
			class="h-full bg-[var(--arc-accent)] transition-[width] duration-200"
			style="width:{percent}%;"
		></div>
	</div>
	<span class="arc-label whitespace-nowrap text-[var(--arc-muted)]">{label} {percent}%</span>
</div>
