<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";
</script>

<nav
    class="flex overflow-x-auto border border-black mb-5 whitespace-nowrap flex-shrink-0 shadow-sm"
>
    <a
        href="/"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">OVERVIEW</a
    >
    <a
        href="/projects"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/projects'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">PROJECTS</a
    >
    <a
        href="/team"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/team'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">TEAM</a
    >
    <a
        href="/events"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page.url.pathname.startsWith(
            '/events',
        )
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">EVENTS</a
    >
    <a
        href="/resources"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/resources'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">RESOURCES</a
    >
    <a
        href="/blog"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page.url.pathname.startsWith(
            '/blog',
        )
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">BLOG</a
    >
    <a
        href="/media"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/media'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">MEDIA</a
    >
    <a
        href="/calendar"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/calendar'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">CALENDAR</a
    >

    <a
        href="https://discord.gg/WfKAbJpZFX"
        target="_blank"
        rel="noopener noreferrer"
        class="lg:ml-auto px-5 py-2.5 flex-shrink-0 no-underline font-bold text-sm lg:border-l border-r border-black text-[#5865F2] hover:bg-[#ddd] bg-[#eee] flex items-center gap-1.5"
        ><Icon icon="mdi:discord" class="text-lg" /> DISCORD / JOIN</a
    >
</nav>
