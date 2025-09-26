# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Notion clone built with Next.js 14, React 18, TypeScript, and Convex for real-time collaboration. It features document management, rich text editing, file uploads, and subscription handling.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start Convex backend (required for database)
npx convex dev

# Start Next.js development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Testing
No test framework is currently configured. Consider implementing tests if adding new features.

## High-Level Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Convex (real-time database), Clerk (auth), Stripe (payments), EdgeStore (file storage)
- **Editor**: BlockNote for rich text editing

### Key Directory Structure
- `/app/(home)/` - Public landing pages
- `/app/(secret)/` - Authenticated routes (documents, settings)
- `/app/api/` - API routes for Stripe webhooks and EdgeStore
- `/convex/` - Convex backend functions and schema
- `/components/ui/` - Shadcn UI components
- `/components/modals/` - Modal components (settings, search, etc.)

### Core Features & Implementation
1. **Document Management**: Hierarchical documents with parent-child relationships stored in Convex
2. **Real-time Sync**: All document updates use Convex's real-time subscriptions
3. **Authentication**: Clerk integration with Convex for user management
4. **File Uploads**: EdgeStore handles image uploads for document covers
5. **Subscription System**: Stripe integration for premium features

### Environment Variables Required
Create `.env.local` with:
- Clerk keys: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Convex: `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`
- EdgeStore: `EDGE_STORE_ACCESS_KEY`, `EDGE_STORE_SECRET_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_SECRET_KEY`
- Domain: `NEXT_PUBLIC_DOMAIN`

### Development Workflow
1. Always run `npx convex dev` before starting the Next.js dev server
2. Convex functions are in `/convex/` and auto-reload on changes
3. Use Convex Dashboard for debugging database queries
4. Check Stripe webhook events in Stripe Dashboard when testing payments

### Important Patterns
- All database operations go through Convex functions (no direct DB access)
- Use `useQuery` and `useMutation` hooks from Convex for data operations
- Authentication state is managed by Clerk and synced with Convex
- File uploads follow: Client → EdgeStore → Store URL in Convex
- Components use Shadcn UI patterns with Tailwind for styling