<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Underline from "@tiptap/extension-underline";
	import Link from "@tiptap/extension-link";
	import Image from "@tiptap/extension-image";
	import Placeholder from "@tiptap/extension-placeholder";

	let {
		content = $bindable(""),
		placeholder = "Write your update…"
	}: { content?: string; placeholder?: string } = $props();

	let editorElement: HTMLDivElement;
	let editor: Editor | undefined;
	let transactions = $state(0);

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit,
				Underline,
				Link.configure({ openOnClick: false }),
				Image.configure({ inline: false, allowBase64: false }),
				Placeholder.configure({ placeholder })
			],
			content: content || "",
			onUpdate: ({ editor: instance }) => {
				content = instance.getHTML();
			},
			onTransaction: () => {
				transactions++;
			}
		});
	});

	onDestroy(() => editor?.destroy());

	function isActive(name: string, attrs?: Record<string, unknown>) {
		transactions;
		if (!editor) return false;
		return attrs ? editor.isActive(name, attrs) : editor.isActive(name);
	}

	function run(action: () => void) {
		return (event: MouseEvent) => {
			event.preventDefault();
			action();
		};
	}

	function promptLink() {
		const current = editor?.getAttributes("link").href ?? "";
		const url = prompt("Link URL:", current);
		if (url === null) return;
		if (url === "") {
			editor?.chain().focus().unsetLink().run();
			return;
		}
		editor?.chain().focus().setLink({ href: url, target: "_blank" }).run();
	}

	export function insertImage(url: string) {
		editor?.chain().focus().setImage({ src: url }).run();
	}

	const tools = [
		{ icon: "mdi:format-bold", label: "Bold", name: "bold", action: () => editor?.chain().focus().toggleBold().run() },
		{ icon: "mdi:format-italic", label: "Italic", name: "italic", action: () => editor?.chain().focus().toggleItalic().run() },
		{ icon: "mdi:format-underline", label: "Underline", name: "underline", action: () => editor?.chain().focus().toggleUnderline().run() },
		{ icon: "mdi:format-header-2", label: "Heading", name: "heading", attrs: { level: 2 }, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
		{ icon: "mdi:format-list-bulleted", label: "Bullet list", name: "bulletList", action: () => editor?.chain().focus().toggleBulletList().run() },
		{ icon: "mdi:format-list-numbered", label: "Numbered list", name: "orderedList", action: () => editor?.chain().focus().toggleOrderedList().run() },
		{ icon: "mdi:format-quote-close", label: "Quote", name: "blockquote", action: () => editor?.chain().focus().toggleBlockquote().run() },
		{ icon: "mdi:link-variant", label: "Link", name: "link", action: promptLink }
	];
</script>

<div class="border border-[var(--arc-line)] bg-[var(--arc-surface)]">
	<div class="flex flex-wrap gap-1 border-b border-[var(--arc-line)] p-2">
		{#each tools as tool}
			<button
				type="button"
				title={tool.label}
				aria-label={tool.label}
				class="flex h-8 w-8 cursor-pointer items-center justify-center border {isActive(
					tool.name,
					tool.attrs
				)
					? 'border-[var(--arc-accent)] bg-[var(--arc-accent)] text-[var(--arc-on-accent)]'
					: 'border-[var(--arc-line)] text-[var(--arc-ink-2)] hover:border-[var(--arc-accent)]'}"
				onclick={run(tool.action)}
			>
				<Icon icon={tool.icon} class="text-lg" />
			</button>
		{/each}
	</div>

	<div
		bind:this={editorElement}
		class="prose prose-sm max-w-none px-4 py-3 text-[var(--arc-ink-2)] prose-p:my-2 prose-headings:text-[var(--arc-ink)] prose-a:text-[var(--arc-accent)] prose-li:my-0"
	></div>
</div>

<style>
	div :global(.tiptap) {
		min-height: 160px;
		outline: none;
	}

	div :global(.tiptap p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
		color: var(--arc-muted-2);
	}

	div :global(.tiptap img) {
		max-width: 100%;
		height: auto;
		border: 1px solid var(--arc-line);
	}
</style>
