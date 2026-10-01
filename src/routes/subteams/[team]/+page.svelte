<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import {
		defaultSubTeamIcon,
		type SubTeam,
		type SubTeamMember,
		type SubTeamProject
	} from "$lib/subTeams";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let team = $derived(data.team as SubTeam);

	function projectHref(project: SubTeamProject) {
		return `/projects/${project.slug || project.id}`;
	}

	function stripHtml(html: string): string {
		return html
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	}

	function memberDetails(member: SubTeamMember) {
		return [member.major, member.year].filter(Boolean).join(" · ");
	}

	function memberKey(member: SubTeamMember, index: number) {
		return member.clubId || `${member.name}-${index}`;
	}
</script>

<Page title={team.name} heading={team.name}>
	<a href="/subteams" class="arc-link inline-flex items-center gap-1">
		<Icon icon="mdi:chevron-left" class="text-base" />
		ALL SUB TEAMS
	</a>

	<Panel title="ABOUT THIS SUB TEAM">
		<div class="flex items-start gap-4">
			<Icon
				icon={team.icon || defaultSubTeamIcon}
				class="shrink-0 text-4xl text-[var(--arc-accent)]"
			/>
			{#if team.description}
				<p class="arc-body m-0">{team.description}</p>
			{:else}
				<p class="arc-note m-0">
					{team.members.length} member{team.members.length === 1 ? "" : "s"} building together at ARC.
				</p>
			{/if}
		</div>
	</Panel>

	{#if team.projects.length > 0}
		<Panel title="TEAM PROJECTS">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each team.projects as project (project.id)}
					<a
						href={projectHref(project)}
						class="flex min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] no-underline hover:border-[var(--arc-accent)]"
					>
						{#if project.image}
							<img
								src={project.image}
								alt={project.name}
								class="h-44 w-full border-b border-[var(--arc-line)] object-cover"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div
								class="flex h-44 w-full items-center justify-center border-b border-[var(--arc-line)] bg-[var(--arc-surface)]"
							>
								<Icon icon="mdi:image-outline" class="h-12 w-12 text-[var(--arc-line)]" />
							</div>
						{/if}

						<div class="flex flex-1 flex-col gap-2 p-5">
							<div class="flex flex-wrap items-baseline justify-between gap-2">
								<div class="arc-h3 text-lg text-[var(--arc-ink)]">{project.name}</div>
								{#if project.status === "completed"}
									<span class="arc-label text-[var(--arc-muted-2)]">PAST</span>
								{/if}
							</div>

							{#if project.description}
								<p class="arc-note line-clamp-3 flex-1">{stripHtml(project.description)}</p>
							{:else}
								<div class="flex-1"></div>
							{/if}

							<span class="arc-link mt-2 inline-flex items-center gap-1">
								VIEW PROJECT
								<Icon icon="mdi:chevron-right" class="text-base" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</Panel>
	{/if}

	{#if team.images.length > 0}
		<Panel title="PHOTOS">
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
				{#each team.images as image (image)}
					<img
						src={image}
						alt="{team.name} photo"
						class="h-40 w-full border border-[var(--arc-line)] object-cover sm:h-48"
						loading="lazy"
						decoding="async"
					/>
				{/each}
			</div>
		</Panel>
	{/if}

	<Panel title="MEMBERS">
		{#if team.members.length === 0}
			<p class="arc-note">Nobody has been added to this sub team yet.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{#each team.members as member, index (memberKey(member, index))}
					<div class="min-w-0 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-5">
						<div class="flex items-start gap-4">
							{#if member.photoUrl}
								<img
									src={member.photoUrl}
									alt={member.name}
									class="h-14 w-14 flex-shrink-0 rounded-full border border-[var(--arc-line)] object-cover"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div
									class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-[var(--arc-line)] bg-[var(--arc-surface)]"
								>
									<Icon icon="mdi:account" class="text-2xl text-[var(--arc-faint)]" />
								</div>
							{/if}

							<div class="min-w-0 flex-1">
								{#if member.clubId}
									<a
										href="/member/{member.clubId}"
										class="text-[16px] font-bold text-[var(--arc-ink)] no-underline hover:text-[var(--arc-accent)]"
									>
										{member.name}
									</a>
								{:else}
									<div class="text-[16px] font-bold text-[var(--arc-ink)]">{member.name}</div>
								{/if}

								{#if member.role}
									<div class="arc-label mt-1 text-[var(--arc-accent)]">{member.role}</div>
								{/if}
								{#if memberDetails(member)}
									<div class="arc-note mt-1">{memberDetails(member)}</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Panel>
</Page>
