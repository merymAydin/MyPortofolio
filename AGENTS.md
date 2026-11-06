# The Forgotten Archives — Project Development Instructions

## Purpose
This file contains persistent development instructions for The Forgotten Archives project. It serves as a quick reference for developers joining the project and ensures consistency across implementations.

## Core Directives

### 1. Visual Direction
- **Do not redesign the visual identity.** The color palette, typography, and aesthetic are already decided.
- **Color palette** (use these exact values):
  - Charcoal: `#171714`
  - Dark wood: `#30251D`
  - Leather brown: `#765A3B`
  - Antique gold: `#B49A6B`
  - Parchment: `#D9CCAD`
- **Typography** (use these exact fonts):
  - Headings: Cinzel
  - Editorial text: Cormorant Garamond
  - Technical details: IBM Plex Mono
- **Aesthetic**: Dark Academia + Medieval Fantasy + Victorian Detective Mystery
- **Avoid**: Cartoonish graphics, generic fantasy-game aesthetics, modern dashboard interfaces

### 2. Main Interface
- The main screen is an antique Victorian detective study.
- Components:
  - Dark gothic library in background
  - Large antique wooden desk in foreground
  - Open central book as primary navigation
  - Magnifying glass
  - Small glass vial with revealing solution
  - Vintage typewriter
- The open book contains 5 sections (navigation):
  1. The Author — About Me
  2. The Laboratory — Technical Skills
  3. Case Files — Projects
  4. The Chronicles — Education and Experience
  5. Correspondence — Contact and CV
- The typewriter provides an alternative shortcut to Correspondence

### 3. Signature Interaction: Invisible Ink
- **Core feature.** A glass vial containing revealing solution is dragged over parchment.
- As the liquid moves across the parchment, previously invisible writing becomes visible.
- **Technical approach**:
  - React Pointer Events
  - Native HTML Canvas API
  - Radial reveal masks
  - Canvas compositing
  - Persistent reveal areas
  - HTML content as the accessible source of truth
- A magnifying glass provides an additional way to inspect revealed content.
- This is a visual metaphor for detecting invisible ink, not a magical potion system.

### 4. Case Files System
- Projects appear as vintage detective investigation dossiers, not ordinary portfolio cards.
- Each preview contains:
  - Case number
  - Case status
  - Project title
  - Description
  - Investigation details
  - Technologies
  - Evidence collected
  - "Explore Investigation" action
- Each project has an independent detail route.
- **Detail page sections**:
  1. The Mystery
  2. The Investigation
  3. The Evidence
  4. The Solution
  5. Source Code / Live Demo
- **Evidence supports**:
  - Architecture diagrams
  - ER diagrams
  - Screenshots
  - API documentation
  - Code snippets
  - Technical documentation
- Project data must be separate from presentation logic.
- Use reusable React components and JavaScript.
- **Never invent** project achievements, technologies, metrics or results.

### 5. Correspondence — Typewriter
- The contact experience uses a vintage mechanical typewriter.
- **Requirements**:
  - Actual functional form
  - Name and email fields
  - Message input
  - Validation
  - Submission feedback
  - Accessible keyboard interaction
  - Optional mechanical typing sounds
  - Real email delivery will be implemented when backend strategy is established
- **Do not use** a fountain pen or ink-writing contact form.

### 6. Technology Stack
- **Current foundation**: React 19, JavaScript (ES6+), JSX, Vite 8
- **Planned**:
  - React Router DOM 7 for routing
  - Native Canvas API for invisible ink
  - CSS for styling and responsive layouts
  - Animation library only when justified
  - Vitest for unit testing
  - Playwright for end-to-end testing
- **Do not introduce**: Redux, microservices, databases, authentication or backend infrastructure without a genuine requirement.

### 7. Engineering Principles (mandatory)
1. Do not write the entire application.
2. Do not implement features without an assigned task.
3. Do not overwrite existing files without inspecting them first.
4. Do not install dependencies without explaining why.
5. Prefer simple, maintainable architecture.
6. Use strict JavaScript typing where beneficial (JSDoc).
7. Separate business logic from presentation.
8. Build reusable components where appropriate.
9. Consider accessibility and responsive behavior.
10. Optimize animations and Canvas rendering.
11. Explain important technical decisions.
12. Never fabricate project information.

### 8. Project Structure
- `AGENTS.md` — persistent project development instructions (this file)
- `docs/ARCHITECTURE.md` — system architecture
- `docs/TECHNICAL_DECISIONS.md` — technology decisions and reasoning
- `src/` — application source code
  - Components organized by feature/domain (`.jsx` files)
  - JavaScript data definitions with JSDoc documentation
  - Canvas rendering logic for invisible ink
  - Routing configuration with React Router DOM 7
  - CSS styles matching the Dark Academia aesthetic
- `public/` — static assets

### 9. Development Workflow
- Use `npm run dev` to start development server
- Use `npm run build` to build for production
- Use `npm run lint` to lint code (oxlint)
- Use `npm run preview` to preview the build
- Write Vitest tests for unit testing (JavaScript mode)
- Write Playwright tests for end-to-end testing

### 10. Accessibility Requirements
- All interactive elements must be keyboard accessible.
- Color contrast must meet WCAG AA standards.
- The invisible ink interaction must have an alternative text-based mode of access.
- Form elements in the typewriter correspondence section must have proper labels and error handling.

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```