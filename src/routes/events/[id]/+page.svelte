<script lang="ts">
	import { onMount } from "svelte";

	type Section = { title: string; content: string };

	type EventDetail = {
		id: string;
		title: string;
		date: string;
		timeRange: string;
		location: string;
		description: string;
		rsvpUrl?: string;
		eventAddress?: string;
		parkingAddress?: string;
		parkingInfo?: string;
		sections: Section[];
	};

	let { data }: { data: { id: string } } = $props();

	let event = $state<EventDetail | null>(null);
	let loading = $state(true);
	let notFound = $state(false);

	onMount(async () => {
		try {
			const res = await fetch(
				`https://manage.autonomousrobotics.club/api/public/club/events?id=${data.id}`,
				{ cache: "no-store" },
			);
			if (res.status === 404) {
				notFound = true;
				return;
			}
			if (res.ok) {
				event = await res.json();
			}
		} catch (e) {
			console.error("Error fetching event:", e);
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

{#if loading}
	<div class="config-category">
		<p class="text-sm text-[#555]">Loading...</p>
	</div>
{:else if notFound || !event}
	<div class="config-category">
		<h2>EVENT NOT FOUND</h2>
		<p class="mb-4">This event could not be found.</p>
		<a href="/events"><button class="edit-btn">BACK TO EVENTS</button></a>
	</div>
{:else}
	<!-- Page header -->
	<div class="border border-black bg-[#f0f0f0] p-5 mb-5">
		<a href="/events">
			<button class="edit-btn mb-4">← BACK TO EVENTS</button>
		</a>

		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
			<div>
				<h1 class="text-2xl md:text-3xl font-bold m-0 mb-3 leading-tight">
					{event.title.toUpperCase()}
				</h1>
				<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#444]">
					<span>{formatDate(event.date)}</span>
					<span class="text-[#bbb]">·</span>
					<span>{event.timeRange}</span>
					<span class="text-[#bbb]">·</span>
					<span>{event.location}</span>
				</div>
			</div>

			{#if event.rsvpUrl}
				<a
					href={event.rsvpUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="flex-shrink-0"
				>
					<button
						class="save-btn py-2.5 px-6 font-bold w-full md:w-auto hover:bg-black hover:text-white transition-colors border-2 border-black whitespace-nowrap"
					>
						RSVP FOR THIS EVENT →
					</button>
				</a>
			{/if}
		</div>
	</div>

	<!-- Body -->
	<div class="dashboard-grid">
		<div class="column-main">
			{#if event.description}
				<div class="config-category">
					<h2>ABOUT THIS EVENT</h2>
					<p class="leading-relaxed">{event.description}</p>
				</div>
			{/if}

			{#each event.sections as section}
				<div class="config-category">
					<h2>{section.title}</h2>
					<p class="leading-relaxed" style="white-space: pre-line;">
						{section.content}
					</p>
				</div>
			{/each}
		</div>

		<div class="column-side">
			{#if event.eventAddress || event.parkingAddress}
				<div class="config-category">
					<h2>LOCATION & PARKING</h2>

					{#if event.eventAddress}
						<div class="mb-4">
							<div class="text-xs font-bold text-[#555] mb-1.5 uppercase tracking-wider">
								Event Address
							</div>
							<div
								class="border border-black p-3 bg-[#f8f8f8] text-sm leading-relaxed"
								style="white-space: pre-line;"
							>
								{event.eventAddress}
							</div>
						</div>
					{/if}

					{#if event.parkingAddress}
						<div>
							<div class="text-xs font-bold text-[#555] mb-1.5 uppercase tracking-wider">
								{event.parkingInfo ? `Parking — ${event.parkingInfo}` : "Parking"}
							</div>
							<div
								class="border border-black p-3 bg-[#f8f8f8] text-sm leading-relaxed"
								style="white-space: pre-line;"
							>
								{event.parkingAddress}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if event.rsvpUrl}
				<div class="config-category">
					<h2>REGISTER</h2>
					<p class="text-sm mb-4 leading-relaxed">
						Use the link below to RSVP and secure your spot at this event.
					</p>
					<a
						href={event.rsvpUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="block"
					>
						<button
							class="save-btn w-full py-2.5 font-bold hover:bg-black hover:text-white transition-colors border border-black"
						>
							RSVP HERE
						</button>
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
