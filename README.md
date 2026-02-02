This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin ESA setup (Supabase)

### Required environment variables

Create a `.env.local` in the project root:

```bash
# Public (safe to expose to the browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only
SUPABASE_SERVICE_ROLE_KEY=

# Optional convenience (admin client falls back to NEXT_PUBLIC_SUPABASE_URL)
SUPABASE_URL=
```

### Database migrations

This repo includes an **additive** "shadow-mode" Admin ESA migration:

- `supabase/migrations/20260127000100_admin_esa_shadow_core.sql`

Phase 2 onboarding tables + feature flags + audit logs:

- `supabase/migrations/20260127000200_phase2_onboarding_core.sql`

It creates canonical membership tables (`tenant_members`) + a global tech escape hatch (`global_roles`),
adds helper functions for RLS, aligns Atelier Salon tables with the UI expectations, and replaces
older JWT `app_metadata` tenant policies with membership-based policies.

## Admin ESA console (Tech only)

- Platform console: `/esa`
- Create/manage tenants: `/esa/tenants/...`
- Invite link format: `/invite/<token>`

Invites are generated in the console; sending the invite link by email is designed to be automated
later via Opal/n8n/Supabase SMTP.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
