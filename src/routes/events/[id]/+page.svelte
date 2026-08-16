<script lang="ts">
	import { onMount } from "svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { apiRoot } from "$lib/theme/content";

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

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/club/events?id=${data.id}`, {
				cache: "no-store"
			});
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
			timeZone: "America/New_York"
		});
	}
</script>

<svelte:head>
	<title>{event ? event.title : "Event"} - Autonomous Robotics Club</title>
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			{#if loading}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<p class="arc-note">Loading...</p>
				</div>
			{:else if !event}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h1 class="arc-h1">EVENT NOT FOUND</h1>
					<p class="arc-note mt-4">This event could not be found.</p>
					<a href="/events" class="arc-btn-ghost mt-6">ALL EVENTS</a>
				</div>
			{:else}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
					<nav class="arc-label">
						<a href="/events" class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">
							EVENTS
						</a>
						<span class="mx-2 text-[var(--arc-faint)]">/</span>
						<span>{event.title.toUpperCase()}</span>
					</nav>

					<h1 class="arc-h1 mt-5">{event.title.toUpperCase()}</h1>

					{#if event.rsvpUrl}
						<a
							href={event.rsvpUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="arc-btn mt-8"
						>
							RSVP FOR THIS EVENT
						</a>
					{/if}
				</section>

				<div class="bg-[var(--arc-surface)] px-6 py-5 md:col-span-2">
					<div class="arc-label">DATE</div>
					<div class="mt-2 text-[15px] font-medium">{formatDate(event.date)}</div>
				</div>

				<div class="bg-[var(--arc-surface)] px-6 py-5 md:col-span-2">
					<div class="arc-label">TIME</div>
					<div class="mt-2 text-[15px] font-medium">{event.timeRange}</div>
				</div>

				<div class="bg-[var(--arc-surface)] px-6 py-5 md:col-span-2">
					<div class="arc-label">LOCATION</div>
					<div class="mt-2 text-[15px] font-medium">{event.location}</div>
				</div>

				{#if event.description}
					<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
						<h2 class="arc-h2">ABOUT THIS EVENT</h2>
						<div class="arc-body mt-4">{@html event.description}</div>
					</section>
				{/if}

				{#each event.sections ?? [] as section}
					<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
						<h2 class="arc-h2">{section.title.toUpperCase()}</h2>
						<div class="arc-body mt-4">{@html section.content}</div>
					</section>
				{/each}

				{#if event.eventAddress}
					<section
						class="bg-[var(--arc-surface)] p-8 {event.parkingAddress
							? 'md:col-span-3'
							: 'md:col-span-6'}"
					>
						<h2 class="arc-h2">EVENT ADDRESS</h2>
						<div class="arc-body mt-4">{@html event.eventAddress}</div>
					</section>
				{/if}

				{#if event.parkingAddress}
					<section
						class="bg-[var(--arc-surface)] p-8 {event.eventAddress
							? 'md:col-span-3'
							: 'md:col-span-6'}"
					>
						<h2 class="arc-h2">PARKING</h2>
						{#if event.parkingInfo}
							<div class="arc-body font-bold mt-3">{@html event.parkingInfo}</div>
						{/if}
						<div class="arc-body mt-4">{@html event.parkingAddress}</div>
					</section>
				{/if}

				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<h2 class="arc-h2">
							{event.rsvpUrl ? "RESERVE YOUR SPOT" : "SEE THE FULL SCHEDULE"}
						</h2>
						<div class="flex flex-wrap gap-3">
							{#if event.rsvpUrl}
								<a
									href={event.rsvpUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="arc-btn"
								>
									RSVP HERE
								</a>
							{/if}
							<a href="/events" class="arc-btn-ghost">ALL EVENTS</a>
						</div>
					</div>
				</section>
			{/if}
		</div>
	</main>

	<Footer />
</div>
