# Hello Hyperlocal — Project Handover

**Purpose of this file:** a single source of truth for any AI agent or developer
picking up this project cold — whether that's a fresh Claude Code session after
hitting a limit, or a different tool entirely (e.g. Antigravity). Read this
file completely before making changes. **Keep it updated** after any
significant chunk of work — treat it as part of the deliverable, not a
one-off snapshot.

**Confidentiality:** this entire project (code, docs, client relationship) is
covered by an NDA. Fine to share this file with another AI tool you (the
developer) are using on your own machine to continue your own work — do not
post it, or any project content, publicly or to third parties.

---

## 1. What this project is

**Hello Hyperlocal** (first flagship instance: **Hello Linden**) — a
hyperlocal community app connecting residents, local businesses, and
community organisations in the Linden suburb (Johannesburg, South Africa).
Tagline: "Love Where You Live." Long-term vision: a national network
(Hello Parkhurst, Hello Greenside, etc.) — see `docs/` for full brief.

**Business context:** Lambert Van Sittert (Wavepoint Studios) is the
developer, building this under a monthly retainer for client JC Snooke /
Hello Hyperlocal (Pty) Ltd. Full contract terms in
`docs/HHL NDA (1).pdf` and `docs/Project Proposal_ Hello Hyperlocal Platform.pdf`.
Design brief at `Downloads/HHL Brief.pdf` (or wherever it's been moved to
inside `docs/` — check both).

**Timeline:** targeted app launch is **October 2026** (per the developer, as
of 2026-07-31 — not sourced from the proposal PDF, confirm against actual
contract terms if this matters for a specific date-sensitive decision). A
client-facing presentation/demo will be needed at some point before then —
see §8 for the EAS standalone-build plan for that (Expo Go is fine for dev
testing but deliberately not recommended for the client-facing demo itself —
see reasoning there).

**Reference docs to read before touching design/content:**
- `docs/brand-board_7.html` — color tokens, type scale, spacing/radius rules,
  named component patterns, voice/casing rules.
- `docs/UI Mockup Production Sprint/` — actual screen mockups. Screenshots in
  `screenshots/` (left.png, new.png, task78.png form one coherent 8-screen
  journey — canvas.png is a separate/earlier alternate draft, don't treat it
  as equally authoritative). `Sprint.dc.html` has the exact copy for every
  screen (grep it for exact strings rather than guessing).
- `docs/Project Proposal_...pdf` — tech stack, phased roadmap, App Store IAP
  compliance rules, retainer structure, scope boundaries.

---

## 2. Tech stack (do not deviate without a reason)

- **Expo SDK 51**, React Native 0.74.5, TypeScript, `expo-router` ~3.5.23
  (file-based routing under `app/`).
- **Styling: plain React Native `StyleSheet.create()`.** NOT NativeWind, NOT
  Tailwind. An earlier planning doc (from Gemini) incorrectly claimed
  NativeWind was already in use — it never was and still isn't. Don't
  introduce it without discussing first; it would require rewriting every
  existing screen's styling.
- **Fonts: DM Sans is the only typeface for UI text — no exceptions without
  discussing first.** DM Mono exists solely for two deliberate, narrow cases:
  the OTP verification digit boxes (`app/auth.tsx`, `otpBox` style,
  `fonts.mono.medium`) and numeric social-action counts — upvotes/comments —
  on the Home Feed (`app/(tabs)/index.tsx`, `socialText` style,
  `fonts.mono.regular`). Both are "monospace for digits" cases, not a
  general-purpose second font. Don't reach for DM Mono anywhere else without
  discussing first.
  Loaded via `@expo-google-fonts/dm-sans` and `@expo-google-fonts/dm-mono`
  once in `app/_layout.tsx` via `useFonts`. Family-name constants in
  `src/constants/fonts.ts` (`fonts.sans.{regular,medium,semiBold,bold,extraBold,black}`,
  `fonts.mono.{regular,medium}`) — always use these, never hardcode a
  font-family string or rely on `fontWeight` alone (RN needs the actual
  weight-specific family name per font). **Every `Text` style with a
  `fontSize` must also set `fontFamily`** — omitting it doesn't error, RN
  just silently falls back to the OS default font (San Francisco/Roboto).
  This exact bug was found and fixed in 3 places this session (`welcome.tsx`
  `subtitle`/`cardBody`, `auth.tsx` `subtitle`) — see §9.
- **Local persistence:** `@react-native-async-storage/async-storage`. **Never
  use `window.localStorage`** — it doesn't exist in React Native on iOS/Android
  and was a real bug found and fixed this session (worked fine on web, would
  have silently broken all session persistence on a real device).
- **Icons:** `lucide-react-native`.
- **Backend:** Supabase — `src/lib/supabase.ts` is currently a **placeholder
  client only**. OTP is mocked (see below); there is no real database, no
  schema, no persisted user data anywhere. This is intentionally deferred —
  see "Phase 5" below.
- **Image picking:** `expo-image-picker` (avatar photo, verification document
  capture). Config plugin already registered in `app.json` with permission
  strings.
- **Maps:** `react-native-maps` (Explore tab). Android needs a real Google
  Maps API key to render tiles — see §7.
- **File picking:** `expo-document-picker` (settings-context proof-of-address
  upload — accepts images or PDF, unlike `expo-image-picker` which is
  images-only).
- **Biometrics:** `expo-local-authentication` (Security settings toggle —
  preference only, doesn't gate app launch yet, see §7).

---

## 3. Screens built so far (`app/`)

Routing flow for a first-time user:
`index.tsx` (splash) → `onboarding.tsx` → `welcome.tsx` → `auth.tsx` (signup)
→ `profile-setup.tsx` → (optional) `verify-address.tsx` → `(tabs)/index.tsx`

Returning user (has an account, session expired): splash → `auth.tsx`
(login mode — **email + password now, not OTP**, see §3's `auth.tsx` row) →
straight to tabs, **skipping onboarding and profile-setup**.
Active session: splash → straight to tabs.

Routing decisions live in `app/index.tsx`, driven by three AsyncStorage keys:
`hhl_session` (`'active'`), `hhl_has_account` (`'true'`), `hhl_onboarding_seen`
(`'true'`). Also `hhl_user_role` (`'resident'|'business'|'visitor'`),
`hhl_user_data` (JSON — the shared `StoredUserData` interface, now in
`src/lib/mock-data.ts`: `identifier`, `fullName?`, `phoneNumber?`,
`streetAddress?`, `businessName?`, `avatarUri?`. **This was duplicated as a
local interface in 4 files before the auth-redesign session; it's now one
shared type — import it, don't redeclare it**),
`hhl_verification_status` (`'pending'`, or `'verified'` if that state is ever
reachable — nothing currently sets it to `'verified'`, there's no admin/review
backend, see §7). Added in the Profile/Settings build: `hhl_biometric_enabled`
(`'true'|'false'`), `hhl_notif_prefs` (JSON: emergencyAlerts/loveLocalDeals/
whatsOnEvents/communityReplies, all booleans). Added in the search/RSVP/
upvote/block build: `hhl_blocked_authors` (JSON array of author name
strings — matched by name, not a real user ID, since there's no real user
system yet). Added when the Share modal's persistence bug was fixed:
`hhl_user_posts` (JSON array of `CommunityPost`, newest first — user-submitted
posts, merged into the Home Feed on focus). Added with the detail-screens
build: `hhl_rsvps` (JSON object, `{ [eventId]: boolean }` — read/write via
`src/lib/rsvps.ts`'s `getRsvps`/`setRsvp`, shared between `whats-on.tsx` and
`event/[id].tsx` so RSVP state agrees between the list and detail views).
The full key list lives in `app/settings/account.tsx`'s
`ALL_APP_KEYS` — **that array must be kept in sync whenever a new top-level
`hhl_*` key is added** (adding a field *inside* `hhl_user_data`'s JSON, like
`phoneNumber`/`avatarUri` were, does NOT need a new entry there — it's still
one key), since "Delete my account" wipes exactly that list, nothing more,
nothing less.

| File | Status | Notes |
|---|---|---|
| `app/index.tsx` | ✅ Done | Animated splash + session-router logic |
| `app/onboarding.tsx` | ✅ Done | 3-slide button-driven carousel (no swipe gesture). Slide 1 copy is from the real mockup; slides 2–3 are original copy in the same voice (Love Local / What's On themed) |
| `app/welcome.tsx` | ✅ Done | Role select: Resident / Business / Visitor |
| `app/auth.tsx` | ✅ Done | **Split by mode, redesigned this session.** `mode=signup`: unchanged OTP flow (email-only — mobile/SA-phone was removed per earlier explicit request; demo code `123456`), role-aware fields, → `/profile-setup`. `mode=login` (returning users): **now email + password, no OTP** — a deliberate UX call (OTP-per-login was more friction than needed for returning users; OTP is now reserved for signup + security step-up, e.g. `settings/security.tsx`'s email-change flow already does this). Password is **mocked with the same transparent-demo pattern as the OTP PIN** (`DEMO_PASSWORD = 'demo1234'`, shown in-UI) — there's no real backend yet, don't mistake this for real auth; wire real `supabase.auth.signInWithPassword` when Phase 5 starts. Login only restores `hhl_session` — does **not** overwrite `hhl_user_role`/`hhl_user_data` (a real bug in the pre-redesign version: every login force-reset role to `'resident'`, which would've demoted a returning business user). OTP boxes now auto-advance focus on digit entry (were static — real bug, user-reported) |
| `app/profile-setup.tsx` | ✅ Done | Avatar picker — **now actually persists `avatarUri` to `hhl_user_data`** (real bug: previously kept in local state only, discarded the moment the user left the screen). Reads name/address from `hhl_user_data`, "Verify your address" status row → `/verify-address` |
| `app/settings/edit-profile.tsx` | ✅ Done | Edit name (or business name), phone number, and avatar photo after signup — this was a real gap (no way to update personal details once past onboarding). Business-role-aware label ("Business name" vs "Full name"). **`phoneNumber` here is a contact-info field only, not a login identifier** — doesn't reintroduce the mobile/SA-phone login option that was explicitly removed from `auth.tsx` per client request; email stays the only sign-in identifier |
| `app/verify-address.tsx` | ✅ Done | **UI shell only, no real OCR/backend.** Mocked "submitted for review" state, mirrors Gemini's `verifications_queue` concept in UI form only |
| `app/share-modal.tsx` | ✅ Done | Root-level modal (not a tab route) — 6-category share form matching mockup exactly. **Now actually persists** — was a real bug found in a post-build audit: submitting showed "Post published! Your update is live on the community feed" but nothing was ever saved anywhere, the post just vanished. Fixed as a local mock (matches the rest of the app's pattern — no real backend, see §7): new posts save to `hhl_user_posts` (AsyncStorage), Home Feed merges them in on focus, tagged `isPreApproved: false` and shown with a "Pending review" badge — this reuses a `CommunityPost` field that existed in the type since early in the build but was **never actually wired to anything** until now. Honest about scope: all 6 share categories (event, hood, lost & found, job, recommendation, business) become a generic community post on the Home Feed — none of them route to a dedicated destination (e.g. an "event" share does NOT create a real entry in `What's On`, a "business listing" share does NOT add to `Love Local`). "Add photos" button is now wired to `expo-image-picker` (previously had no `onPress` at all) |
| `app/(tabs)/_layout.tsx` | ✅ Done | 5-tab bar: Home, Love Local, Explore, What's on, Share (nav order matches brief). "Share" isn't a real route — its `tabBarButton` is overridden to push `/share-modal` |
| `app/profile.tsx` | ✅ Done | Profile Hub. **Not a tab** — deliberately kept off the 5-tab bar to preserve brief-matched nav; reached by tapping the Avatar in the Home Feed header. Identity header, address/verification card, quick-nav to Security/Notifications/Account/Legal. "Suburb switcher" and "Help & support" rows are still visible but disabled — no content built for them |
| `app/settings/legal/index.tsx` + `[doc].tsx` | ✅ Done (placeholder) | Privacy Policy / Terms of Service / Community Guidelines list + detail screens. **Placeholder text only, explicitly labelled as such on-screen (red banner)** — not real legal content, don't mistake it for drafted copy. Client will write real templates for their legal team to review; swap `DOC_CONTENT` in `[doc].tsx` when that's ready |
| `app/notifications.tsx` | ✅ Done | Notifications Activity Center, reached via the bell icon (with unread dot) next to the Avatar on the Home Feed. Reads `NOTIFICATIONS` mock array in `mock-data.ts`; read/unread state is local component state only, not persisted (consistent with the rest of the app — nothing here has a backend yet) |
| `app/settings/verification.tsx` | ✅ Done | Settings-context proof-of-address upload via `expo-document-picker` (accepts image or PDF) + street address field. **Distinct from** `app/verify-address.tsx` (the onboarding-flow version, image-only) — both write the same `hhl_verification_status`/`hhl_user_data` keys, so either flow satisfies the other |
| `app/settings/security.tsx` | ✅ Done | Email change (self-contained OTP flow, same demo-code pattern as `auth.tsx`'s signup OTP) — **email only, no mobile/phone option**, matching the explicit removal already documented for `auth.tsx`. This is the "step-up auth for sensitive settings" pattern — re-verify via OTP before a security-relevant change takes effect. OTP boxes auto-advance (fixed alongside `auth.tsx`'s same bug). Biometric toggle via `expo-local-authentication`, gated on `hasHardwareAsync`/`isEnrolledAsync`. "Active sessions" shows a single mock "this device" entry — there's no real session backend to enumerate (see §7) |
| `app/settings/notifications.tsx` | ✅ Done | 4 preference toggles (Emergency Alerts/Love Local Deals/What's On Events/Community Replies) → `hhl_notif_prefs`. These are **preferences only** — no push infrastructure (`expo-notifications`, permission prompts, a push token, or a server to send from) exists yet, so toggling them doesn't currently change what notifications arrive |
| `app/settings/account.tsx` | ✅ Done | "Log out" clears `hhl_session` only. "Delete my account" clears every key in `ALL_APP_KEYS` behind an `Alert.alert` destructive confirmation (Apple Guideline 5.1.1(v) compliance) |
| `app/(tabs)/index.tsx` | ✅ Done | Home Feed — rebuilt to match mockup exactly (header, hero card, pill tabs, "Hidden gems near you" facility grid, community posts). **Header greeting and avatar now read real `hhl_user_data`** (name, `avatarUri`) via `useFocusEffect` — previously hardcoded to "Hello, Sam." / initials "S" regardless of who actually signed up, which would've looked broken the moment `edit-profile.tsx` existed to change it. Upvote (ThumbsUp) is interactive — toggles + adjusts count, **local component state only, resets on remount/app restart** (no backend to persist it, see §7). "Block user" (via the "⋯" → `ReportModal`) is real: persists to `hhl_blocked_authors` (AsyncStorage, unlike upvotes) and actually filters that author's posts out of the feed. "Report post" still just simulates submission (honest — there's no moderation backend to receive it). **The 3 "Hidden gems" cards are now tappable** — the large card → `/event/[id]`, the 2 small offer cards → `/business/[id]` (via `offer.businessId`, guarded with `undefined` if not set — see `LoveLocalOffer` in §6). **The segmented tabs are now real** — "Around you" shows the original mixed grid (1 event + 2 offers), "What's on" shows up to 3 events, "Love Local" shows up to 3 offers; the section title and "See all" link (→ the matching tab screen) change with it, and "See all" is hidden entirely for "Around you" since a mixed view has no single destination. **Quick Ask is now real, not hardcoded** — shows the latest actual community post tagged `Job:` or `Recommendation:` (i.e. a real Share submission in one of those categories) if one exists; otherwise a tappable prompt that opens `/share-modal`. Still open from the audit: comments are display-only (see §7) |
| `app/(tabs)/love-local.tsx` | ✅ Done | Category-filtered business directory (`CategoryChips` + business cards) + search bar (filters by name/description, combines with category filter). **Business cards are now tappable** → `/business/[id]` (were plain non-interactive `<View>`s before) |
| `app/(tabs)/whats-on.tsx` | ✅ Done | Day strip (generated from **today's real date**, not hardcoded), featured event card, "This week" list. RSVP is interactive on both the featured card and each list row — toggles `isUserRsvped` + adjusts `rsvpCount`. **RSVP state moved from local-only to `hhl_rsvps`** (AsyncStorage, via `src/lib/rsvps.ts`'s `getRsvps`/`setRsvp` helpers) so it stays in sync with the new event detail screen — RSVPing from one screen now correctly reflects on the other. **Featured card + list rows are now tappable** → `/event/[id]` (the RSVP button inside each is a separate nested touchable, still works independently) |
| `app/(tabs)/explore.tsx` | ✅ Done | Category chips + search bar (filters by name/address, combines with category) + `react-native-maps` `MapView` (pins from `LOCAL_BUSINESSES[].coordinate`) + synced "Nearby" list below. **Tap behavior changed**: list row tap now opens `/business/[id]` (was: pan+select the pin); map pin tap still selects/highlights (unchanged) — map-browsing and going-deeper are now split between pin and row instead of both doing the same thing. **Map tiles won't render on Android until a real Google Maps API key replaces the placeholder** — see §8 |
| `app/business/[id].tsx` | ✅ Done | Business detail screen — hero image, name/category/rating/open-status, full description, address+hours, a small single-pin map of just that business, "Get directions" (opens the OS's native Maps app via a Google Maps URL with the business's real lat/lng — a real feature, not a mock, since it's just a URL hand-off). Reached from Love Local, Explore's list rows, and Home Feed's offer cards |
| `app/event/[id].tsx` | ✅ Done | Event detail screen — hero image, title/category/date/time/location, full description (`WhatsOnEvent.description`, added this session), RSVP button (reads/writes the shared `hhl_rsvps` key, same as `whats-on.tsx`), "Get directions" (opens native Maps via an address text search, since events don't have lat/lng coordinates the way businesses do). Reached from What's On's featured card + list rows, and Home Feed's large "Hidden gems" card |

**Note on expo-router:** a tab only appears in the bottom bar if its file
exists — declaring a `<Tabs.Screen name="x">` without a matching file just
produces a silent console warning ("Route x is extraneous") and the tab is
dropped. This tripped us up earlier in the session; keep it in mind if a tab
"disappears."

---

## 4. Reusable components (`src/components/`)

`StatChip`, `IconButton`, `HeroCard`, `PillTabs` (fixed 3-tab segmented
control), `FacilityCard` (image+title+subtitle grid card, large/small),
`Avatar` (`variant="soft"` for list rows, `variant="solid"` dark-fill for
profile avatars; now accepts an optional `imageUri` prop to render a real
photo instead of initials — pass `userData?.avatarUri`, falls back to
initials automatically when absent), `ListRow` (image/avatar + title + subtitle + trailing
element, full-width), `CategoryChips` (scrollable multi-option filter row,
distinct from `PillTabs`), `ReportModal` (reusable slide-up Report
post/Block user sheet — currently wired onto the Home Feed's community post
cards only, since that's the only user-generated content surface built so
far; not yet on Love Local or Explore), `StateViews` (`Skeleton` shimmer
placeholder + `EmptyState`, used by `app/notifications.tsx`'s empty state).

Reuse these before writing new ad-hoc styles — this is the intended design
system, matching the 8 named patterns documented in `docs/brand-board_7.html`
§05 ("Component standards").

---

## 5. Design tokens (already correct in code — don't re-derive from scratch)

- **`src/constants/theme.ts`** (added this session) — `colors` and `radius`
  objects. **Used by every file added this session** (`profile.tsx`, all of
  `settings/*.tsx`, `notifications.tsx`, `ReportModal`, `StateViews`).
  **Screens that predate this session (everything in the §3 table above it)
  still use hardcoded hex/number literals directly and have NOT been
  retrofitted** — don't assume `theme.ts` is used app-wide, and don't be
  surprised to find both patterns side by side until an explicit retrofit
  pass happens. New code: use `theme.ts`. Touching old code: match what's
  already there unless asked to migrate it.
- Typography: **DM Sans only** for UI text (DM Mono is a narrow, deliberate
  exception for OTP digit boxes only — see §2).
- Colors: Dark Spruce `#1C472A`, Radioactive Grass `#7ED957`, Hunter Green
  `#47663B`, Warm White `#FCFAF7`, Onyx `#0F0F0F`.
- Radius scale: 12 (chips/tags) / 16 (stat chips, list cards) / 24 (hero
  cards, sheets) / 999 (pills, nav, CTAs). No other radius values.
- Voice/casing: sentence case everywhere in UI copy (buttons, titles) —
  **never Title Case**, except eyebrows/labels (deliberately uppercase,
  wide letter-spacing). No emoji anywhere. Warm/neighbourly tone, never
  corporate ("Share something great," not "Submit Content").

---

## 6. Mock data (`src/lib/mock-data.ts`)

`LINDEN_MOCK_FEED` (hero announcement, love-local offers, what's-on events,
community posts) and `LOCAL_BUSINESSES` (7 businesses covering all 6 of the
brief's Love Local categories: Restaurants, Coffee Shops, Retail, Guesthouses,
Markets, Experiences — each with a `coordinate: {latitude, longitude}` used
by the Explore tab's map). All imagery reused from `assets/photography/` —
real Linden photos supplied by the client, not stock. Added this session:
`NOTIFICATIONS` (5 mock items across alert/deal/event/reply types) for the
Notifications Activity Center. Added with the detail-screens build:
`LoveLocalOffer.businessId?` (links the 3 seeded offers to their real
`LocalBusiness` — only these 3 are linked, a hypothetical new offer without
one is handled gracefully, just isn't tappable to a business) and
`WhatsOnEvent.description` (a real paragraph per event, not derived from
other fields — used by `event/[id].tsx`). `src/lib/rsvps.ts` is a small new
shared helper (`getRsvps`/`setRsvp`) — not really "mock data" but lives
alongside it since both event-facing screens depend on it for consistency.

---

## 7. What's explicitly NOT built / deferred (don't assume it exists)

- **Post-build audit findings (dead-end interactions)** — a systematic pass
  over every screen found a recurring pattern: browsing works, but "going
  deeper" mostly doesn't. Fixed since: Share's persistence bug, the missing
  business/event detail screens, Home Feed's segmented tabs (now actually
  filter the Hidden Gems grid), the dead "See all" links (Home Feed now
  routes to the matching tab, What's On's was removed since the screen
  already is the full list), and the hardcoded Quick Ask line (now shows a
  real Job/Recommendation post if one exists, else a prompt to Share) — see
  §3 for all of these. Still open:
  - **Comments are display-only** — a post shows a comment count
    (`MessageSquare` icon) but there's no way to open or add a comment
    anywhere in the app. This is the last item from the audit — **fully
    scoped in §10**, not yet built.
- **Google Maps API key** — `app.json` → `android.config.googleMaps.apiKey`
  is a placeholder string (`REPLACE_WITH_REAL_GOOGLE_MAPS_ANDROID_API_KEY`).
  Android's `MapView` is backed by the Google Maps Android SDK and needs a
  real key (Google Cloud Console → enable "Maps SDK for Android") before map
  tiles render on Android — until then the Explore tab's map will show a
  blank/grey grid with pins floating on nothing, everything else (pins,
  list, filtering, selection sync) works regardless. iOS uses Apple Maps by
  default and needs no key.
- **Supabase backend** — no schema, no real auth, no persisted data. Everything
  currently runs on mock data + AsyncStorage flags only. This is "Phase 5" per
  the original proposal's roadmap, and hasn't started.
- **Marketplace** — appeared in the mockup sprint as an extra screen, but the
  client brief explicitly lists it under "Future Features" (post-MVP). Not
  in scope for the current 5-tab build. Don't build it unless asked.
- **Real document verification / OCR** — `verify-address.tsx` and
  `settings/verification.tsx` are UI mocks only; no OCR, no admin review
  queue, nothing ever transitions `hhl_verification_status` to `'verified'`.
- **Real push notification delivery** — `settings/notifications.tsx`'s
  toggles persist a preference (`hhl_notif_prefs`) but there's no
  `expo-notifications` integration, no permission prompt, no push token, no
  server to send from. Toggling a preference today has zero effect on what
  notifications arrive, because none currently do.
- **Biometric-gated app unlock** — `settings/security.tsx`'s toggle
  persists a preference (`hhl_biometric_enabled`) and actually calls
  `LocalAuthentication.authenticateAsync()` once to confirm enabling it, but
  nothing reads that preference back to actually gate app launch/resume —
  `app/index.tsx`'s routing logic is untouched. Wiring that up is a bigger,
  separate change.
- **Suburb switcher, Help & support** — still visible as disabled rows on
  the Profile hub, no screens built, no content behind them. (Legal is now
  built as a placeholder — see §3 table — no longer in this deferred list.)
- **Report post is still a pure mock simulation** — unlike "Block user"
  (which is now real, see §3's Home Feed row), tapping a report reason just
  shows a "submitted" screen; nothing is actually sent anywhere, because
  there's no moderation backend to receive it. That backend is the
  **Content moderation dashboard** below.
- **Landing page** — a *separate* Next.js project per the proposal, not part
  of this Expo repo at all, not started.
- **Content moderation dashboard** — a separate web portal per the proposal's
  Phase 3, not started. This is where reports filed via `ReportModal` would
  actually need to land once it exists.

---

## 8. Environment / tooling status

- **Client demo plan**: targeted app launch is October 2026 (see §1); a
  client-facing presentation/demo will be needed before then. **Don't use
  Expo Go for that moment** — it requires the client to install a generic
  third-party app, shows "Expo Go" branding instead of the real app
  icon/name, and depends on network setup (same Wi-Fi, or a laggier tunnel).
  For presenting, build a real standalone install via EAS (`eas login` +
  `eas build:configure`, then `eas build --platform android/ios --profile
  preview`) so the client sees the actual app icon/name with no dependency
  on network conditions in the room. `eas.json` is already scaffolded
  (development/preview/production profiles) but **no real EAS project is
  linked yet** — that's the blocker, not code. Expo Go remains the right
  tool for day-to-day dev testing (see below), just not for the client
  moment itself.
- `expo-doctor` → **16/17 as of the search/RSVP/upvote/block build session**
  (was 17/17 before). The 1 new failure — "app config fields may not be
  synced in a non-CNG project" — is an expected side effect of the `android/`
  native folder now existing on disk (created automatically by `npx expo
  run:android`'s prebuild step during native-build attempts), not a
  regression in the feature code added this session. If going back to pure
  managed-workflow/EAS cloud builds later, remove `android/` first
  (`npx expo prebuild --clean` or `rm -rf android`) and this check should
  pass again. `npx tsc --noEmit` clean.
- App icon fixed: `assets/logo/icon-app.png` (square, opaque) and
  `assets/logo/icon-adaptive-foreground.png` (square, transparent, padded
  safe-zone) generated from the source logo via ImageMagick — both wired
  into `app.json`.
- `eas.json` scaffolded (development/preview/production profiles) but **no
  real EAS project is linked yet** — needs `eas login` + `eas build:configure`
  with a real Expo account before an actual device build/store submission is
  possible.
- **An AVD exists** (`Pixel_8`, Google Play system image) — created this
  session via Android Studio's Virtual Device Manager. It is **not left
  running by default**: it's RAM-heavy enough to noticeably slow this
  machine, so the workflow is launch-when-testing,
  close-when-done (`emulator -avd Pixel_8` /
  `%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Pixel_8`, then
  `adb devices` to confirm `device` not `offline`). Don't assume it's up —
  check first.
- **Switched to LDPlayer** (as of this session) — chosen over the stock AVD
  for its lower RAM/CPU footprint, and over Genymotion because Genymotion's
  free tier isn't licensed for commercial/client work (this project is under
  an NDA for a paying client — see §1). LDPlayer is third-party closed-source
  freeware, not part of the standard Expo/RN tooling chain. As of this note:
  installed, running, USB/ADB debugging enabled inside LDPlayer's settings —
  **but `adb devices` / `npx expo run:android` connecting to it has not yet
  been confirmed from this machine's tooling side.** Confirm `adb devices`
  shows it (may need `adb connect 127.0.0.1:<port>` — LDPlayer's default ADB
  port varies by version/instance, check LDPlayer's own settings for the
  exact port) before assuming it "just works" the way the AVD did.
- **The app has NEVER been successfully run/launched on a native target as
  of end of this session** — not once, on any screen, old or new. Every
  `npx expo run:android` / `gradlew` attempt this session failed before the
  app ever reached the emulator. Everything in this document marked "done"
  is verified only via `npx tsc --noEmit` (clean) and `npx expo-doctor`
  (17/17) — **not** by seeing it render. Web (`react-native-web`) preview
  hides native-only issues entirely and, for several features added this
  session, doesn't work at all: `react-native-maps` (Explore),
  `expo-document-picker` / `expo-local-authentication` (Settings) are
  native-only. **Do not report any screen as visually confirmed working
  until it has actually been seen on a device or emulator.**
- **Native Android build requires `JAVA_HOME` set explicitly** — this
  machine's only other Java is a JRE-8 stub (`java` on PATH resolves to it,
  but there's no `javac`; Gradle needs a full JDK). Android Studio bundles
  one: `JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"` (JDK 21).
  Without this, the build fails immediately with "No Java compiler found."
- **Recurring, unresolved Windows Gradle bug**: `npx expo run:android` /
  `gradlew app:assembleDebug` repeatedly failed with
  `java.io.UncheckedIOException: Could not move temporary workspace ... to
  immutable location` under `android/.gradle/8.8/dependencies-accessors/`.
  Happened across multiple attempts even after `rm -rf android/.gradle`
  each time and adding `org.gradle.vfs.watch=false` to
  `android/gradle.properties` (that line is now in place — note
  `android/gradle.properties` is inside the Expo-generated `android/`
  folder, so it gets **wiped by `expo prebuild --clean`**; re-add it if that
  ever runs). Neither fix resolved it. This is a known class of Windows
  issue usually caused by antivirus/Windows Defender locking a file during
  Gradle's atomic cache-directory rename — **not attempted**: adding a
  Defender exclusion for the project folder or `android/.gradle`, since
  that's a system security setting change outside what an AI agent should
  do unilaterally. If this recurs, that's the next thing to try, done by
  the developer directly (Windows Security → Virus & threat protection →
  Exclusions → add `C:\Projects\apps\Hello-Hyperlocal`).
- `agent-device` (Callstack's CLI for AI-driven device testing) is installed
  globally, and the Expo MCP server is connected/authorized. `agent-device`'s
  `web setup` command is currently broken on Windows (an upstream npm-detection
  bug in the CLI itself, not something in this repo) — untested whether it
  works once a real Android emulator exists instead of the web target.
- No `.env` file — Supabase env vars aren't set, intentional since there's no
  real backend yet.

---

## 9. Key decisions worth knowing (to avoid re-litigating or contradicting)

- Multi-tenant architecture (suburb-by-suburb scaling) was specified in the
  proposal but **is not yet reflected in the code** — everything is hardcoded
  to "Linden." Worth keeping in mind if/when real data modeling starts, but
  not a current bug.
- Apple/Google **in-app purchase compliance**: any future paid digital listing
  (boosted posts, paid job listings) must use native IAP, not a direct SA
  payment gateway (PayFast/Yoco) inside the app, or risk app store rejection.
  Relevant whenever monetization features get built — not yet an issue since
  nothing is monetized yet.
- **Silent font fallback bug**: a `Text` style with `fontSize` but no `fontFamily`
  doesn't error — RN just falls back to the OS default font (San Francisco on
  iOS, Roboto on Android) for that one block of text, silently, with no
  warning. Found and fixed 3 instances this session: `welcome.tsx`
  (`subtitle`, `cardBody`) and `auth.tsx` (`subtitle`) — all now use
  `fonts.sans.regular`. There's no lint rule catching this; if body text
  looks subtly "off-brand" again, check for a style with `fontSize` but no
  `fontFamily` before assuming it's something else.
- The Home Feed's exact layout/copy was matched against the mockup screenshots
  pixel-by-pixel this session after an earlier draft (built by a different
  tool) diverged from them — if something looks "off" against a mockup again,
  check the actual screenshot files in `docs/UI Mockup Production Sprint/screenshots/`
  before guessing.

---

## 10. NEXT UP — Comments feature (scoped, not yet built)

This is the last item from a post-build audit (§7) that found a recurring
pattern of "browsing works, going deeper mostly doesn't." Everything else
from that audit is fixed (Share persistence, business/event detail screens,
Home Feed's segmented tabs, dead "See all" links, the hardcoded Quick Ask
line). Comments are the one that's left: a post shows a comment count
(`MessageSquare` icon, `post.commentsCount`) but there's no way to open or
add one anywhere in the app. This section is a scope, not code — nothing
below has been built yet.

**Recommended approach: a dedicated `app/post/[id].tsx` detail screen**,
matching the pattern already established by `app/business/[id].tsx` and
`app/event/[id].tsx` this session — consistent with how the rest of the app
now handles "go deeper on this card." It also incidentally fixes a smaller
related gap: there's currently no way to link to or reference one specific
post at all. **Lighter alternative**: an inline expandable comment thread
directly on the Home Feed card (accordion-style) — faster to build, less
consistent with the established detail-screen pattern, and doesn't fix the
no-way-to-reference-a-post gap. Whoever picks this up should choose one
rather than defaulting silently; the dedicated-screen approach is the
recommendation, not a decision already made.

**Data model** — add to `src/lib/mock-data.ts`:
```ts
export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  timeAgo: string; // static 'Just now' for anything added this session,
                    // matching the existing pattern used by hhl_user_posts
                    // and the OTP/RSVP mocks — don't over-engineer real
                    // relative-time computation for a mock feature.
}
```

**Storage** — new `hhl_comments` AsyncStorage key (flat `Comment[]`, filter
by `postId` at render time — matches the flat-array shape of
`hhl_user_posts`, not a nested object). New top-level key: **remember to
add `'hhl_comments'` to `app/settings/account.tsx`'s `ALL_APP_KEYS`** — see
the warning about this in §3, it's been missed before. Suggest a
`src/lib/comments.ts` helper (`getComments`, `addComment`) mirroring
`src/lib/rsvps.ts`'s `getRsvps`/`setRsvp` shape exactly, for consistency.

**Bundled fix needed alongside this**: upvotes currently live in
`app/(tabs)/index.tsx`'s local `communityPosts` state only, not persisted
anywhere (§3, §7). If a post detail screen gets its own upvote button, it
will hit the **exact same cross-screen sync bug that RSVP had** before it
was moved to `hhl_rsvps` (§3, §6) — upvoting on the detail screen wouldn't
show up on the Home Feed list and vice versa. Fix it the same way: migrate
upvote state to a shared `hhl_upvotes` key (`Record<postId, boolean>`) via
the same `getRsvps`/`setRsvp`-style helper pattern, used by both
`index.tsx` and the new `post/[id].tsx`. Don't build the comment screen
with upvotes still local-only — it'll look broken in exactly the way RSVP
did before that fix.

**`commentsCount` should become derived, not a static number** — once real
comments exist, compute `commentsCount` as the actual count of matching
`Comment` records for that post rather than a fixed mock integer. This is
different from how upvotes work (upvotes have no real backing content, just
a boolean + a mock base number to add to) — comments have real content, so
the count should reflect reality, not simulate it.

**Post detail screen (`app/post/[id].tsx`) should contain**: header back
button; the full post (avatar, author, time, the `isPreApproved` "Pending
review" badge if applicable, title, content, image if present); the
upvote button (now backed by `hhl_upvotes`); a comment list (avatar/initials,
name, content, `timeAgo`); a text input + submit at the bottom that calls
`addComment` and appends to the visible list immediately (optimistic, no
loading state needed — this is a local mock, not a network call).

**Entry point**: Home Feed's comment icon+count (`app/(tabs)/index.tsx`,
currently a non-touchable `<View>` around `MessageSquare` + `commentsCount`)
becomes tappable → `router.push('/post/${post.id}')`. Register the new
route in `app/_layout.tsx` (`<Stack.Screen name="post/[id]" ... />`),
following the exact pattern already used for `business/[id]` and
`event/[id]`.

**Open honesty question, not yet decided**: should new comments carry the
same `isPreApproved: false` / "Pending review" treatment that Share posts
get, per the brief's "everything is moderated before publishing" line? Or
should comments post instantly with no moderation gate, matching how most
apps treat live comment threads versus original posts? No call has been
made either way — flag it and ask rather than assuming, it changes the UX
of the input (does the comment appear "pending" the moment you post it, or
just appear normally).

**Verification checklist once built**: `npx tsc --noEmit`, `npx expo-doctor`,
the font-consistency scan (a Python one-liner script this session used
repeatedly — see the pattern of checking every `fontSize` has a matching
`fontFamily`, §9's silent-font-fallback note explains why), and confirm
`hhl_comments` + `hhl_upvotes` are both added to `ALL_APP_KEYS`.

---

## 11. How to resume work

```bash
cd C:\Projects\apps\Hello-Hyperlocal
npx expo start --web        # preview in browser (fastest, no emulator needed)
npx tsc --noEmit             # typecheck
npx expo-doctor              # project health check
```

To test on a real Android target once the emulator exists:
`npx expo run:android` or `npx expo start` + open in the emulator.

---

## 12. Maintenance

**Update this file** whenever you complete a meaningful chunk of work — new
screens, new decisions, new known issues, changes to what's deferred. Treat
section 3 (screens) and section 7 (what's not built) as the two sections most
likely to go stale first.
