<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { apiRoot } from "$lib/theme/content";

	type MemberLink = { type: string; url: string; icon?: string; label?: string };

	type MemberDetail = {
		id: string;
		name: string;
		slug: string;
		role: string;
		bio?: string;
		contact?: string;
		photoUrl?: string;
		links?: MemberLink[];
		teamName?: string;
	};

	let { data }: { data: { slug: string } } = $props();

	let member = $state<MemberDetail | null>(null);
	let loading = $state(true);

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
			const res = await fetch(`${apiRoot}/roster?slug=${data.slug}`, {
				cache: "no-store"
			});
			if (res.ok) {
				member = await res.json();
			}
		} catch (e) {
			console.error("Error fetching team member:", e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{member ? member.name : "Team"} - Autonomous Robotics Club</title>
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			{#if loading}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<p class="arc-note">Loading...</p>
				</div>
			{:else if !member}
				<div class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h1 class="arc-h1">MEMBER NOT FOUND</h1>
					<p class="arc-note mt-4">This team member could not be found.</p>
					<a href="/team" class="arc-btn-ghost mt-6">ALL TEAM</a>
				</div>
			{:else}
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
							{#if member.role}
								<div class="arc-label mt-2 text-sm">{member.role}</div>
							{/if}
							{#if member.teamName}
								<div class="arc-note mt-1">{member.teamName}</div>
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
										<Icon icon={linkIcon(link)} class="inline-block align-text-bottom" />
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
						<div class="arc-body mt-4">{@html member.bio}</div>
					</section>
				{/if}

				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<h2 class="arc-h2">MEET THE REST OF THE TEAM</h2>
						<a href="/team" class="arc-btn-ghost">ALL TEAM</a>
					</div>
				</section>
			{/if}
		</div>
	</main>

	<Footer />
</div>
