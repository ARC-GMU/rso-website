<script lang="ts">
	import Icon from "@iconify/svelte";
	import { LINK_TYPES, emptySocialLink, type SocialLink } from "$lib/socialLink";

	let { links = $bindable() }: { links: SocialLink[] } = $props();

	const inputClass =
		"w-full border border-[var(--arc-line)] bg-[var(--arc-surface)] px-4 py-3 text-[16px] font-medium text-[var(--arc-ink)] outline-none focus:border-[var(--arc-accent)]";

	function addLink() {
		links = [...links, emptySocialLink()];
	}

	function removeLink(index: number) {
		links = links.filter((_, position) => position !== index);
	}
</script>

<div class="flex flex-col gap-4">
	{#each links as link, index}
		<div class="flex flex-col gap-3 border border-[var(--arc-line)] p-4 sm:flex-row sm:items-end">
			<label class="flex flex-col gap-2 sm:w-[170px]">
				<span class="arc-label">TYPE</span>
				<select class={inputClass} bind:value={link.type}>
					{#each LINK_TYPES as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>

			{#if link.type === "custom"}
				<label class="flex flex-col gap-2 sm:w-[170px]">
					<span class="arc-label">LABEL</span>
					<input class={inputClass} type="text" bind:value={link.label} placeholder="Portfolio" />
				</label>
			{/if}

			<label class="flex min-w-0 flex-1 flex-col gap-2">
				<span class="arc-label">URL</span>
				<input
					class={inputClass}
					type="text"
					bind:value={link.url}
					placeholder="https://github.com/you"
				/>
			</label>

			<button
				class="arc-btn-ghost cursor-pointer sm:w-auto"
				type="button"
				onclick={() => removeLink(index)}
			>
				<Icon icon="mdi:close" class="inline-block align-text-bottom" /> REMOVE
			</button>
		</div>
	{/each}

	{#if links.length === 0}
		<p class="m-0 text-[15px] leading-[1.7] text-[var(--arc-muted)]">
			No links yet. Add your GitHub, LinkedIn, or anything else you want on your profile.
		</p>
	{/if}

	<button class="arc-btn-ghost cursor-pointer self-start" type="button" onclick={addLink}>
		<Icon icon="mdi:plus" class="inline-block align-text-bottom" /> ADD LINK
	</button>
</div>
