<script lang="ts">
	import { goto } from "$app/navigation";
	import Panel from "$lib/theme/Panel.svelte";
	import { register } from "$lib/memberSession";

	let name = $state("");
	let email = $state("");
	let password = $state("");
	let errorMessage = $state("");
	let submitting = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = "";
		submitting = true;

		try {
			await register(name, email, password);
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

		<p class="m-0 text-[15px] leading-[1.7] text-[var(--arc-muted)]">
			Sign up with your GMU email. Your club ID is assigned for you and shown on your account
			once you are in.
		</p>

		<label class="flex flex-col gap-2">
			<span class="arc-label">FULL NAME</span>
			<input class={inputClass} type="text" bind:value={name} autocomplete="name" required />
		</label>

		<label class="flex flex-col gap-2">
			<span class="arc-label">GMU EMAIL</span>
			<input
				class={inputClass}
				type="email"
				bind:value={email}
				placeholder="name@gmu.edu"
				required
			/>
		</label>

		<label class="flex flex-col gap-2">
			<span class="arc-label">CHOOSE A PASSWORD</span>
			<input
				class={inputClass}
				type="password"
				bind:value={password}
				autocomplete="new-password"
				minlength="8"
				required
			/>
			<span class="text-[13px] font-medium text-[var(--arc-muted-2)]">At least 8 characters.</span>
		</label>

		<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={submitting}>
			{submitting ? "CREATING..." : "CREATE ACCOUNT"}
		</button>
	</form>

	<div class="border-t border-[var(--arc-line)] px-6 py-5 text-center">
		<p class="m-0 text-[15px] font-medium text-[var(--arc-muted)]">Already have an account?</p>
		<a class="arc-btn-ghost mt-3 inline-block" href="/account/signin">SIGN IN</a>
	</div>
</Panel>
