<script lang="ts">
	import { goto } from "$app/navigation";
	import Panel from "$lib/theme/Panel.svelte";
	import { login } from "$lib/memberSession";

	let identifier = $state("");
	let password = $state("");
	let errorMessage = $state("");
	let submitting = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = "";
		submitting = true;

		try {
			await login(identifier, password);
			await goto("/account");
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			submitting = false;
		}
	}

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";
</script>

<Panel flush>
	<form class="flex flex-col gap-5 px-6 py-6" onsubmit={submit}>
		{#if errorMessage}
			<div
				class="border border-[var(--arc-warn)] px-4 py-3 text-[14px] font-bold text-[var(--arc-warn)]"
			>
				{errorMessage}
			</div>
		{/if}

		<label class="flex flex-col gap-2">
			<span class="arc-label">CLUB ID OR GMU EMAIL</span>
			<input
				class={inputClass}
				type="text"
				bind:value={identifier}
				autocomplete="username"
				required
			/>
		</label>

		<label class="flex flex-col gap-2">
			<span class="arc-label">PASSWORD</span>
			<input
				class={inputClass}
				type="password"
				bind:value={password}
				autocomplete="current-password"
				required
			/>
		</label>

		<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={submitting}>
			{submitting ? "SIGNING IN..." : "SIGN IN"}
		</button>
	</form>

	<div class="border-t border-[var(--arc-line)] px-6 py-5 text-center">
		<p class="m-0 text-[15px] font-medium text-[var(--arc-muted)]">
			Do not have an account yet?
		</p>
		<a class="arc-btn-ghost mt-3 inline-block" href="/account/register">CREATE AN ACCOUNT</a>
	</div>
</Panel>
