# Skills Reference Guide

> **LLM Context & Usage Guide**
> This document is the authoritative index for all `.agents/skills/` installed in this project. 
> - **How to use this directory (`spec/`)**: Before generating, reviewing, or refactoring code, always consult this file to determine which skills are active, their purpose, and their top priority rules.
> - **How to act on it**: Use the *Quick Index* below to map the user's intent to the appropriate skill, then load that skill into your context along with any listed under **Pairs With**.
> - **How to update**: When installing or updating a skill, strictly follow the `Unified Writing Format Template` documented below to maintain consistency.

## Quick Index
- [1- emil-design-eng](#1--emil-design-eng): Animation details, component polish, tactile interactions.
- [2- humanizer](#2--humanizer): Removes AI writing patterns for natural, human-like text.
- [3- make-interfaces-feel-better](#3--make-interfaces-feel-better): UI polish, layered shadows, concentric borders, optical alignment.
- [4- next-best-practices](#4--next-best-practices): Next.js app router, RSCs, fetching, file conventions.
- [5- radix-ui-design-system](#5--radix-ui-design-system): Accessible root primitives for custom UI component libraries.
- [6- react-useeffect](#6--react-useeffect): Advanced effect rules and when to aggressively avoid `useEffect`.
- [7- seo-audit](#7--seo-audit): SEO checklists, indexation tracking, page speed, schema markup.
- [8- shadcn](#8--shadcn): shadcn/ui CLI management, components, styling, and presets.
- [9- tailwind-design-system](#9--tailwind-design-system): Tailwind v4 architecture, OKLCH variables, dynamic tokens.
- [10- vercel-composition-patterns](#10--vercel-composition-patterns): React component composition strategies to prevent prop bloat.
- [11- vercel-react-best-practices](#11--vercel-react-best-practices): High-impact Next.js/React performance rules and bundle optimization.
- [12- next-intl-app-router](#12--next-intl-app-router): Configures and uses next-intl with prefix-based locale routing for App Router.

---

## Document Pattern
The skills follow a specific structure to indicate their depth and organization:
- **Only `SKILL.md`**: Means that it's the full content of the skill.
- **`SKILL.md` + `AGENTS.md`**: Means that `SKILL.md` is the summary, and `AGENTS.md` is the full content of the skill.
- **`SKILL.md` + folders (`examples`, `templates`, `references`, `evals`, `rules`, etc.)**: Means that `SKILL.md` is the full content of the skill and folders contain rules guided by `SKILL.md`.

## Unified Writing Format Template
When adding new skills or updating existing ones in this document, you MUST strictly follow this exact Markdown structure to maintain an opinionated and standardized writing style:

```markdown
### [Skill Number]- [skill-directory-name]
**Structure**: [e.g., Only `SKILL.md` | `SKILL.md` + `AGENTS.md` | `SKILL.md` + folders (`examples`, `rules`, etc.)]
**Triggers**: [comma-separated keyword tags, e.g., UI, React, SEO, optimization]
**Pairs With**: [related skill names, e.g., shacdn, react-useeffect]
**Summary**:
[1-2 sentence engaging summary of the core philosophy/purpose of the skill]
- [Bullet 1 summarizing key features or coverage]
- [Bullet 2 summarizing key techniques or patterns]
- [Bullet 3 summarizing practical application or edge cases]
- [Bullet 4 summarizing tooling or architectural impact]

**Top 5 Rules (By Priority)**:
1. [Highest impact, most critical rule for the skill]
2. [Second most critical rule]
3. [Third most critical rule]
4. [Fourth most critical rule]
5. [Fifth most critical rule]
```

---

## Skills

### 1- emil-design-eng
**Structure**: Only `SKILL.md`
**Triggers**: UI polish, animation, micro-interactions, cubic-bezier, component feel, design engineering
**Pairs With**: make-interfaces-feel-better, tailwind-design-system
**Summary**:
Craft-focused design philosophy for building interfaces where every detail compounds into something that feels right.
- Covers animation decision framework (frequency, purpose, easing, duration) with custom cubic-bezier curves and performance rules for UI interactions
- Includes component patterns: button press feedback, origin-aware popovers, tooltip delays, blur masking, and clip-path reveals
- Provides gesture and drag principles: momentum-based dismissal, boundary damping, and friction instead of hard stops
- Details CSS transform mastery, stagger animations, and accessibility considerations (prefers-reduced-motion, touch hover states)
- Emphasizes unseen details, taste as trained instinct, and cohesion across the entire experience

**Top 5 Rules (By Priority)**:
1. Scale-on-press should use exactly 0.96 scale down and a custom cubic bezier for easing.
2. Don't stop block/drag animations abruptly; use friction/damping for drag bounds and momentum scaling.
3. Use micro-delays for tooltips to prevent flashing when moving the mouse quickly across items.
4. Provide accessibility fallback (prefers-reduced-motion) for all animations and ensure hover shapes don't clash.
5. Use clip-path reveals over opacity fades for entering elements to make them feel more physical.

### 2- humanizer
**Structure**: `SKILL.md` + additional files (`README.md`)
**Triggers**: rewrite, edit text, marketing copy, tone adjustment, AI writing, sound human
**Pairs With**: seo-audit
**Summary**:
Detect and remove AI writing patterns to make text sound naturally human.
- Identifies 24 distinct AI-writing patterns including inflated symbolism, promotional language, vague attributions, em dash overuse, rule of three, AI vocabulary words, and superficial -ing analyses
- Rewrites problematic sections while preserving meaning, tone, and voice, with guidance on adding personality and specificity to avoid soulless writing
- Based on Wikipedia's comprehensive "Signs of AI writing" guide, covering both content patterns (undue emphasis, false ranges) and style patterns (copula avoidance, elegant variation, curly quotes)
- Includes concrete before/after examples for each pattern and a structured process for identifying and fixing AI-isms in any text

**Top 5 Rules (By Priority)**:
1. Remove inflated symbolism and promotional language.
2. Fix vague attributions (e.g. replacing "It is widely believed" with specific actors).
3. Avoid the "rule of three" repetition for adjectives.
4. Replace AI vocabulary words and complex conjunctive phrases with simpler language.
5. Avoid overuse of em dashes, elegant variation, and curly quotes.

### 3- make-interfaces-feel-better
**Structure**: `SKILL.md` + folders/md files (`animations.md`, `performance.md`, `surfaces.md`, `typography.md`)
**Triggers**: CSS, interface styling, shadows, border-radius, alignment, hover states
**Pairs With**: emil-design-eng, tailwind-design-system, shadcn
**Summary**:
Practical design engineering principles for polishing UI components and interactions.
- Covers 16 core techniques including concentric border radius, optical alignment, layered shadows, interruptible animations, and staggered enter/exit transitions
- Provides specific implementation details: scale-on-press uses exactly `0.96`, icon animations use defined opacity/scale/blur ranges, tabular numbers prevent layout shift, and hit areas require minimum 40×40px
- Includes a review checklist and common mistakes table to catch visual polish issues during code review
- Organized by category (typography, surfaces, animations, performance) with guidance on when to apply each principle

**Top 5 Rules (By Priority)**:
1. Use concentric border radius (Inner radius = Outer radius - Padding).
2. Apply optical alignment manually for icons and elements to visually center them, not just vertically center them.
3. Use layered shadows (3+ layers with varying blur/spread) instead of single hard shadows to create softer, realistic depth.
4. Ensure animations are interruptible and snapping; avoid long durations for micro-interactions.
5. Ensure interactive hit areas are at least 40x40px to improve touch accessibility without inflating the visual element.

### 4- next-best-practices
**Structure**: `SKILL.md` + multiple markdown files (rules/patterns)
**Triggers**: Next.js, app router, server components, RSC, page routing, fetching
**Pairs With**: vercel-react-best-practices, vercel-composition-patterns
**Summary**:
Comprehensive Next.js development guidelines covering file structure, RSC patterns, data fetching, optimization, and error handling.
- Covers 15+ topic areas including file conventions, route segments, RSC boundaries, async patterns, metadata generation, and image/font optimization
- Provides runtime selection guidance, directive usage, and error handling strategies with specific file conventions like `error.tsx` and `not-found.tsx`
- Includes data fetching patterns, route handler best practices, bundling considerations, and hydration error debugging
- Addresses advanced patterns such as parallel routes, intercepting routes, Suspense boundaries, and self-hosting with Docker

**Top 5 Rules (By Priority)**:
1. Default to React Server Components (RSC); only use `"use client"` as leaf nodes when interactivity or browser APIs are needed.
2. Parallelize data fetching promises with `Promise.all()` to avoid async waterfalls on the server.
3. Group related route segments with `(groups)` to organize UI logic without polluting URL paths.
4. Always wrap suspense boundaries physically close to the fetching component for progressive rendering.
5. Use `next/image` and `next/font` for automatic optimization and zero layout shifts.

### 5- radix-ui-design-system
**Structure**: `SKILL.md` + folders (`examples`, `templates`)
**Triggers**: Radix, unstyled primitives, a11y, ARIA, ui components, design system
**Pairs With**: shadcn, tailwind-design-system
**Summary**:
Radix UI provides unstyled, accessible components (primitives) that you can customize to match any design system. This skill guides you through building scalable component libraries with Radix UI, focusing on accessibility-first design, theming architecture, and composable patterns.
- Headless by design: Full styling control without fighting defaults
- Accessibility built-in: WAI-ARIA compliant, keyboard navigation, screen reader support
- Composable primitives: Build complex components from simple building blocks
- Framework agnostic: Works with React, but styles work anywhere

**Top 5 Rules (By Priority)**:
1. Always utilize the unstyled Radical primitives for components requiring WAI-ARIA compliance.
2. Use the `asChild` composition pattern to avoid wrapping arbitrary `<div>` nesting when passing props to your own components.
3. Compose complex logic using simple primitive abstractions rather than monolithic single elements.
4. Maintain accessibility by not overriding core keyboard handlers provided by the primitive unless strictly necessary.
5. Theme the design system dynamically utilizing CSS variables or Tailwind classes instead of inline styles.

### 6- react-useeffect
**Structure**: `SKILL.md` + extra md files (`alternatives.md`, `anti-patterns.md`, `README.md`)
**Triggers**: React, useEffect, hooks, syncing, API fetching, lifecycle
**Pairs With**: vercel-react-best-practices, vercel-composition-patterns
**Summary**:
React useEffect best practices guide covering when to use Effects and superior alternatives.
- Teaches the escape-hatch nature of Effects: use only for synchronizing with external systems, not for derived state, expensive calculations, or user event responses
- Provides a decision tree and quick-reference table mapping common situations (data fetching, state derivation, prop changes) to the correct React pattern
- Covers when NOT to use Effects: transforming data for render, handling user events, deriving state, and chaining state updates
- Recommends alternatives including direct calculation during render, useMemo for expensive computations, key prop for state reset, and useSyncExternalStore for subscriptions

**Top 5 Rules (By Priority)**:
1. Do not use an Effect to synchronize or derive state that can be calculated directly during rendering.
2. Handle user events (click, submit) within specific event handlers, not inside Effects.
3. Do not use Effects to chain state updates (e.g., if A changes, update B, then C).
4. Use the `key` prop on components to completely reset their state when necessary, avoiding complex Effect synchronization.
5. Use `useEffect` solely as an escape hatch to synchronize the React component with external systems (APIs, integrations, DOM).

### 7- seo-audit
**Structure**: `SKILL.md` + folders (`evals`, `references`)
**Triggers**: SEO, search ranking, core web vitals, meta tags, schema markup, crawlability
**Pairs With**: humanizer, next-best-practices
**Summary**:
Comprehensive SEO auditing framework covering crawlability, indexation, speed, on-page optimization, and content quality.
- Guides systematic assessment across five priority areas: crawlability and indexation, technical foundations, on-page optimization, content quality, and authority signals
- Includes detailed checklists for title tags, meta descriptions, heading structure, internal linking, image optimization, and keyword targeting
- Provides site-type-specific guidance for SaaS, e-commerce, content, and local business sites
- Emphasizes schema markup validation via browser tools or Google Rich Results Test, not static HTML inspection, to avoid false negatives from JavaScript-injected structured data
- Delivers findings in prioritized action plans with impact levels and specific remediation steps

**Top 5 Rules (By Priority)**:
1. Check crawlability and indexation first by validating `robots.txt`, sitemaps, and strict `noindex` rules.
2. Maintain strong foundational markup: a single semantic `<h1>` tag with descriptive subheadings structured correctly.
3. Validate Javascript-injected structured data via the Rich Results tool, avoiding static DOM checks.
4. Include concise, unique title tags and compelling meta descriptions on every page.
5. Optimize all imagery and ensure clean internal linking to secure high Core Web Vitals (LCP, CLS, FID).

### 8- shadcn
**Structure**: `SKILL.md` + folders/md files (`agents`, `assets`, `evals`, `rules`, `cli.md`, `customization.md`, `mcp.md`)
**Triggers**: shadcn/ui, add component, magicui, CLI commands, styling presets
**Pairs With**: radix-ui-design-system, tailwind-design-system, make-interfaces-feel-better
**Summary**:
Complete shadcn/ui component management for adding, searching, fixing, styling, and composing UI.
- Manages the full component lifecycle: search registries, add components, view docs, preview changes with `--dry-run` and `--diff`, and intelligently merge upstream updates while preserving local modifications
- Enforces critical rules across forms (FieldGroup, Field, InputGroup, validation states), composition (Groups, overlays, Card structure), styling (semantic colors, gap spacing, size shorthand), and icons (data-icon attributes)
- Supports multiple registries (@shadcn, @magicui, @tailark, community presets) and provides component selection guidance via a reference table covering buttons, forms, overlays, navigation, charts, and layouts
- Injects project context automatically including aliases, framework, base library (radix vs base), icon library, Tailwind version, and resolved paths to ensure correct imports and APIs

**Top 5 Rules (By Priority)**:
1. Add new components exclusively via the CLI commands, keeping standard paths and handling presets automatically.
2. Use forms correctly via strictly composed patterns (`Form`, `FormItem`, `FormControl`, `FormMessage`).
3. Leverage semantic color utility classes (`bg-primary`, `text-muted-foreground`) to scale the theme seamlessly.
4. For upstream changes, run CLI commands with `--diff` and selectively merge files to retain local overrides.
5. Inject proper `data-icon` attributes into integrated icon libraries for reliable styling overlays.

### 9- tailwind-design-system
**Structure**: `SKILL.md` + folders (`references`)
**Triggers**: Tailwind v4, CSS variables, OKLCH, CVA, `@theme`, components
**Pairs With**: shadcn, radix-ui-design-system, make-interfaces-feel-better
**Summary**:
CSS-first design system framework for Tailwind v4 with tokens, components, and responsive patterns.
- Migrates configuration from `tailwind.config.ts` to CSS `@theme` blocks with native CSS variables, OKLCH color spaces, and `@custom-variant` for dark mode
- Provides production-ready component patterns including CVA-based variants, compound components, form controls, grids, and animations using native `@keyframes` and `@starting-style`
- Includes design token hierarchy (brand → semantic → component), responsive utilities like `size-*` shorthand, and accessibility-first patterns with ARIA attributes and focus states
- Covers v3-to-v4 migration with checklist, custom `@utility` directives, container queries, and color-mix() for alpha variants

**Top 5 Rules (By Priority)**:
1. Define the design system tokens within CSS `@theme` directives instead of using the config file for pure Tailwind v4 structure.
2. Rely on OKLCH color spaces and native CSS variables for accurate, dynamically scalable design tokens.
3. Manage multiple states effectively via CVA (Class Variance Authority) wrapper components.
4. Replace rigid media queries with container queries where fluid width components depend on layouts.
5. Create seamless accessible states, utilizing `aria-*` tags paired directly with tailwind state variants.

### 10- vercel-composition-patterns
**Structure**: `SKILL.md` + `AGENTS.md` + folders (`rules`, `metadata.json`, `README.md`)
**Triggers**: refactoring, props bloat, component architecture, React 19 upgrades
**Pairs With**: vercel-react-best-practices, react-useeffect
**Summary**:
React composition patterns for scaling components and avoiding boolean prop proliferation.
- Covers four priority categories: component architecture, state management, implementation patterns, and React 19 APIs, each with specific rules and code examples
- Includes 10+ named patterns addressing compound components, context providers, state lifting, and explicit variants
- Designed for refactoring bloated components, building reusable libraries, and reviewing component architecture decisions
- React 19 specific guidance on removing `forwardRef` and using `use()` instead of `useContext()`

**Top 5 Rules (By Priority)**:
1. Leverage "Compound Components" to decompose monolithic designs, passing standard children components.
2. Prevent boolean prop proliferation by separating visual variation logic explicitly rather than chaining endless flags.
3. Upgrade to React 19's natural functional `ref` passing over the legacy `forwardRef` API.
4. Replace internal provider `useContext()` injections with React 19's `use()` hook when practical.
5. Favor lifting state into parent architectures ("State Hoisting") to simplify dense UI elements.

### 11- vercel-react-best-practices
**Structure**: `SKILL.md` + `AGENTS.md` + folders (`rules`, `metadata.json`, `README.md`)
**Triggers**: performance, bundle size, caching, rendering issues, optimization
**Pairs With**: next-best-practices, react-useeffect, vercel-composition-patterns
**Summary**:
React and Next.js performance optimization guide with 64 prioritized rules across 8 categories.
- Organized by impact level, from critical waterfalls and bundle optimization down to advanced patterns, each rule includes incorrect/correct code examples and explanations
- Covers eight domains: async patterns, bundle size, server-side caching, client-side data fetching, re-render optimization, rendering performance, JavaScript efficiency, and advanced patterns
- Designed for use during component writing, code review, refactoring, and performance audits on React and Next.js applications
- Each rule has a prefix code (e.g., `async-parallel`, `bundle-barrel-imports`) for easy reference in automated tooling and documentation

**Top 5 Rules (By Priority)**:
1. Prevent Critical Waterfalls by parallelizing server logic via `Promise.all()` and hoisting independent data access.
2. Optimize Bundle Size significantly by avoiding barrel imports and breaking up large dependencies dynamically.
3. Prioritize Server-Side caching with `React.cache()` to share expensive cross-request functions effectively.
4. Efficiently de-duplicate Client-Side tasks leveraging reliable fetching tools like SWR or React Query.
5. Defend against bloated re-renders by enforcing structured hooks, deferring state transitions, and caching object results.

### 12- next-intl-app-router
**Structure**: `SKILL.md` + folders (`examples`)
**Triggers**: i18n, translations, locale routing, next-intl, localization
**Pairs With**: next-best-practices
**Summary**:
Setup and usage of `next-intl` with prefix-based locale routing for Next.js App Router projects.
- Provides specific file layout requirements across routing config, messages JSON, and the `app/[locale]` architecture
- Details the Next.js 16+ `proxy.ts`/`middleware.ts` integration to intercept and appropriately route localized requests
- Explains navigation wrapper implementations (`Link`, `useRouter`, `redirect`) to guarantee locale-aware URL navigation
- Maps correct static rendering (`setRequestLocale`) and server/client component localization API usage

**Top 5 Rules (By Priority)**:
1. Do not wrap the global root layout with `NextIntlClientProvider`; it strictly belongs inside `app/[locale]/layout.tsx`.
2. Do not import `Link`, `useRouter`, or `redirect` from `next/navigation`; always import the localized versions from your internal `/i18n/navigation.ts` helper.
3. Ensure you map `hasLocale()` explicitly inside layout bounds, executing a `notFound()` fallback immediately if an invalid locale path triggers.
4. Call `setRequestLocale(locale)` before executing any `next-intl` translation APIs within statically rendered layouts or pages.
5. Maintain segregated JSON files per namespace/locale under `/messages/` to keep string data decoupled from the component lifecycle.
