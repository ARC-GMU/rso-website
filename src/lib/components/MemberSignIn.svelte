<script lang="ts">
	import Panel from "$lib/theme/Panel.svelte";
	import { login, register } from "$lib/memberSession";

	let mode: "login" | "register" = $state("login");

	let identifier = $state("");
	let password = $state("");

	let name = $state("");
	let email = $state("");
	let newPassword = $state("");

	let errorMessage = $state("");
	let submitting = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = "";
		submitting = true;

		try {
			if (mode === "login") await login(identifier, password);
			else await register(name, email, newPassword);
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			submitting = false;
		}
	}

	function switchTo(next: "login" | "register") {
		mode = next;
		errorMessage = "";
	}

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";
</script>

<Panel flush>
	<div class="flex border-b border-[var(--arc-line)]">
		<button
			class="flex-1 cursor-pointer px-6 py-4 text-[13px] font-bold tracking-[0.1em] {mode === 'login'
				? 'bg-[var(--arc-fill)] text-[var(--arc-ink)]'
				: 'text-[var(--arc-muted)]'}"
			onclick={() => switchTo("login")}
		>
			SIGN IN
		</button>
		<button
			class="flex-1 cursor-pointer px-6 py-4 text-[13px] font-bold tracking-[0.1em] {mode === 'register'
				? 'bg-[var(--arc-fill)] text-[var(--arc-ink)]'
				: 'text-[var(--arc-muted)]'}"
			onclick={() => switchTo("register")}
		>
			SET UP ACCOUNT
		</button>
	</div>

	<form class="flex flex-col gap-5 px-6 py-6" onsubmit={submit}>
		{#if errorMessage}
			<div
				class="border border-[var(--arc-warn)] px-4 py-3 text-[14px] font-bold text-[var(--arc-warn)]"
			>
				{errorMessage}
			</div>
		{/if}

		{#if mode === "login"}
			<label class="flex flex-col gap-2">
				<span class="arc-label">CLUB ID OR GMU EMAIL</span>
				<input class={inputClass} type="text" bind:value={identifier} autocomplete="username" required />
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
		{:else}
			<p class="m-0 text-[15px] leading-[1.7] text-[var(--arc-muted)]">
				Sign up with your GMU email. Your club ID is assigned for you and shown on your
				account once you are in.
			</p>

			<label class="flex flex-col gap-2">
				<span class="arc-label">FULL NAME</span>
				<input class={inputClass} type="text" bind:value={name} autocomplete="name" required />
			</label>

			<label class="flex flex-col gap-2">
				<span class="arc-label">GMU EMAIL</span>
				<input class={inputClass} type="email" bind:value={email} placeholder="name@gmu.edu" required />
			</label>

			<label class="flex flex-col gap-2">
				<span class="arc-label">CHOOSE A PASSWORD</span>
				<input
					class={inputClass}
					type="password"
					bind:value={newPassword}
					autocomplete="new-password"
					minlength="8"
					required
				/>
				<span class="text-[13px] font-medium text-[var(--arc-muted-2)]">At least 8 characters.</span>
			</label>
		{/if}

		<button class="arc-btn cursor-pointer disabled:opacity-60" type="submit" disabled={submitting}>
			{submitting ? "WORKING..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
		</button>
	</form>
</Panel>
