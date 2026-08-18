<script lang="ts">
	import { onMount } from "svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, type Project } from "$lib/theme/content";

	let projects = $state<Project[]>([]);
	let loading = $state(true);

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

<Page title="Projects" heading="Current Projects">
	<Panel title="PROJECTS" flush>
		{#if loading}
			<p class="arc-table-empty">Loading...</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="arc-table arc-table-fixed">
					<thead>
						<tr>
							<th class="w-[40%]">PROJECT</th>
							<th class="w-[40%]">DESCRIPTION</th>
							<th class="w-[20%]">DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{#if projects.length === 0}
							<tr>
								<td colspan="3" class="arc-table-empty">No projects available.</td>
							</tr>
						{:else}
							{#each projects as project}
								<tr>
									<td class="font-bold truncate">{project.name}</td>
									<td class="truncate">{project.description ? stripHtml(project.description) : ""}</td>
									<td>
										{#if project.external && project.externalUrl}
											<a
												href={project.externalUrl}
												target="_blank"
												rel="noopener noreferrer"
												class="arc-btn-small"
											>
												VISIT PROJECT
											</a>
										{:else}
											<a href="/projects/{project.slug || project.id}" class="arc-btn-small">
												VIEW DETAILS
											</a>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
	</Panel>
</Page>
