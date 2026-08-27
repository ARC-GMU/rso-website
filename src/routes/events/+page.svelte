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
		"4c826a39964247488f072f2a32faf5716741eaf7fb6aaebe19eae29af306330b%40group.calendar.google.com";

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
	{#if events.length === 0}
		<p class="arc-table-empty">{emptyText}</p>
	{:else}
		<div class="hidden overflow-x-auto sm:block">
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
					{#each events as event}
						<tr>
							<td>
								<span class="block truncate font-bold">{formatDate(event.date)}</span>
								<span class="mt-1 block truncate text-[12px] text-[var(--arc-muted-2)]">
									{event.timeRange}
								</span>
							</td>
							<td class="truncate">{event.title}</td>
							<td class="truncate">{event.location}</td>
							<td>
								<a href="/events/{event.id}" class="arc-btn-small">VIEW INFO</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="flex flex-col divide-y divide-[var(--arc-line-soft)] sm:hidden">
			{#each events as event}
				<a
					href="/events/{event.id}"
					class="flex flex-col gap-1 px-5 py-4 no-underline hover:bg-[var(--arc-fill)]"
				>
					<span class="font-bold text-[var(--arc-ink)]">{formatDate(event.date)}</span>
					<span class="text-[12px] text-[var(--arc-muted-2)]">{event.timeRange}</span>
					<span class="mt-1 font-medium text-[var(--arc-ink-2)]">{event.title}</span>
					{#if event.location}
						<span class="text-[13px] text-[var(--arc-muted)]">{event.location}</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
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

		<Panel title="TEAM CALENDAR" padding="p-0 sm:p-6">
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
				class="hidden h-[650px] w-full border border-[var(--arc-line)] sm:block"
				scrolling="no"
			></iframe>
			<iframe
				src="https://calendar.google.com/calendar/embed?src={calendarId}&ctz=America%2FNew_York&mode=AGENDA"
				title="Autonomous Robotics Club calendar (agenda view)"
				class="block h-[650px] w-full border border-[var(--arc-line)] sm:hidden"
				scrolling="no"
			></iframe>
		</Panel>

		<Panel title="PAST EVENTS" flush>
			{@render eventTable(past, "No past events.")}
		</Panel>
	{/if}
</Page>
