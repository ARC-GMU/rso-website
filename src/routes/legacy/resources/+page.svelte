<script lang="ts">
    import ResourceTable from "$lib/components/ResourceTable.svelte";
    import FileTable from "$lib/components/FileTable.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const tools: any[] = [
        {
            name: "Sim-Link",
            description:
                "A web application designed to take the results of Gazebo simulations, save them, rank the best-performing simulations.",
            url: "https://simlink.sirblob.co/",
        },
    ];
</script>

<div class="super-container">
    <div class="config-category">
        <h2>FEATURED VIDEO</h2>
        <div class="hardware-box p-4 bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-center">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/iIVQBmexkuU?si=0iO24cZmjIBcFMSx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> 
        </div>
    </div>

    <ResourceTable title="TOOLS & SOFTWARE" resources={tools} />

    {#if data.files.length > 0}
        <FileTable title="TEAM FILES & DOWNLOADS" files={data.files} />
    {:else}
        <div class="config-category">
            <h2>TEAM FILES & DOWNLOADS</h2>
            <div class="hardware-box">
                <p>
                    No files found from server.
                </p>
            </div>
        </div>
    {/if}
</div>
