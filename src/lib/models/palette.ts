import type * as THREE from "three";

export type ThreeModule = typeof import("three");

export type Track = <T extends { dispose: () => void }>(item: T) => T;

export type Palette = {
	body: THREE.MeshStandardMaterial;
	trim: THREE.MeshStandardMaterial;
	metal: THREE.MeshStandardMaterial;
	glass: THREE.MeshStandardMaterial;
	accent: THREE.MeshStandardMaterial;
};

export type PaintScheme = {
	name: string;
	body: number;
	trim: number;
	metal: number;
	glass: number;
	accent: number;
};

const PAINT_CHANCE = 0.75;

const PAINT_SCHEMES: PaintScheme[] = [
	{
		name: "hot pink",
		body: 0xff2e93,
		trim: 0xb00063,
		metal: 0xffd1e8,
		glass: 0x2a0a1d,
		accent: 0x00e5ff
	},
	{
		name: "cyber blue",
		body: 0x1b2a52,
		trim: 0x243b6b,
		metal: 0x9fd8ff,
		glass: 0x08121f,
		accent: 0x00f0ff
	},
	{
		name: "sunset",
		body: 0x3a2340,
		trim: 0x5a2740,
		metal: 0xffc98a,
		glass: 0x1d0f1b,
		accent: 0xff7a3d
	},
	{
		name: "lava",
		body: 0x2a1512,
		trim: 0x4d1f17,
		metal: 0xffb199,
		glass: 0x190b09,
		accent: 0xff3b1f
	},
	{
		name: "ultraviolet",
		body: 0x2b1b52,
		trim: 0x3d2578,
		metal: 0xd0bcff,
		glass: 0x140a26,
		accent: 0xb14dff
	}
];

export function pickPaintScheme(chance = PAINT_CHANCE): PaintScheme | null {
	if (Math.random() >= chance) return null;
	return PAINT_SCHEMES[Math.floor(Math.random() * PAINT_SCHEMES.length)];
}

export function createPalette(three: ThreeModule, paint: PaintScheme | null = null): Palette {
	const accent = paint?.accent ?? 0x8f9aa0;

	return {
		body: new three.MeshStandardMaterial({
			color: paint?.body ?? 0x1b2124,
			roughness: 0.45,
			metalness: 0.5
		}),
		trim: new three.MeshStandardMaterial({
			color: paint?.trim ?? 0x2c3237,
			roughness: 0.62,
			metalness: 0.25
		}),
		metal: new three.MeshStandardMaterial({
			color: paint?.metal ?? 0xb9c2c6,
			roughness: 0.26,
			metalness: 0.95
		}),
		glass: new three.MeshStandardMaterial({
			color: paint?.glass ?? 0x101c1a,
			roughness: 0.12,
			metalness: 0.6,
			transparent: true,
			opacity: 0.88
		}),
		accent: new three.MeshStandardMaterial({
			color: accent,
			roughness: 0.3,
			metalness: 0.45,
			emissive: accent,
			emissiveIntensity: paint ? 0.5 : 0.15
		})
	};
}

export function paletteMaterials(palette: Palette): THREE.MeshStandardMaterial[] {
	return Object.values(palette);
}
