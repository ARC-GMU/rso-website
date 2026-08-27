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
					<div class="mt-5 flex flex-wrap justify-center gap-4">
						{#each partner.contacts as person}
							<div
								class="flex w-full min-w-0 flex-col items-center gap-3 border border-[var(--arc-line)] bg-[var(--arc-fill)] p-5 text-center sm:w-[calc(50%-8px)] sm:p-6 lg:w-[calc(33.3333%-10.6667px)]"
							>
								{#if person.photoUrl}
									<img
										src={person.photoUrl}
										alt={person.name}
										class="h-28 w-28 rounded-full border border-[var(--arc-line)] object-cover"
										loading="lazy"
										decoding="async"
									/>
								{:else}
									<div
										class="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--arc-line)] bg-[var(--arc-surface)]"
									>
										<Icon icon="mdi:account" class="h-14 w-14 text-[var(--arc-line)]" />
									</div>
								{/if}
								<div>
									<div class="arc-h3 text-base text-[var(--arc-ink)]">{person.name}</div>
									{#if person.role}
										<div class="arc-label mt-1 text-xs">{person.role}</div>
									{/if}
								</div>
								{#if person.contact || person.socialLinks?.length}
									<div class="flex flex-wrap items-center justify-center gap-1">
										{#if person.contact}
											<a
												href="mailto:{person.contact}"
												aria-label="Email {person.name}"
												title={person.contact}
												class="flex h-9 w-9 items-center justify-center text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
											>
												<Icon icon="mdi:email-outline" class="text-xl" />
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
													class="flex h-9 w-9 items-center justify-center text-[var(--arc-muted)] hover:text-[var(--arc-accent)]"
												>
													<Icon icon={socialIcon(link)} class="text-xl" />
												</a>
											{/if}
										{/each}
									</div>
								{/if}
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
