<script lang="ts">
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "America/New_York"
		});
	}
</script>

<svelte:head>
	<title>{data.page.title} - Autonomous Robotics Club</title>
	<meta name="description" content={data.page.excerpt || data.page.title} />
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-12">
		<a href="/about" class="arc-link">BACK TO ABOUT</a>

		<article class="arc-panel mt-6">
			<div class="p-8 md:p-10">
				<h1 class="arc-h1">{data.page.title}</h1>

				<div class="arc-label mt-4">
					{formatDate(data.page.updatedAt || data.page.createdAt)} / {data.page.author}
				</div>

				<div
					class="prose prose-sm md:prose-base mt-8 max-w-none border-t border-[var(--arc-line-soft)] pt-8 text-[var(--arc-ink-2)]"
				>
					{@html data.page.content}
				</div>
			</div>
		</article>
	</main>

	<Footer />
</div>
