<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import RegisterForm from "$lib/components/RegisterForm.svelte";
	import { loadProfile } from "$lib/memberSession";

	let checking = $state(true);

	onMount(async () => {
		const profile = await loadProfile();
		if (profile) {
			await goto("/account");
			return;
		}
		checking = false;
	});
</script>

<Page title="Create Account" heading="Create Account">
	{#if checking}
		<Panel flush>
			<div class="px-6 py-12 text-center text-[15px] font-medium text-[var(--arc-muted)]">
				LOADING...
			</div>
		</Panel>
	{:else}
		<RegisterForm />
	{/if}
</Page>
