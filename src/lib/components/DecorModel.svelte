<script lang="ts">
	import { onMount, tick } from "svelte";
	import { buildDecorModel, type DecorKind } from "$lib/models/buildDecor";
	import { motionIsReduced, reduceMotion } from "$lib/motion";

	const DESKTOP_QUERY = "(min-width: 768px)";
	const DRAG_SPEED = 0.011;
	const MAX_PITCH = 0.65;
	const SPIN_FRICTION = 0.94;

	let { kind, size = 130 }: { kind: DecorKind; size?: number } = $props();

	let container: HTMLDivElement | undefined = $state();
	let enabled = $state(false);
	let grabbing = $state(false);

	function clamp(value: number, limit: number) {
		return Math.max(-limit, Math.min(limit, value));
	}

	onMount(() => {
		if (typeof window === "undefined") return;
		if (!window.matchMedia(DESKTOP_QUERY).matches) return;

		let motionReduced = motionIsReduced();

		enabled = true;

		let stopped = false;
		let cleanup: (() => void) | undefined;

		(async () => {
			await tick();
			const three = await import("three");
			const element = container;
			if (stopped || !element) return;

			const accent =
				getComputedStyle(document.documentElement).getPropertyValue("--arc-accent").trim() ||
				"#006633";
			const accentColor = new three.Color(accent).getHex();

			const scene = new three.Scene();

			const camera = new three.PerspectiveCamera(34, 1, 0.1, 50);
			camera.position.set(2.6, 1.9, 3.4);
			camera.lookAt(0, 0, 0);

			const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.setSize(size, size, false);
			element.appendChild(renderer.domElement);

			scene.add(new three.AmbientLight(0xffffff, 1.2));

			const keyLight = new three.DirectionalLight(0xffffff, 2.6);
			keyLight.position.set(3, 5, 4);
			scene.add(keyLight);

			const rimLight = new three.DirectionalLight(accentColor, 2.4);
			rimLight.position.set(-4, 1.5, -3);
			scene.add(rimLight);

			const decor = buildDecorModel(three, kind, accentColor);

			const pivot = new three.Group();
			pivot.add(decor.group);
			scene.add(pivot);

			let dragYaw = 0;
			let dragPitch = 0;
			let spin = 0;
			let dragging = false;
			let lastX = 0;
			let lastY = 0;

			const drawOnce = () => {
				pivot.rotation.y = dragYaw;
				pivot.rotation.x = dragPitch;
				renderer.render(scene, camera);
			};

			const onPointerDown = (event: PointerEvent) => {
				dragging = true;
				grabbing = true;
				spin = 0;
				lastX = event.clientX;
				lastY = event.clientY;
				element.setPointerCapture(event.pointerId);
			};

			const onPointerMove = (event: PointerEvent) => {
				if (!dragging) return;

				const deltaX = (event.clientX - lastX) * DRAG_SPEED;
				lastX = event.clientX;
				lastY = event.clientY;

				dragYaw += deltaX;
				dragPitch = clamp(dragPitch + (event.movementY || 0) * DRAG_SPEED, MAX_PITCH);
				spin = deltaX;

				if (motionReduced) drawOnce();
			};

			const onPointerUp = (event: PointerEvent) => {
				dragging = false;
				grabbing = false;
				element.releasePointerCapture(event.pointerId);
			};

			element.addEventListener("pointerdown", onPointerDown);
			element.addEventListener("pointermove", onPointerMove);
			element.addEventListener("pointerup", onPointerUp);
			element.addEventListener("pointercancel", onPointerUp);

			const start = performance.now();
			let previous = start;
			let frame = 0;
			let visible = true;

			const renderFrame = (now: number) => {
				const delta = Math.min((now - previous) / 1000, 0.1);
				previous = now;

				if (!dragging) {
					dragYaw += spin;
					spin *= SPIN_FRICTION;
					if (Math.abs(spin) < 0.0001) spin = 0;
				}

				decor.update((now - start) / 1000, delta);
				drawOnce();

				frame = visible ? requestAnimationFrame(renderFrame) : 0;
			};

			const unsubscribe = reduceMotion.subscribe((reduced) => {
				motionReduced = reduced;
				if (reduced) {
					cancelAnimationFrame(frame);
					frame = 0;
					decor.update(0, 0);
					drawOnce();
				} else if (visible && frame === 0) {
					previous = performance.now();
					frame = requestAnimationFrame(renderFrame);
				}
			});

			const visibility = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				if (motionReduced) return;
				if (visible && frame === 0) {
					previous = performance.now();
					frame = requestAnimationFrame(renderFrame);
				}
			});
			visibility.observe(element);

			cleanup = () => {
				cancelAnimationFrame(frame);
				unsubscribe();
				visibility.disconnect();
				element.removeEventListener("pointerdown", onPointerDown);
				element.removeEventListener("pointermove", onPointerMove);
				element.removeEventListener("pointerup", onPointerUp);
				element.removeEventListener("pointercancel", onPointerUp);
				decor.dispose();
				renderer.dispose();
				renderer.domElement.remove();
			};
		})();

		return () => {
			stopped = true;
			cleanup?.();
		};
	});
</script>

{#if enabled}
	<div
		bind:this={container}
		class="decor-model"
		class:grabbing
		style="width:{size}px; height:{size}px;"
		aria-hidden="true"
	></div>
{/if}

<style>
	.decor-model {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		cursor: grab;
		touch-action: none;
		opacity: 0.85;
	}

	.decor-model.grabbing {
		cursor: grabbing;
	}

	.decor-model :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
