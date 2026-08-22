<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { apiRoot } from "$lib/theme/content";

	type MemberLink = { type: string; url: string; icon?: string; label?: string };

	type Membership = { teamId: string; teamName: string; role: string };

	type MemberDetail = {
		id: string;
		name: string;
		slug: string;
		major?: string;
		bio?: string;
		contact?: string;
		photoUrl?: string;
		links?: MemberLink[];
		memberships?: Membership[];
	};

	type MemberProject = {
		id: string;
		slug?: string;
		name: string;
		description?: string;
		repoUrl?: string;
		images?: string[];
		external?: boolean;
		externalUrl?: string;
	};

	let { data }: { data: { member: MemberDetail } } = $props();

	let member = $derived(data.member);
	let memberProjects = $state<MemberProject[]>([]);

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	function projectMemberName(entry: string): string {
		const sep = entry.indexOf(" — ");
		return sep === -1 ? entry : entry.slice(0, sep);
	}

	const linkIcons: Record<string, string> = {
		linkedin: "mdi:linkedin",
		github: "mdi:github",
		instagram: "mdi:instagram"
	};

	function linkIcon(link: MemberLink) {
		if (link.type === "custom") return link.icon || "mdi:link-variant";
		return linkIcons[link.type] || "mdi:link-variant";
	}

	function linkLabel(link: MemberLink) {
		if (link.type === "custom") return link.label || "Link";
		return link.type.charAt(0).toUpperCase() + link.type.slice(1);
	}

	onMount(async () => {
		try {
			const projectsRes = await fetch(`${apiRoot}/public/club/projects`, { cache: "no-store" });
			if (projectsRes.ok) {
				const projects = await projectsRes.json();
				const name = member.name.trim().toLowerCase();
				memberProjects = (projects ?? []).filter((p: any) =>
					(p.teamMembers ?? []).some((entry: string) => projectMemberName(entry).trim().toLowerCase() === name)
				);
			}
		} catch (e) {
			console.error("Error fetching projects:", e);
		}
	});

	function membershipLabel(m: Membership): string {
		return m.role ? `${m.role} — ${m.teamName}` : m.teamName;
	}

	let metaDescription = $derived(
		member.bio
			? stripHtml(member.bio).slice(0, 200)
			: (member.memberships ?? []).map(membershipLabel).join(", ") ||
					`${member.name} — Autonomous Robotics Club.`
	);
</script>

<svelte:head>
	<title>{member.name} - Autonomous Robotics Club</title>
	<meta name="description" content={metaDescription} />
	{#if member.photoUrl}
		<meta property="og:image" content={member.photoUrl} />
	{/if}
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
				<nav class="arc-label">
					<a href="/team" class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">
						TEAM
					</a>
					<span class="mx-2 text-[var(--arc-faint)]">/</span>
					<span>{member.name.toUpperCase()}</span>
				</nav>

				<div class="mt-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
					{#if member.photoUrl}
						<img
							src={member.photoUrl}
							alt={member.name}
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
						<h1 class="arc-h1">{member.name.toUpperCase()}</h1>
						{#if member.memberships?.length}
							<div class="mt-2 flex flex-col gap-1 sm:items-start">
								{#each member.memberships as m}
									<div class="arc-label text-sm">{membershipLabel(m)}</div>
								{/each}
							</div>
						{/if}
						{#if member.major}
							<div class="arc-note mt-1">{member.major}</div>
						{/if}
					</div>
				</div>

				{#if member.contact || (member.links && member.links.length > 0)}
					<div class="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
						{#if member.contact}
							<a href="mailto:{member.contact}" class="arc-btn">
								EMAIL {member.name.split(" ")[0].toUpperCase()}
							</a>
						{/if}
						{#each member.links ?? [] as link}
							{#if link.url}
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									class="arc-btn-ghost"
								>
									<Icon icon={linkIcon(link)} class="inline-block align-text-bottom text-lg mr-1" />
									{linkLabel(link).toUpperCase()}
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</section>

			{#if member.bio}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">ABOUT</h2>
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html member.bio}</div>
				</section>
			{/if}

			{#if memberProjects.length > 0}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">PROJECTS</h2>
					<div class="mt-4 flex flex-col gap-3">
						{#each memberProjects as project}
							<a
								href={project.external && project.externalUrl ? project.externalUrl : `/projects/${project.slug || project.id}`}
								target={project.external && project.externalUrl ? "_blank" : undefined}
								rel={project.external && project.externalUrl ? "noopener noreferrer" : undefined}
								class="flex w-full items-stretch border border-[var(--arc-line)] bg-[var(--arc-fill)] no-underline hover:border-[var(--arc-accent)]"
							>
								{#if project.images?.length}
									<img
										src={project.images[0]}
										alt={project.name}
										class="w-24 flex-shrink-0 self-stretch object-cover sm:w-32"
									/>
								{:else}
									<div
										class="flex w-24 flex-shrink-0 items-center justify-center self-stretch bg-[var(--arc-surface)] sm:w-32"
									>
										<Icon icon="mdi:code-braces" class="text-2xl text-[var(--arc-line)]" />
									</div>
								{/if}
								<div class="flex min-w-0 flex-1 items-center gap-4 p-4 sm:p-5">
									<div class="min-w-0 flex-1">
										<div class="flex flex-wrap items-center gap-2">
											<div class="text-[16px] font-bold text-[var(--arc-ink)]">{project.name.toUpperCase()}</div>
											{#if project.external}
												<Icon icon="mdi:open-in-new" class="text-[var(--arc-muted)]" />
											{/if}
										</div>
										{#if project.description}
											<p class="arc-note mt-1 line-clamp-2">{stripHtml(project.description)}</p>
										{/if}
									</div>
									{#if project.repoUrl}
										<Icon icon="mdi:github" class="hidden flex-shrink-0 text-2xl text-[var(--arc-muted)] sm:block" />
									{/if}
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<h2 class="arc-h2">MEET THE REST OF THE TEAM</h2>
					<a href="/team" class="arc-btn-ghost">ALL TEAM</a>
				</div>
			</section>
		</div>
	</main>

	<Footer />
</div>
