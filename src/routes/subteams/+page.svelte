<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import type { PageData } from "./$types";

	type SubTeamProject = {
		id: string;
		name: string;
		slug: string;
		status: string;
		role?: string;
	};

	type SubTeamMember = {
		clubId: string;
		name: string;
		role: string;
		major: string;
		year: string;
		photoUrl: string;
		projects: SubTeamProject[];
	};

	type SubTeam = {
		id: string;
		name: string;
		slug: string;
		description: string;
		members: SubTeamMember[];
		projects: SubTeamProject[];
	};

	let { data }: { data: PageData } = $props();

	let subTeams = $derived((data.subTeams ?? []) as SubTeam[]);

	function projectHref(project: SubTeamProject) {
		return `/projects/${project.slug || project.id}`;
	}

	function memberDetails(member: SubTeamMember) {
		return [member.major, member.year].filter(Boolean).join(" · ");
	}
</script>

<Page title="Sub Teams" heading="Sub Teams">
	{#if subTeams.length === 0}
		<Panel>
			<p class="arc-note">No sub teams have been set up yet.</p>
		</Panel>
	{:else}
		{#each subTeams as team (team.id)}
			<Panel title={team.name.toUpperCase()}>
				{#if team.description}
					<p class="arc-body m-0">{team.description}</p>
				{/if}

				<div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
					<span class="arc-label text-[var(--arc-muted)]">
						{team.members.length} MEMBER{team.members.length === 1 ? "" : "S"}
					</span>
					{#if team.projects.length > 0}
						<span class="arc-label text-[var(--arc-muted)]">TEAM PROJECTS</span>
						{#each team.projects as project (project.id)}
							<a href={projectHref(project)} class="arc-link">{project.name.toUpperCase()}</a>
						{/each}
					{/if}
				</div>

				{#if team.members.length === 0}
					<p class="arc-note mt-5">Nobody has been added to this sub team yet.</p>
				{:else}
					<div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
						{#each team.members as member (member.clubId)}
							<div
								class="flex min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)] p-5"
							>
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

								<div class="mt-4 border-t border-[var(--arc-line)] pt-4">
									<div class="arc-label text-[var(--arc-muted)]">WORKING ON</div>
									{#if member.projects.length === 0}
										<p class="arc-note mt-2">Not on a project team yet.</p>
									{:else}
										<div class="mt-2 flex flex-col gap-2">
											{#each member.projects as project (project.id)}
												<a
													href={projectHref(project)}
													class="flex items-center justify-between gap-3 border border-[var(--arc-line)] bg-[var(--arc-surface)] px-3 py-2 no-underline hover:border-[var(--arc-accent)]"
												>
													<span class="min-w-0">
														<span class="block truncate text-[14px] font-bold text-[var(--arc-ink)]">
															{project.name}
														</span>
														{#if project.role}
															<span class="block truncate text-[12px] text-[var(--arc-muted)]">
																{project.role}
															</span>
														{/if}
													</span>
													{#if project.status === "completed"}
														<span class="arc-label flex-shrink-0 text-[var(--arc-muted-2)]">PAST</span>
													{/if}
												</a>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Panel>
		{/each}
	{/if}
</Page>
