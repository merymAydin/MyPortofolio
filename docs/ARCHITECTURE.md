# The Forgotten Archives — System Architecture

## 1. Overview
The Forgotten Archives is a single-page application (SPA) that presents an immersive Victorian detective study interface. The application navigates between different sections via an open book interface and a typewriter-based correspondence system.

## 2. Folder Structure

```
src/
  assets/           # Static images and fonts
  components/       # Reusable React components
    ui/             # Generic UI elements (buttons, inputs, etc.)
    book/           # Book-related components (pages, covers, navigation)
    typewriter/     # Typewriter interface components
    ink/            # Invisible ink canvas components
    projects/       # Project dossier and detail page components
  hooks/            # Custom React hooks (useInkReveal, useTypewriter, etc.)
  data/             # Project data definitions with JSDoc documentation
  lib/              # Utility functions and constants
  router/           # React Router configuration
  styles/           # CSS/Sass files organized by feature
  types/            # JSDoc type definitions (optional, for editor assistance)
  App.jsx           # Main application component
  main.jsx          # Application entry point
```

## 3. Routing Architecture (React Router DOM 7)

### 3.1 Route Map

| Route           | Component          | Description                    |
|-----------------|--------------------|--------------------------------|
| `/`             | TheAuthorPage      | "The Author" — About Me section |
| `/laboratory`   | TheLabPage         | "The Laboratory" — Skills       |
| `/case-files`   | TheCasesPage       | "Case Files" — Project listings |
| `/case-files/:id` | CaseDetailPage   | Individual project detail route |
| `/chronicles`   | TheChroniclesPage  | "The Chronicles" — Education/experience |
| `/correspondence` | TypewriterPage   | Contact form via typewriter    |

### 3.2 Route Configuration
- Use `createBrowserRouter` from react-router-dom v7
- Define all routes in a centralized `router/index.js`
- Use `ErrorBoundary` for graceful error handling
- Implement data loading for case detail routes

### 3.3 Navigation Flow
- Primary navigation: Open book interface (clicking on book sections)
- Secondary navigation: Typewriter shortcut (clicking typewriter icon)
- Deep linking supported via route parameters

## 4. Component Hierarchy

### 4.1 Book Interface (Primary Navigation)
```
<BookComponent>
  <BookCover>
  <OpenSpread>
    <BookPage section="author">       -> navigates to / or /author
    <BookPage section="laboratory">   -> navigates to /laboratory
    <BookPage section="case-files">   -> navigates to /case-files
    <BookPage section="chronicles">   -> navigates to /chronicles
    <BookPage section="correspondence"> -> navigates to /correspondence
  </OpenSpread>
  <MagnifyingGlass>
  <InkVial>
</BookComponent>
```

### 4.2 Typewriter Interface
```
<TypewriterComponent>
  <TypewriterBody>
    <TypewriterCarriage>
      <TypewriterRoll>
        <Typebar line="..." />
      </TypewriterRoll>
    </TypewriterCarriage>
    <MessageForm>
      <NameField>
      <EmailField>
      <MessageTextarea>
      <SendButton>
</TypewriterComponent>
```

### 4.3 Invisible Ink Canvas
```
<InkCanvas>
  <ParchmentBackground>
  <InvisibleInkContent>      # HTML content rendered as source of truth
  <RevealMask>               # Radial gradient mask following pointer
  <RevealedContent>          # Portion of content visible through mask
  <MagnifyingGlassOverlay>
</InkCanvas>
```

## 5. Data Flow

### 5.1 Project Data (Case Files)
- Project data definitions live in `src/data/projects.js` with JSDoc documentation
- Each project has: case number, status, title, description, investigation details, technologies, evidence
- Data is separate from presentation — components receive project data as props
- **Never fabricate project achievements, technologies, metrics or results**

### 5.2 State Management
- Minimal state management; use React useState/useLocalStorage where appropriate
- Canvas reveal state managed per-project or globally
- Form state managed within Typewriter component
- URL routing serves as primary navigation state

### 5.3 Event Flow
1. User interacts with book interface → route changes
2. User drags ink vial over parchment → canvas mousemove/pointermove updates reveal mask
3. User types on typewriter → form state updates
4. User submits typewriter form → validation → submission feedback

## 6. Styling Architecture

### 6.1 CSS Organization
- `styles/tokens.css` — colour, typography, spacing, border, shadow, motion and layout tokens
- `styles/global.css` — reset, base element styles, accessibility defaults
- `styles/components/` — component-specific styles, imported by their components
- Use CSS custom properties for the colour palette:
  - `--color-charcoal: #171714`
  - `--color-dark-wood: #30251D`
  - `--color-leather-brown: #765A3B`
  - `--color-antique-gold: #B49A6B`
  - `--color-parchment: #D9CCAD`
- Additional neutrals exist only for contrast: `--color-ash` (muted text on dark) and `--color-ink` (deep text on parchment). Leather brown is never used for small text.
- Use CSS custom properties for typography:
  - `--font-heading: 'Cinzel', serif`
  - `--font-body: 'Cormorant Garamond', serif`
  - `--font-mono: 'IBM Plex Mono', monospace`
- BEM-like naming convention for component classes
- Plain global CSS imported by components; no CSS-in-JS and no UI framework

### 6.2 Responsive Behavior
- Mobile-first with breakpoints at 40rem (640px), 48rem (768px) and 64rem (1024px)
- Below 640px: header stacks vertically and navigation wraps
- 640–1024px: single-column content with reduced gutters
- Above 1024px: desktop gutters and full content width
- Book spread and canvas interaction rules will be defined with those features

### 6.3 Dark Mode
- Prefers-color-scheme media query support
- Dark mode colors align with the Victorian detective aesthetic
- No harsh contrasts; maintain warm, aged appearance

## 7. Canvas Architecture (Invisible Ink)

### 7.1 Rendering Pipeline
1. Parchment background image or pattern rendered to canvas
2. Invisible ink content HTML rendered to canvas (as source of truth)
3. Radial mask follows pointer position (from pointer events)
4. Canvas compositing: `source-in` mask reveals content under mask
5. Persistent reveal areas remain visible after pointer passes
6. Magnifying glass overlay renders a zoomed region of the canvas

### 7.2 Canvas Sizing
- Canvas matches the parchment area dimensions
- Retina display support via `devicePixelRatio` scaling
- Off-screen canvas for off-screen render optimizations

### 7.3 Performance Considerations
- Clear and redraw only when pointer moves
- Throttle pointer move events (max 60fps)
- Use `requestAnimationFrame` for animation loops
- Pre-render static elements to off-screen canvas
- Limit persistent reveal area count to avoid memory issues

## 8. Accessibility Architecture

### 8.1 Invisible Ink Accessibility
- HTML content remains the accessible source of truth
- Screen readers read the full text content (invisible initially)
- Keyboard users can tab to a "Reveal All" button alternative
- Color-independent instructions ("Drag the vial across the parchment to reveal text")

### 8.2 Typewriter Form Accessibility
- All form fields have associated `<label>` elements
- Keyboard navigable: Tab order follows logical flow
- Validation errors announced to screen readers
- Submit button has descriptive accessible name

### 8.3 General
- Focus-visible styles on all interactive elements
- `aria-label` or `aria-labelledby` on custom components
- `role="status"` for live region validation feedback
- Skip navigation link for keyboard users

## 9. Testing Architecture

### 9.1 Unit Testing (Vitest)
- Component unit tests in `__tests__/` directories
- Hook tests for useInkReveal, useTypewriter
- JSDoc type tests for project data
- Canvas rendering logic tests

### 9.2 End-to-End Testing (Playwright)
- Navigation between all routes
- Book section clicking navigates correctly
- Typewriter form submission (valid and invalid)
- Invisible ink interaction accessibility tree verification
- Responsive breakpoint behavior

### 9.2 Linting
- Oxlint with React rules
- JavaScript syntax validation
- Custom rules for palette variable usage

## 10. Development Phases

### Phase 1: Foundation
- [ ] Set up Vite configuration
- [ ] Configure React Router with all routes
- [ ] Create global styles with color palette
- [ ] Implement basic layout (book, desk, background)

### Phase 2: Core Components
- [ ] Book component with spread navigation
- [ ] Typewriter component with form
- [ ] Invisible ink canvas component
- [ ] Project data definitions with JSDoc

### Phase 3: Integration
- [ ] Wire book navigation to routes
- [ ] Connect project data to dossier components
- [ ] Implement magnifying glass interaction
- [ ] Add accessibility features

### Phase 4: Polish
- [ ] Animation refinements
- [ ] Responsive behavior across breakpoints
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Test suite implementation