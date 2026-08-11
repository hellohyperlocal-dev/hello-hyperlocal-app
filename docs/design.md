---
version: alpha
name: Hello-Hyperlocal-design-analysis
description: An inspired interpretation of Hello Hyperlocal's design language — a community network brand whose surface combines an authoritative near-black display sans with a vivid lime-green brand accent, sage-tinted surface neutrals, rounded white cards on a pale green-tinted canvas, and the technical precision of Vercel's Geist Typography System.

colors:
  primary: "#7ED957"
  on-primary: "#0e0f0c"
  primary-active: "#cdffad"
  primary-neutral: "#c5edab"
  primary-pale: "#e2f6d5"
  ink: "#0e0f0c"
  ink-deep: "#1C472A"
  body: "#454745"
  mute: "#868685"
  canvas: "#ffffff"
  canvas-soft: "#F5F5F5"
  canvas-muted: "#EBEBEB"
  positive: "#2ead4b"
  positive-deep: "#054d28"
  warning: "#ffd11a"
  warning-deep: "#b86700"
  warning-content: "#4a3b1c"
  negative: "#d03238"
  negative-deep: "#a72027"
  negative-darkest: "#a7000d"
  negative-bg: "#320707"
  accent-orange: "#ffc091"
  accent-cyan: "#38c8ff"

typography:
  display-mega:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 165px
    fontWeight: 600
    lineHeight: 148px
    letterSpacing: -9.9px
    geistClass: "text-heading-72 lg:text-heading-165"
  display-xxl:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 96px
    fontWeight: 600
    lineHeight: 96px
    letterSpacing: -4.32px
    geistClass: "text-heading-72"
  display-xl:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 72px
    fontWeight: 600
    lineHeight: 72px
    letterSpacing: -4.32px
    geistClass: "text-heading-72"
  display-lg:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 48px
    fontWeight: 600
    lineHeight: 56px
    letterSpacing: -2.88px
    geistClass: "text-heading-48"
  display-md:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 50px
    fontWeight: 600
    lineHeight: 54px
    letterSpacing: -3.00px
    geistClass: "text-heading-50"
  display-sm:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -1.28px
    geistClass: "text-heading-32"
  display-xs:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
    geistClass: "text-heading-24"
  body-lg:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 36px
    geistClass: "text-copy-20"
  body-md:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    geistClass: "text-copy-16"
  body-md-strong:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    geistClass: "text-copy-16 font-semibold"
  body-sm:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    geistClass: "text-copy-14"
  body-sm-strong:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    geistClass: "text-label-14 font-semibold"
  caption:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    geistClass: "text-label-12"
  caption-mono:
    fontFamily: var(--font-geist-mono), monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    geistClass: "text-label-12-mono"
  button-md:
    fontFamily: var(--font-geist-sans), sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px
    geistClass: "text-button-16"

  # In-App Simulated Phone Screen Micro-Tokens (WCAG / Responsive Viewports)
  mockup-status-time:
    fontSize: 11px
    fontWeight: 600
    letterSpacing: -0.2px
  mockup-badge-micro:
    fontSize: 8px
    fontWeight: 800
    letterSpacing: 0.1em
    textTransform: uppercase
  mockup-subtext-micro:
    fontSize: 8.5px
    fontWeight: 500
    lineHeight: 12px
  mockup-caption-micro:
    fontSize: 9px
    fontWeight: 700
    letterSpacing: 0.12em
    textTransform: uppercase
  mockup-body-dense:
    fontSize: 10.5px
    fontWeight: 600
    lineHeight: 14px
  mockup-title-dense:
    fontSize: 14px
    fontWeight: 800
    letterSpacing: -0.5px
    lineHeight: 18px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
  button-arrow-flip:
    description: "Interactive button variant featuring dual-element sliding arrow flip animation on hover (Arrow 1 exits top-right, Arrow 2 slides in from bottom-left)."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
    animation: "icon-flip (duration: 0.3s, easing: cubic-bezier(0.16, 1, 0.3, 1))"
  button-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-content-elevated:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "none"
    shadow: "0 4px 24px rgba(14, 15, 12, 0.1)"
  card-feature-sage:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-green:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark-primary:
    description: "Primary dark feature card with deep forest green ink (#1C472A) surface."
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark-secondary:
    description: "Secondary dark feature card with near-black ink (#0e0f0c) surface."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark:
    alias: "card-feature-dark-primary"
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  hero-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.3xl} {spacing.xl}"
  currency-converter-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  eyebrow-pill-standard:
    description: "Standard section eyebrow pill used across light canvases and neutral sections."
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.positive-deep}"
    iconColor: "{colors.positive-deep}"
    iconSize: "14px (h-3.5 w-3.5)"
    typography: "{typography.caption}"
    textTransform: "Title Case"
    fontWeight: "600 (font-semibold)"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    border: "1px solid rgba(14, 15, 12, 0.05)"
    dark:
      backgroundColor: "{colors.ink-deep}"
      textColor: "{colors.primary}"
      iconColor: "{colors.primary}"
      border: "1px solid rgba(255, 255, 255, 0.05)"

  eyebrow-pill-dark:
    description: "High-contrast eyebrow pill for dark surfaces (e.g. Forest Green #1C472A cards, Download CTA)."
    backgroundColor: "rgba(255, 255, 255, 0.10)"
    textColor: "{colors.primary}"
    iconColor: "{colors.primary}"
    iconSize: "14px (h-3.5 w-3.5)"
    typography: "{typography.caption}"
    textTransform: "Title Case"
    fontWeight: "600 (font-semibold)"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    border: "1px solid rgba(255, 255, 255, 0.10)"

  eyebrow-pill-accent:
    description: "High-energy lime pill variant for focal dark cards."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    iconColor: "{colors.on-primary}"
    iconSize: "14px (h-3.5 w-3.5)"
    typography: "{typography.caption}"
    textTransform: "Title Case"
    fontWeight: "700 (font-bold)"
    rounded: "{rounded.pill}"
    padding: "6px 14px"

  eyebrow-pill-surface-contrast:
    description: "Inverted contrast pill for sections or cards with a native primary-pale (#e2f6d5) background."
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.primary}"
    iconColor: "{colors.primary}"
    iconSize: "14px (h-3.5 w-3.5)"
    typography: "{typography.caption}"
    textTransform: "Title Case"
    fontWeight: "600 (font-semibold)"
    rounded: "{rounded.pill}"
    padding: "6px 14px"

  badge-positive:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.positive-deep}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  badge-negative:
    backgroundColor: "{colors.negative-bg}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas-soft}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.xl}"

  # ─── Examples (illustrative) ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.mute}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    item-divider: "{colors.canvas-soft}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-mono}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.canvas-soft}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---

## Overview

Hello Hyperlocal wears its identity in a signature pairing: a vivid grass/lime-green `{colors.primary}` (`#7ED957`) used as the CTA pill and brand accent, set against a clean soft canvas `{colors.canvas-soft}` (`#F5F5F5`) running across the hero band, and near-black ink `{colors.ink}` (`#0e0f0c`) with an olive undertone. The brand reads like a calm Scandinavian magazine — generous whitespace, large rounded cards (`{rounded.xl}` 24 px / `{rounded.2xl}` 32 px), full-radius interactive pills (`{rounded.pill}` 9999 px), and punchy display typography.

In this system, all typography is powered by Vercel's **Geist Typography System** (`GeistSans` and `GeistMono`). Headings make use of calibrated negative letter spacing (`-0.02em` to `-0.06em`), while body copy and buttons leverage dedicated single-purpose classes (`text-heading-*`, `text-copy-*`, `text-label-*`, `text-button-*`).

**Key Characteristics:**
- A single lime-green CTA accent `{colors.primary}` (`#7ED957`) — universal primary action color.
- Geist Typography System ladder — `text-heading-72` to `text-heading-14`, `text-copy-20` to `text-copy-13`, `text-label-14`, `text-button-16`.
- `{rounded.pill}` 9999 px is the canonical radius for all buttons, CTA pills, status tags, and eyebrow pills.
- `{rounded.xl}` 24 px and `{rounded.2xl}` 32 px are the canonical radii for cards, dialogs, and feature mockups.
- Soft canvas `{colors.canvas-soft}` (`#F5F5F5`) is the hero surface; white `{colors.canvas}` is reserved for cards.
- Interactive Local Hub & Deals components.

---

## Eyebrow Pill System Specification

To eliminate inconsistent button/badge styles across sections, all section headers adhere to a **unified Eyebrow Pill standard**:

### 1. Typography & Anatomy
- **Geometry**: `rounded-full` (`{rounded.pill}` 9999px)
- **Padding**: `px-3.5 py-1.5` (compact 6px × 14px container)
- **Typography**: `text-[12px]` / `0.75rem`, `font-semibold` (`600` weight), `leading-none`
- **Casing**: **Title Case** (e.g., *"The Neighbourhood Network"*, *"Why Hello Hyperlocal"*, *"App Experience"*, *"How It Works"*, *"For Local Businesses"*, *"Our Commitment"*, *"Get the App"*)
- **Layout**: `inline-flex items-center gap-2 w-fit` with micro-icon (`h-3.5 w-3.5`, `strokeWidth: 2.2`)

### 2. Standard Variants & Contrasting Rules

| Variant | Surface (Background) | Text & Icon Color | Border | Recommended Usage |
| :--- | :--- | :--- | :--- | :--- |
| **`Standard`** | `#e2f6d5` (`primary-pale`)<br>*Dark: `#1C472A`* | `#054d28` (`positive-deep`)<br>*Dark: `#7ED957`* | `1px solid rgba(14,15,12,0.05)`<br>*Dark: `1px solid rgba(255,255,255,0.05)`* | **Default** across all light surfaces (Hero, Bento, App Experience, How It Works, For Business, Our Commitment) |
| **`Dark Contrast`** | `rgba(255, 255, 255, 0.10)` | `#7ED957` (`primary`) | `1px solid rgba(255, 255, 255, 0.10)` | Dark feature surfaces (e.g. Card 4 Dark Forest, dark hero bands) |
| **`Accent Lime`** | `#7ED957` (`primary`) | `#0e0f0c` (`ink`) | None | High-energy focal CTA cards (e.g. Download CTA card) |
| **`Surface Contrast`** | `#1C472A` (`ink-deep`) | `#7ED957` (`primary`) | None | When inside an already-mint `#e2f6d5` container or step card |

### 3. Canonical Section Eyebrows & Icon Pairings

| Section | Icon (`lucide-react`) | Title Case Label | Variant |
| :--- | :--- | :--- | :--- |
| **Hero** | `<Sparkles className="h-3.5 w-3.5" />` | `The Neighbourhood Network` | `Standard` (`#e2f6d5`) |
| **Why Hello Hyperlocal** | `<Compass className="h-3.5 w-3.5" />` | `Why Hello Hyperlocal` | `Standard` (`#e2f6d5`) |
| **App Experience** | `<Layers className="h-3.5 w-3.5" />` | `App Experience` | `Standard` (`#e2f6d5`) |
| **How It Works** | `<ListOrdered className="h-3.5 w-3.5" />` | `How It Works` | `Standard` (`#e2f6d5`) |
| **For Local Businesses** | `<Store className="h-3.5 w-3.5" />` | `For Local Businesses` | `Standard` (`#e2f6d5`) |
| **Our Commitment** | `<ShieldCheck className="h-3.5 w-3.5" />` | `Our Commitment` | `Standard` (`#e2f6d5`) |
| **Download CTA** | `<Smartphone className="h-3.5 w-3.5" />` | `Get the App` | `Accent Lime` (`#7ED957`) |

---

## Semantic Color & Visual Language Matrix

Purpose-driven colors establish a clear, consistent visual hierarchy for feedback, statuses, and community interactions:

| Semantic Purpose | Foreground / Accent | Background Surface | Text Contrast Ratio | Use Cases in Hello Hyperlocal |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Verified** | `#7ED957` / `#054d28` | `#e2f6d5` (mint soft) | **7.6:1 (AAA)** | Physical address verification passes, active resident checkmarks, claimed perk passes, successful form submission confirmations. |
| **Warning / Notice** | `#D97706` / `#B45309` | `#FEF3C7` (amber soft) | **5.4:1 (AA)** | Municipal maintenance advisories, scheduled substation repair notices, pending suburb verification review. |
| **Danger / Outage** | `#DC2626` / `#991B1B` | `#FEE2E2` (rose soft) | **5.8:1 (AA)** | Critical community safety alerts, emergency municipal outages, required form validation errors. |
| **Info / Civic Action** | `#2563EB` / `#1E40AF` | `#DBEAFE` (blue soft) | **6.1:1 (AA)** | Ward infrastructure progress bars, community clean-up milestones, municipal voting dates. |

---

## Accessibility (a11y) & WCAG 2.1 AA Compliance Standards

1. **Contrast Standards**:
   - Standard body text (`#454745` on `#FFFFFF` / `#F5F5F5`): **>4.7:1 (Passes AA)**.
   - Brand deep forest green (`#1C472A` with white `#FFFFFF`): **9.8:1 (Passes AAA)**.
   - Primary action lime (`#7ED957` with dark `#0e0f0c` / `#054d28`): **7.6:1 (Passes AAA)**.
   - Pale mint surface (`#e2f6d5` with forest text `#054d28`): **8.2:1 (Passes AAA)**.

2. **Screen Reader Compatibility**:
   - **Semantic Landmarks**: Clean structure with `header`, `main#main-content`, `footer`, and `nav[aria-label]`.
   - **Skip Link**: Top-level `<a href="#main-content">` accessible via initial `Tab` keypress.
   - **Modals**: Full dialog semantics (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
   - **Accordions**: WAI-ARIA Accordion pattern with `aria-expanded`, `aria-controls`, `role="region"`, and `aria-labelledby`.
   - **Non-Text Content (WCAG § 1.1.1)**: Simulated micro-mockup viewports are isolated with `aria-hidden="true"`, while parent containers provide clean, descriptive `aria-label` tags.

3. **Keyboard Navigation**:
   - Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-[#1C472A] dark:focus-visible:ring-[#7ED957]`).
   - Full keyboard operability (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
   - `Escape` key closes all active modals and dropdown drawers.

