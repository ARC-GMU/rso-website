# Autonomous Robotics Club (ARC) Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-5-ff3e00?logo=svelte)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-black?logo=tailwindcss)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-latest-black?logo=bun)](https://bun.sh/)

## Overview
This platform serves as the public website for the ARC Team, currently focused on developing collaborative autonomous systems for the **2025-2026 Raytheon Autonomous Vehicle Competition (AVC)**.

The website provides a centralized overview of:
- Our mission statement and technical capabilities.
- Live system statuses and events.
- The official Drone and Ground Team directory.
- Curated access to all active tracking/software repositories.
- Community Discord connections and organizational meeting schedules.

## Tech Stack
This project is built using modern edge technologies optimized for static workflows:
- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/) utilizing runes and snippet design patterns. 
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) implementing inline utilities mapped via `@theme`.
- **Icons**: [@iconify/svelte](https://iconify.design/) providing scalable vector illustrations without heavy payload sizes.
- **Runtime**: [Bun](https://bun.sh/) for ultra-fast dependency management and compilation speeds.

## Logos

Brand assets live in `static/logos/`.

**Club logo** — homepage hero, favicon fallback, `og:image`, legacy header

<img src="static/logos/logooo.png" width="160" alt="Club logo" />

**ARC wordmark** — navbar, light mode (`arcc.png`) and dark mode (`arcc_light.png`)

<img src="static/logos/arcc.png" width="220" alt="ARC wordmark, light mode" />
<img src="static/logos/arcc_light.png" width="220" alt="ARC wordmark, dark mode" style="background:#15181a;" />

The navbar wordmark swap between the two is handled purely with CSS in `src/lib/theme/Header.svelte`, keyed off the `data-theme` attribute set on `<html>` (see `src/app.html`).

**Favicon** — `favicon.png`, available but not currently wired to `<link rel="icon">`

<img src="static/logos/favicon.png" width="80" alt="Favicon" />

## Development Setup

To run the project locally, you will need to have [Bun](https://bun.sh/) installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RDC-GMU/website.git
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

You can now preview the application concurrently by navigating to `http://localhost:5173`.

## Deployment Architecture

This website is configured to be deployed on **Vercel** using `@sveltejs/adapter-vercel`.

### Vercel Deployment
The project is set up to deploy seamlessly on Vercel. 
1. Import the repository into your Vercel dashboard.
2. Vercel will automatically detect the SvelteKit project and use the `bun run build` command.
3. The site will be built and deployed automatically on every push to the `main` branch.
