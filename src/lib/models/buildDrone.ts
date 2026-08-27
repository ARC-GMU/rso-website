import type * as THREE from "three";

type ThreeModule = typeof import("three");

export type Drone = {
	group: THREE.Group;
	rotors: THREE.Object3D[];
	dispose: () => void;
};

const ARM_POSITIONS: [number, number][] = [
	[0.62, 0.62],
	[0.62, -0.62],
	[-0.62, 0.62],
	[-0.62, -0.62]
];

export function buildDrone(three: ThreeModule, accentColor: number): Drone {
	const group = new three.Group();
	const rotors: THREE.Object3D[] = [];

	const disposables: { dispose: () => void }[] = [];

	function track<T extends { dispose: () => void }>(item: T): T {
		disposables.push(item);
		return item;
	}

	const bodyMaterial = track(
		new three.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.42, metalness: 0.45 })
	);
	const trimMaterial = track(
		new three.MeshStandardMaterial({ color: 0x161616, roughness: 0.6, metalness: 0.2 })
	);
	const lensMaterial = track(
		new three.MeshStandardMaterial({
			color: accentColor,
			roughness: 0.25,
			metalness: 0.1,
			emissive: accentColor,
			emissiveIntensity: 0.6
		})
	);

	const body = new three.Mesh(track(new three.BoxGeometry(1.15, 0.3, 0.72)), bodyMaterial);
	group.add(body);

	const canopy = new three.Mesh(track(new three.BoxGeometry(0.62, 0.2, 0.5)), trimMaterial);
	canopy.position.set(0.06, 0.22, 0);
	group.add(canopy);

	const armGeometry = track(new three.BoxGeometry(1.95, 0.07, 0.1));
	for (const angle of [Math.PI / 4, -Math.PI / 4]) {
		const arm = new three.Mesh(armGeometry, bodyMaterial);
		arm.rotation.y = angle;
		group.add(arm);
	}

	const motorGeometry = track(new three.CylinderGeometry(0.11, 0.11, 0.2, 16));
	const hubGeometry = track(new three.CylinderGeometry(0.05, 0.05, 0.06, 12));
	const bladeGeometry = track(new three.BoxGeometry(0.92, 0.014, 0.09));

	for (const [x, z] of ARM_POSITIONS) {
		const motor = new three.Mesh(motorGeometry, trimMaterial);
		motor.position.set(x, 0.08, z);
		group.add(motor);

		const hub = new three.Mesh(hubGeometry, bodyMaterial);
		hub.position.set(x, 0.21, z);
		group.add(hub);

		const rotor = new three.Group();
		rotor.position.set(x, 0.23, z);
		group.add(rotor);

		for (const bladeAngle of [0, Math.PI / 2]) {
			const blade = new three.Mesh(bladeGeometry, trimMaterial);
			blade.rotation.y = bladeAngle;
			rotor.add(blade);
		}

		rotors.push(rotor);
	}

	const skidGeometry = track(new three.BoxGeometry(0.9, 0.05, 0.05));
	const legGeometry = track(new three.BoxGeometry(0.05, 0.26, 0.05));
	for (const z of [0.3, -0.3]) {
		const skid = new three.Mesh(skidGeometry, trimMaterial);
		skid.position.set(0, -0.34, z);
		group.add(skid);

		for (const x of [0.32, -0.32]) {
			const leg = new three.Mesh(legGeometry, trimMaterial);
			leg.position.set(x, -0.22, z);
			group.add(leg);
		}
	}

	const gimbal = new three.Mesh(track(new three.SphereGeometry(0.13, 16, 12)), trimMaterial);
	gimbal.position.set(0.34, -0.17, 0);
	group.add(gimbal);

	const lens = new three.Mesh(track(new three.CylinderGeometry(0.06, 0.06, 0.05, 14)), lensMaterial);
	lens.rotation.z = Math.PI / 2;
	lens.position.set(0.45, -0.19, 0);
	group.add(lens);

	return {
		group,
		rotors,
		dispose: () => disposables.forEach((item) => item.dispose())
	};
}
