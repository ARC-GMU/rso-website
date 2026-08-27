<script lang="ts">
	import "./layout.css";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import { initReduceMotion } from "$lib/motion";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

	injectAnalytics({ mode: dev ? "development" : "production" });
	injectSpeedInsights();

	let { children } = $props();

	onMount(initReduceMotion);
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
	<meta property="og:image" content="/logos/logooo.png" />
	<meta property="og:url" content="https://rdc-gmu.github.io/" />
	<meta name="twitter:card" content="summary" />
	<link rel="icon" href="/logos/logooo.png" />
	<script
		defer
		src="https://umami.sirblob.co/script.js"
		data-website-id="46476793-0363-4cb7-8fbc-cb29dba94e03"
	></script>
</svelte:head>

{@render children()}
