import { writable } from "svelte/store";
import { apiRoot } from "$lib/theme/content";

const STORAGE_KEY = "arc-member-token";

export type MemberProfile = {
	id: string;
	clubId: string;
	name: string;
	email: string;
	major: string;
	year: string;
	photoUrl: string;
	active: boolean;
};

export const member = writable<MemberProfile | null>(null);

export function storedToken(): string {
	if (typeof localStorage === "undefined") return "";
	try {
		return localStorage.getItem(STORAGE_KEY) ?? "";
	} catch {
		return "";
	}
}

function saveToken(token: string) {
	try {
		if (token) localStorage.setItem(STORAGE_KEY, token);
		else localStorage.removeItem(STORAGE_KEY);
	} catch (e) {
		console.error("Could not save the member session:", e);
	}
}

function authHeaders(): Record<string, string> {
	const token = storedToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function send(path: string, options: RequestInit = {}) {
	const res = await fetch(`${apiRoot}${path}`, {
		...options,
		headers: { ...(options.headers ?? {}), ...authHeaders() }
	});

	if (!res.ok) {
		throw new Error((await res.text()).trim() || "Something went wrong.");
	}
	const text = await res.text();
	return text ? JSON.parse(text) : {};
}

function adopt(data: any) {
	if (data.token) saveToken(data.token);
	member.set(data as MemberProfile);
	return data as MemberProfile;
}

export async function login(identifier: string, password: string) {
	return adopt(
		await send("/public/members/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier, password })
		})
	);
}

export async function register(clubId: string, email: string, password: string) {
	return adopt(
		await send("/public/members/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clubId, email, password })
		})
	);
}

export async function loadProfile() {
	if (!storedToken()) {
		member.set(null);
		return null;
	}
	try {
		return adopt(await send("/public/members/me"));
	} catch {
		logout();
		return null;
	}
}

export async function saveProfile(updates: {
	name: string;
	email: string;
	major: string;
	year: string;
}) {
	return adopt(
		await send("/public/members/me", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updates)
		})
	);
}

export async function changePassword(currentPassword: string, newPassword: string) {
	await send("/public/members/me/password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ currentPassword, newPassword })
	});
}

export async function uploadPhoto(file: File) {
	const body = new FormData();
	body.append("file", file);
	const data = await send("/public/members/me/photo", { method: "POST", body });
	member.update((current) => (current ? { ...current, photoUrl: data.photoUrl } : current));
	return data.photoUrl as string;
}

export function logout() {
	saveToken("");
	member.set(null);
}
