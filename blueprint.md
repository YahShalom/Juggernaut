# Project Blueprint: Admin ESA & Atelier Salon

## Overview

This document outlines the architecture and features of the multi-tenant "Admin ESA" platform, with a specific focus on the "Atelier Salon Hair Try-On Lite" module built for the `perrydbeauty` tenant.

## Core Platform Features

- **Multi-Tenancy:** The platform is built around a tenant model, where each tenant has its own unique slug for routing (e.g., `/[tenantSlug]/...`).
- **Authentication:** Utilizes Supabase Auth with tenant-specific user roles (`owner`, `admin`, `tech`, `member`).
- **Styling:** A skinning engine (`lib/skin/getSkin`) provides tenant-specific branding and CSS variables.
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) enforced on all tables to ensure data isolation between tenants.

## Atelier Salon Module

This module provides a virtual hair try-on experience and is controlled by a feature flag.

### Feature Flag

- **Name:** `atelier_salon_tryon_lite`
- **Table:** `public.tenant_features`
- **Scope:** Can be enabled or disabled on a per-tenant basis.
- **Admin UI:** A toggle switch is available in the admin settings page (`/[tenantSlug]/admin/settings`) for tenant owners/admins to manage this feature.

### Admin Management UI

- **Categories (`/[tenantSlug]/admin/atelier-salon/categories`):**
  - Allows admins to create, rename, and sort hair style categories.
  - All operations are secured via Server Actions and RLS.
- **Hair Styles (`/[tenantSlug]/admin/atelier-salon/hair-styles`):**
  - A table lists all hairstyles for the tenant.
  - Provides forms for creating and editing styles, including fields for:
    - Name, description, category, status
    - **Image Uploads:** Overlay (PNG) and Preview (JPG) images are uploaded to the `hair-overlays` Supabase Storage bucket.
    - **Transform Sliders:** Default values for scale, offset, rotation, and opacity can be set.

### Tenant-Facing Try-On Page

- **Route:** `/[tenantSlug]/atelier/salon/tryon`
- **Access Control:** 
  1. The page is only accessible if the `atelier_salon_tryon_lite` feature flag is enabled for the tenant.
  2. Requires the user to be logged in.
- **Functionality:**
  1. **Selfie Upload:** Users can upload a photo of themselves.
  2. **Style Catalog:** Displays a grid of active hairstyles.
  3. **Live Preview:** When a style is selected, its PNG overlay is rendered on top of the user's selfie.
  4. **Adjustments:** Users can manipulate the overlay using sliders for scale, position, rotation, and opacity.
  5. **Save:** The final try-on (selfie path, style ID, and applied transforms) is saved to the `public.hair_tryons` table. Selfies are stored in the private `tryon-selfies` bucket.

### Demo Mode

- **Activation:** Enabled by setting the `DEMO_MODE=true` environment variable.
- **Behavior:** When active, a "Demo Mode" banner is displayed at the top of all pages **only** for the `perrydbeauty` tenant.

## Code Quality and Linting Fixes

- **Corrected Linter Configuration:** Fixed the `eslint.config.mjs` file with the proper `import` syntax.
- **Replaced `<a>` with `<Link>`:** Updated `app/esa/layout.tsx` and `app/invite/[token]/page.tsx` to use the Next.js `<Link>` component for internal navigation, which is the recommended practice for Next.js applications.
- **Removed Unused Code:** Removed the unused `cookies` import from `app/auth/actions.ts` and the unused `styles` and `setStyles` state variables from `components/admin/hair-styles-client-page.tsx`.
- **Optimized Images:** Replaced the standard `<img>` tags with the `next/image` `Image` component in `components/admin/hair-styles-client-page.tsx` and `components/atelier-salon/tryon-client-page.tsx` for better performance and to resolve linting warnings. I also updated the `next.config.mjs` to allow images from your Supabase storage.
- **Corrected a Typo:** Fixed a layout typo in `components/atelier-salon/tryon-client-page.tsx`.
