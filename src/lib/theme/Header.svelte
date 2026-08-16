<script lang="ts">
	import { page } from "$app/stores";
	import { discordUrl, navLinks } from "$lib/theme/content";
</script>

{#snippet navItems()}
	{#each navLinks as link}
		<a
			href={link.href}
			class="text-[15px] font-bold tracking-[0.04em] whitespace-nowrap no-underline hover:text-[#006633] {$page.url.pathname.startsWith(
				link.href
			)
				? 'text-[#006633]'
				: 'text-[#2f3d37]'}"
		>
			{link.label.toUpperCase()}
		</a>
	{/each}
{/snippet}

<header class="border-b border-[#d5dad5] bg-[#e9e6db]">
	<div class="mx-auto max-w-[1120px] px-6">
		<div class="flex items-center gap-6 py-4">
			<a
				href="/"
				class="shrink-0 text-[15px] font-bold tracking-[0.06em] text-[#16211c] no-underline"
			>
				<span class="hidden sm:inline">AUTONOMOUS ROBOTICS CLUB (ARC)</span>
				<span class="sm:hidden">ARC</span>
			</a>

			<nav class="ml-auto hidden items-center gap-7 lg:flex">
				{@render navItems()}
			</nav>

			<a
				href={discordUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="ml-auto shrink-0 border border-[#16211c] px-4 py-2 text-[15px] font-bold tracking-[0.04em] text-[#16211c] no-underline hover:bg-[#16211c] hover:text-white lg:ml-0"
			>
				JOIN
			</a>
		</div>

		<nav class="-mx-6 flex gap-7 overflow-x-auto px-6 pb-4 lg:hidden">
			{@render navItems()}
		</nav>
	</div>
</header>
