<script lang="ts">
	import { onMount } from "svelte";

	type Project = {
		id: string;
		name: string;
		description: string;
		repoUrl: string;
		order: number;
		createdAt: string;
	};

	let projects = $state<Project[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(
				"https://manage.autonomousrobotics.club/api/public/club/projects",
				{ cache: "no-store" },
			);
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

<div class="super-container">
	<div class="config-category">
		<h2>CURRENT PROJECTS</h2>

		{#if loading}
			<p class="text-sm text-[#555]">Loading...</p>
		{:else}
			<div class="tables-container">
				<div class="table-wrapper">
					<table class="config-table">
						<thead>
							<tr>
								<th>PROJECT</th>
								<th>DESCRIPTION</th>
								<th>REPOSITORY</th>
							</tr>
						</thead>
						<tbody>
							{#if projects.length === 0}
								<tr>
									<td colspan="3" class="text-center py-4 text-[#555]"
										>No projects available.</td
									>
								</tr>
							{:else}
								{#each projects as project}
									<tr>
										<td><strong>{project.name}</strong></td>
										<td>{project.description}</td>
										<td>
											{#if project.repoUrl}
												<a
													href={project.repoUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<button class="edit-btn">VIEW GITHUB</button>
												</a>
											{/if}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>
