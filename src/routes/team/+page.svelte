<script lang="ts">
	import TeamTable from "$lib/components/TeamTable.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="dashboard-grid">
	<div class="column-main">
		{#if data.teams && data.teams.length > 0}
			{#each data.teams as team}
				<TeamTable title={team.name.toUpperCase()} members={team.members} />
			{/each}
		{:else}
			<div class="config-category">
				<h2>TEAM ROSTER</h2>
				<p>Unable to load team roster at this time.</p>
			</div>
		{/if}
	</div>

	<div class="column-side">
		<div class="hardware-box">
			<h3>JOIN US & CONTRIBUTE</h3>
			<p>
				Interested in joining the ARC team? We are looking for members
				who are interested and <strong>dedicated</strong> to working with
				us.
			</p>
			<hr />
			<ul style="margin: 5px 0 0 15px; padding: 0;">
				<li>Join our Discord server.</li>
			</ul>
			<a
				href="https://discord.gg/WfKAbJpZFX"
				target="_blank"
				rel="noopener noreferrer"
				style="display: block; width: 100%; text-decoration: none;"
			>
				<button class="save-btn" style="margin-top: 15px; width: 100%;"
					>JOIN DISCORD</button
				>
			</a>
		</div>
	</div>
</div>
