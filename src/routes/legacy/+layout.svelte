<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div data-legacy>
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
</div>

<style>
	:global(body:has([data-legacy])) {
		max-width: 1400px;
		margin: 0 auto;
		padding: 20px;
		background: #ffffff;
	}
</style>
