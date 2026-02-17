# ESA-Studio Blueprint

## Overview

This project is a Next.js application designed to provide a multi-tenant solution with customized UI and features based on the tenant. It uses Lucia for authentication and Drizzle ORM for database interactions. The application is designed to be deployed on Firebase.

## Style and Design

The application uses Tailwind CSS for styling, with a modern and clean design. It incorporates a variety of UI components, including:

*   **Buttons:** Interactive buttons with hover and focus states.
*   **Cards:** Cards with drop shadows to create a lifted effect.
*   **Forms:** Well-structured forms with labels, input fields, and validation messages.
*   **Navigation:** A sidebar for navigation within the admin and ESA sections.

## Features

### 1. Authentication

*   **Lucia-based authentication:** The application uses Lucia for session management and user authentication.
*   **Email/Password sign-in:** Users can sign in with their email and a password associated with a specific workspace.
*   **Sign-up:** New users can sign up for a workspace, with password strength validation.
*   **OTP-based sign-in:** The application now supports OTP-based sign-in with Supabase.

### 2. Multi-tenancy

*   **Tenant-based routing:** The application uses the tenant's slug in the URL to determine the current workspace.
*   **Customized UI:** The UI and features can be customized based on the tenant.

### 3. Admin and ESA Sections

*   **Admin dashboard:** A dedicated section for administrators to manage tenant-specific settings.
*   **ESA dashboard:** A section for ESA (Enterprise Solutions Agent) to manage tenants and other system-level configurations.

### 4. Supabase Integration

*   **Supabase client:** The application uses the Supabase client for interacting with Supabase services.
*   **Callback route:** A dedicated route to handle the authentication callback from Supabase.

## Current Plan

*   **Implement OTP-based sign-in:** The current plan is to implement OTP-based sign-in using Supabase.
