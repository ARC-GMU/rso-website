<script lang="ts">
	import { onMount, tick } from "svelte";
	import { buildDrone, type Drone } from "$lib/models/buildDrone";
	import { motionIsReduced, reduceMotion } from "$lib/motion";

	const DESKTOP_QUERY = "(min-width: 768px)";
	const PLAY_CHANCE = 0.5;

	const ENTER_END = 1.5;
	const LOOK_END = 5.1;
	const EXIT_END = 6.5;

	const QUARTER_TURN = Math.PI / 2;

	const YAW_KEYFRAMES: [time: number, angle: number][] = [
		[0, 0],
		[0.35, 0],
		[1.2, -Math.PI],
		[1.8, -Math.PI],
		[2.45, -QUARTER_TURN],
		[2.9, -QUARTER_TURN],
		[3.6, 0]
	];

	let container: HTMLDivElement | undefined = $state();
	let enabled = $state(false);

	function easeOut(t: number) {
		return 1 - Math.pow(1 - t, 3);
	}

	function easeIn(t: number) {
		return t * t * t;
	}

	function easeInOut(t: number) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function flightProgress(time: number) {
		if (time < ENTER_END) return -1 + easeOut(time / ENTER_END);
		if (time < LOOK_END) return 0;
		return easeIn((time - LOOK_END) / (EXIT_END - LOOK_END));
	}

	function lookAroundAngle(time: number) {
		const elapsed = time - ENTER_END;
		if (elapsed <= 0) return 0;

		for (let i = 1; i < YAW_KEYFRAMES.length; i++) {
			const [fromTime, fromAngle] = YAW_KEYFRAMES[i - 1];
			const [toTime, toAngle] = YAW_KEYFRAMES[i];
			if (elapsed > toTime) continue;
			if (fromAngle === toAngle) return fromAngle;

			const turn = (elapsed - fromTime) / (toTime - fromTime);
			return fromAngle + (toAngle - fromAngle) * easeInOut(turn);
		}

		return YAW_KEYFRAMES[YAW_KEYFRAMES.length - 1][1];
	}

	onMount(() => {
		if (typeof window === "undefined") return;

		const desktop = window.matchMedia(DESKTOP_QUERY);
		if (!desktop.matches || motionIsReduced()) return;
		if (Math.random() >= PLAY_CHANCE) return;

		enabled = true;

		let stopped = false;
		let frame = 0;
		let cleanup: (() => void) | undefined;

		const unsubscribe = reduceMotion.subscribe((reduced) => {
			if (!reduced) return;
			cleanup?.();
			enabled = false;
		});

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

			const camera = new three.PerspectiveCamera(38, 1, 0.1, 100);
			camera.position.set(0, 0.9, 7.2);
			camera.lookAt(0, 0, 0);

			const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
			element.appendChild(renderer.domElement);

			scene.add(new three.AmbientLight(0xffffff, 1.1));

			const keyLight = new three.DirectionalLight(0xffffff, 2.4);
			keyLight.position.set(4, 6, 5);
			scene.add(keyLight);

			const rimLight = new three.DirectionalLight(accentColor, 2.2);
			rimLight.position.set(-5, 2, -4);
			scene.add(rimLight);

			const drone: Drone = buildDrone(three, accentColor);
			scene.add(drone.group);

			let travel = 12;

			const resize = () => {
				const width = element.clientWidth;
				const height = element.clientHeight;
				if (width === 0 || height === 0) return;

				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				renderer.setSize(width, height, false);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
				travel = halfHeight * camera.aspect + 2.5;
			};

			resize();
			const observer = new ResizeObserver(resize);
			observer.observe(element);

			const start = performance.now();
			let previous = start;

			const render = (now: number) => {
				const delta = (now - previous) / 1000;
				previous = now;
				const time = (now - start) / 1000;

				const x = flightProgress(time) * travel;
				const velocity = (x - drone.group.position.x) / Math.max(delta, 0.001);
				const bank = Math.max(-0.4, Math.min(0.4, velocity * 0.035));

				drone.group.position.x = x;
				drone.group.position.y = Math.sin(time * 1.2) * 0.12;
				drone.group.rotation.z = -bank;
				drone.group.rotation.x = bank * 0.35;
				drone.group.rotation.y = lookAroundAngle(time);

				for (const rotor of drone.rotors) rotor.rotation.y += delta * 30;

				renderer.render(scene, camera);

				if (time >= EXIT_END) {
					cleanup?.();
					enabled = false;
					return;
				}

				frame = requestAnimationFrame(render);
			};

			frame = requestAnimationFrame(render);

			cleanup = () => {
				cancelAnimationFrame(frame);
				observer.disconnect();
				drone.dispose();
				renderer.dispose();
				renderer.domElement.remove();
				cleanup = undefined;
			};
		})();

		return () => {
			stopped = true;
			unsubscribe();
			cleanup?.();
		};
	});
</script>

{#if enabled}
	<div bind:this={container} class="drone-scan" aria-hidden="true"></div>
{/if}

<style>
	.drone-scan {
		position: fixed;
		inset: 0;
		z-index: 40;
		pointer-events: none;
		overflow: hidden;
	}

	.drone-scan :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
