<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import {
		discordUrl,
		githubUrl,
		instagramUrl,
		linkedinUrl,
		youtubeUrl
	} from "$lib/theme/content";

	let darkMode = $state(false);

	onMount(() => {
		darkMode = document.documentElement.dataset.theme === "dark";
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		const mode = darkMode ? "dark" : "light";
		document.documentElement.dataset.theme = mode;
		try {
			localStorage.setItem("arc-theme", mode);
		} catch (e) {
			console.error("Could not save theme preference:", e);
		}
	}
</script>

<footer class="border-t border-[var(--arc-line)] bg-[var(--arc-chrome)]">
	<div class="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8">
		<div
			class="flex flex-col gap-4 text-center text-[13px] font-medium tracking-[0.06em] text-[var(--arc-muted)] md:flex-row md:items-center md:justify-between md:text-left"
		>
			<span class="flex flex-col items-center gap-2 md:flex-row md:gap-3">
				<span>AUTONOMOUS ROBOTICS CLUB / GEORGE MASON UNIVERSITY</span>
				<a href="/legacy" class="text-[var(--arc-muted)] underline hover:text-[var(--arc-accent)]">
					OLD SITE
				</a>
				<button
					class="flex cursor-pointer items-center gap-2 border border-[var(--arc-line)] px-3 py-1.5 text-[13px] font-bold tracking-[0.06em] text-[var(--arc-ink)] hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
					aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					aria-pressed={darkMode}
					onclick={toggleDarkMode}
				>
					<Icon icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"} class="text-base" />
					{darkMode ? "LIGHT MODE" : "DARK MODE"}
				</button>
			</span>
			<div class="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
				<a
					href={instagramUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">INSTAGRAM</a
				>
				<a
					href={linkedinUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">LINKEDIN</a
				>
				<a
					href={youtubeUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">YOUTUBE</a
				>
				<a
					href={discordUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">DISCORD</a
				>
				<a
					href={githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--arc-muted)] no-underline hover:text-[var(--arc-accent)]">GITHUB</a
				>
			</div>
		</div>

		<p class="m-0 text-[12px] leading-[1.8] text-[var(--arc-muted-2)]">
			<strong class="font-bold">University Public Disclaimer:</strong> The programs
			and services offered by George Mason University are open to all who seek them.
			George Mason does not discriminate on the basis of race, color, religion, ethnic
			national origin (including shared ancestry and/or ethnic characteristics), sex,
			disability, military status (including veteran status), sexual orientation, gender
			identity, gender expression, age, marital status, pregnancy status, genetic
			information, or any other characteristic protected by law. After an initial
			review of its policies and practices, the university affirms its commitment to
			meet all federal mandates as articulated in federal law, as well as recent
			executive orders and federal agency directives.
		</p>
	</div>
</footer>
