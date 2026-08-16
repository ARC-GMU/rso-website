<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, discordUrl, mason360Url } from "$lib/theme/content";

	type TeamLink = { type: string; url: string; icon?: string; label?: string };
	type TeamMember = {
		id?: string;
		name: string;
		slug?: string;
		role: string;
		contact?: string;
		photoUrl?: string;
		links?: TeamLink[];
	};
	type Team = { name: string; members: TeamMember[] };

	function memberHref(member: TeamMember): string | undefined {
		const key = member.slug || member.id;
		return key ? `/team/${key}` : undefined;
	}

	let teams = $state<Team[]>([]);
	let loading = $state(true);

	const linkIcons: Record<string, string> = {
		linkedin: "mdi:linkedin",
		github: "mdi:github",
		instagram: "mdi:instagram"
	};

	function linkIcon(link: TeamLink) {
		if (link.type === "custom") return link.icon || "mdi:link-variant";
		return linkIcons[link.type] || "mdi:link-variant";
	}

	function linkLabel(link: TeamLink) {
		if (link.type === "custom") return link.label || "Link";
		return link.type.charAt(0).toUpperCase() + link.type.slice(1);
	}

	onMount(async () => {
		try {
			const res = await fetch(`${apiRoot}/roster`, { cache: "no-store" });
			if (res.ok) {
				teams = await res.json();
			}
		} catch (e) {
			console.error("Error fetching roster:", e);
		} finally {
			loading = false;
		}
	});
</script>

<Page title="Team" heading="Team Roster">
	{#if loading}
		<Panel>
			<p class="arc-note">Loading...</p>
		</Panel>
	{:else if teams.length === 0}
		<Panel>
			<p class="arc-note">Unable to load team roster at this time.</p>
		</Panel>
	{:else}
		{#each teams as team}
			<Panel title={team.name.toUpperCase()}>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each team.members as member}
						<div
							class="flex w-full min-w-0 flex-col items-center gap-3 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-5 text-center sm:p-6"
						>
							<svelte:element
								this={memberHref(member) ? "a" : "div"}
								href={memberHref(member)}
								class="flex flex-col items-center gap-3 no-underline {memberHref(member) ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}"
							>
								{#if member.photoUrl}
									<img
										src={member.photoUrl}
										alt={member.name}
										class="h-36 w-36 rounded-2xl border border-[var(--arc-line)] object-cover sm:h-40 sm:w-40"
									/>
								{:else}
									<div
										class="flex h-36 w-36 items-center justify-center rounded-2xl border border-[var(--arc-line)] bg-[var(--arc-surface)] sm:h-40 sm:w-40"
									>
										<Icon icon="mdi:account-circle" class="h-20 w-20 text-[var(--arc-line)]" />
									</div>
								{/if}
								<div>
									<div class="arc-h3 text-xl text-[var(--arc-ink)]">{member.name}</div>
									{#if member.role}
										<div class="arc-label mt-1 text-sm">{member.role}</div>
									{/if}
								</div>
							</svelte:element>
							{#if member.contact || (member.links && member.links.length > 0)}
								<div class="flex flex-wrap items-center justify-center gap-1">
									{#if member.contact}
										<a
											href="mailto:{member.contact}"
											aria-label="Email {member.name}"
											title={member.contact}
											class="flex h-10 w-10 items-center justify-center text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
										>
											<Icon icon="mdi:email-outline" class="text-2xl" />
										</a>
									{/if}
									{#each member.links ?? [] as link}
										{#if link.url}
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={linkLabel(link)}
												title={linkLabel(link)}
												class="flex h-10 w-10 items-center justify-center text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
											>
												<Icon icon={linkIcon(link)} class="text-2xl" />
											</a>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</Panel>
		{/each}
	{/if}

	<Panel title="JOIN US AND CONTRIBUTE">
		<p class="arc-body">
			Interested in joining the ARC team? We are looking for members who are
			interested and dedicated to working with us. Sign up on Mason360 and join our
			Discord server to get started.
		</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<a href={mason360Url} target="_blank" rel="noopener noreferrer" class="arc-btn">
				SIGN UP ON MASON360
			</a>
			<a href={discordUrl} target="_blank" rel="noopener noreferrer" class="arc-btn-ghost">
				JOIN DISCORD
			</a>
		</div>
	</Panel>
</Page>
