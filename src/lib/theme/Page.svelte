<script lang="ts">
	import type { Snippet } from "svelte";
	import Header from "$lib/theme/Header.svelte";
	import Footer from "$lib/theme/Footer.svelte";

	let {
		title,
		heading = "",
		children
	}: { title: string; heading?: string; children: Snippet } = $props();
</script>

<svelte:head>
	<title>{title} - Autonomous Robotics Club</title>
</svelte:head>

<div class="arc-page">
	<Header />

	<main class="arc-shell py-8 sm:py-12">
		<h1 class="arc-h1">{(heading || title).toUpperCase()}</h1>

		<div class="mt-6 flex flex-col gap-6 sm:mt-8">
			{@render children()}
		</div>
	</main>

	<Footer />
</div>
