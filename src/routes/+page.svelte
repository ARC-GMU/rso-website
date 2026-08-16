<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import {
		apiRoot,
		discordUrl,
		emptyContent,
		githubUrl,
		instagramUrl,
		linkedinUrl,
		loadClubContent,
		mason360Url,
		youtubeUrl,
		type ClubContent
	} from "$lib/theme/content";

	const socialLinks = [
		{ label: "INSTAGRAM", url: instagramUrl, icon: "mdi:instagram", color: "var(--arc-instagram)" },
		{ label: "LINKEDIN", url: linkedinUrl, icon: "mdi:linkedin", color: "var(--arc-linkedin)" },
		{ label: "YOUTUBE", url: youtubeUrl, icon: "mdi:youtube", color: "var(--arc-youtube)" },
		{ label: "DISCORD", url: discordUrl, icon: "mdi:discord", color: "var(--arc-discord)" },
		{ label: "GITHUB", url: githubUrl, icon: "mdi:github", color: "var(--arc-ink)" }
	];

	type ClubEvent = {
		id: string;
		title: string;
		date: string;
		timeRange: string;
		location: string;
	};

	let content = $state<ClubContent>(emptyContent);
	let upcomingEvents = $state<ClubEvent[]>([]);

	onMount(async () => {
		content = await loadClubContent();

		try {
			const res = await fetch(`${apiRoot}/public/club/events`, { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				upcomingEvents = data.upcoming ?? [];
			}
		} catch (e) {
			console.error("Error fetching events:", e);
		}
	});

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric"
		});
	}
</script>

<svelte:head>
	<title>Autonomous Robotics Club</title>
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			<section
				class="flex flex-col gap-8 bg-[var(--arc-surface)] p-8 md:col-span-6 md:flex-row md:items-center md:justify-between md:gap-12 md:p-12"
			>
				<div>
					<h1 class="m-0 max-w-3xl text-[2rem] leading-[1.3] font-bold sm:text-[2.6rem]">
						Autonomous Robotics Club
					</h1>
					{#if content.whatWeDo}
						<p class="arc-body mt-5 max-w-2xl text-[17px]">{content.whatWeDo}</p>
					{/if}
					<div class="mt-9 flex flex-wrap gap-3">
						<a
							href={discordUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="arc-btn"
						>
							JOIN THE CLUB
						</a>
						<a href="/projects" class="arc-btn-ghost">VIEW PROJECTS</a>
					</div>
				</div>

				<img
					src="/logo.png"
					alt="ARC logo"
					class="h-40 w-auto shrink-0 object-contain md:h-60"
				/>
			</section>

			<div
				class="bg-[var(--arc-surface)] px-6 py-5 {content.schedule.length > 0
					? 'md:col-span-2'
					: 'md:col-span-3'}"
			>
				<div class="arc-label">LOCATION</div>
				<div class="mt-2 text-[15px] font-medium">{content.location}</div>
			</div>

			{#if content.schedule.length > 0}
				<div class="bg-[var(--arc-surface)] px-6 py-5 md:col-span-2">
					<div class="arc-label">MEETING TIMES</div>
					<div class="mt-2 text-[15px] font-medium">
						{#each content.schedule as entry}
							<div class="flex justify-between gap-4 py-1">
								<span>{entry.day}</span>
								<span>{entry.time}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div
				class="bg-[var(--arc-surface)] px-6 py-5 {content.schedule.length > 0
					? 'md:col-span-2'
					: 'md:col-span-3'}"
			>
				<div class="arc-label">FIND US</div>
				<div class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
					{#each socialLinks as social}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2.5 text-[15px] font-bold tracking-[0.06em] no-underline hover:underline"
							style="color: {social.color}"
						>
							<Icon icon={social.icon} class="text-lg" />
							{social.label}
						</a>
					{/each}
				</div>
			</div>

			<section
				class="bg-[var(--arc-surface)] p-8 {content.missionStatement
					? 'md:col-span-2'
					: 'md:col-span-3'}"
			>
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="arc-h2">UPCOMING EVENTS</h2>
					<a href="/events" class="arc-link">ALL EVENTS</a>
				</div>

				<div class="mt-5">
					{#if upcomingEvents.length === 0}
						<p class="arc-note">No upcoming events scheduled.</p>
					{:else}
						{#each upcomingEvents.slice(0, 3) as event}
							<div class="border-b border-[var(--arc-line-soft)] py-4 last:border-b-0">
								<div class="text-[15px] font-bold">{formatDate(event.date)}</div>
								<div class="mt-1 text-[14px] font-medium text-[var(--arc-muted)]">
									{event.timeRange} / {event.location}
								</div>
								<div class="mt-2 text-[15px] font-medium text-[var(--arc-ink-2)]">
									{event.title}
								</div>
								<a href="/events/{event.id}" class="arc-link mt-2 inline-block">
									VIEW INFO
								</a>
							</div>
						{/each}
					{/if}
				</div>
			</section>

			{#if content.missionStatement}
				<section
					class="flex flex-col justify-center bg-[var(--arc-surface)] p-8 text-center md:col-span-2"
				>
					<h2 class="arc-h2">MISSION STATEMENT</h2>
					<p class="arc-body mt-4">{content.missionStatement}</p>
				</section>
			{/if}

			<section
				class="bg-[var(--arc-surface)] p-8 {content.missionStatement
					? 'md:col-span-2'
					: 'md:col-span-3'}"
			>
				<h2 class="arc-h2">GET INVOLVED</h2>
				<p class="arc-note mt-4">
					No experience required. Come to a meeting, pick a project, and start
					building with the team.
				</p>
				<div class="mt-6 flex flex-col gap-3">
					<a href={mason360Url} target="_blank" rel="noopener noreferrer" class="arc-btn">
						SIGN UP ON MASON360
					</a>
					<a
						href={discordUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="arc-btn-ghost"
					>
						JOIN THE DISCORD
					</a>
				</div>
			</section>

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-3">
				<h2 class="arc-h2">2026 EAST COAST AVC</h2>
				<div class="mt-5 aspect-video w-full border border-[var(--arc-line)]">
					<iframe
						src="https://www.youtube.com/embed/J9QkS8nLYy0"
						title="2026 East Coast Autonomous Vehicle Competition"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
						class="h-full w-full border-none"
					></iframe>
				</div>
			</section>

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-3">
				<h2 class="arc-h2">CLUB VIDEO</h2>
				<div class="mt-5 aspect-video w-full border border-[var(--arc-line)]">
					<iframe
						src="https://www.youtube.com/embed/iIVQBmexkuU?si=0iO24cZmjIBcFMSx"
						title="Autonomous Robotics Club video"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
						class="h-full w-full border-none"
					></iframe>
				</div>
			</section>
		</div>
	</main>

	<Footer />
</div>
