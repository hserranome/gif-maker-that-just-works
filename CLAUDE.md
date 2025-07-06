# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Start development server at http://localhost:5173/
- `pnpm build` - Build for production with static HTML prerendering
- `pnpm preview` - Preview production build at http://localhost:4173/
- `pnpm install` - Install dependencies (uses pnpm, not npm)
- `npx eslint src/` - Run ESLint on source files

## Architecture

This is a Preact application built with Vite, configured for static site generation through prerendering.

### Key Technologies
- **Preact**: React-compatible library with smaller bundle size
- **Vite**: Build tool and dev server
- **preact-iso**: Routing and SSR/prerendering capabilities
- **TypeScript**: Type checking with JSX support

### Application Structure
- **Entry Point**: `src/index.tsx` - Contains the main `App` component with routing setup
- **Routing**: Uses `preact-iso` for client-side routing with prerendering support
- **Components**: Located in `src/components/` with TypeScript JSX files
- **Pages**: Located in `src/pages/` following a directory-based structure

### Build Configuration
- **Vite Config**: Prerendering enabled with `/404` fallback route
- **TypeScript**: Configured for Preact with React compatibility aliases
- **ESLint**: Uses `preact` config preset

### Prerendering
The app uses static site generation - all routes are prerendered to HTML at build time. The `prerender` function in `src/index.tsx` handles SSR for static generation.