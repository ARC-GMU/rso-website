<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, type Project } from "$lib/theme/content";

	let projects = $state<Project[]>([]);
	let loading = $state(true);

	let activeProjects = $derived(projects.filter((p) => p.status !== "completed"));
	let completedProjects = $derived(projects.filter((p) => p.status === "completed"));

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	function projectHref(project: Project): string {
		if (project.external && project.externalUrl) return project.externalUrl;
		return `/projects/${project.slug || project.id}`;
	}

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/club/projects`, {
				cache: "no-store"
			});
			if (res.ok) {
				projects = await res.json();
			}
		} catch (e) {
			console.error("Error fetching projects:", e);
		} finally {
			loading = false;
		}
	});
</script>

{#snippet projectGrid(list: Project[])}
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each list as project}
			<div
				class="flex w-full min-w-0 flex-col border border-[var(--arc-line)] bg-[var(--arc-fill)]"
			>
				{#if project.images && project.images.length > 0}
					<img
						src={project.images[0]}
						alt={project.name}
						class="h-44 w-full border-b border-[var(--arc-line)] object-cover"
					/>
				{:else}
					<div
						class="flex h-44 w-full items-center justify-center border-b border-[var(--arc-line)] bg-[var(--arc-surface)]"
					>
						<Icon icon="mdi:image-outline" class="h-12 w-12 text-[var(--arc-line)]" />
					</div>
				{/if}
				<div class="flex flex-1 flex-col gap-2 p-5">
					<div class="arc-h3 text-lg text-[var(--arc-ink)]">{project.name}</div>
					{#if project.description}
						<p class="arc-note line-clamp-3 flex-1">{stripHtml(project.description)}</p>
					{/if}
					<a
						href={projectHref(project)}
						target={project.external && project.externalUrl ? "_blank" : undefined}
						rel={project.external && project.externalUrl ? "noopener noreferrer" : undefined}
						class="arc-btn mt-3 w-full text-center"
					>
						{project.external && project.externalUrl ? "VISIT PROJECT" : "VIEW DETAILS"}
					</a>
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<Page title="Projects">
	{#if loading}
		<Panel>
			<p class="arc-note">Loading...</p>
		</Panel>
	{:else if projects.length === 0}
		<Panel>
			<p class="arc-note">No projects available.</p>
		</Panel>
	{:else}
		{#if activeProjects.length > 0}
			<Panel title="CURRENT PROJECTS">
				{@render projectGrid(activeProjects)}
			</Panel>
		{/if}

		{#if completedProjects.length > 0}
			<Panel title="PAST PROJECTS">
				{@render projectGrid(completedProjects)}
			</Panel>
		{/if}
	{/if}
</Page>
