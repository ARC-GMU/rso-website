<script lang="ts">
	import Icon from "@iconify/svelte";
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
	import PdfViewer from "$lib/theme/PdfViewer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let category = $derived(data.category);
	let hasSizes = $derived(category.files.some((file) => file.size));

	function isPdf(src: string) {
		return src.toLowerCase().endsWith(".pdf");
	}
</script>

<Page title={category.name} heading={category.name}>
	<a href="/resources" class="arc-link inline-flex items-center gap-1">
		<Icon icon="mdi:chevron-left" class="text-base" />
		ALL RESOURCES
	</a>

	{#if category.kind === "files"}
		<Panel title="FILES" flush>
			<div class="hidden overflow-x-auto sm:block">
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
						{#each category.files as file (file.src)}
							<tr>
								<td class="font-bold">{file.name}</td>
								<td>{file.description}</td>
								{#if hasSizes}
									<td class="truncate">{file.size ?? "-"}</td>
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
					</tbody>
				</table>
			</div>

			<div class="flex flex-col divide-y divide-[var(--arc-line-soft)] sm:hidden">
				{#each category.files as file (file.src)}
					<div class="flex flex-col gap-2 px-5 py-4">
						<span class="font-bold text-[var(--arc-ink)]">{file.name}</span>
						{#if file.description}
							<span class="text-[14px] text-[var(--arc-ink-2)]">{file.description}</span>
						{/if}
						{#if hasSizes && file.size}
							<span class="text-[12px] text-[var(--arc-muted-2)]">{file.size}</span>
						{/if}
						<div class="mt-1 flex flex-wrap items-center gap-2">
							{#if isPdf(file.src)}
								<PdfViewer src={file.src} title={file.name} />
							{/if}
							<a href={file.src} download class="arc-btn-small">DOWNLOAD</a>
						</div>
					</div>
				{/each}
			</div>
		</Panel>
	{:else}
		<Panel title={category.name.toUpperCase()} flush>
			<div class="hidden overflow-x-auto sm:block">
				<table class="arc-table arc-table-fixed">
					<thead>
						<tr>
							<th class="w-[28%]">RESOURCE</th>
							<th class="w-[55%]">DESCRIPTION</th>
							<th class="w-[17%]">LINK</th>
						</tr>
					</thead>
					<tbody>
						{#each category.links as link (link.url)}
							<tr>
								<td class="truncate font-bold">{link.title}</td>
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

			<div class="flex flex-col divide-y divide-[var(--arc-line-soft)] sm:hidden">
				{#each category.links as link (link.url)}
					<div class="flex flex-col gap-2 px-5 py-4">
						<span class="font-bold text-[var(--arc-ink)]">{link.title}</span>
						{#if link.description}
							<span class="text-[14px] text-[var(--arc-ink-2)]">{link.description}</span>
						{/if}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="arc-btn-small mt-1 self-start"
						>
							OPEN
						</a>
					</div>
				{/each}
			</div>
		</Panel>
	{/if}
</Page>
