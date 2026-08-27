import type * as THREE from "three";
import { buildDrone } from "./buildDrone";

type ThreeModule = typeof import("three");

export type DecorKind = "drone" | "rover" | "rotor" | "arm";

export type Decor = {
	group: THREE.Group;
	update: (time: number, delta: number) => void;
	dispose: () => void;
};

type Palette = {
	body: THREE.MeshStandardMaterial;
	trim: THREE.MeshStandardMaterial;
	accent: THREE.MeshStandardMaterial;
};

type Track = <T extends { dispose: () => void }>(item: T) => T;

const BASE_YAW = -0.6;

function createPalette(three: ThreeModule, accentColor: number): Palette {
	return {
		body: new three.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.42, metalness: 0.45 }),
		trim: new three.MeshStandardMaterial({ color: 0x161616, roughness: 0.6, metalness: 0.2 }),
		accent: new three.MeshStandardMaterial({
			color: accentColor,
			roughness: 0.3,
			metalness: 0.1,
			emissive: accentColor,
			emissiveIntensity: 0.5
		})
	};
}

function buildRover(three: ThreeModule, palette: Palette, track: Track) {
	const group = new three.Group();
	const wheels: THREE.Mesh[] = [];

	const chassis = new three.Mesh(track(new three.BoxGeometry(1.5, 0.34, 0.9)), palette.body);
	group.add(chassis);

	const deck = new three.Mesh(track(new three.BoxGeometry(0.9, 0.18, 0.66)), palette.trim);
	deck.position.set(-0.15, 0.26, 0);
	group.add(deck);

	const mast = new three.Mesh(track(new three.BoxGeometry(0.1, 0.55, 0.1)), palette.trim);
	mast.position.set(0.42, 0.42, 0);
	group.add(mast);

	const sensor = new three.Mesh(track(new three.BoxGeometry(0.3, 0.2, 0.26)), palette.body);
	sensor.position.set(0.42, 0.76, 0);
	group.add(sensor);

	const lens = new three.Mesh(track(new three.CylinderGeometry(0.06, 0.06, 0.05, 14)), palette.accent);
	lens.rotation.z = Math.PI / 2;
	lens.position.set(0.58, 0.76, 0);
	group.add(lens);

	const wheelGeometry = track(new three.CylinderGeometry(0.28, 0.28, 0.18, 20));
	for (const x of [0.52, -0.52]) {
		for (const z of [0.5, -0.5]) {
			const axle = new three.Group();
			axle.position.set(x, -0.2, z);
			axle.rotation.x = Math.PI / 2;
			group.add(axle);

			const wheel = new three.Mesh(wheelGeometry, palette.trim);
			axle.add(wheel);
			wheels.push(wheel);
		}
	}

	return { group, wheels };
}

function buildRotor(three: ThreeModule, palette: Palette, track: Track) {
	const group = new three.Group();

	const motor = new three.Mesh(track(new three.CylinderGeometry(0.3, 0.34, 0.44, 20)), palette.body);
	group.add(motor);

	const collar = new three.Mesh(track(new three.CylinderGeometry(0.34, 0.34, 0.07, 20)), palette.accent);
	collar.position.y = 0.1;
	group.add(collar);

	const blades = new three.Group();
	blades.position.y = 0.3;
	group.add(blades);

	const hub = new three.Mesh(track(new three.CylinderGeometry(0.12, 0.12, 0.14, 14)), palette.trim);
	blades.add(hub);

	const bladeGeometry = track(new three.BoxGeometry(1.7, 0.035, 0.22));
	for (const angle of [0, Math.PI / 2]) {
		const blade = new three.Mesh(bladeGeometry, palette.trim);
		blade.rotation.y = angle;
		blade.rotation.z = 0.12;
		blade.position.y = 0.04;
		blades.add(blade);
	}

	return { group, blades };
}

function buildArm(three: ThreeModule, palette: Palette, track: Track) {
	const group = new three.Group();

	const base = new three.Mesh(track(new three.CylinderGeometry(0.46, 0.56, 0.16, 24)), palette.body);
	base.position.y = -0.9;
	group.add(base);

	const column = new three.Mesh(track(new three.CylinderGeometry(0.24, 0.28, 0.36, 18)), palette.trim);
	column.position.y = -0.64;
	group.add(column);

	const jointGeometry = track(new three.CylinderGeometry(0.17, 0.17, 0.32, 18));
	const smallJointGeometry = track(new three.CylinderGeometry(0.13, 0.13, 0.26, 16));

	const shoulder = new three.Group();
	shoulder.position.y = -0.44;
	group.add(shoulder);

	const shoulderJoint = new three.Mesh(jointGeometry, palette.accent);
	shoulderJoint.rotation.x = Math.PI / 2;
	shoulder.add(shoulderJoint);

	const lowerArm = new three.Mesh(track(new three.BoxGeometry(0.2, 1, 0.24)), palette.body);
	lowerArm.position.y = 0.5;
	shoulder.add(lowerArm);

	const elbow = new three.Group();
	elbow.position.y = 1;
	shoulder.add(elbow);

	const elbowJoint = new three.Mesh(smallJointGeometry, palette.accent);
	elbowJoint.rotation.x = Math.PI / 2;
	elbow.add(elbowJoint);

	const upperArm = new three.Mesh(track(new three.BoxGeometry(0.17, 0.85, 0.2)), palette.body);
	upperArm.position.y = 0.42;
	elbow.add(upperArm);

	const wrist = new three.Group();
	wrist.position.y = 0.85;
	elbow.add(wrist);

	const wristBlock = new three.Mesh(track(new three.BoxGeometry(0.24, 0.18, 0.22)), palette.trim);
	wrist.add(wristBlock);

	const fingers: THREE.Mesh[] = [];
	const fingerGeometry = track(new three.BoxGeometry(0.06, 0.3, 0.07));
	for (const x of [0.09, -0.09]) {
		const finger = new three.Mesh(fingerGeometry, palette.trim);
		finger.position.set(x, 0.21, 0);
		wrist.add(finger);
		fingers.push(finger);
	}

	group.scale.setScalar(0.82);
	group.position.y = 0.1;

	return { group, shoulder, elbow, wrist, fingers };
}

export function buildDecorModel(three: ThreeModule, kind: DecorKind, accentColor: number): Decor {
	if (kind === "drone") {
		const drone = buildDrone(three, accentColor);
		drone.group.scale.setScalar(0.95);

		return {
			group: drone.group,
			dispose: drone.dispose,
			update: (time, delta) => {
				for (const rotor of drone.rotors) rotor.rotation.y += delta * 22;
				drone.group.position.y = Math.sin(time * 1.1) * 0.07;
				drone.group.rotation.y = BASE_YAW + Math.sin(time * 0.4) * 0.3;
				drone.group.rotation.z = Math.sin(time * 0.5) * 0.05;
			}
		};
	}

	const disposables: { dispose: () => void }[] = [];
	const track: Track = (item) => {
		disposables.push(item);
		return item;
	};

	const palette = createPalette(three, accentColor);
	disposables.push(palette.body, palette.trim, palette.accent);

	const dispose = () => disposables.forEach((item) => item.dispose());

	if (kind === "rover") {
		const rover = buildRover(three, palette, track);
		rover.group.rotation.x = 0.16;

		return {
			group: rover.group,
			dispose,
			update: (time, delta) => {
				for (const wheel of rover.wheels) wheel.rotation.y += delta * 1.5;
				rover.group.rotation.y = BASE_YAW + Math.sin(time * 0.32) * 0.35;
				rover.group.position.y = Math.sin(time * 2.4) * 0.015;
			}
		};
	}

	if (kind === "arm") {
		const arm = buildArm(three, palette, track);

		return {
			group: arm.group,
			dispose,
			update: (time) => {
				const cycle = time * 0.5;
				arm.shoulder.rotation.z = 0.42 + Math.sin(cycle) * 0.2;
				arm.elbow.rotation.z = -1.05 + Math.sin(cycle + 0.9) * 0.28;
				arm.wrist.rotation.z = -0.4 + Math.sin(cycle + 1.8) * 0.22;
				arm.group.rotation.y = BASE_YAW + Math.sin(time * 0.24) * 0.35;

				const grip = 0.14 + Math.max(0, Math.sin(cycle * 2)) * 0.18;
				arm.fingers[0].rotation.z = -grip;
				arm.fingers[1].rotation.z = grip;
			}
		};
	}

	const rotor = buildRotor(three, palette, track);
	rotor.group.rotation.x = 0.16;

	return {
		group: rotor.group,
		dispose,
		update: (time, delta) => {
			rotor.blades.rotation.y += delta * 5.5;
			rotor.group.rotation.y = BASE_YAW + Math.sin(time * 0.3) * 0.25;
		}
	};
}
