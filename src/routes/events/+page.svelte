<script lang="ts">
	import { onMount } from "svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, type ScheduleEntry } from "$lib/theme/content";

	type ClubEvent = {
		id: string;
		title: string;
		date: string;
		timeRange: string;
		location: string;
	};

	let schedule = $state<ScheduleEntry[]>([]);
	let upcoming = $state<ClubEvent[]>([]);
	let past = $state<ClubEvent[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/club/events`, {
				cache: "no-store"
			});
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

	const calendarId =
		"4ddd5a1a4f8d806829a85b10e2e7d77d1185fb5ad242551cf6d48103f2876183%40group.calendar.google.com";

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: "America/New_York"
		});
	}
</script>

{#snippet eventTable(events: ClubEvent[], emptyText: string)}
	<div class="overflow-x-auto">
		<table class="arc-table arc-table-fixed">
			<thead>
				<tr>
					<th class="w-[25%]">DATE</th>
					<th class="w-[30%]">EVENT</th>
					<th class="w-[25%]">LOCATION</th>
					<th class="w-[20%]">DETAILS</th>
				</tr>
			</thead>
			<tbody>
				{#if events.length === 0}
					<tr>
						<td colspan="4" class="arc-table-empty">{emptyText}</td>
					</tr>
				{:else}
					{#each events as event}
						<tr>
							<td class="whitespace-nowrap">
								<span class="font-bold">{formatDate(event.date)}</span>
								<span class="mt-1 block text-[12px] text-[var(--arc-muted-2)]">
									{event.timeRange}
								</span>
							</td>
							<td>{event.title}</td>
							<td>{event.location}</td>
							<td>
								<a href="/events/{event.id}" class="arc-btn-small">VIEW INFO</a>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/snippet}

<Page title="Events">
	{#if loading}
		<Panel>
			<p class="arc-note">Loading...</p>
		</Panel>
	{:else}
		{#if schedule.length > 0}
			<Panel title="MEETING SCHEDULE" flush>
				<table class="arc-table arc-table-fixed">
					<tbody>
						{#each schedule as entry}
							<tr>
								<th class="w-48">{entry.day.toUpperCase()}</th>
								<td>{entry.time}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Panel>
		{/if}

		<Panel title="UPCOMING EVENTS" flush>
			{@render eventTable(upcoming, "No upcoming events scheduled.")}
		</Panel>

		<Panel title="TEAM CALENDAR">
			{#snippet action()}
				<a
					href="https://calendar.google.com/calendar/render?cid={calendarId}"
					target="_blank"
					rel="noopener noreferrer"
					class="arc-link"
				>
					SUBSCRIBE / SYNC
				</a>
			{/snippet}

			<iframe
				src="https://calendar.google.com/calendar/embed?src={calendarId}&ctz=America%2FNew_York"
				title="Autonomous Robotics Club calendar"
				class="h-[650px] w-full border border-[var(--arc-line)]"
				scrolling="no"
			></iframe>
		</Panel>

		<Panel title="PAST EVENTS" flush>
			{@render eventTable(past, "No past events.")}
		</Panel>
	{/if}
</Page>
