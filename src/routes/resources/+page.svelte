<script lang="ts">
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import PdfViewer from "$lib/theme/PdfViewer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	function isPdf(src: string) {
		return src.toLowerCase().endsWith(".pdf");
	}

	let hasSizes = $derived(data.files.some((file: { size?: string }) => file.size));
</script>

<Page title="Resources">
	{#each data.linkGroups as group}
		<Panel title={group.category.toUpperCase()} flush>
			<div class="overflow-x-auto">
				<table class="arc-table arc-table-fixed">
					<thead>
						<tr>
							<th class="w-[28%]">RESOURCE</th>
							<th class="w-[55%]">DESCRIPTION</th>
							<th class="w-[17%]">LINK</th>
						</tr>
					</thead>
					<tbody>
						{#each group.links as link}
							<tr>
								<td class="font-bold whitespace-nowrap">{link.title}</td>
								<td>{link.description}</td>
								<td>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="arc-btn-small"
									>
										OPEN
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Panel>
	{/each}

	<Panel title="TEAM FILES AND DOWNLOADS" flush>
		<div class="overflow-x-auto">
			<table class="arc-table">
				<thead>
					<tr>
						<th>FILE</th>
						<th>DESCRIPTION</th>
						{#if hasSizes}
							<th>SIZE</th>
						{/if}
						<th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					{#if data.files.length === 0}
						<tr>
							<td colspan="4" class="arc-table-empty">No files available.</td>
						</tr>
					{:else}
						{#each data.files as file}
							<tr>
								<td class="font-bold">{file.name}</td>
								<td>{file.description}</td>
								{#if hasSizes}
									<td class="whitespace-nowrap">{file.size ?? "-"}</td>
								{/if}
								<td>
									<div class="flex flex-wrap items-center gap-2">
										{#if isPdf(file.src)}
											<PdfViewer src={file.src} title={file.name} />
										{/if}
										<a href={file.src} download class="arc-btn-small">DOWNLOAD</a>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</Panel>
</Page>
