# Graph Report - .  (2026-07-30)

## Corpus Check
- 82 files · ~305,302 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 402 nodes · 507 edges · 60 communities (19 shown, 41 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 1,670,890 input · 0 output

## Community Hubs (Navigation)
- Core App Screens & Components
- Design System Runtime (support.js)
- Package Dependencies
- Mockup Sprint & Handover Docs
- Onboarding & Auth Flow
- Expo App Config
- Design System Bundle Components
- Dev Tooling & Build Config
- Legal & Brand Documents
- TypeScript Config
- New Resident Journey Screens
- Explore, Share & Marketplace Screens
- IconButton & StatChip Components
- Tech Stack Decisions
- HHL Logo Brand Identity
- Kids Street Play Photo
- Linden Market Photo
- Color Token System
- App Icon & Brand
- Churros Photo Concept
- IAP Compliance Rule
- Multi-Tenant Architecture Note
- Churros Dish (Sprint Copy)
- Hello Presentation Deck Copies
- Expo CLI Readme
- Web Favicon Asset
- Adaptive Icon Foreground
- Breakfast Photography
- Dog Walking Photography
- Goddess Cafe Photography
- Kids Fun Street Photo
- Linden Lanes Photography
- Linden Market Photography
- Linden Market Toast Photo
- Linden Streetview Photography
- Market Plate Breakfast Photo
- Whippet Cafe Photography
- Winter Menu Photography
- NDA Non-Circumvention Clause
- Retainer Structure Terms
- Avatar Component Spec
- Button Component Spec
- CreateButton Component Spec
- IconButton Component Spec
- StatusBadge Component Spec
- HHL Logo (Sprint Copy)
- Breakfast Photo (Sprint Copy)
- Dog Walking (Sprint Copy)
- Goddess Cafe (Sprint Copy)
- Linden Lanes (Sprint Copy)
- Linden Market Toast (Sprint Copy)
- Linden Streetview (Sprint Copy)
- Market Breakfast (Sprint Copy)
- Whippet Cafe (Sprint Copy)
- Winter Menu (Sprint Copy)
- Mockup Canvas Screenshot
- New Mockup Screenshot
- Login Screen Mockup
- Brand Personality Notes

## God Nodes (most connected - your core abstractions)
1. `react` - 21 edges
2. `fonts` - 19 edges
3. `expo` - 14 edges
4. `expo-router` - 11 edges
5. `createRuntime()` - 9 edges
6. `boot()` - 8 edges
7. `walkChildren()` - 8 edges
8. `walk()` - 8 edges
9. `Home Feed screen mockup` - 8 edges
10. `getReact()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Main navigation (Home, Love Local, Explore, What's On, Share)` --semantically_similar_to--> `Screens built so far (app/ routes)`  [INFERRED] [semantically similar]
  docs/UI Mockup Production Sprint/uploads/HHL Brief.pdf → HANDOVER.md
- `Tagline — "Rediscover Where You Live"` --conceptually_related_to--> `Hello Hyperlocal / Hello Linden Project`  [AMBIGUOUS]
  docs/UI Mockup Production Sprint/uploads/HHL Brand values.pdf → HANDOVER.md
- `Explore tab (map) not built — deferred` --conceptually_related_to--> `Phased Implementation Roadmap (Phase 1–4)`  [INFERRED]
  HANDOVER.md → docs/Project Proposal_ Hello Hyperlocal Platform.pdf
- `Hello Hyperlocal / Hello Linden Project` --references--> `Phased Implementation Roadmap (Phase 1–4)`  [EXTRACTED]
  HANDOVER.md → docs/Project Proposal_ Hello Hyperlocal Platform.pdf
- `Lucide icon substitution (flagged, not a discovered brand asset)` --semantically_similar_to--> `Tech Stack (Expo SDK 51, RN 0.74.5, TypeScript, expo-router)`  [INFERRED] [semantically similar]
  docs/UI Mockup Production Sprint/_ds/hello-hyperlocal-design-system-7b16bf08-024c-492c-b3cc-3237dcb2876d/readme.md → HANDOVER.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **9-screen mockup sprint (Splash → Login → Onboarding → Home Feed → Merchant Spotlight → Explore → Share → What's On → Marketplace)** — docs_ui_mockup_production_sprint_sprint_dc_splash_screen, docs_ui_mockup_production_sprint_sprint_dc_login_screen, docs_ui_mockup_production_sprint_sprint_dc_onboarding_screen, docs_ui_mockup_production_sprint_sprint_dc_home_feed_screen, docs_ui_mockup_production_sprint_sprint_dc_merchant_spotlight_screen, docs_ui_mockup_production_sprint_sprint_dc_explore_screen, docs_ui_mockup_production_sprint_sprint_dc_share_screen, docs_ui_mockup_production_sprint_sprint_dc_whats_on_screen, docs_ui_mockup_production_sprint_sprint_dc_marketplace_screen [INFERRED 0.85]
- **Card component family implementing the brand-board's 8 named component patterns** — docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_statchip_component, docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_herocard_component, docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_ledgercard_component, docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_facilitycard_component, docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_listrow_component, docs_ui_mockup_production_sprint__ds_hello_hyperlocal_design_system_7b16bf08_024c_492c_b3cc_3237dcb2876d_readme_component_standards [EXTRACTED 0.95]
- **Governing documents that jointly define the Hello Hyperlocal engagement (legal, commercial, design)** — docs_hhl_nda__1__nda_agreement, docs_project_proposal__hello_hyperlocal_platform_roadmap, docs_ui_mockup_production_sprint_uploads_hhl_brief_design_philosophy [INFERRED 0.75]

## Communities (60 total, 41 thin omitted)

### Community 0 - "Core App Screens & Components"
Cohesion: 0.06
Nodes (40): StoredUserData, styles, FEED_TABS, MainFeedScreen(), styles, styles, CATEGORIES, styles (+32 more)

### Community 1 - "Design System Runtime (support.js)"
Cohesion: 0.07
Nodes (45): boot(), cdnScriptFor(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createExternalModules() (+37 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.04
Nodes (45): expo, expo-constants, expo-font, @expo-google-fonts/dm-mono, @expo-google-fonts/dm-sans, expo-image, expo-image-picker, expo-linking (+37 more)

### Community 3 - "Mockup Sprint & Handover Docs"
Cohesion: 0.07
Nodes (34): §05 Component standards section, Phased Implementation Roadmap (Phase 1–4), BottomNav component (floating bottom nav), uploads/brand-board_5.html (primary token/spec source), Component standards — 8 named UI patterns, uploads/design.md (companion design spec v6), Hello Hyperlocal Design System (readme overview), FacilityCard component (+26 more)

### Community 4 - "Onboarding & Auth Flow"
Cohesion: 0.09
Nodes (16): AuthScreen(), styles, plugins, styles, SLIDES, styles, CategoryKey, SHARE_CATEGORIES (+8 more)

### Community 5 - "Expo App Config"
Cohesion: 0.08
Nodes (25): backgroundColor, foregroundImage, adaptiveIcon, package, expo, android, assetBundlePatterns, icon (+17 more)

### Community 6 - "Design System Bundle Components"
Cohesion: 0.17
Nodes (21): App(), Avatar(), BottomNav(), Button(), Community(), CreateButton(), _extends(), Facilities() (+13 more)

### Community 7 - "Dev Tooling & Build Config"
Cohesion: 0.11
Nodes (18): @babel/core, devDependencies, @babel/core, resolve-from, @types/react, typescript, main, name (+10 more)

### Community 8 - "Legal & Brand Documents"
Cohesion: 0.17
Nodes (12): IP ownership clause (work product vests in Hello Hyperlocal on payment), Mutual NDA, Non-Circumvention & IP Agreement, IP, Confidentiality & Scope Boundaries (Section 6), "Toast Notification" hard content rule — no script/handwritten fonts in interactive UI, Voice / casing content rules (sentence case, warm neighbourly tone), Brand purpose — helping people rediscover their neighbourhood, Tagline — "Rediscover Where You Live", "What Hello Is / Isn't" positioning statement (+4 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): expo/tsconfig.base, **/*.ts, **/*.tsx, compilerOptions, baseUrl, paths, strict, extends (+1 more)

### Community 10 - "New Resident Journey Screens"
Cohesion: 0.36
Nodes (9): Hello Linden New-Resident Journey (Mockup Sprint), Hidden Gems / More Local Spots Feed (Linden Village Market, The Whippet), Home Feed (Hello, Sam - Linden Block 4), Neighborhood Alert Card (Load-shedding Schedule Update), Love Local: Merchant Spotlight (Goddess Cafe), Onboarding Step 01: Rediscover Your Street, Reward Points / Local Rewards Badge (e.g. R240, R85), Splash Screen (Hello Hyperlocal, Linden) (+1 more)

### Community 11 - "Explore, Share & Marketplace Screens"
Cohesion: 0.43
Nodes (8): Bottom Tab Navigation Pattern (green pill icons), Community Marketplace Screen, Explore - Map & Directory Screen, Hyperlocal Neighborhood App Concept (Linden), Post Creation Categories (Event, Around the 'hood, Lost & Found, Job, Recommendation, Business listing), Share Something Great Screen (Post Composer), What's On - Events Screen, Task 78: Four-Screen App Mockup (Explore, Share, What's On, Marketplace)

### Community 12 - "IconButton & StatChip Components"
Cohesion: 0.29
Nodes (5): IconButton(), IconButtonProps, styles, StatChipProps, styles

### Community 13 - "Tech Stack Decisions"
Cohesion: 0.40
Nodes (5): Proposed tech stack (Next.js/TS web, Supabase+PostGIS, Cloudflare R2), Lucide icon substitution (flagged, not a discovered brand asset), AsyncStorage vs window.localStorage bug, Plain RN StyleSheet.create() — not NativeWind, Tech Stack (Expo SDK 51, RN 0.74.5, TypeScript, expo-router)

### Community 14 - "HHL Logo Brand Identity"
Cohesion: 0.83
Nodes (4): Hello Hyperlocal Brand Identity, Hello Hyperlocal Logo (hhl-logo.png), Tagline: "Love Where You Live.", Winking Smiley Mascot Mark (inside the O)

### Community 15 - "Kids Street Play Photo"
Cohesion: 0.50
Nodes (4): Childhood Outdoor Play, Kids Fun in Street (Photography), Hyperlocal Neighborhood Lifestyle, Jacaranda-Lined Neighborhood Street

### Community 16 - "Linden Market Photo"
Cohesion: 0.67
Nodes (3): Hyperlocal Market/Community Photography Reference, The Linden Market (Community Market Venue), The Linden Market (Entrance Sign Photograph)

### Community 17 - "Color Token System"
Cohesion: 0.67
Nodes (3): Brand board colour tokens (Dark Spruce, Radioactive Grass, Hunter Green, Warm White, Onyx), 5-token colour palette, Design tokens already in code (colors, radius scale, voice/casing)

## Ambiguous Edges - Review These
- `Hello Hyperlocal / Hello Linden Project` → `Tagline — "Rediscover Where You Live"`  [AMBIGUOUS]
  docs/UI Mockup Production Sprint/uploads/HHL Brand values.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **169 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+164 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Hello Hyperlocal / Hello Linden Project` and `Tagline — "Rediscover Where You Live"`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Package Dependencies` to `Design System Bundle Components`, `Dev Tooling & Build Config`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `react` connect `Design System Bundle Components` to `Design System Runtime (support.js)`, `Package Dependencies`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `expo-router` connect `Onboarding & Auth Flow` to `Core App Screens & Components`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _169 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core App Screens & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05807622504537205 - nodes in this community are weakly interconnected._
- **Should `Design System Runtime (support.js)` be split into smaller, more focused modules?**
  _Cohesion score 0.07456140350877193 - nodes in this community are weakly interconnected._