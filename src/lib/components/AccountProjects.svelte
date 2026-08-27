<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import { fetchMyProjects, type MemberProject } from "$lib/memberSession";

	let projects = $state<MemberProject[]>([]);
	let loading = $state(true);
	let errorMessage = $state("");

	onMount(async () => {
		try {
			projects = await fetchMyProjects();
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			loading = false;
		}
	});

	const active = $derived(projects.filter((project) => project.status !== "completed"));
	const completed = $derived(projects.filter((project) => project.status === "completed"));
</script>

{#snippet projectCard(project: MemberProject)}
	<div class="border border-[var(--arc-line)] bg-[var(--arc-surface)] p-5">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="min-w-0">
				<div class="flex items-center gap-2">
					{#if project.private}
						<Icon
							icon="mdi:lock-outline"
							class="shrink-0 text-[var(--arc-faint)]"
							title="Not shown publicly"
						/>
					{/if}
					<span class="text-[17px] font-bold text-[var(--arc-ink)]">{project.name}</span>
				</div>
				<div class="mt-1 text-[14px] font-medium text-[var(--arc-muted)]">
					{project.role || "Team member"}
				</div>
			</div>

			<span
				class="shrink-0 border px-3 py-1 text-[11px] font-bold tracking-[0.1em] {project.status ===
				'completed'
					? 'border-[var(--arc-line)] text-[var(--arc-muted)]'
					: 'border-[var(--arc-accent)] text-[var(--arc-accent)]'}"
			>
				{(project.status || "active").toUpperCase()}
			</span>
		</div>

		{#if project.slug && !project.private}
			<a class="arc-link mt-4 inline-block" href="/projects/{project.slug}">
				VIEW PROJECT PAGE
			</a>
		{/if}
	</div>
{/snippet}

{#if loading}
	<div class="px-6 py-12 text-center text-[15px] font-medium text-[var(--arc-muted)]">
		LOADING...
	</div>
{:else if errorMessage}
	<div class="px-6 py-6 text-[14px] font-bold text-[var(--arc-warn)]">{errorMessage}</div>
{:else if projects.length === 0}
	<div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
		<Icon icon="mdi:folder-outline" class="text-5xl text-[var(--arc-faint)]" />
		<p class="m-0 max-w-[420px] text-[15px] leading-[1.7] text-[var(--arc-muted)]">
			You are not on a project team yet. Ask a project lead to add you, and it will show up
			here.
		</p>
		<a class="arc-btn-ghost mt-2" href="/projects">BROWSE ALL PROJECTS</a>
	</div>
{:else}
	<div class="flex flex-col gap-8 px-6 py-6">
		{#if active.length}
			<div>
				<div class="text-[13px] font-bold tracking-[0.08em] text-[var(--arc-muted)]">
					ACTIVE
				</div>
				<div class="mt-4 grid gap-4 lg:grid-cols-2">
					{#each active as project (project.id)}
						{@render projectCard(project)}
					{/each}
				</div>
			</div>
		{/if}

		{#if completed.length}
			<div>
				<div class="text-[13px] font-bold tracking-[0.08em] text-[var(--arc-muted)]">
					COMPLETED
				</div>
				<div class="mt-4 grid gap-4 lg:grid-cols-2">
					{#each completed as project (project.id)}
						{@render projectCard(project)}
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
