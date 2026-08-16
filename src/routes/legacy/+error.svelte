<script lang="ts">
    import { page } from "$app/stores";
</script>

<svelte:head>
    <title>{$page.status} Error | ARC</title>
</svelte:head>

<div class="super-container max-w-[800px] mx-auto mt-10">
    <div class="config-category border-[#CC0000]">
        <h2 class="text-[#CC0000] border-[#CC0000]">
            SYSTEM EXCEPTION: {$page.status}
        </h2>

        <div
            class="hardware-box bg-[#FFCCCC] border-[#CC0000] text-[#990000] mb-5"
        >
            <h3>FAULT DETECTED</h3>
            <p class="font-bold text-lg mb-2">
                {$page.error?.message ??
                    "Unknown framework exception encountered in the system."}
            </p>

            {#if $page.status === 404}
                <p>
                    The requested directory, trajectory track, or URL path could
                    not be located on the current server environment.
                </p>
            {:else}
                <p>
                    An unexpected internal telemetry fault occurred during data
                    retrieval. Please re-run the operational request.
                </p>
            {/if}
        </div>

        <div class="flex mt-6 mb-2">
            <a href="/legacy" class="no-underline block">
                <button
                    class="save-btn font-bold py-2 px-6 hover:bg-black hover:text-white transition-colors border border-black bg-[#e0e0e0] text-black uppercase"
                >
                    Return to Home Page
                </button>
            </a>
        </div>
    </div>
</div>
