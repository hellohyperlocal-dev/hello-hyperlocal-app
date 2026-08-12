# Hello Hyperlocal — Project Handover

## ✅ REBUILD COMPLETE (Expo SDK 54, cutover finished 2026-08-12)

**This section is now historical context, not an active blocker** — the
rebuild described below is complete and `master` on
`hellohyperlocal-dev/hello-hyperlocal-app` now IS this codebase. The rest of
this document (§2 onward) is no longer superseded by anything.

**How cutover happened**: `hello-hyperlocal-rebuild` (a fresh
`create-expo-app` scaffold, never branched from the real repo) was pushed to
branch `rebuild/sdk54-wip`, verified via GitHub Actions CI
(`gradlew assembleDebug` passing clean on GitHub's Linux runners — proof the
native build compiles correctly, after local Windows builds hit a
Windows-specific `react-native-worklets` bug and a WSL2 workaround proved too
unstable in this environment to finish), then force-merged into `master`
(`git push origin origin/rebuild/sdk54-wip:master --force`) since the two
branches had unrelated histories and couldn't produce a normal PR diff. The
pre-cutover SDK 51 state is fully preserved and recoverable via the
`pre-rebuild-sdk51` git tag.

**Still genuinely open, not done yet**: visually confirming `expo-maps`
renders real map tiles on-device — confirmed the native module loads and
fails gracefully (not a crash) when Google Play Services is unavailable
(the LDPlayer instance used for testing didn't have it), which is real
positive signal, but actual rendered tiles were never seen. Try on a real
device or a Play-Services-enabled emulator whenever convenient.

The original app (this repo, SDK 51) is being **rebuilt from scratch** on
current Expo SDK 54 / React Native 0.81.5 / mandatory New Architecture, after
repeated native-module breakage on the old stack (an unrecoverable
`expo-updates` crash, a web build broken by `react-native-maps`, and the
client's Expo Go no longer supporting SDK 51 at all — Expo Go only supports
the current SDK). Decision made 2026-08-12; full rationale and step-by-step
plan at `C:\Users\Lambert Van Sittert\.claude\plans\cool-i-will-check-keen-shell.md`
(read that file for the complete plan — this is just a status tracker).

**Key decisions locked in:**
- Rebuilding fresh in an isolated sibling directory
  (`C:\Projects\apps\hello-hyperlocal-rebuild`), NOT touching this repo's
  `master` branch, until the new build is fully verified. This repo stays
  live/deployable throughout.
- Maps: migrating from `react-native-maps` to **`expo-maps`** (Expo's
  New-Arch-native replacement) — decided up front, not deferred.
  `expo-maps` requires **iOS 17 minimum**.
- Same EAS project (`projectId` `1d1fa914-a04b-4c86-bd44-9da0da9a763a`) and
  same GitHub repo (`hellohyperlocal-dev/hello-hyperlocal-app`) get reused
  at cutover — not recreated.

**Progress checklist** (updated after each step completes — check the plan
file for exact task detail per step):

- [x] Step 1 — Fresh SDK 54 scaffold created at `hello-hyperlocal-rebuild`
- [x] Step 2 — Port foundation layer (theme, fonts, mock-data, quiz-data, persona-scoring, supabase client, assets) — `tsc --noEmit` clean.
  **Notes for next session:**
  - This SDK 54 default template routes from `src/app/` (not root `app/`), with a `@/*` → `./src/*` path alias already configured in `tsconfig.json`. Deliberately adopted this instead of forcing the old root-`app/` layout — it's the current idiomatic Expo structure, not worth fighting.
  - The old repo's `assets/lib/mock-data.ts` had a stray dependency on `require()` for images working without any explicit type declaration — that's because the OLD project never actually had an `expo-env.d.ts` file checked in (it used to be gitignored, evidenced by a `.gitignore` diff earlier this session removing that line — probably deleted accidentally at some point in the old repo and nobody noticed since typechecking still passed via some other stale state). The **new** scaffold needed `expo-env.d.ts` created manually (standard content: `/// <reference types="expo/types" />`) since `expo-doctor` does NOT auto-generate it (only `expo start`'s dev-server bootstrap does) — if you hit "Cannot find name 'require'" errors in a fresh Expo project, this is why.
  - Installed via `npx expo install`: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`.
- [ ] Step 3 — Port components + rewrite `AppMapView` against `expo-maps`
- [x] Step 3 — Port components + rewrite `AppMapView` against `expo-maps` — `tsc --noEmit` clean.
  **Notes for next session:**
  - `expo-maps`'s real API is nothing like `react-native-maps` — no unified `MapView`, instead separate `AppleMaps.View` (iOS) / `GoogleMaps.View` (Android) components, each taking a `markers` **array** prop (not JSX children), a `cameraPosition: {coordinates, zoom}` instead of `initialRegion` with lat/lng deltas, and — important — **the two platforms' marker shapes aren't symmetric**: iOS markers have `title`/`tintColor` but no description-equivalent field; Android markers have `title`/`snippet` but no color/tint field at all (would need a custom `icon` image). `src/components/AppMapView.tsx` preserves the old `<MapView><Marker/></MapView>` JSX-children call-site API by having `Marker` render `null` and having `AppMapView` walk `React.Children` to extract marker data — so `explore.tsx`/`business/[id].tsx` port with zero changes, per the plan. Read the comments in that file before touching it again; the platform-asymmetry (pinColor iOS-only, description Android-only) is a real, permanent limitation of `expo-maps`, not a bug to "fix."
  - `expo-maps` is confirmed **alpha** and **not available in Expo Go** (same limitation `react-native-maps` had) — `AppMapView.tsx` keeps the same Expo-Go-detection + `StaticMapPlaceholder` fallback pattern as before. Real maps only render in a dev client or standalone/EAS build.
  - `npx expo install expo-maps` auto-added itself to `app.json`'s `plugins` array — no manual config needed there.
  - Also installed (needed by ported components): `lucide-react-native`, `@react-navigation/bottom-tabs`, `react-native-svg` (lucide's peer dep).
- [x] Step 4 — Port screens/routes (entry funnel → tabs → detail screens → settings) — `tsc --noEmit` clean, `expo-doctor` 20/20.
  **Notes for next session:**
  - Ported all ~26 screens across 4 parallel passes (entry funnel, tabs, detail screens, settings) + hand-wrote the root `src/app/_layout.tsx` (route registration) myself afterward, since that file ties everything together and isn't any single group's responsibility. All routes from the old `app/_layout.tsx` are registered identically (same screen names, same `share-modal` modal presentation).
  - Every screen's imports into `src/` were rewritten from relative paths to the `@/*` alias (`@/components/...`, `@/constants/...`, `@/lib/...`) — this is now the consistent convention across the whole ported app.
  - **Fixed, not just ported**: two small React 19 / SDK 54 compatibility issues that don't change behavior — (1) `ref={(ref) => (otpRefs.current[idx] = ref)}` pattern (auth.tsx, settings/security.tsx, settings/verification.tsx) had to become a block-bodied arrow (`ref={(ref) => { otpRefs.current[idx] = ref; }}`) since React 19's stricter ref-callback typing rejects a callback that returns a value; (2) `NodeJS.Timeout` → `ReturnType<typeof setInterval>` (auth.tsx) since the global Node type isn't available the same way. Both are type-only fixes, zero runtime change.
  - **Fixed, real cross-package type mismatch**: `src/components/TopTabBar.tsx` was typed against `BottomTabBarProps` imported from `@react-navigation/bottom-tabs` directly — but `expo-router` vendors its own slightly-different copy of that same type (a `ColorValue` vs `string` mismatch, several layers deep), causing a real `tsc` error at `(tabs)/_layout.tsx`. Fixed by deriving the prop type directly from `expo-router`'s own `Tabs` component's `tabBar` signature instead of importing the type from `@react-navigation/bottom-tabs` — see the comment in `TopTabBar.tsx`. Removed `@react-navigation/bottom-tabs` as a dependency entirely once nothing else needed it.
  - Additional packages installed during this step (all via `npx expo install`, SDK-54-compatible versions resolved automatically): `expo-image-picker`, `expo-local-authentication`, `expo-document-picker`.
- [x] Step 5 — Port `app.json`/`eas.json`/`vercel.json` — `expo-doctor` 20/20.
  **Notes for next session:**
  - `app.json`/`eas.json`/`vercel.json` all ported with the same identity (`name`, `slug`, `bundleIdentifier`/`package`, `scheme`, `owner`, and critically the same `extra.eas.projectId` `1d1fa914-a04b-4c86-bd44-9da0da9a763a` and `updates.url`) — same EAS project will be reused at cutover, not recreated.
  - **SDK 54 removed the old top-level `app.json` `splash` config schema entirely** (`expo-doctor` fails config validation if you keep it) — native splash is now plugin-only. Re-added `expo-splash-screen` (dependency + config plugin) with the same `image`/`backgroundColor` as before. **Worth a visual check once running**: the new plugin format is icon-style (fixed-width centered image), not the old full-bleed "contain" resize mode — `hhl-splash.png` may have been designed for the old full-bleed behavior. Not verified visually yet (no device run performed as of this note) — check this in Step 6 and consider whether the splash image needs redesigning for the new format, that's a content/design call, not something I should decide unilaterally.
  - Removed unused template-only packages that came bundled with `create-expo-app`'s default template but were never referenced by any ported code: `@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-symbols`, `expo-system-ui`, `expo-web-browser`, plus initially `expo-splash-screen` (before re-adding it properly for the splash fix above). Also removed the template's placeholder assets (`assets/images/`, `assets/expo.icon`) and its example `scripts/reset-project.js`.
  - `package.json`: renamed from the scaffold's `hello-hyperlocal-rebuild` to the real `hello-hyperlocal-mobile` (matching OLD project), and restored the `android`/`ios` scripts to `expo run:android`/`expo run:ios` (full native builds) rather than the template's default `expo start --android/ios` (lighter dev-client-only launch) — matches how this project has actually been built/tested.
  - Kept the new template's `experiments.typedRoutes`/`experiments.reactCompiler` and `web.output: "static"` — these are current SDK 54 defaults not present in the old SDK 51 config, adopted deliberately as part of "latest tech stack," not carried over from the old app.
- [~] Step 6 — Full standalone verification — **NATIVE BUILD VERIFIED (2026-08-12, via GitHub Actions CI, see below); on-device manual walkthrough still outstanding.**
  **RESOLUTION (2026-08-12, later same night):** WSL2 (below) was fought for hours and abandoned — not a code problem, but a pattern of the WSL2 VM/its `wsl.exe` client getting killed every ~10-20 minutes regardless of a `vmIdleTimeout=-1` fix, compounded early on by this machine genuinely running low on disk space (99% full at one point, unrelated to this project — freed back to 101GB). **Pivoted to GitHub Actions CI instead**: `.github/workflows/android-build.yml` pushed to `rebuild/sdk54-wip`, builds on GitHub's own clean Linux runners. **First run completed successfully** — `gradlew assembleDebug` passes with zero code errors, `app-debug.apk` artifact confirmed downloadable. This is the actual proof the SDK 54 rebuild compiles correctly. See §8 for the full decision-tree writeup. WSL2 history below kept for reference only — don't resurrect it as the default path, GitHub Actions is simpler and already proven.
  **What's verified clean:** `npx tsc --noEmit` (whole project), `npx expo-doctor` (20/20), `npx expo export --platform web` (all 30 routes exported successfully, first try).
  **What's blocked:** `npx expo run:android` / `./gradlew assembleDebug` locally on this Windows machine fails with a C++ linker error in `react-native-worklets`' native build (`ld.lld: error: undefined symbol: std::__ndk1::mutex::lock()` and many similar undefined-symbol errors for basic C++ runtime symbols — `operator new`, `__cxa_throw`, `std::bad_alloc`, etc).
  - **This is a known, unresolved, Windows-specific upstream issue** — confirmed via GitHub `expo/expo#40468` (same exact error signature). The reporter there: identical build succeeds on EAS Build (Ubuntu) but fails locally on Windows; tried NDK 26, NDK 27, full cache clears, full Android Studio/SDK reinstalls — none fixed it. This is not something wrong in this project's code or config — `react-native-worklets` (reanimated 4.x's new native dependency, package version `0.10.1` as of this rebuild) currently has a broken/unreliable native Windows local-build path.
  - **Tried tonight, for the record**: 3 build attempts. 1st got killed by a tool timeout mid-Gradle-download (not a real failure). 2nd hit a stale lock file from the killed 1st attempt's orphaned daemon (killed the orphan, not a real failure). 3rd got all the way through 344 actionable tasks (251 up-to-date from cache) and failed specifically on `react-native-worklets`' native `.cxx`/CMake link step — this is the real, reproducible blocker.
  - **Real options for whoever picks this up** (not decided yet — needs a call, likely from the developer given time/tooling tradeoffs):
    1. **Build via EAS Build (cloud/Linux)** instead of locally — known to work around this exact issue per the GitHub thread, but re-introduces the free-tier EAS queue slowness documented earlier tonight (~13-day estimate seen once already this session).
    2. **Try WSL2** (Windows Subsystem for Linux) on this same machine — would use a real Linux toolchain locally, matching the environment where this issue doesn't occur, without EAS's queue. Not attempted yet.
    3. **Wait for an upstream fix** to `react-native-worklets`/`react-native-reanimated` — check its GitHub for newer releases before retrying locally; this is a very new package (split out of reanimated in the 4.x line), plausible this gets fixed soon.
  - **Not yet done regardless of which option is chosen**: installing to a real device and manually walking the app (signup → quiz → tabs → explore/business maps → settings), and testing on a real device via Expo Go/dev client. The web export being clean is a good sign the app logic itself ported correctly, but native-only behavior (the real `expo-maps` rendering, biometrics, image/document pickers) is still unverified on-device.

  **WSL2 attempt in progress (2026-08-12, interrupted by /clear):** Chose option 2 (WSL2) over EAS/stopping. Progress so far:
  - WSL2 platform was already enabled on this machine (`wsl --status` showed Default Version: 2, no reboot needed) — just no distro installed.
  - Installed Ubuntu via `wsl --install -d Ubuntu --no-launch`, confirmed working via `wsl -d Ubuntu -u root -- whoami` (root access works without needing the interactive first-run username/password wizard — this is the way to drive WSL non-interactively).
  - Installed JDK 21 successfully (`apt-get install openjdk-21-jdk-headless`) — confirmed via `java --version` inside WSL.
  - Wrote `wsl-setup.sh` (still at `C:\Projects\apps\hello-hyperlocal-rebuild\wsl-setup.sh`, accessible from WSL at `/mnt/c/Projects/apps/hello-hyperlocal-rebuild/wsl-setup.sh`) to install Node.js 22 + Android SDK cmdline-tools + platform-tools + `platforms;android-36` + `build-tools;36.0.0` + `ndk;27.1.12297006` + `cmake;3.22.1` to `/opt/android-sdk`, and persist `ANDROID_HOME`/`PATH` in `/root/.bashrc`. **This script itself is fine and hasn't been proven to fail** — the run attempt failed for an unrelated reason (below), not a bug in the script.
  - **Real lesson learned, important for next attempt**: launched the script via `wsl -d Ubuntu -u root -- bash -c "nohup bash /mnt/...wsl-setup.sh > /tmp/... & disown; echo started"` — this pattern does NOT work for WSL2 the way `nohup`+`disown` works for a normal background Linux process. WSL2 tears down the entire lightweight VM instance shortly after the last attached `wsl.exe` client disconnects (by default), which kills everything running inside it — `nohup`/`disown` only protects a process from its *parent shell* exiting, not from the whole VM being shut down. Confirmed via `/tmp`'s timestamp resetting and the setup log file being gone entirely a few minutes later.
  - **Fix for next attempt**: don't background *inside* WSL. Instead, run the setup script as the foreground command of the outer tool call, using this session's own `run_in_background: true` (i.e. keep the `wsl.exe` process itself alive as the thing being backgrounded, from the Windows/Git-Bash side) — e.g. `wsl -d Ubuntu -u root -- bash /mnt/c/Projects/apps/hello-hyperlocal-rebuild/wsl-setup.sh` run with the tool's own background flag, not `nohup ... &` inside the WSL command string. That keeps one `wsl.exe` client continuously attached for the script's whole duration, which should prevent the idle VM shutdown. Alternatively/additionally, could set a longer `vmIdleTimeout` in `%UserProfile%\.wslconfig`'s `[wsl2]` section, but the "keep a client attached" approach is simpler and doesn't require editing Windows-level config.
  - **Also learned**: when invoking `wsl.exe` from this Windows machine's Git Bash, bare Unix-style path arguments passed directly (not inside a quoted `bash -c "..."` string) get mangled by MSYS's automatic path translation (e.g. `wsl ... -- tail /tmp/foo.log` silently rewrites `/tmp/foo.log` into a Windows path before `wsl.exe` ever sees it, causing a false "file not found"). Always wrap WSL commands as `wsl -d Ubuntu -u root -- bash -c "...actual unix commands..."` to keep paths intact.
  - **Next step when resuming**: rerun `wsl-setup.sh` using the fixed backgrounding approach above, then once Node/SDK/NDK are installed, copy the project into WSL's native filesystem (e.g. `cp -r /mnt/c/Projects/apps/hello-hyperlocal-rebuild ~/hello-hyperlocal-rebuild` — do NOT build directly from `/mnt/c/...`, cross-filesystem I/O between Windows and WSL2 is slow and can cause its own flaky issues), run `npm install` fresh inside WSL (Linux-native `node_modules`, can't reuse the Windows-built one), then `npx expo prebuild --platform android --clean` + `./gradlew assembleDebug` from inside WSL.

  **UPDATE (still 2026-08-12, later same night) — WSL2 setup fully completed and the build got FAR, then was manually stopped (not failed) due to session length. Genuinely promising result, pick this up first next time:**
  - WSL2 Ubuntu now has everything working: JDK 21, Node 22, Android SDK (build-tools 36.0.0, platforms;android-36, NDK 27.1.12297006, cmake 3.22.1) — all confirmed installed and functional. Helper scripts left in place at `C:\Projects\apps\hello-hyperlocal-rebuild\`: `wsl-setup.sh` (installs the toolchain, idempotent/safe to rerun), `wsl-build.sh` (copies project into WSL-native `~/hello-hyperlocal-rebuild`, `npm install`, `expo prebuild`, `gradlew assembleDebug`), `wsl-stop.sh` (clean shutdown), `wsl-verify.sh`, `wsl-poll.sh`. All still valid, just rerun `wsl-build.sh` to pick up where this left off (it does a fresh `npm install`/`prebuild` each time, so it's safe to rerun from scratch — no partial-state corruption risk).
  - **Critical tool-usage lesson, applies to ALL future WSL commands in this environment, not just this project**: inline `$VAR` references in a `wsl -d Ubuntu -- bash -c "..."` command string get silently stripped/emptied by something in this tool layer BEFORE reaching the actual shell — confirmed via minimal repro (`bash -c 'X=5; echo $X'` returned empty). This happens regardless of single vs. double quoting. **Fix: never inline `$` references in a WSL command string — always write the commands to a `.sh` file first (via the Write tool) and invoke `wsl -d Ubuntu -u root -- bash /mnt/c/path/to/script.sh`.** Plain literal-string commands with no `$` (e.g. `bash -c 'echo hello'`) work fine inline.
  - **Second lesson**: `MSYS_NO_PATHCONV=1` must be exported before any `wsl ...` invocation from this machine's Git Bash, or Unix-style path arguments (e.g. `/mnt/c/...`) get mangled into bogus Windows paths (`C:/Program Files/Git/mnt/c/...`) before `wsl.exe` ever sees them.
  - **Third lesson**: don't `nohup ... & disown` *inside* a `wsl -d Ubuntu -- bash -c "..."` invocation expecting it to survive — WSL2 tears down the whole lightweight VM shortly after the last attached `wsl.exe` client disconnects, killing everything inside including nohup'd processes. Instead, wrap the *outer* `wsl.exe` invocation itself in `nohup ... & disown` at the Windows/Git-Bash shell level (i.e. `nohup wsl -d Ubuntu -u root -- bash /path/to/script.sh > outerlog 2>&1 & disown`) — this keeps one `wsl.exe` client attached for the whole script's duration (preventing VM idle-shutdown) while also escaping this tool's own ~10-minute per-call timeout cap.
  - **The build itself got a long way in** before being manually stopped (not a failure — user chose to stop for the night given session length): `npm install` succeeded, `expo prebuild` succeeded, and `gradlew assembleDebug` ran for **35+ minutes actively compiling** — well past the exact point where the Windows-native build died (the `react-native-worklets` C++ link step) — reaching Kotlin compilation of `expo-modules-core`, `react-native-worklets` native lib merging, and most `expo-*` package configuration, with no errors of any kind logged. This is a strong signal the WSL2 approach is genuinely working and just needs to be let run to completion (stopped by choice, not by any error) — **rerun `wsl-build.sh` next session and just let it finish; no new investigation should be needed, this looks like it was on track to succeed.**
- [x] Step 7 — Cut over: new branch pushed (`rebuild/sdk54-wip`), native build verified via GitHub Actions CI, force-merged to `master` (unrelated histories — see banner at top of this file). Vercel preview deploy verification dropped (was only ever a backup client-access plan, not a real requirement). Old SDK 51 state preserved via `pre-rebuild-sdk51` tag.

**Until "REBUILD COMPLETE" is marked here**, this repo (`Hello-Hyperlocal`,
not `hello-hyperlocal-rebuild`) is still the live/deployed version — don't
assume the rebuild is what's running in production/on the client's device
until Step 7 is checked off.

---

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

- **Client demo / dev-testing decision tree** (learned the hard way over a
  multi-hour tunnel-debugging session on 2026-08-12 — follow this exactly,
  don't improvise a new tunnel approach):

  | Need | Tool |
  |---|---|
  | Developer's own quick iteration | `expo start` (LAN, no tunnel) |
  | Quick informal remote peek (not client-facing) | `expo start --tunnel`, run by a human directly in their own interactive terminal — **never scripted or backgrounded**, confirmed to fail 3 different ways when automated; expect it may need 1-2 restarts. Prints a `exp://<random>.exp.direct` URL each time it starts — this is the *only* URL format Expo Go's scanner handles correctly; don't try to construct/pair one manually with a separately-run ngrok tunnel, that path is a confirmed dead end (Expo Go hard-codes `http://<host>:8081` for any non-Expo-owned domain, ignoring scheme and port) |
  | Client needs to actually use/carry the app | Real EAS build (`eas build --platform android/ios --profile preview`), installed once — no Expo Go, no tunnel, no network dependency in the room. `eas.json` is scaffolded and **the EAS project is now linked** (`projectId` `1d1fa914-a04b-4c86-bd44-9da0da9a763a`, owner `lambo_24`) — this is no longer the blocker it once was. Apple Developer Program enrollment submitted 2026-08-12, ~2 business days for approval; iOS builds/TestFlight are blocked until that clears, no workaround exists (ad-hoc iOS distribution requires an active paid membership, full stop) |

  **EAS Update via Expo Go is not a supported path for this project as
  currently configured** — `runtimeVersion` policy is `appVersion`,
  incompatible with Expo Go's `exposdk:` requirement (`No launchable update
  was found`); the workaround (temporarily publishing under `exposdk:`
  format) also hit a backend `Experience does not exist` error. Don't
  rediscover this — go straight to the tunnel or a real build instead.

  **Native Android build verification**: local Windows builds hit a
  confirmed, currently-unresolved upstream bug (`react-native-worklets`
  C++ linker error, matches GitHub `expo/expo#40468`) — don't retry local
  `gradlew`/`expo run:android` expecting it to work. **GitHub Actions CI**
  (`.github/workflows/android-build.yml` on `rebuild/sdk54-wip`, added
  2026-08-12) is the proven path — builds clean on GitHub's Linux runners
  with zero environment-specific issues, confirmed working. A WSL2-based
  local alternative was attempted first and abandoned after repeated
  environment instability (unrelated to the code) — not worth resurrecting
  as the default path; GitHub Actions is simpler and already proven.
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
