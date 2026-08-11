# Brief: Hello Hyperlocal — Client Progress Presentation

## Context
Build a client-facing presentation for **Hello Hyperlocal** (flagship instance: **Hello Linden**), a hyperlocal community app for the Linden suburb (Johannesburg, South Africa). Audience: the client (JC Snooke / Hello Hyperlocal (Pty) Ltd). Purpose: show progress since the last meeting and directly address a residency-verification concern the client raised previously.

**Tone:** premium, warm, user-friendly — never technical or corporate. This matches the app's own brand voice: sentence case (never Title Case), no emoji, no jargon. Confident but honest — this is a working build, not a finished product, and the deck should read that way rather than overselling.

**Brand tokens** (pull from the app's actual design system, don't invent new ones):
- Colors: Dark Spruce `#1C472A`, Radioactive Grass `#7ED957`, Hunter Green `#47663B`, Warm White `#FCFAF7`, Onyx `#0F0F0F`
- Typeface: DM Sans (the app uses no other typeface for UI text)
- Radius language: soft, rounded — 12–24px corners, full-pill buttons/nav
- Tagline: "Love where you live."

## Critical instruction: keep "built" and "planned" visually and textually distinct
Every feature must be labeled as either **shipped** (a working, testable part of the app today) or **planned** (roadmap, not built). Never blend the two in a way that could read as "already done." This is being presented to a paying client — accuracy matters more than polish here.

---

## Section 1: Where things stand
Frame this as MVP-in-progress. The app currently covers the full first-time and returning user journey, backed by a real design system pulled from the client's own approved mockups.

**Shipped — full user journey:**
- Onboarding: animated splash, 3-slide intro carousel, role selection (Resident / Business / Visitor)
- Sign-up: email verification code, role-aware profile capture (name + address for residents, business name + address for businesses)
- Log in: email + password for returning users
- Editable profile: name, phone number, profile photo

**Shipped — the 5 core tabs (matching the approved brief exactly):**
- **Home** — personalized feed: neighbourhood announcements, community posts (with upvoting), a curated "hidden gems" grid
- **Love Local** — searchable, filterable directory of local businesses across all 6 brief categories (Restaurants, Coffee Shops, Retail, Guesthouses, Markets, Experiences)
- **Explore** — interactive map of Linden with business locations, search, and category filtering
- **What's On** — real-time event calendar (today's actual date, not a fixed demo date) with RSVP
- **Share** — a 6-category post composer (events, neighbourhood news, lost & found, jobs, recommendations, business listings)

**Shipped — trust & safety foundation:**
- Report / Block on community posts — a blocked user's posts are actually filtered out of your feed, not just a cosmetic button
- Notification preferences and an in-app notification center
- Account controls: security settings, session management, and in-app account deletion (a requirement for App Store approval)

## Section 2: Address verification — the residency-proof feature
This is the section that speaks directly to keeping the community genuinely local.

**Shipped today:**
- A resident can upload a proof-of-address document (a utility bill or lease) directly in the app, either during sign-up or later from account settings
- The submission is captured and marked for review

**Be explicit about scope:** this is a working upload flow with a real UI, not yet connected to an automated review process — a real person (or an automated document-check service) still needs to be wired in on the backend to actually approve or reject a submission. Frame it as "the front door is built — walk through it and you'll see exactly what a resident experiences," not as a finished verification pipeline.

## Section 3: Closing the loop — geo-location confirmation (next phase)
**Clearly mark this entire section as PLANNED, not built.** Suggested visual treatment: a distinct "Coming next" or "Roadmap" band, different background/border treatment from Sections 1–2, so it can't be mistaken for a shipped feature at a glance.

Narrative: "You raised a genuine concern last time — a document alone doesn't prove someone is physically in Linden right now. Here's how we close that gap next: pairing the document upload with a live, on-device location check at the moment of verification, so residency isn't just claimed on paper, it's confirmed on the spot." Keep the technical description light — this is a business audience, not an engineering review.

## Section 4: What's intentionally not built yet (optional, use judgment)
Only include if the presentation benefits from showing deliberate scoping rather than gaps — some clients respond well to "we scoped this out on purpose," others just want the progress story. If included, keep it brief: Marketplace and Loyalty features are explicitly deferred per the client's own brief ("Future Features," post-MVP); a real backend (persisted accounts/data) is the next major phase after the current UI build.

---

## Practical notes for whoever builds this
- Use real language from the app where possible ("Love where you live," "Hidden gems near you," category names) rather than generic SaaS phrasing — it reinforces this is a real, specific product, not a template.
- If screenshots are available, prioritize: the Home Feed, the Explore map, and the address-verification upload screen (the one most relevant to the client's stated concern).
- Do not state or imply any of the following as complete: real backend/persisted accounts, push notification delivery, biometric-gated app unlock, real OCR/document review, geo-location confirmation, Marketplace.
