<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";
</script>

<nav
    class="flex overflow-x-auto border border-black mb-5 whitespace-nowrap flex-shrink-0 shadow-sm"
>
    <a
        href="/legacy"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">OVERVIEW</a
    >
    <a
        href="/legacy/projects"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy/projects'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">PROJECTS</a
    >
    <a
        href="/legacy/team"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy/team'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">TEAM</a
    >
    <a
        href="/legacy/events"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page.url.pathname.startsWith(
            '/legacy/events',
        )
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">EVENTS</a
    >
    <a
        href="/legacy/resources"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy/resources'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">RESOURCES</a
    >
    <a
        href="/legacy/blog"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page.url.pathname.startsWith(
            '/legacy/blog',
        )
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">BLOG</a
    >
    <a
        href="/legacy/media"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy/media'
            ? 'bg-black text-white'
            : 'bg-[#eee] text-black'}">MEDIA</a
    >
    <a
        href="/legacy/calendar"
        class="px-5 py-2.5 no-underline font-bold text-sm border-r border-black flex-shrink-0 hover:bg-[#ddd] {$page
            .url.pathname === '/legacy/calendar'
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
