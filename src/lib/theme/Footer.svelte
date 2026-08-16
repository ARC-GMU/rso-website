<script lang="ts">
	import {
		discordUrl,
		githubUrl,
		instagramUrl,
		linkedinUrl,
		youtubeUrl
	} from "$lib/theme/content";
</script>

<footer class="border-t border-[#d5dad5] bg-[#e9e6db]">
	<div class="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8">
		<div
			class="flex flex-col gap-4 text-[13px] font-medium tracking-[0.06em] text-[#4a5c53] md:flex-row md:items-center md:justify-between"
		>
			<span>
				AUTONOMOUS ROBOTICS CLUB / GEORGE MASON UNIVERSITY
				<a href="/legacy" class="ml-3 text-[#4a5c53] underline hover:text-[#006633]">
					OLD SITE
				</a>
			</span>
			<div class="flex gap-6">
				<a
					href={instagramUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#4a5c53] no-underline hover:text-[#006633]">INSTAGRAM</a
				>
				<a
					href={linkedinUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#4a5c53] no-underline hover:text-[#006633]">LINKEDIN</a
				>
				<a
					href={youtubeUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#4a5c53] no-underline hover:text-[#006633]">YOUTUBE</a
				>
				<a
					href={discordUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#4a5c53] no-underline hover:text-[#006633]">DISCORD</a
				>
				<a
					href={githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#4a5c53] no-underline hover:text-[#006633]">GITHUB</a
				>
			</div>
		</div>

		<p class="m-0 text-[12px] leading-[1.8] text-[#6b7c74]">
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
