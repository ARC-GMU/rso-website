<script lang="ts">
	import { onMount } from "svelte";
	import { fetchAttendanceHistory, type AttendanceRecord } from "$lib/memberSession";

	let meetings = $state<AttendanceRecord[]>([]);
	let loading = $state(true);
	let errorMessage = $state("");

	onMount(async () => {
		try {
			meetings = await fetchAttendanceHistory();
		} catch (e: any) {
			errorMessage = e.message;
		} finally {
			loading = false;
		}
	});

	function formatDate(value: string | null) {
		if (!value) return "";
		return new Date(value).toLocaleDateString(undefined, {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	}

	function formatTime(value: string) {
		return new Date(value).toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit"
		});
	}
</script>

{#if loading}
	<div class="px-6 py-12 text-center text-[15px] font-medium text-[var(--arc-muted)]">
		LOADING...
	</div>
{:else if errorMessage}
	<div class="px-6 py-6 text-[14px] font-bold text-[var(--arc-warn)]">{errorMessage}</div>
{:else if meetings.length === 0}
	<div class="px-6 py-12 text-center">
		<p class="m-0 text-[15px] leading-[1.7] text-[var(--arc-muted)]">
			You have not signed in to a meeting yet. An officer shares a sign in link at each
			meeting.
		</p>
	</div>
{:else}
	<div class="px-6 py-6">
		<div class="text-[13px] font-bold tracking-[0.08em] text-[var(--arc-muted)]">
			{meetings.length} MEETING{meetings.length === 1 ? "" : "S"} ATTENDED
		</div>

		<ul class="m-0 mt-4 list-none p-0">
			{#each meetings as record (record.id)}
				<li
					class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--arc-line-soft)] py-3 last:border-b-0"
				>
					<span class="text-[15px] font-bold text-[var(--arc-ink)]">
						{record.meetingTitle || "Meeting"}
					</span>
					<span class="text-[13px] font-medium text-[var(--arc-muted)]">
						{formatDate(record.meetingDate ?? record.signedInAt)} · signed in
						{formatTime(record.signedInAt)}
					</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
