# Lighthub.ed

Lighthub.ed is a frontend prototype built with Next.js that presents an AI-powered study and revision experience.

## What this repo contains

- A course dashboard for study spaces
- A course workspace page with an AI chat interface placeholder
- A curriculum gap detector page
- A panic mode page for last-minute revision support
- UI-only functionality: the current app is a visual prototype with mocked interactions

## What is implemented

- page navigation between dashboard, course workspace, gap detector, and panic mode
- branded Lighthub.ed text headers throughout the app
- mocked course data, flashcards, and revision flow
- a client-side login page that routes to the dashboard

## What is still missing

- backend services and API routes
- document upload, parsing, and vector indexing
- real AI/chat integration
- user authentication and persistent storage
- production deployment configuration beyond the Next.js prototype

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

This project is currently focused on frontend UX. It is not yet a fully working product, but it does provide the current page structure and navigation flow for the intended Lighthub.ed study assistant.
