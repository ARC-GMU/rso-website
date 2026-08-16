<script lang="ts">
	import { onMount } from "svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { apiRoot } from "$lib/theme/content";

	type ProjectLink = { label: string; url: string };

	type ProjectDetail = {
		id: string;
		name: string;
		description: string;
		repoUrl?: string;
		requirements?: string[];
		links?: ProjectLink[];
		teamMembers?: string[];
		images?: string[];
		videos?: string[];
		external?: boolean;
		externalUrl?: string;
	};

	let { data }: { data: { id: string } } = $props();

	let project = $state<ProjectDetail | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/public/club/projects?id=${data.id}`, {
				cache: "no-store"
			});
			if (res.ok) {
				const p = await res.json();
				if (p.external && p.externalUrl) {
					window.location.href = p.externalUrl;
					return;
				}
				project = p;
			}
		} catch (e) {
			console.error("Error fetching project:", e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{project ? project.name : "Project"} - Autonomous Robotics Club</title>
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			{#if loading}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<p class="arc-note">Loading...</p>
				</div>
			{:else if !project}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h1 class="arc-h1">PROJECT NOT FOUND</h1>
					<p class="arc-note mt-4">This project could not be found.</p>
					<a href="/projects" class="arc-btn-ghost mt-6">ALL PROJECTS</a>
				</div>
			{:else}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
					<nav class="arc-label">
						<a href="/projects" class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">
							PROJECTS
						</a>
						<span class="mx-2 text-[var(--arc-faint)]">/</span>
						<span>{project.name.toUpperCase()}</span>
					</nav>

					<h1 class="arc-h1 mt-5">{project.name.toUpperCase()}</h1>

					{#if project.repoUrl}
						<a
							href={project.repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="arc-btn mt-8"
						>
							VIEW REPOSITORY
						</a>
					{/if}
				</section>

				{#if project.description}
					<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
						<h2 class="arc-h2">ABOUT THIS PROJECT</h2>
						<div class="arc-body mt-4">{@html project.description}</div>
					</section>
				{/if}

				{#if project.requirements?.length}
					<section
						class="bg-[var(--arc-surface)] p-8 {project.teamMembers?.length
							? 'md:col-span-3'
							: 'md:col-span-6'}"
					>
						<h2 class="arc-h2">REQUIREMENTS</h2>
						<ul class="arc-body mt-4 pl-5" style="list-style:disc;">
							{#each project.requirements as req}
								<li>{req}</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if project.teamMembers?.length}
					<section
						class="bg-[var(--arc-surface)] p-8 {project.requirements?.length
							? 'md:col-span-3'
							: 'md:col-span-6'}"
					>
						<h2 class="arc-h2">TEAM</h2>
						<ul class="arc-body mt-4 pl-5" style="list-style:disc;">
							{#each project.teamMembers as member}
								<li>{member}</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if project.links?.length}
					<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
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

				{#if project.images?.length}
					<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
						<h2 class="arc-h2">IMAGES</h2>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
							{#each project.images as image}
								<img src={image} alt={project.name} class="w-full h-auto object-cover" loading="lazy" />
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
			{/if}
		</div>
	</main>

	<Footer />
</div>
