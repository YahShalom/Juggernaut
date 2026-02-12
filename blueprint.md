# Project Blueprint

## Overview

This project is a Next.js application with Supabase integration for authentication and data storage. It includes an AI-powered feature called "Atelier" that provides personalized recommendations to users.

## Features

### Atelier "Run" Endpoint

- **Endpoint:** `app/api/atelier/run/route.ts`
- **Description:** This endpoint processes user requests for product recommendations.
- **Authentication:** Verifies the user's session using Supabase Auth.
- **Tenant Resolution:** Extracts the `tenant_id` from the user's JWT.
- **Session Management:**
    - Creates a new `atelier_sessions` and `atelier_inputs` record for a new session.
    - Updates the `updated_at` timestamp for an existing session.
- **AI Integration:**
    - Calls the Opal API (a mock LLM workflow) with user inputs to get recommendations or clarification questions.
- **Response Handling:**
    - If Opal returns a clarification question, the endpoint responds with a `clarification` type JSON object.
    - If Opal returns a recommendation, the endpoint:
        1. Charges the tenant for the recommendation by calling a `enforce_usage` database function.
        2. Inserts the recommendation into the `atelier_recommendations` table.

## Current Plan

### Atelier v1 End-to-End Implementation

This plan outlines the steps to implement the full end-to-end user experience for Atelier v1 in the Admin ESA.

1.  **API Implementation (`/api/atelier/run`)**
    - The existing API will be leveraged to handle session creation, call the Opal service for recommendations, and record the outcomes in Supabase.
    - The API will also be responsible for debiting credits from the user's account upon a successful recommendation.

2.  **User Interface Overhaul**
    - **Preference Snapshot:** A card will be displayed to the user summarizing their preferences before initiating a recommendation run.
    - **Recommendation Display:** A new screen will be implemented to present the recommendation with a strict, structured layout. This will include:
        - **Fit Confidence Score:** A metric indicating the confidence level of the recommendation.
        - **Conditional Risk Note:** A note that appears if the fit confidence is below a certain threshold.
    - **Feedback Mechanism:**
        - Users will be able to provide feedback on recommendations using "Accept" (✅) and "Reject" (❌) buttons.
        - A negative feedback loop will be implemented to capture reasons for rejection and trigger a revision flow.

3.  **Error Handling and Monetization**
    - The application will gracefully handle "insufficient credits" errors.
    - When a user runs out of credits, a paywall modal will be displayed, prompting them to upgrade their plan.

4.  **Testing and Validation**
    - Once implemented, the end-to-end flow will be tested to ensure all components work together as expected.
