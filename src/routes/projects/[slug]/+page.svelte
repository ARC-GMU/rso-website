<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { apiRoot } from "$lib/theme/content";
	import { parseProjectMember } from "$lib/projectMember";

	type ProjectLink = { label: string; url: string };

	type ProjectDetail = {
		id: string;
		name: string;
		description: string;
		repoUrl?: string;
		requirements?: string[];
		links?: ProjectLink[];
		teamMembers?: unknown[];
		images?: string[];
		videos?: string[];
		external?: boolean;
		externalUrl?: string;
	};

	let { data }: { data: { project: ProjectDetail } } = $props();

	let project = $derived(data.project);

	type RosterMatch = { photoUrl?: string; href?: string };

	let rosterMembers = new Map<string, RosterMatch>();
	let rosterLoaded = $state(false);

	function rosterMatch(name: string): RosterMatch {
		if (!rosterLoaded) return {};
		return rosterMembers.get(name.trim().toLowerCase()) ?? {};
	}

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	onMount(async () => {
		try {
			const rosterRes = await fetch(`${apiRoot}/roster`, { cache: "no-store" });
			if (rosterRes.ok) {
				const teams = await rosterRes.json();
				for (const team of teams ?? []) {
					for (const member of team.members ?? []) {
						const key = member.slug || member.id;
						rosterMembers.set(member.name.trim().toLowerCase(), {
							photoUrl: member.photoUrl || undefined,
							href: key ? `/team/${key}` : undefined
						});
					}
				}
			}
		} catch (e) {
			console.error("Error fetching roster:", e);
		}
		rosterLoaded = true;
	});

	let coverImage = $derived(project.images?.[0]);
	let galleryImages = $derived(project.images?.slice(1) ?? []);
	let metaDescription = $derived(
		project.description
			? stripHtml(project.description).slice(0, 200)
			: `${project.name} — an Autonomous Robotics Club project.`
	);
</script>

<svelte:head>
	<title>{project.name} - Autonomous Robotics Club</title>
	<meta name="description" content={metaDescription} />
	{#if coverImage}
		<meta property="og:image" content={coverImage} />
	{/if}
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			<!-- Hero -->
			{#if coverImage}
				<div class="md:col-span-6">
					<img
						src={coverImage}
						alt={project.name}
						class="h-[240px] w-full object-cover sm:h-[340px] md:h-[420px]"
					/>
				</div>
			{/if}

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
				<nav class="arc-label">
					<a href="/projects" class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">
						PROJECTS
					</a>
					<span class="mx-2 text-[var(--arc-faint)]">/</span>
					<span>{project.name.toUpperCase()}</span>
				</nav>

				<h1 class="arc-h1 mt-5">{project.name.toUpperCase()}</h1>

				<div class="mt-6 flex flex-wrap gap-3">
					{#if project.repoUrl}
						<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="arc-btn">
							<Icon icon="mdi:github" class="inline-block align-text-bottom" /> VIEW REPOSITORY
						</a>
					{/if}
					{#if project.requirements?.length}
						<span class="arc-btn-ghost pointer-events-none">
							{project.requirements.length} REQUIREMENT{project.requirements.length === 1 ? "" : "S"}
						</span>
					{/if}
				</div>
			</section>

			{#if project.description}
				<section class="bg-[var(--arc-surface)] p-8 {project.teamMembers?.length || project.requirements?.length || project.links?.length ? 'md:col-span-4' : 'md:col-span-6'}">
					<h2 class="arc-h2">ABOUT THIS PROJECT</h2>
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0">{@html project.description}</div>
				</section>
			{/if}

			{#if project.teamMembers?.length || project.requirements?.length || project.links?.length}
				<div class="flex flex-col gap-[2px] md:col-span-2">
					{#if project.teamMembers?.length}
						<section class="flex-1 bg-[var(--arc-surface)] p-8">
							<h2 class="arc-h2">TEAM</h2>
							<div class="mt-4 flex flex-col gap-3">
								{#each project.teamMembers as entry}
									{@const member = parseProjectMember(entry)}
									{@const match = rosterMatch(member.name)}
									{@const photoUrl = member.photoUrl || match.photoUrl}
									<svelte:element
										this={match.href ? "a" : "div"}
										href={match.href}
										class="flex items-center gap-3 no-underline {match.href ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}"
									>
										{#if photoUrl}
											<img
												src={photoUrl}
												alt={member.name}
												class="h-10 w-10 flex-shrink-0 rounded-full border border-[var(--arc-line)] object-cover"
												loading="lazy"
												decoding="async"
											/>
										{:else}
											<div
												class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--arc-line)] bg-[var(--arc-fill)]"
											>
												<Icon icon="mdi:account" class="text-lg text-[var(--arc-line)]" />
											</div>
										{/if}
										<div class="min-w-0">
											<div class="truncate text-[14px] font-bold text-[var(--arc-ink)]">{member.name}</div>
											{#if member.role}
												<div class="truncate text-[12px] text-[var(--arc-muted)]">{member.role}</div>
											{/if}
										</div>
									</svelte:element>
								{/each}
							</div>
						</section>
					{/if}

					{#if project.links?.length}
						<section class="flex-1 bg-[var(--arc-surface)] p-8">
							<h2 class="arc-h2">LINKS</h2>
							<div class="flex flex-wrap gap-3 mt-4">
								{#each project.links as link}
									<a href={link.url} target="_blank" rel="noopener noreferrer" class="arc-btn-ghost">
										{link.label.toUpperCase()}
									</a>
								{/each}
							</div>
						</section>
					{/if}

					{#if project.requirements?.length}
						<section class="bg-[var(--arc-surface)] p-8">
							<h2 class="arc-h2">REQUIREMENTS</h2>
							<ul class="mt-4 flex flex-col gap-2">
								{#each project.requirements as req}
									<li class="flex items-start gap-2 text-[15px] leading-[1.5] font-medium text-[var(--arc-ink-2)]">
										<Icon icon="mdi:check-circle-outline" class="mt-0.5 flex-shrink-0 text-[var(--arc-accent)]" />
										<span>{req}</span>
									</li>
								{/each}
							</ul>
						</section>
					{/if}
				</div>
			{/if}

			{#if galleryImages.length}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">IMAGES</h2>
					<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
						{#each galleryImages as image}
							<img
								src={image}
								alt={project.name}
								class="w-full h-auto object-cover"
								loading="lazy"
								decoding="async"
							/>
						{/each}
					</div>
				</section>
			{/if}

			{#if project.videos?.length}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">VIDEOS</h2>
					<div class="grid md:grid-cols-2 gap-4 mt-4">
						{#each project.videos as video}
							<!-- svelte-ignore a11y_media_has_caption -->
							<video src={video} controls class="w-full h-auto"></video>
						{/each}
					</div>
				</section>
			{/if}

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<h2 class="arc-h2">SEE OUR OTHER WORK</h2>
					<div class="flex flex-wrap gap-3">
						{#if project.repoUrl}
							<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="arc-btn">
								VIEW REPOSITORY
							</a>
						{/if}
						<a href="/projects" class="arc-btn-ghost">ALL PROJECTS</a>
					</div>
				</div>
			</section>
		</div>
	</main>

	<Footer />
</div>
