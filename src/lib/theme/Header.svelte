<script lang="ts">
	import { page } from "$app/stores";
	import Icon from "@iconify/svelte";
	import { discordUrl, navLinks } from "$lib/theme/content";

	let menuOpen = $state(false);

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(`${href}/`);
	}
</script>

<header class="border-b border-[var(--arc-line)] bg-[var(--arc-chrome)]">
	<div class="mx-auto max-w-[1120px] px-6">
		<div class="flex items-center gap-4 py-4">
			<a
				href="/"
				class="shrink-0 text-[15px] font-bold tracking-[0.06em] text-[var(--arc-ink)] no-underline"
				onclick={() => (menuOpen = false)}
			>
				<span class="hidden sm:inline">AUTONOMOUS ROBOTICS CLUB (ARC)</span>
				<span class="sm:hidden">ARC</span>
			</a>

			<nav class="ml-auto hidden items-center gap-7 lg:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-[15px] font-bold tracking-[0.04em] whitespace-nowrap no-underline hover:text-[var(--arc-accent)] {isActive(
							link.href
						)
							? 'text-[var(--arc-accent)]'
							: 'text-[var(--arc-ink-2)]'}"
					>
						{link.label.toUpperCase()}
					</a>
				{/each}
			</nav>

			<a
				href={discordUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="ml-auto shrink-0 border border-[var(--arc-ink)] px-4 py-2 text-[15px] font-bold tracking-[0.04em] text-[var(--arc-ink)] no-underline hover:bg-[var(--arc-ink)] hover:text-[var(--arc-invert-text)] lg:ml-0"
			>
				JOIN
			</a>

			<button
				class="shrink-0 cursor-pointer border border-[var(--arc-ink)] p-2 text-[var(--arc-ink)] lg:hidden"
				aria-label="Toggle navigation menu"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} class="text-xl" />
			</button>
		</div>

		{#if menuOpen}
			<nav class="flex flex-col border-t border-[var(--arc-line)] py-2 lg:hidden">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (menuOpen = false)}
						class="border-b border-[var(--arc-line)] py-3 text-[15px] font-bold tracking-[0.04em] no-underline last:border-b-0 {isActive(
							link.href
						)
							? 'text-[var(--arc-accent)]'
							: 'text-[var(--arc-ink-2)]'}"
					>
						{link.label.toUpperCase()}
					</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>
