<script lang="ts">
	import { page } from "$app/state";
	import { afterNavigate } from "$app/navigation";
	import Icon from "@iconify/svelte";
	import { discordUrl, navLinks } from "$lib/theme/content";

	let menuOpen = $state(false);

	afterNavigate(() => {
		menuOpen = false;
	});

	function isActive(href: string) {
		const path = page.url.pathname;
		return path === href || path.startsWith(`${href}/`);
	}

	function closeOnEscape(event: KeyboardEvent) {
		if (event.key === "Escape") menuOpen = false;
	}
</script>

<svelte:window onkeydown={closeOnEscape} />

<style>
	.arc-logo-dark {
		display: none;
	}
	:global(:root[data-theme="dark"]) .arc-logo-light {
		display: none;
	}
	:global(:root[data-theme="dark"]) .arc-logo-dark {
		display: block;
	}
</style>

<header class="sticky top-0 z-40 border-b border-[var(--arc-line)] bg-[var(--arc-chrome)]">
	<div class="mx-auto max-w-[1120px] px-4 sm:px-6">
		<div class="flex h-16 items-center gap-4">
			<div class="flex shrink-0 lg:flex-1">
				<a href="/" class="no-underline" aria-label="Autonomous Robotics Club home">
					<img
						src="/logos/arcc.png"
						alt="Autonomous Robotics Club (ARC)"
						class="arc-logo-light h-8 w-auto"
					/>
					<img
						src="/logos/arcc_light.png"
						alt="Autonomous Robotics Club (ARC)"
						class="arc-logo-dark h-8 w-auto"
					/>
				</a>
			</div>

			<nav aria-label="Main" class="hidden h-full items-stretch gap-6 lg:flex">
				{#each navLinks as link}
					{@const active = isActive(link.href)}
					<a
						href={link.href}
						aria-current={active ? "page" : undefined}
						class="flex items-center border-y-2 border-t-transparent text-[14px] font-bold tracking-[0.06em] whitespace-nowrap no-underline hover:text-[var(--arc-accent)] {active
							? 'border-b-[var(--arc-accent)] text-[var(--arc-accent)]'
							: 'border-b-transparent text-[var(--arc-ink-2)] hover:border-b-[var(--arc-line)]'}"
					>
						{link.label.toUpperCase()}
					</a>
				{/each}
			</nav>

			<div class="ml-auto flex shrink-0 items-center justify-end gap-3 lg:ml-0 lg:flex-1">
				<a
					href={discordUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex shrink-0 items-center gap-2 bg-[var(--arc-accent)] px-4 py-2 text-[14px] font-bold tracking-[0.06em] text-[var(--arc-on-accent)] no-underline hover:bg-[var(--arc-accent-hover)]"
				>
					<Icon icon="mdi:discord" class="text-lg" />
					JOIN
				</a>

				<button
					class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-[var(--arc-line)] text-[var(--arc-ink)] hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)] lg:hidden"
					aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
					aria-expanded={menuOpen}
					aria-controls="mobile-nav"
					onclick={() => (menuOpen = !menuOpen)}
				>
					<Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} class="text-xl" />
				</button>
			</div>
		</div>
	</div>

	{#if menuOpen}
		<nav
			id="mobile-nav"
			aria-label="Main"
			class="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[var(--arc-line)] bg-[var(--arc-chrome)] lg:hidden"
		>
			<div class="mx-auto flex max-w-[1120px] flex-col py-2">
				{#each navLinks as link}
					{@const active = isActive(link.href)}
					<a
						href={link.href}
						aria-current={active ? "page" : undefined}
						class="flex items-center justify-between border-l-2 px-4 py-3 sm:px-6 text-[14px] font-bold tracking-[0.06em] no-underline hover:bg-[var(--arc-fill)] hover:text-[var(--arc-accent)] {active
							? 'border-[var(--arc-accent)] bg-[var(--arc-fill)] text-[var(--arc-accent)]'
							: 'border-transparent text-[var(--arc-ink-2)]'}"
					>
						{link.label.toUpperCase()}
						<Icon icon="mdi:chevron-right" class="text-lg text-[var(--arc-muted)]" />
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>
