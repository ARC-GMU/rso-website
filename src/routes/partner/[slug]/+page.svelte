<script lang="ts">
	import Icon from "@iconify/svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import { socialIcon, socialLabel, socialColor, type SocialLink } from "$lib/theme/content";

	type PartnerContact = {
		name: string;
		role?: string;
		contact?: string;
		photoUrl?: string;
		socialLinks?: SocialLink[];
	};

	type PartnerDetail = {
		name: string;
		slug: string;
		imageUrl?: string;
		url?: string;
		bio?: string;
		socialLinks?: SocialLink[];
		contacts?: PartnerContact[];
	};

	let { data }: { data: { partner: PartnerDetail } } = $props();

	let partner = $derived(data.partner);

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	}

	let metaDescription = $derived(
		partner.bio
			? stripHtml(partner.bio).slice(0, 200)
			: `${partner.name} — an Autonomous Robotics Club partner.`
	);
</script>

<svelte:head>
	<title>{partner.name} - Autonomous Robotics Club</title>
	<meta name="description" content={metaDescription} />
	{#if partner.imageUrl}
		<meta property="og:image" content={partner.imageUrl} />
	{/if}
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<div class="arc-grid md:grid-cols-6">
			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6 md:p-12">
				<nav class="arc-label">
					<a href="/partners" class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">
						PARTNERS
					</a>
					<span class="mx-2 text-[var(--arc-faint)]">/</span>
					<span>{partner.name.toUpperCase()}</span>
				</nav>

				<div class="mt-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
					<div
						class="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--arc-line)] bg-[var(--arc-fill)] p-4 sm:h-40 sm:w-40"
					>
						{#if partner.imageUrl}
							<img src={partner.imageUrl} alt={partner.name} class="max-h-full max-w-full object-contain" />
						{:else}
							<Icon icon="mdi:handshake-outline" class="h-16 w-16 text-[var(--arc-line)]" />
						{/if}
					</div>
					<div>
						<h1 class="arc-h1">{partner.name.toUpperCase()}</h1>
					</div>
				</div>

				{#if partner.url || partner.socialLinks?.length}
					<div class="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
						{#if partner.url}
							<a href={partner.url} target="_blank" rel="noopener noreferrer" class="arc-btn">
								<Icon icon="mdi:open-in-new" class="inline-block align-text-bottom" /> VISIT WEBSITE
							</a>
						{/if}
						{#each partner.socialLinks ?? [] as link}
							{#if link.url}
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									class="arc-btn-ghost"
									style="color: {socialColor(link)}; border-color: {socialColor(link)};"
								>
									<Icon icon={socialIcon(link)} class="inline-block align-text-bottom text-lg mr-1" />
									{socialLabel(link).toUpperCase()}
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</section>

			{#if partner.bio}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">ABOUT</h2>
					<div class="prose prose-sm md:prose-base max-w-none text-[var(--arc-ink-2)] mt-4">{@html partner.bio}</div>
				</section>
			{/if}

			{#if partner.contacts?.length}
				<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
					<h2 class="arc-h2">PEOPLE TO CONNECT WITH</h2>
					<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						{#each partner.contacts as person}
							<div
								class="flex items-center gap-4 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-4"
							>
								{#if person.photoUrl}
									<img
										src={person.photoUrl}
										alt={person.name}
										class="h-16 w-16 flex-shrink-0 rounded-full border border-[var(--arc-line)] object-cover"
									/>
								{:else}
									<div
										class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-[var(--arc-line)] bg-[var(--arc-surface)]"
									>
										<Icon icon="mdi:account" class="text-2xl text-[var(--arc-line)]" />
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<div class="truncate text-[15px] font-bold text-[var(--arc-ink)]">{person.name}</div>
									{#if person.role}
										<div class="truncate text-[13px] text-[var(--arc-muted)]">{person.role}</div>
									{/if}
									<div class="mt-1.5 flex flex-wrap items-center gap-2">
										{#if person.contact}
											<a
												href="mailto:{person.contact}"
												aria-label="Email {person.name}"
												title={person.contact}
												class="text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
											>
												<Icon icon="mdi:email-outline" class="text-lg" />
											</a>
										{/if}
										{#each person.socialLinks ?? [] as link}
											{#if link.url}
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={socialLabel(link)}
													title={socialLabel(link)}
													class="text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
												>
													<Icon icon={socialIcon(link)} class="text-lg" />
												</a>
											{/if}
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<section class="bg-[var(--arc-surface)] p-8 md:col-span-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<h2 class="arc-h2">SEE OTHER PARTNERS</h2>
					<a href="/partners" class="arc-btn-ghost">ALL PARTNERS</a>
				</div>
			</section>
		</div>
	</main>

	<Footer />
</div>
