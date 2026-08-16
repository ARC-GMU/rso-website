<script lang="ts">
	import { page } from "$app/stores";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
</script>

<Page title="Error {$page.status}" heading="Error {$page.status}">
	<Panel>
		<p class="arc-body">
			{$page.error?.message ?? "Something went wrong on this page."}
		</p>
		<p class="arc-note mt-4">
			{#if $page.status === 404}
				The page you requested could not be found.
			{:else}
				An unexpected error occurred while loading this page. Please try again.
			{/if}
		</p>
		<a href="/" class="arc-btn mt-6">RETURN TO HOME PAGE</a>
	</Panel>
</Page>
