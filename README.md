<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

# Contractors CRM

A modern CRM application for managing consultants, assignments, customers, and partners. Built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), and [Tailwind CSS](https://tailwindcss.com).

---

## Features

- Next.js App Router structure
- Supabase authentication and data management
- Azure-based social login via Supabase UI
- Styled with Tailwind CSS and [shadcn/ui](https://ui.shadcn.com)
- Modular components and utilities
- State management with Zustand

---

## Demo

Try the live demo:  
https://lively-ocean-0eed29103.1.azurestaticapps.net (DEV site) or
https://polite-river-0f3229403.1.azurestaticapps.net (PROD site)

---

## Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### 2. Clone the repository

```sh
git clone https://github.com/your-username/contractors-crm.git
cd contractors-crm
```

### 3. Set up Supabase

- Create a Supabase project: [Supabase dashboard](https://database.new)
- Copy your Supabase URL and Anon Key from your project's API settings.

### 4. Configure environment variables

Rename `.env.example` to `.env.local` and add:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Install dependencies

```sh
npm install
```

### 6. Run the development server

```sh
npm run dev
```

Visit [localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `app/` – Main Next.js app, routes, layouts, and pages
- `components/` – Reusable UI and form components
- `lib/` – Supabase clients and utilities
- `app/core/` – Commands, queries, stores, types for business logic
- `app/utilities/` – Helper functions

---

## Styling

- Uses Tailwind CSS (`globals.css`, `tailwind.config.ts`)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Easily customizable themes (light/dark)

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

---

## Feedback & Issues

Feel free to open issues or contribute via pull requests.

---

## More Examples

- [Supabase Next.js Examples](https://supabase.com/docs/guides/getting-started/local-development)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs/installation/next)
