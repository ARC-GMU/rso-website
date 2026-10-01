<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { defaultSubTeamIcon, subTeamHref, type SubTeam } from "$lib/subTeams";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let subTeams = $derived((data.subTeams ?? []) as SubTeam[]);

	function countLabel(count: number, noun: string) {
		return `${count} ${noun}${count === 1 ? "" : "s"}`;
	}
</script>

<Page title="Sub Teams" heading="Sub Teams">
	{#if subTeams.length === 0}
		<Panel>
			<p class="arc-note">No sub teams have been set up yet.</p>
		</Panel>
	{:else}
		<Panel title="OUR SUB TEAMS">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each subTeams as team (team.id)}
					<a
						href={subTeamHref(team)}
						class="flex min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] no-underline hover:border-[var(--arc-accent)]"
					>
						<div class="flex flex-1 flex-col p-6">
							<Icon
								icon={team.icon || defaultSubTeamIcon}
								class="mb-4 text-3xl text-[var(--arc-accent)]"
							/>

							<div class="arc-h3 text-[17px] text-[var(--arc-ink)]">
								{team.name.toUpperCase()}
							</div>

							{#if team.description}
								<p class="arc-note mt-2 line-clamp-3 flex-1">{team.description}</p>
							{:else}
								<div class="flex-1"></div>
							{/if}

							<div class="arc-note mt-3">
								{countLabel(team.members.length, "member")} · {countLabel(
									team.projects.length,
									"project"
								)}
							</div>

							<span class="arc-link mt-4 inline-flex items-center gap-1">
								VIEW SUB TEAM
								<Icon icon="mdi:chevron-right" class="text-base" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</Panel>
	{/if}
</Page>
