<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, discordUrl, mason360Url } from "$lib/theme/content";

	type TeamLink = { type: string; url: string; icon?: string; label?: string };
	type TeamMember = {
		name: string;
		role: string;
		contact?: string;
		photoUrl?: string;
		links?: TeamLink[];
	};
	type Team = { name: string; members: TeamMember[] };

	let teams = $state<Team[]>([]);
	let loading = $state(true);
	let copiedContact = $state("");

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

	async function copyContact(contact: string) {
		try {
			await navigator.clipboard.writeText(contact);
			copiedContact = contact;
			setTimeout(() => {
				if (copiedContact === contact) copiedContact = "";
			}, 1500);
		} catch (e) {
			console.error("Could not copy contact:", e);
		}
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
							{#if member.photoUrl}
								<img
									src={member.photoUrl}
									alt={member.name}
									class="h-24 w-24 rounded-full border border-[var(--arc-line)] object-cover"
								/>
							{:else}
								<Icon icon="mdi:account-circle" class="h-24 w-24 text-[var(--arc-line)]" />
							{/if}
							<div>
								<div class="arc-h3">{member.name}</div>
								{#if member.role}
									<div class="arc-label mt-1">{member.role}</div>
								{/if}
							</div>
							{#if member.contact}
								<span class="flex max-w-full flex-wrap items-center justify-center gap-2">
									<a href="mailto:{member.contact}" class="arc-link break-all">
										{member.contact}
									</a>
									<button
										class="cursor-pointer border border-[var(--arc-line)] bg-[var(--arc-surface)] p-1 text-[var(--arc-ink)] hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
										aria-label="Copy email"
										onclick={() => copyContact(member.contact ?? "")}
									>
										<Icon
											icon={copiedContact === member.contact
												? "mdi:check-bold"
												: "mdi:content-copy"}
											class="text-sm"
										/>
									</button>
								</span>
							{/if}
							{#if member.links && member.links.length > 0}
								<div class="flex flex-wrap justify-center gap-2">
									{#each member.links as link}
										{#if link.url}
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={linkLabel(link)}
												title={linkLabel(link)}
												class="flex h-9 w-9 items-center justify-center border border-[var(--arc-line)] text-[var(--arc-ink)] no-underline hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
											>
												<Icon icon={linkIcon(link)} class="text-base" />
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
