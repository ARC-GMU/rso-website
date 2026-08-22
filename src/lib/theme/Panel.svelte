<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		title = "",
		flush = false,
		padding = "p-6",
		action,
		children
	}: {
		title?: string;
		flush?: boolean;
		padding?: string;
		action?: Snippet;
		children: Snippet;
	} = $props();
</script>

<section class="arc-panel">
	{#if title}
		<div class="arc-panel-head">
			<h2 class="arc-h2">{title}</h2>
			{#if action}
				{@render action()}
			{/if}
		</div>
	{/if}

	<div class={flush ? "" : padding}>
		{@render children()}
	</div>
</section>
