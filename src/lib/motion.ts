import { get, writable } from "svelte/store";

const STORAGE_KEY = "arc-reduce-motion";
const SYSTEM_QUERY = "(prefers-reduced-motion: reduce)";

export const reduceMotion = writable(false);

function applyToDocument(value: boolean) {
	if (typeof document === "undefined") return;
	if (value) document.documentElement.dataset.reduceMotion = "true";
	else delete document.documentElement.dataset.reduceMotion;
}

function savedChoice(): boolean | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "on") return true;
		if (stored === "off") return false;
	} catch (e) {
		console.error("Could not read motion preference:", e);
	}
	return null;
}

export function setReduceMotion(value: boolean, remember = true) {
	reduceMotion.set(value);
	applyToDocument(value);
	if (!remember) return;
	try {
		localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
	} catch (e) {
		console.error("Could not save motion preference:", e);
	}
}

export function toggleReduceMotion() {
	setReduceMotion(!get(reduceMotion));
}

export function motionIsReduced() {
	return get(reduceMotion);
}

export function initReduceMotion() {
	if (typeof window === "undefined") return;

	const system = window.matchMedia(SYSTEM_QUERY);
	const choice = savedChoice();
	setReduceMotion(choice ?? system.matches, false);

	const onSystemChange = () => {
		if (savedChoice() === null) setReduceMotion(system.matches, false);
	};
	system.addEventListener("change", onSystemChange);

	return () => system.removeEventListener("change", onSystemChange);
}
