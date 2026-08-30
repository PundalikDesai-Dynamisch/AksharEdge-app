# AksharEdge

A React Native mobile app for **child cognitive / dyslexia screening**, used by a parent and
child together. A parent creates a child profile, the child completes a set of age-based game
assessments (built in Unity, embedded via Unity-as-a-Library) plus a handwriting assessment,
and the parent receives a personalised screening report.

Target age range: **5–14**. Android + iOS, portrait-first.

---

## Product flow

```
Splash → Welcome → Sign Up / Sign In
   → Parent Home            (empty-state carousel | populated child list)
   → Create Child Wizard    (identity → details → location gate → camera gate → confirm)
   → Ready to Play          (per-child dashboard; Report locked until assessment completes)
   → Mission Intro → Game rounds (Unity) → Handwriting capture → Celebration
   → Ready to Play          (Play now locked, Report unlocked)
   → Screening Report
```

Location and Camera are **hard permission gates** — there is no skip, no "maybe later", and no
hidden forward path. Only a genuinely granted OS permission unlocks the next step.

---

## ⚠️ Current state — read before you build

This repository is **mid-migration**. The infrastructure below works; the product surface is
still being retargeted from an earlier teacher-facing app to AksharEdge.

| | State |
|---|---|
| Firebase auth (email + Google), navigation, theme, shared components | ✅ Working |
| Unity game embedded and building on Android | ✅ Working (arm64 device only) |
| `src/features/students/`, `src/features/uploads/`, `src/features/dashboard/` | ⚠️ Legacy teacher-product screens, scheduled for removal |
| App id `com.aksharedge.teacher`, display name "AksharEdge Teacher" | ⚠️ Rename pending |
| `yarn typecheck` | ❌ **3 errors** — all in `src/features/games/screens/UnityGameScreen.tsx` |
| `yarn lint` | ❌ **4 errors, 8 warnings** — same two Unity screens |
| `yarn test` | ⚠️ No test files exist yet |

A clean `typecheck` and `lint` is a hard gate for every phase — fixing those 7 errors is the
first task, not a background chore.

The RN project's internal name is still `DyslexiaApp` (visible in `ios/DyslexiaApp/`,
`android/settings.gradle`, and the `postinstall` script). That is deliberate — renaming it
ripples through the Xcode project for no user-visible benefit.

---

## Stack

| | Version |
|---|---|
| React Native | 0.86.2 (CLI, **New Architecture** + Hermes) |
| React | 19.2.3 |
| TypeScript | 5.8 — `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals` |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) |
| State | Redux Toolkit 2.12 + React Redux 9.3 |
| Backend | Firebase 26.2.0 (Auth, Firestore, Storage) + Google Sign-In 16.1.4 |
| Unity bridge | `@azesmway/react-native-unity` 1.1.1 |
| Package manager | Yarn 3.6.4 |

---

## Prerequisites

| | Required |
|---|---|
| Node | **20.19.4** (pinned in `.nvmrc`) |
| Yarn | **3.6.4** (via `corepack`) |
| Ruby | ≥ 2.6.10 with Bundler (CocoaPods) |
| Xcode | iOS deployment target **15.1** |
| Android SDK | compileSdk / targetSdk **36**, minSdk **24** |
| Android NDK | **Both** `27.1.12297006` (React Native) **and** `23.1.7779620` (Unity IL2CPP) |
| Unity Editor | 2022.3.62f3 — only needed to re-export the game, not to build the app |

Verify both NDKs are present before your first Android build:

```bash
ls ~/Library/Android/sdk/ndk/
# must list BOTH 23.1.7779620 and 27.1.12297006
```

---

## Setup

```bash
git clone https://github.com/PundalikDesai-Dynamisch/AksharEdge-app.git
cd AksharEdge-app

nvm use                 # picks up .nvmrc → Node 20.19.4
corepack enable
yarn install

# iOS only
bundle install
cd ios && bundle exec pod install && cd ..
```

**Firebase config files are committed** — `android/app/google-services.json` and
`ios/GoogleService-Info.plist`, both pointing at project `dyslexiamvp`. These are client
config, not secrets; security is enforced by `firestore.rules` and `storage.rules`, which live
in this repo but whose deployment status is **unverified**.

`android/local.properties` is git-ignored — create it with your own `sdk.dir` if the build
can't find the Android SDK.

⚠️ `android/gradle.properties` contains a hardcoded `NODE_BINARY` path from the original
developer's machine. Update or delete that line on any other machine.

---

## Running

```bash
yarn start              # Metro
yarn android            # build + install on a connected device
yarn ios
```

**Android games must be tested on a physical arm64 device.** The Unity export is built for
`arm64-v8a` only — on an x86_64 emulator the React Native side runs fine but Unity fails to
load its native libraries. Emulator support needs a re-export from Unity.

---

## ⚠️ Unity is NOT in this repository

`unity/` is git-ignored. **A fresh clone will not build the Android app until it is restored.**

| | |
|---|---|
| What's missing | The Unity Android export — ~1.8 GB at `unity/builds/android/` |
| Why it's excluded | `symbols/arm64-v8a/libil2cpp.so` alone is 243 MB, over GitHub's 100 MB hard limit |
| Can it be regenerated? | **No.** The Unity *source project* is not in this repo either |

To restore it, copy a backed-up `unity/` directory into the repository root, then follow the
re-apply checklist in `UNITY_INTEGRATION_SNAPSHOT.md` (see below). The integration spans 7
layers — an npm dependency, the export payload, three Gradle wiring changes, an IL2CPP ×
Gradle 9 compatibility patch, an NDK version split, and the React Native screens.

The Gradle 9 patch is the fragile one: **re-exporting from Unity overwrites it** and the build
fails with `Could not find method BuildIl2Cpp()`. A warning comment is embedded at the top of
the patched section in `unityLibrary/build.gradle`.

**iOS has no Unity integration at all** — no Podfile target, no iOS export. The games feature
is Android-only today.

---

## ⚠️ Documentation is NOT in this repository

By project decision, `README.md` is the only markdown file tracked in git. The specification
and engineering docs live on the maintainer's machine and in an external backup:

```
~/Desktop/aksharedge-docs-backup/
```

| Document | What it defines |
|---|---|
| `CLAUDE.md` | Engineering rules, layer boundaries, permission and completion standards |
| `design.md` | Design system — colours, typography, spacing, components, accessibility |
| `AKSHAREDGE_SCREENS_SPEC.md` | All 28 screens with elements, states, and navigation targets |
| `UNITY_INTEGRATION_SNAPSHOT.md` | **The only record of how to re-apply the Unity integration** |
| `docs/` (25 files) | Legacy teacher-product engineering spec — still cited by ~69 source comments |
| `PROJECT_STATUS.md` | Point-in-time audit of the codebase |

These are **the only copies**. They are not backed up by version control — keep the external
backup current.

---

## Scripts

| Command | Purpose |
|---|---|
| `yarn start` | Metro bundler |
| `yarn android` / `yarn ios` | Build and install |
| `yarn typecheck` | `tsc --noEmit` — must be clean |
| `yarn lint` | ESLint — must be clean |
| `yarn test` | Jest |
| `yarn format` | Prettier over `src/` |

---

## Project structure

```
src/
├── app/          App root, bootstrap sequence
├── navigation/   Navigators, typed param lists, deep linking
├── theme/        Design tokens — colours, typography, spacing, radii, icons
├── components/   Shared UI, exported through a single barrel
├── domain/       Entities and errors — pure, no React / Redux / Firebase / IO
├── services/     Firebase and native integrations
├── features/     Feature slices, thunks, and screens
├── store/        Redux store and typed hooks
├── constants/    Routes, strings, config
├── types/        Cross-cutting string unions
└── utils/        Logger
```

### Enforced layer boundaries

`.eslintrc.js` makes these **build failures**, not conventions:

- Firebase may only be imported inside the data layer
- Presentation may not reach repositories, the database, or the filesystem directly
- `src/domain/` must stay pure — no React, Redux, Firebase, or IO
- `no-console` and `no-explicit-any` are errors; use `src/utils/logger.ts`

Path aliases are mirrored in **both** `tsconfig.json` and `babel.config.js`. They must stay in
sync — tsc resolves through one and Metro through the other, and drift produces code that
type-checks but won't bundle.

---

## Firebase

| | |
|---|---|
| Project | `dyslexiamvp` |
| Storage bucket | `dyslexiamvp.firebasestorage.app` |
| Services | Auth (email/password + Google), Firestore, Storage |

`firestore.rules`, `storage.rules`, and `firestore.indexes.json` are versioned here and wired
through `firebase.json`. They currently describe the **legacy** teacher/student/upload
collections and will be rewritten for the parent/child/assessment model.

```bash
firebase deploy --only firestore:rules,storage:rules
```
