<script lang="ts">
	import { onMount } from "svelte";
	import TeamTable from "$lib/components/TeamTable.svelte";

	let teams = $state<{ name: string; members: any[] }[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(
				"https://manage.autonomousrobotics.club/api/roster",
				{ cache: "no-store" },
			);
			if (res.ok) {
				teams = await res.json();
			}
		} catch (e) {
			console.error("Error fetching roster:", e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="dashboard-grid">
	<div class="column-main">
		{#if loading}
			<div class="config-category">
				<h2>TEAM ROSTER</h2>
				<p class="text-sm text-[#555]">Loading...</p>
			</div>
		{:else if teams.length > 0}
			{#each teams as team}
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
