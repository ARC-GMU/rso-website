<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import { apiRoot, socialIcon, socialLabel, type SocialLink } from "$lib/theme/content";
	import { reduceMotion, toggleReduceMotion } from "$lib/motion";

	let socialLinks = $state<SocialLink[]>([]);
	let darkMode = $state(false);

	onMount(() => {
		darkMode = document.documentElement.dataset.theme === "dark";

		(async () => {
			try {
				const res = await fetch(`${apiRoot}/public/club/about`, { cache: "no-store" });
				if (res.ok) {
					const data = await res.json();
					socialLinks = data.socialLinks ?? [];
				}
			} catch (e) {
				console.error("Error fetching social links:", e);
			}
		})();
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
	<div class="mx-auto max-w-[1120px] px-6 py-10">
		<div
			class="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left"
		>
			<div>
				<div class="text-[15px] font-bold tracking-[0.06em] text-[var(--arc-ink)]">
					AUTONOMOUS ROBOTICS CLUB
				</div>
				<div class="mt-2 text-[13px] font-medium text-[var(--arc-muted)]">
					George Mason University
				</div>
			</div>

			<div class="flex flex-wrap justify-center gap-3">
				{#each socialLinks as social}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={socialLabel(social)}
						title={socialLabel(social)}
						class="flex h-10 w-10 items-center justify-center border border-[var(--arc-line)] text-[var(--arc-ink)] no-underline hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
					>
						<Icon icon={socialIcon(social)} class="text-lg" />
					</a>
				{/each}
			</div>
		</div>

		<div
			class="mt-8 flex flex-col items-center gap-4 border-t border-[var(--arc-line)] pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
		>
			<details class="group order-2 w-full sm:order-1 sm:flex-1">
				<summary
					class="flex cursor-pointer list-none items-center justify-center gap-1.5 text-[12px] font-bold tracking-[0.06em] text-[var(--arc-muted-2)] hover:text-[var(--arc-accent)] sm:justify-start [&::-webkit-details-marker]:hidden"
				>
					<Icon icon="mdi:chevron-right" class="text-base group-open:rotate-90" />
					UNIVERSITY PUBLIC DISCLAIMER
				</summary>

				<p class="m-0 mt-4 text-[12px] leading-[1.8] text-[var(--arc-muted-2)]">
					The programs and services offered by George Mason University are open to all
					who seek them. George Mason does not discriminate on the basis of race, color,
					religion, ethnic national origin (including shared ancestry and/or ethnic
					characteristics), sex, disability, military status (including veteran status),
					sexual orientation, gender identity, gender expression, age, marital status,
					pregnancy status, genetic information, or any other characteristic protected by
					law. After an initial review of its policies and practices, the university
					affirms its commitment to meet all federal mandates as articulated in federal
					law, as well as recent executive orders and federal agency directives.
				</p>
			</details>

			<div class="order-1 flex shrink-0 gap-3 sm:order-2">
				<a
					href="/legacy"
					aria-label="Old site"
					title="Old site"
					class="flex h-10 w-10 items-center justify-center border border-[var(--arc-line)] text-[var(--arc-ink)] no-underline hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
				>
					<Icon icon="mdi:history" class="text-lg" />
				</a>

				<button
					class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border text-[var(--arc-ink)] hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)] {$reduceMotion
						? 'border-[var(--arc-accent)] text-[var(--arc-accent)]'
						: 'border-[var(--arc-line)]'}"
					aria-label={$reduceMotion ? "Turn animations on" : "Turn animations off"}
					aria-pressed={$reduceMotion}
					title={$reduceMotion ? "Turn animations on" : "Turn animations off"}
					onclick={toggleReduceMotion}
				>
					<Icon
						icon={$reduceMotion ? "mdi:motion-pause-outline" : "mdi:motion-outline"}
						class="text-lg"
					/>
				</button>

				<button
					class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-[var(--arc-line)] text-[var(--arc-ink)] hover:border-[var(--arc-accent)] hover:text-[var(--arc-accent)]"
					aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					aria-pressed={darkMode}
					title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					onclick={toggleDarkMode}
				>
					<Icon
						icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"}
						class="text-lg"
					/>
				</button>
			</div>
		</div>
	</div>
</footer>
