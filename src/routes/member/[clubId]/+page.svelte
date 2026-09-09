<script lang="ts">
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { formatDuration } from "$lib/duration";
	import { socialLinkIcon, socialLinkLabel } from "$lib/socialLink";
	import type { PublicMemberProfile } from "$lib/memberSession";

	let { data }: { data: { profile: PublicMemberProfile } } = $props();

	let profile = $derived(data.profile);
	let activeProjects = $derived(profile.projects.filter((p) => p.status !== "completed"));
	let completedProjects = $derived(profile.projects.filter((p) => p.status === "completed"));

	function joinedLabel(value: string | null): string {
		if (!value) return "";
		return new Date(value).toLocaleDateString(undefined, { month: "long", year: "numeric" });
	}

	let metaDescription = $derived(
		profile.bio
			? profile.bio.slice(0, 200)
			: `${profile.name} — Autonomous Robotics Club member ${profile.clubId}.`
	);
</script>

<svelte:head>
	<title>{profile.name} - Autonomous Robotics Club</title>
	<meta name="description" content={metaDescription} />
	{#if profile.photoUrl}
		<meta property="og:image" content={profile.photoUrl} />
	{/if}
</svelte:head>

{#snippet projectList(list: PublicMemberProfile["projects"])}
	<div class="mt-4 flex flex-col gap-3">
		{#each list as project (project.id)}
			<a
				href="/projects/{project.slug || project.id}"
				class="flex items-center justify-between gap-4 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-4 no-underline hover:border-[var(--arc-accent)]"
			>
				<div class="min-w-0">
					<div class="text-[16px] font-bold text-[var(--arc-ink)]">
						{project.name.toUpperCase()}
					</div>
					{#if project.role}
						<div class="mt-1 text-[14px] font-medium text-[var(--arc-muted)]">
							{project.role}
						</div>
					{/if}
				</div>
				<Icon icon="mdi:chevron-right" class="flex-shrink-0 text-2xl text-[var(--arc-muted)]" />
			</a>
		{/each}
	</div>
{/snippet}

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
				<nav class="arc-label">
					<span class="text-[var(--arc-muted)]">MEMBER</span>
					<span class="mx-2 text-[var(--arc-faint)]">/</span>
					<span>{profile.clubId}</span>
				</nav>

				<div class="mt-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
					{#if profile.photoUrl}
						<img
							src={profile.photoUrl}
							alt={profile.name}
							class="h-32 w-32 flex-shrink-0 rounded-2xl border border-[var(--arc-line)] object-cover sm:h-40 sm:w-40"
						/>
					{:else}
						<div
							class="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--arc-line)] bg-[var(--arc-fill)] sm:h-40 sm:w-40"
						>
							<Icon icon="mdi:account-circle" class="h-20 w-20 text-[var(--arc-line)]" />
						</div>
					{/if}

					<div>
						<h1 class="arc-h1">{profile.name.toUpperCase()}</h1>
						<div class="arc-label mt-2 text-[var(--arc-accent)]">{profile.clubId}</div>
						{#if profile.major || profile.year}
							<div class="arc-note mt-1">
								{[profile.major, profile.year].filter(Boolean).join(" · ")}
							</div>
						{/if}
						{#if profile.joinedAt}
							<div class="arc-note mt-1">Member since {joinedLabel(profile.joinedAt)}</div>
						{/if}
					</div>
				</div>

				{#if profile.links.length > 0}
					<div class="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
						{#each profile.links as link (link.url)}
							<a href={link.url} target="_blank" rel="noopener noreferrer" class="arc-btn-ghost">
								<Icon
									icon={socialLinkIcon(link)}
									class="mr-1 inline-block align-text-bottom text-lg"
								/>
								{socialLinkLabel(link).toUpperCase()}
							</a>
						{/each}
					</div>
				{/if}
			</section>

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-3">
				<h2 class="arc-h2">TIME LOGGED</h2>
				<div class="mt-4 text-[42px] leading-none font-bold text-[var(--arc-ink)]">
					{formatDuration(profile.minutesLogged)}
				</div>
				<p class="arc-note mt-3">
					Work time logged across {profile.meetingsAttended} meeting{profile.meetingsAttended === 1
						? ""
						: "s"} attended.
				</p>
			</section>

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-3">
				<h2 class="arc-h2">PROJECTS</h2>
				<div class="mt-4 text-[42px] leading-none font-bold text-[var(--arc-ink)]">
					{profile.projects.length}
				</div>
				<p class="arc-note mt-3">
					Project team{profile.projects.length === 1 ? "" : "s"} this member is part of.
				</p>
			</section>

			{#if profile.bio}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">ABOUT</h2>
					<p class="mt-4 text-[16px] leading-[1.8] whitespace-pre-line text-[var(--arc-ink-2)]">
						{profile.bio}
					</p>
				</section>
			{/if}

			{#if activeProjects.length > 0}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">CURRENT PROJECTS</h2>
					{@render projectList(activeProjects)}
				</section>
			{/if}

			{#if completedProjects.length > 0}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">PAST PROJECTS</h2>
					{@render projectList(completedProjects)}
				</section>
			{/if}

			{#if profile.projects.length === 0}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">PROJECTS</h2>
					<p class="arc-note mt-4">This member is not on a project team yet.</p>
					<a class="arc-btn-ghost mt-4 inline-block" href="/projects">BROWSE PROJECTS</a>
				</section>
			{/if}
		</div>
	</main>

	<Footer />
</div>
