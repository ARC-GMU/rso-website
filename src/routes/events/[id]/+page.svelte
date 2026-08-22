<script lang="ts">
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";

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

	let { data }: { data: { event: EventDetail } } = $props();

	let event = $derived(data.event);

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: "America/New_York"
		});
	}

	let metaDescription = $derived(
		event.description
			? stripHtml(event.description).slice(0, 200)
			: `${formatDate(event.date)} / ${event.timeRange} at ${event.location}.`
	);
</script>

<svelte:head>
	<title>{event.title} - Autonomous Robotics Club</title>
	<meta name="description" content={metaDescription} />
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
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
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html event.description}</div>
				</section>
			{/if}

			{#each event.sections ?? [] as section}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">{section.title.toUpperCase()}</h2>
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html section.content}</div>
				</section>
			{/each}

			{#if event.eventAddress}
				<section
					class="bg-[var(--arc-surface)] p-8 {event.parkingAddress
						? 'md:col-span-3'
						: 'md:col-span-6'}"
				>
					<h2 class="arc-h2">EVENT ADDRESS</h2>
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html event.eventAddress}</div>
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
						<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] font-bold mt-3">{@html event.parkingInfo}</div>
					{/if}
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html event.parkingAddress}</div>
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
		</div>
	</main>

	<Footer />
</div>
