# The Forgotten Archives — Technical Decisions and Reasoning

## 1. Technology Stack Decisions

### 1.1 React 19 + JavaScript (ES6+)
- **Decision**: Use React 19 with plain JavaScript (ES6+) for the foundation.
- **Reasoning**: The project foundation already includes React 19.3.1 and React DOM 19.3.1. Using React 19 with JavaScript ensures access to latest features and security fixes without the complexity of TypeScript configuration. The `@vitejs/plugin-react` works well with React 19's JSX transformation.
- **Alternatives considered**: React 18 with TypeScript — rejected per the updated technology decision to use JavaScript.

### 1.2 Vite 8
- **Decision**: Use Vite as the build tool and dev server.
- **Reasoning**: Already configured in vite.config.js. Vite provides fast HMR (Hot Module Replacement) which is essential for canvas-based development where frequent redraws occur. The config already uses @vitejs/plugin-react, which works well with React 19.
- **Alternatives considered**: Create React App — rejected (deprecated, no longer maintained). Next.js — rejected (overkill for SPA, would add unnecessary complexity).

### 1.3 React Router DOM 7
- **Decision**: Use react-router-dom v7 for routing.
- **Reasoning**: Already installed in package.json (^7.18.5). React Router DOM 7 provides routing, data loading (via route loaders), and a file-based routing approach that fits the SPA structure. Enables deep linking for the book sections and case detail pages.
- **Note**: This is react-router-dom v7, not the new React Router v7 API with `createBrowserRouter`. The existing API surface (BrowserRouter, Route, NavLink) is used. If the new React Router v7 routing APIs are desired, they can be evaluated in a future phase.
- **Alternatives**: Wouter — rejected (smaller ecosystem, less official support). TanStack Router — rejected (learning curve, additional dependencies).

### 1.4 Vitest for Unit Testing
- **Decision**: Use Vitest for unit testing.
- **Reasoning**: Listed in the established technology stack. Vitest works well with Vite, shares the same config, and provides fast test execution. Supports JavaScript out of the box.
- **Alternatives**: Jest — would require additional configuration to work with Vite. Testing Library — would need to be added as a dependency, but @testing-library/react should be available.

### 1.5 Playwright for E2E Testing
- **Decision**: Use Playwright for end-to-end testing.
- **Reasoning**: Listed in the established technology stack. Playwright provides comprehensive browser testing across multiple browsers, handles file uploads and canvas interactions well, and integrates with Vite.
- **Alternatives**: Cypress — good but not listed in the stack; Playwright was chosen per project requirements.

### 1.6 oxlint for Linting
- **Decision**: Use oxlint as the linter.
- **Reasoning**: Already configured in .oxlintrc.json with react and oxc plugins. Oxlint is faster than ESLint and has modern rulesets. The existing config includes react/rules-of-hooks and react/only-export-components.
- **Alternatives**: ESLint — would require migration; oxlint was already set up.

## 2. Architecture Decisions

### 2.1 Separation of Data from Presentation
- **Decision**: Project data (case files) must be separate from presentation logic.
- **Implementation**: Project definitions live in `src/data/projects.js` as JavaScript objects with JSDoc documentation. Components receive project data as props and render based on that data.
- **Reasoning**: Enables easy data updates without touching component code, facilitates testing, and ensures multiple components can consume the same data. Prevents duplication and inconsistencies.
- **Violation warning**: Never fabricate project achievements, technologies, metrics or results. Use only real project information.

### 2.2 Canvas and HTML Source of Truth
- **Decision**: For the invisible ink feature, HTML content serves as the accessible source of truth, with canvas used for the visual reveal effect.
- **Implementation**: 
  - Invisible ink text/content exists as regular HTML inside a container div (source of truth for screen readers, selectable text, etc.)
  - Canvas element sits on top with a radial mask that follows the pointer
  - The canvas reveals portions of the underlying HTML through compositing (`source-in` operation)
  - When the user releases the vial, persistent reveal areas remain visible
  - Magnifying glass zooms into a region of the canvas, but the underlying HTML remains accessible
- **Reasoning**: Balances the visual interactive experience with accessibility requirements. Screen readers can read the full text even when it's "invisible." Selectable text works. The visual effect is a progressive reveal, not a replacement of content.
- **Alternative considered**: Fully canvas-rendered text — rejected (poor accessibility, no selectable text, issues with different screen sizes).

### 2.3 React Router DOM 7 over Hash Routers
- **Decision**: Use browser-based routing (`BrowserRouter` from react-router-dom) rather than hash-based routing.
- **Reasoning**: Cleaner URLs (/case-files/:id vs /case-files/#:id), more intuitive navigation experience matching a physical book's pages.
- **Fallback**: If needed, add `basename` for deployment on paths without server configuration.

### 2.4 Component Composition over Inheritance
- **Decision**: Use React component composition patterns rather than class inheritance.
- **Implementation**: 
  - Generic UI components (Button, Input) composed within specific page components
  - Book pages composed from section components
  - Typewriter components composed from smaller units (carriage, roll, message form)
- **Reasoning**: More flexible, easier to test, aligns with React best practices.

### 2.5 CSS Custom Properties for Theming
- **Decision**: Use CSS custom properties (variables) for the color palette and typography.
- **Implementation**: Define variables in `:root`. The archive is a single dark theme (`color-scheme: dark`); no light variant is planned for the current identity.
- **Reasoning**: Enables consistent theming across the application, and values match the specified palette exactly. Makes it easy to adjust the entire aesthetic by changing variable values.
- **Current state**: `src/styles/tokens.css` is the single source of truth for colour, typography, spacing, borders, radii, shadows, motion, and layout tokens.

### 2.6 Mobile-First Responsive Design
- **Decision**: Design mobile-first, with breakpoint at 768px.
- **Implementation**: 
  - Below 768px: book spread stacks vertically, typewriter full-width, canvas interactions limited
  - Above 768px: two-page spread, desk area shows more detail
- **Reasoning**: Most users will access the portfolio on various devices. Mobile-first ensures core content is accessible on small screens. Canvas interactions may be simplified or disabled on touch devices without pointer devices.

## 3. Feature Implementation Decisions

### 3.1 Invisible Ink — Pointer Events + Canvas
- **Decision**: Use React Pointer Events (onPointerMove, onPointerDown, onPointerUp) on a canvas overlay.
- **Technical approach**:
  1. Create a canvas element positioned over the parchment area
  2. Render the invisible ink content to an off-screen canvas (source of truth render)
  3. On pointer move, draw a radial gradient mask at pointer position
  4. Composite the main canvas with `destination-out` or `source-in` to reveal content
  5. Track persistent reveal areas in a Set; never fully erase
  6. Optionally render a magnifying glass following the pointer with zoomed canvas content
- **Performance**: Throttle pointer move to 60fps max. Use `requestAnimationFrame` for the render loop. Clear and redraw only the mask region.
- **Accessibility**: 
  - Full HTML text remains visible to screen readers even when "invisible"
  - Add a "Reveal All" button for keyboard-only users
  - Provide instructions: "Drag the vial across the parchment to reveal text"
  - Ensure color contrast meets WCAG AA for the mask boundary

### 3.2 Typewriter — Functional Form
- **Decision**: Build an actual functional typewriter interface with a form, not a decorative element.
- **Technical approach**:
  1. Typewriter "carriage" component that moves as text is typed
  2. Typebars animate into view for each keystroke
  3. Roll advances (simulates typewriter paper scrolling)
  4. Underlying form has Name, Email, and Message fields
  5. Validation on submit (required fields, email format)
  6. Submission feedback (success/error state)
  7. Optional: Mechanical typing sound on keypress (howl/audio element, optional per user preference)
- **Reasoning**: Per the specification, the correspondence must use a typewriter interface with actual functional form fields. Not a fountain pen or ink-writing form.
- **Accessibility**: 
  - Label elements associated with each input
  - Keyboard navigable Tab order
  - ARIA status for validation live regions
  - Skip instructions for screen readers

### 3.3 Project Dossiers — Not Portfolio Cards
- **Decision**: Projects appear as vintage detective investigation dossiers, not ordinary portfolio cards.
- **Implementation details**:
  - Each project preview includes: case number, case status, title, description, investigation details, technologies, evidence collected, "Explore Investigation" action
  - Visual style: aged paper texture, parchment-like borders, vintage typography, handwritten-style case numbers
  - "Evidence" section supports expandable sections for architecture diagrams, ER diagrams, screenshots, etc.
  - Individual detail page with sections: The Mystery, The Investigation, The Evidence, The Solution, Source Code / Live Demo
- **Data structure** (example documented with JSDoc):
  ```javascript
  /**
   * A project case file for The Forgotten Archives.
   * @typedef {Object} ProjectCase
   * @property {string} caseNumber - The case number (e.g., "CASE-001")
   * @property {'open' | 'solved' | 'archived'} status - The current case status
   * @property {string} title - The project title
   * @property {string} description - A brief description of the project
   * @property {string} investigation - Details of the investigation
   * @property {string[]} technologies - Technologies used in the project
   * @property {EvidenceItem[]} evidence - Collected evidence items
   * @property {{ label: string, url: string }} link - Action links (Explore, Source Code, Live Demo)
   */
  ```
- **Reasoning**: Per the specification, this is a core differentiator from a generic portfolio. The detective theme is integral to the project's visual identity.

### 3.4 Navigation — Book as Primary Mechanism
- **Decision**: The open book is the primary navigation mechanism between sections.
- **Implementation**:
  - Book spread covers the central area
  - Each page of the open book corresponds to a section
  - Clicking on a page section navigates to the corresponding route
  - Typewriter icon provides shortcut to Correspondence route
- **Reasoning**: Per the specification, "The book is the primary navigation mechanism." This creates the immersive experience of exploring a detective's archives.

## 4. Styling Decisions

### 4.1 Palette Variables Over Hardcoded Values
- **Decision**: All colors from the specified palette use CSS custom properties.
- **Mapping**:
  - `--charcoal: #171714` — background, dark elements
  - `--dark-wood: #30251D` — desk, structural elements
  - `--leather-brown: #765A3B` — leather accents, buttons
  - `--antique-gold: #B49A6B` — highlights, accents, links
  - `--parchment: #D9CCAD` — paper backgrounds, card backgrounds
- **Reasoning**: Enables consistent theming, easy dark mode adaptation, and ensures the exact specified colors are used throughout.

### 4.2 Font Loading Strategy
- **Decision**: Load Cinzel, Cormorant Garamond, and IBM Plex Mono from Google Fonts via a stylesheet link in `index.html`, with `preconnect` hints and `display=swap`.
- **Weights loaded**: Cinzel 400/600; Cormorant Garamond 400/600 plus italic 400; IBM Plex Mono 400/500. No unused weights are requested.
- **Fallback strategy**: Local serif and monospace fallbacks are declared in the token font stacks, so the layout remains readable if the network request fails.
- **Reasoning**: This is a reliable, dependency-free strategy that keeps the build self-contained and avoids shipping font binaries during the design-foundation phase. Self-hosted `@font-face` files can replace the CDN link later without changing component code, because all families are referenced through tokens.

### 4.3 Responsive Breakpoints
- **Decision**: Single breakpoint at 768px (tablet/mobile transition).
- **Implementation**: 
  - Mobile-first: single-column layout
  - At 768px: two-column (book spread)
  - No complex media queries beyond this breakpoint
- **Reasoning**: Simplifies the CSS, reduces maintenance burden, covers the majority of use cases.

## 5. Data Decisions

### 5.1 Project Data Separation
- **Decision**: Project data in `src/data/projects.js`, not hardcoded in components.
- **Reasoning**: 
  - Easy to update projects without touching component code
  - Can be imported by multiple components (list view, detail view)
  - Facilitates testing with static data
  - Per spec: "Project data must be separate from presentation logic"
- **Content**: Must use real project information; never fabricate achievements, technologies, metrics or results.

### 5.2 Evidence Data Structure
- **Decision**: Evidence items have a defined structure but support multiple media types.
- **Structure** (documented with JSDoc):
  ```javascript
  /**
   * An evidence item for a project case file.
   * @typedef {Object} EvidenceItem
   * @property {'architecture' | 'erd' | 'screenshot' | 'api' | 'code' | 'documentation'} type - The type of evidence
   * @property {string} title - The evidence title/description
   * @property {string} [url] - External link (optional, for documentation/screenshots)
   * @property {string} [caption] - Caption for the evidence (optional)
   * @property {string} [code] - Code snippet (optional, for code evidence type)
   * @property {string} [language] - Programming language of code snippet (optional)
   */
  ```
- **Reasoning**: Supports the detail page requirements (architecture diagrams, ER diagrams, screenshots, API docs, code snippets, technical documentation) while keeping data structured.

## 6. Accessibility Decisions

### 6.1 Invisible Ink Accessibility
- **Decision**: HTML is the accessible source of truth; canvas is the visual effect layer.
- **Details**:
  - The ink text content exists as regular HTML in the DOM
  - Screen readers read the full text content regardless of canvas state
  - Text is selectable even when "invisible" (before drag starts)
  - A "Reveal All" button appears for keyboard-only users
  - The vial drag is an enhancement, not the only way to access content
- **WCAG compliance**: 
  - Ensure the mask boundary has sufficient contrast
  - Text remains readable when revealed
  - Focus management for "Reveal All" button

### 6.2 Form Accessibility
- **Decision**: All typewriter form fields have proper labels and error handling.
- **Details**:
  - `<label>` elements associated with `<input>` fields
  - `aria-invalid` and `aria-describe-text` for validation errors
  - Live region (`role="status"`) for submission feedback
  - Focus-visible styles on all interactive elements
  - Keyboard-navigable Tab order: Name → Email → Message → Send

### 6.3 Focus and Motion
- **Decision**: 
  - Reduced motion support (`prefers-reduced-motion`) — disable canvas animations for users who prefer reduced motion
  - Focus-visible outlines on all interactive elements
  - Skip link at the top of the page for keyboard navigation
- **Reasoning**: Inclusive design; some users experience motion sickness from canvas animations.

## 7. Performance Decisions

### 7.1 Canvas Rendering Optimization
- **Decision**: Optimize canvas redraws for the invisible ink feature.
- **Techniques**:
  - Only redraw the mask region, not the entire canvas
  - Use `clearRect` sparingly; track persistent reveal areas
  - Throttle pointer move events
  - Use `requestAnimationFrame` loop instead of setInterval
  - Pre-render static elements (parchment texture, background) once
- **Target**: Maintain 60fps during ink dragging on typical desktop devices.

### 7.2 Code Splitting
- **Decision**: Code-split route-based components.
- **Implementation**: 
  - React Router DOM 7 dynamic imports (using lazy loading)
  - Each section (author, lab, cases, chronicles, correspondence) loaded on demand
  - Reduces initial bundle size
- **Reasoning**: The application has distinct sections that don't all need to be loaded simultaneously. A user visiting only the "About Me" section shouldn't load the case files data.

### 7.3 Asset Optimization
- **Decision**: Use WebP or optimized formats for images.
- **Reasoning**: The hero image and other images should be optimized. Vite's default image handling can be configured for this.
- **Current assets**: hero.png, react.svg, vite.svg — these will be replaced or optimized as part of the visual direction implementation.

## 8. Future Considerations

### 8.1 TypeScript Evaluation
- **Note**: The project can evaluate adding TypeScript later if the team desires type safety. The current JavaScript foundation is functional and the project builds successfully with Vite. If TypeScript is added in the future, a migration plan would involve:
  - Installing `typescript` and `@types/react`, `@types/react-dom`
  - Generating `tsconfig.json`
  - Converting `.jsx` files to `.tsx`
  - Updating build and lint configurations
- **Current stance**: TypeScript is not required per the updated technology decisions.

### 8.2 Backend for Correspondence
- **Note**: "Real email delivery will be implemented when the backend strategy is established." Per the specification, do not implement backend infrastructure without a genuine requirement. The form should provide feedback but not necessarily send real email initially.

### 8.3 Animation Library
- **Note**: "Animation library only when justified." The current decisions rely on CSS transitions and native Canvas animation. If complex keyframe animations are needed, consider Framer Motion only after evaluating CSS sufficiency.

### 8.4 Database/Auth
- **Note**: "Do not introduce Redux, microservices, databases, authentication or backend infrastructure without a genuine requirement." This remains in effect. The correspondence form may have local state only; no user accounts or persistent storage is planned per the current specification.