# Hello Hyperlocal — Design System

**Love where you live.**

Hello Hyperlocal is a neighbourhood-first community app connecting
residents, local businesses, and events within a specific suburb (the
reference build here is centered on **Linden**, a Johannesburg
neighbourhood). Residents get a home feed of local news/events/
marketplace posts, a directory of nearby facilities and businesses,
community RSVPs, and a lightweight payments/ledger flow for boosted
listings. Local businesses are the other side of the network —
featured listings, marketplace boosts, and fee billing reuse the same
visual language as the resident-facing screens.

The brand is explicitly **not stock-photography-driven** — it leans on
real neighbourhood imagery (coffee shops, weekend markets, dog walks,
kids playing in the street) to read as authentic and local rather than
corporate.

## Sources

- `uploads/brand-board_5.html` — a living brand-kit/spec document (the
  primary source of truth for tokens, type, radius, and the 8 named
  UI component patterns used throughout this system).
- `uploads/design.md` — companion design specification (v6), same
  content in prose form with a few additional clarifications (Toast
  Notification naming, presentation-layer rules).
- `uploads/HHL Logo.png` — the only real logo asset provided. Sourced
  originally from a Supabase Storage bucket
  (`brand-assets/HHL%20Logo.png`) per the brand board, but the actual
  file was supplied directly and is what's copied into `assets/logo/`.
- `uploads/*.jpg / .jpeg / .webp` — neighbourhood photography (Linden
  market, local cafés, dog walking, breakfast plates, street scenes).
  Copied into `assets/photography/`.
- No Figma file, GitHub repo, or shipped codebase was attached. This
  system was authored from the brand-board spec + provided imagery
  only — there is no existing component codebase to defer to.

## Component strategy

The brand-board (§05 "Component standards") explicitly enumerates 8
named UI patterns already observed in the shipped app screens — that
list **is** the component inventory, and every family below maps
directly onto one of those 8 patterns. `shadcn/ui` was named as a
structural reference (composable, unstyled-by-default primitives) but
no shadcn code was attached, so this system does not literally import
it — components are hand-built to shadcn's spirit (small, composable,
variant-driven) using only the CSS custom properties defined here.

### Components

**Core** (`components/core/`)
- **Button** — pill CTA, 4 variants (spruce / grass / white / ghost). *Intentional addition* — the brand board's CTAs (hero "Read more", ledger "Pay", create-post) share one visual pattern; factored out as a single reusable primitive rather than three copies.
- **Avatar** — initials circle (list rows).
- **StatusBadge** — live / pending status pill.
- **IconButton** — circular icon affordance (stat-chip arrow, etc).

**Cards** (`components/cards/`) — the 8 named patterns from brand-board §05:
- **StatChip** — grass metric chip pair.
- **HeroCard** — dark announcement card.
- **LedgerCard** — dark fee/ledger breakdown panel.
- **FacilityCard** — listing/facility grid card.
- **ListRow** — avatar + status list row.

**Navigation** (`components/navigation/`)
- **PillTabs** — segmented pill tab control.
- **BottomNav** — floating bottom nav bar.
- **CreateButton** — full-width "create post" entry point.

## Content fundamentals

**Voice:** warm, plain, neighbourly — never corporate or SaaS-y.
Copy reads like something a helpful neighbour would say, not a
platform. Example from the spec: the create-post button reads **"Share
something great"**, explicitly *not* "Submit Content" — the brand
board calls this out as a hard rule.

**Person:** direct address in second person for status/labels ("Pre-
Approved by Chris"), first-person-plural warmth implied by "Hello" —
the wordmark itself is a greeting. The home greeting header uses the
resident's name directly: **"Hello, User."** / "Hello, Sam."

**Casing:** sentence case everywhere in UI copy (buttons, titles,
list names) — never Title Case, never ALL CAPS except eyebrows/labels,
which are deliberately uppercase with wide tracking (0.14em) as a
structural/categorical device, not for emphasis.

**Tone of sample content:** hyperlocal and specific — real street
names, rand amounts, load-shedding schedules, market stall prices
("R30 per stall"), piano teachers for an 8-year-old. Nothing generic;
copy should always feel like it's about one real street, not "a
neighbourhood."

**Emoji:** none observed anywhere in the spec or shipped screens. Do
not introduce emoji.

**The one hard content rule ("Toast Notification"):** script and
handwritten typefaces are prohibited from every interactive
component, enforced at the token level — not by convention. The
handwritten "Hello" lives only inside the static logo asset.

## Visual foundations

**Color:** 5 tokens only (see `tokens/colors.css`). Warm White
(`#FCFAF7`) is the dominant canvas — nearly every screen's default
background. **Dark Spruce** (`#1C472A`) is the one dominant *dark*
surface — it fills every dark accent container: hero cards, ledger
panels, the create-post button, and the floating bottom nav. **Onyx**
(`#0F0F0F`) is text-only — body copy, descriptions, and numerals —
with exactly one sanctioned exception: the app-icon presentation
viewport. **Radioactive Grass** (`#7ED957`) is reserved strictly for
action callouts (CTAs, active states, price highlights) — never a
passive background wash. **Hunter Green** (`#47663B`) covers secondary
accents: eyebrows, tags, inactive-tab labels, icon fills. Any text
sitting directly on Dark Spruce renders in white or grass only —
never onyx, never hunter.

**Type:** one geometric sans, DM Sans, at every weight/size in the
scale (`tokens/typography.css`) — display (38/800), heading (22/800),
card title (15/700), body (13/400), label (12/700), eyebrow (11/700
uppercase, 0.14em tracking). DM Mono is reserved for data/technical
values — rand amounts, numeric IDs, the big structural numerals in the
brand-board itself.

**Spacing & radius:** 4px base spacing scale. Radius scale is
purpose-bound, not arbitrary: 12px for chips/small tags, 16px for stat
chips and list cards, 24px for hero cards and sheets, full-pill for
every nav/tab/CTA. Never round to a different grid — these exact
pixel values are load-bearing brand signals.

**Backgrounds:** flat color fills only — no gradients, no textures, no
hand-drawn illustration patterns anywhere in the spec. The one
placeholder gradient (`asset-media` spruce→hunter diagonal) exists
only in the brand-board's own presentation chrome for un-filled
photography slots, not as a real UI pattern — don't reuse it.

**Imagery:** real neighbourhood photography — warm, natural daylight,
honest un-styled moments (market stalls, coffee counters, dogs on
leashes, kids playing in the street). Never stock photography, never
black-and-white, never heavy grain or filter treatment. Frames always
render with `background-size: cover` so mixed source aspect ratios
never distort a grid.

**Animation:** none specified in the source. No easing curves, bounce,
or transition durations were documented — components here use minimal,
functional transitions only (opacity/scale on press) as a reasonable
default, not a documented brand behavior.

**Hover / press states:** not explicitly specified in the source
beyond the nav's active-ring behavior. This system's components use a
conservative default (slight scale-down on press) — flagged as an
inference, not a documented rule.

**Borders / shadows:** the system is almost entirely flat-fill with
thin hairline borders (`rgba(15,15,15,0.07–0.12)`) between list rows
and grid cells — no drop shadows on cards. The one shadow in the whole
system is a soft float shadow reserved for the floating bottom nav,
which needs to visually detach from the screen edge.

**Corner radii:** see Spacing & radius above — this is the full scale,
there is no 5th radius value anywhere in the source.

**Cards:** no border, no shadow, flat fill, radius per the scale above.
The only card "chrome" is the fill color itself (Dark Spruce for
dark/featured cards, white/canvas for everything else) plus an
occasional hairline border on facility cards holding photography.

**Transparency / blur:** used sparingly and only for soft tints —
`rgba` overlays for status-pill backgrounds and inactive nav icons
(translucent white). No backdrop-blur / glassmorphism anywhere in the
source.

**Fixed elements:** the bottom nav floats, detached from the screen
edge, on every screen — the one persistent fixed element in the app.

## Iconography

The brand-board's own component gallery represents nav icons with bare
Unicode glyphs (⌂ ♡ ⌕ ◔ ☰) as a stand-in, not a real icon system — no
icon font, SVG sprite, or icon library ships with the provided source
files. **Substitution:** this system uses
[Lucide](https://lucide.dev) icons (loaded from the `unpkg` CDN) as the
nearest match — thin (1.5–2px), geometric, single-weight line icons
that read the same register as the brand's minimal glyph placeholders.
This is a flagged substitution, not a discovered brand asset — if HHL
has a real icon library, swap it in and update `BottomNav`/`Icon`
usages across `components/navigation/` and `ui_kits/app/`.

No emoji are used as icons anywhere in the system.

## Fonts

DM Sans and DM Mono are loaded via a Google Fonts CDN `@import` in
`tokens/typography.css` (both exact families requested in the design
brief — no substitution needed here). Font **binaries were not able to
be fetched and vendored into `assets/fonts/`** in this environment; if
you'd like fully self-hosted, offline-safe font files, please supply
the `.woff2` files (or grant a route to download them) and this can be
swapped for local `@font-face` rules.

## Logo

`assets/logo/hhl-logo.png` is the only real, provided lockup — the
green speech-bubble mark with the handwritten "HELLO" and the
geometric "HYPERLOCAL" wordmark + "LOVE WHERE YOU LIVE." tagline. Per
the brand board, this exact PNG is the fixed master asset; only the
canvas behind it changes (Warm White, Dark Spruce, or the Onyx
app-icon squircle frame) — it is never redrawn, recolored, or
simplified.

## Index

- `styles.css` — root stylesheet; imports every token file below.
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — CSS custom properties.
- `guidelines/` — 14 foundation specimen cards (Colors, Type, Spacing, Brand groups) shown in the Design System tab.
- `assets/logo/` — the HHL logo PNG.
- `assets/photography/` — 16 neighbourhood photos.
- `components/core/` — Button, Avatar, StatusBadge, IconButton.
- `components/cards/` — StatChip, HeroCard, LedgerCard, FacilityCard, ListRow.
- `components/navigation/` — PillTabs, BottomNav, CreateButton.
- `ui_kits/app/` — click-through recreation of the resident mobile app (Home, Facilities, Community, Payments screens).
- `SKILL.md` — portable skill file for using this system in Claude Code.
