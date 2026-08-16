<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import { apiRoot, discordUrl, mason360Url } from "$lib/theme/content";

	type TeamMember = { name: string; role: string; contact?: string };
	type Team = { name: string; members: TeamMember[] };

	let teams = $state<Team[]>([]);
	let loading = $state(true);
	let copiedContact = $state("");

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
			<Panel title={team.name.toUpperCase()} flush>
				<div class="overflow-x-auto">
					<table class="arc-table">
						<thead>
							<tr>
								<th>NAME</th>
								<th>ROLE</th>
								{#if team.members.some((member) => member.contact)}
									<th>CONTACT</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each team.members as member}
								<tr>
									<td class="font-bold whitespace-nowrap">{member.name}</td>
									<td>{member.role}</td>
									{#if team.members.some((entry) => entry.contact)}
										<td>
											{#if member.contact}
												<span class="flex flex-wrap items-center gap-2">
													<a href="mailto:{member.contact}" class="arc-link">
														{member.contact}
													</a>
													<button
														class="cursor-pointer border border-[#d5dad5] bg-[#efece2] p-1 text-[#16211c] hover:border-[#006633] hover:text-[#006633]"
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
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
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
