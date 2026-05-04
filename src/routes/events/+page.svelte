<script lang="ts">
	import { onMount } from "svelte";

	type ScheduleEntry = { day: string; time: string };

	type ClubEvent = {
		id: string;
		title: string;
		date: string;
		timeRange: string;
		location: string;
		rsvpUrl?: string;
	};

	let schedule = $state<ScheduleEntry[]>([]);
	let upcoming = $state<ClubEvent[]>([]);
	let past = $state<ClubEvent[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(
				"https://manage.autonomousrobotics.club/api/public/club/events",
				{ cache: "no-store" },
			);
			if (res.ok) {
				const data = await res.json();
				schedule = data.schedule ?? [];
				upcoming = data.upcoming ?? [];
				past = data.past ?? [];
			}
		} catch (e) {
			console.error("Error fetching events:", e);
		} finally {
			loading = false;
		}
	});

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}
</script>

<div class="super-container">
	{#if loading}
		<div class="config-category">
			<h2>EVENTS</h2>
			<p class="text-sm text-[#555]">Loading...</p>
		</div>
	{:else}
		{#if schedule.length > 0}
			<div class="config-category">
				<h2>MEETING SCHEDULE</h2>
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

		<div class="config-category">
			<h2>UPCOMING EVENTS</h2>
			<div class="tables-container">
				<div class="table-wrapper">
					<table class="config-table">
						<thead>
							<tr>
								<th>DATE</th>
								<th>EVENT</th>
								<th>LOCATION</th>
								<th>DETAILS</th>
							</tr>
						</thead>
						<tbody>
							{#if upcoming.length === 0}
								<tr>
									<td colspan="4" class="text-center py-4 text-[#555]"
										>No upcoming events scheduled.</td
									>
								</tr>
							{:else}
								{#each upcoming as event}
									<tr>
										<td>
											<strong>{formatDate(event.date)}</strong><br />
											<span class="text-xs text-[#555]">{event.timeRange}</span>
										</td>
										<td>{event.title}</td>
										<td>{event.location}</td>
										<td>
											<a href={`/events/${event.id}`}>
												<button class="edit-btn">VIEW INFO</button>
											</a>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="config-category">
			<h2>PAST EVENTS</h2>
			<div class="tables-container">
				<div class="table-wrapper">
					<table class="config-table">
						<thead>
							<tr>
								<th>DATE</th>
								<th>EVENT</th>
								<th>LOCATION</th>
								<th>DETAILS</th>
							</tr>
						</thead>
						<tbody>
							{#if past.length === 0}
								<tr>
									<td colspan="4" class="text-center py-4 text-[#555]"
										>No past events.</td
									>
								</tr>
							{:else}
								{#each past as event}
									<tr>
										<td>
											<strong>{formatDate(event.date)}</strong><br />
											<span class="text-xs text-[#555]">{event.timeRange}</span>
										</td>
										<td>{event.title}</td>
										<td>{event.location}</td>
										<td>
											<a href={`/events/${event.id}`}>
												<button class="edit-btn">VIEW INFO</button>
											</a>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</div>
