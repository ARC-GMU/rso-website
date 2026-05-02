<script lang="ts">
	import "./layout.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { dev } from "$app/environment";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

	injectAnalytics({ mode: dev ? "development" : "production" });
	injectSpeedInsights();

	let { children } = $props();
</script>

<svelte:head>
	<title>Autonomous Robotics Club (ARC)</title>
	<meta
		name="description"
		content="Official website for the Autonomous Robotics Club (ARC) team. Developing collaborative autonomous UAV and UGV systems for GPS-denied environments."
	/>
	<meta
		name="keywords"
		content="Autonomous, Robotics, Club, ARC, UAV, UGV, Autonomous Vehicles, Robotics"
	/>
	<meta property="og:title" content="Autonomous Robotics Club (ARC)" />
	<meta
		property="og:description"
		content="Official website for the Autonomous Robotics Club (ARC) team."
	/>
	<meta property="og:image" content="/logo.png" />
	<meta property="og:url" content="https://rdc-gmu.github.io/" />
	<meta name="twitter:card" content="summary" />
	<link rel="icon" href="/logo.png" />
</svelte:head>

<div
	class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[15px] mb-[20px]"
>
	<div class="flex items-center gap-[15px]">
		<img
			src="/logo.png"
			alt="ARC Logo"
			class="h-16 md:h-24 rounded-md w-auto object-contain"
		/>
		<h1 class="m-0 text-xl md:text-2xl font-bold leading-tight">
			AUTONOMOUS ROBOTICS CLUB <span
				class="text-[14px] md:text-[18px] text-[#555] font-normal block sm:inline mt-1 sm:mt-0"
				>(ARC)</span
			>
		</h1>
	</div>
</div>

<Navbar />

{@render children()}

<Footer />
