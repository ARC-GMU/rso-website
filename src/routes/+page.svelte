<script lang="ts">
	import { onMount } from "svelte";

	type ScheduleEntry = { day: string; time: string };

	let focusStatement = $state("");
	let missionStatement = $state("");
	let whatWeDo = $state("");
	let organization = $state("");
	let location = $state("");
	let schedule = $state<ScheduleEntry[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(
				"https://manage.autonomousrobotics.club/api/public/club/about",
				{ cache: "no-store" },
			);
			if (res.ok) {
				const data = await res.json();
				focusStatement = data.focusStatement ?? "";
				missionStatement = data.missionStatement ?? "";
				whatWeDo = data.whatWeDo ?? "";
				organization = data.organization ?? "";
				location = data.location ?? "";
				schedule = data.schedule ?? [];
			}
		} catch (e) {
			console.error("Error fetching about-the-team content:", e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="dashboard-grid">
	<div class="column-main">
		<div class="config-category">
			<h2>ABOUT THE TEAM</h2>
			{#if loading}
				<p class="text-sm text-[#555]">Loading...</p>
			{:else}
				<p>{focusStatement}</p>
			{/if}
		</div>

		{#if !loading && missionStatement}
			<div class="hardware-box">
				<h3>MISSION STATEMENT</h3>
				<p>{missionStatement}</p>
			</div>
		{/if}

		{#if !loading && whatWeDo}
			<div class="hardware-box mt-5">
				<h3>WHAT WE DO</h3>
				<p>{whatWeDo}</p>
			</div>
		{/if}
	</div>

	<div class="column-side">
		<div class="config-category">
			<h2>CLUB OVERVIEW</h2>
			<div class="tables-container">
				<div class="table-wrapper">
					<table class="config-table">
						<tbody>
							<tr>
								<th>ORGANIZATION</th>
								<td>{organization}</td>
							</tr>
							<tr>
								<th>LOCATION</th>
								<td>{location}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		{#if !loading && schedule.length > 0}
			<div class="config-category">
				<h2>MEETING TIMES</h2>
				<div class="tables-container">
					<div class="table-wrapper">
						<table class="config-table">
							<tbody>
								{#each schedule as entry}
									<tr>
										<th>{entry.day.toUpperCase()}</th>
										<td>{entry.time}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
