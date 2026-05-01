<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<footer class="mt-10 border-t border-black pt-5 pb-10 flex flex-col gap-6">
	<div
		class="text-sm flex flex-col md:flex-row gap-4 justify-between items-center text-center md:text-left"
	>
		<div>
			<span>AUTONOMOUS ROBOTICS CLUB (ARC).</span>
		</div>
		<div
			class="text-center md:text-right flex flex-col md:flex-row items-center justify-center md:justify-end gap-[15px]"
		>
			<a
				href="https://www.instagram.com/arc.gmu/"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-blue-600 hover:text-purple-800 flex items-center gap-1.5"
				><Icon icon="mdi:instagram" class="text-base" /> INSTAGRAM</a
			>
			<a
				href="https://discord.gg/WfKAbJpZFX"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-blue-600 hover:text-purple-800 flex items-center gap-1.5"
				><Icon icon="mdi:discord" class="text-base" /> DISCORD SERVER</a
			>
			<a
				href="https://github.com/RDC-GMU"
				target="_blank"
				class="underline text-blue-600 hover:text-purple-800 flex items-center gap-1.5"
				><Icon icon="mdi:github" class="text-base" /> GITHUB / OPEN SOURCE</a
			>
		</div>
	</div>

	<div class="text-xs text-[#555] text-center md:text-left leading-relaxed">
		<strong>University Public Disclaimer:</strong> The programs and services
		offered by George Mason University are open to all who seek them. George
		Mason does not discriminate on the basis of race, color, religion, ethnic
		national origin (including shared ancestry and/or ethnic characteristics),
		sex, disability, military status (including veteran status), sexual orientation,
		gender identity, gender expression, age, marital status, pregnancy status,
		genetic information, or any other characteristic protected by law. After
		an initial review of its policies and practices, the university affirms its
		commitment to meet all federal mandates as articulated in federal law, as
		well as recent executive orders and federal agency directives.
	</div>
</footer>
