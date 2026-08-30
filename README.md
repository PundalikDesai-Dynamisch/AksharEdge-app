# AksharEdge Teacher App — Engineering Documentation

Complete engineering specification for **DyslexiaApp**, a React Native CLI
(Android + iOS) companion app that lets teachers create student records and
upload learning material (scanned documents, gallery images, PDFs) with
**offline-first** guarantees and automatic Firebase sync.

This repository is the **single source of truth**. It is written to be handed
directly to Claude Code (or a human developer) and implemented phase by phase
without further clarification.

---

## 1. What is being built

A teacher-facing mobile app. One sentence per capability:

| # | Capability | Notes |
|---|---|---|
| 1 | Teacher creates an account or signs in | Email/password **or** Google Sign-In (Firebase Auth) |
| 2 | Teacher creates and manages student records | Name, DOB, class, school, language, gender. Students never log in. |
| 3 | Teacher uploads learning material per student | Scanned document, gallery image, or PDF |
| 4 | Everything works with no internet | Files are copied into app storage; metadata queued in SQLite |
| 5 | Queue drains automatically when internet returns | NetInfo-driven sync engine with retry + backoff |
| 6 | Files land in Firebase Storage, metadata in Firestore | `teachers/{tid}/students/{sid}/...` + `uploads` collection |
| 7 | Teacher sees per-student upload history and status | Pending / Uploading / Uploaded / Failed, with manual retry |

**Explicitly out of scope for the MVP:** OCR, handwriting analysis, ML/AI
scoring, report or PDF generation, parent or student logins, admin console.
The architecture leaves a clean extension point for all of them — see
[docs/04_APP_ARCHITECTURE.md](docs/04_APP_ARCHITECTURE.md) § Future AI Hook.

---

## 2. Document index

Read in order. Documents 00–07 define *what*, 08–11 define *data*, 12–18
define *modules*, 19–25 define *delivery*.

| # | Document | Purpose |
|---|---|---|
| — | [README.md](README.md) | This file — orientation and index |
| 01 | [PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md) | Problem, users, MVP scope, requirements, acceptance criteria |
| 02 | [PROJECT_ROADMAP.md](docs/02_PROJECT_ROADMAP.md) | 4-week plan, milestones, risks, definition of done |
| 03 | [TECH_STACK.md](docs/03_TECH_STACK.md) | Every library, why it was chosen, what it replaced |
| 04 | [APP_ARCHITECTURE.md](docs/04_APP_ARCHITECTURE.md) | Layers, data flow, dependency rules, diagrams |
| 05 | [FOLDER_STRUCTURE.md](docs/05_FOLDER_STRUCTURE.md) | Every directory and file, with ownership rules |
| 06 | [NAVIGATION_FLOW.md](docs/06_NAVIGATION_FLOW.md) | Navigators, route params, deep links, guards |
| 07 | [SCREEN_SPECIFICATIONS.md](docs/07_SCREEN_SPECIFICATIONS.md) | Every screen: layout, state, validation, errors |
| 08 | [FIREBASE_SETUP_GUIDE.md](docs/08_FIREBASE_SETUP_GUIDE.md) | Firebase from zero — console, Android, iOS, Google Sign-In |
| 09 | [FIRESTORE_DATABASE.md](docs/09_FIRESTORE_DATABASE.md) | Collections, fields, indexes, queries, security rules |
| 10 | [FIREBASE_STORAGE.md](docs/10_FIREBASE_STORAGE.md) | Bucket layout, naming, metadata, rules, lifecycle |
| 11 | [SQLITE_DATABASE.md](docs/11_SQLITE_DATABASE.md) | Tables, DDL, migrations, DAO contracts |
| 12 | [AUTHENTICATION_FLOW.md](docs/12_AUTHENTICATION_FLOW.md) | Sign-up, sign-in, Google, session restore, sign-out |
| 13 | [STUDENT_MODULE.md](docs/13_STUDENT_MODULE.md) | Student CRUD, offline cache, validation |
| 14 | [UPLOAD_MODULE.md](docs/14_UPLOAD_MODULE.md) | Scan / gallery / PDF capture, file persistence, enqueue |
| 15 | [OFFLINE_SYNC_ENGINE.md](docs/15_OFFLINE_SYNC_ENGINE.md) | The core module: queue, worker, retry, backoff, background |
| 16 | [REDUX_ARCHITECTURE.md](docs/16_REDUX_ARCHITECTURE.md) | Store, slices, thunks, selectors, persistence |
| 17 | [SERVICES_LAYER.md](docs/17_SERVICES_LAYER.md) | Service/repository interfaces and error contracts |
| 18 | [UI_COMPONENT_GUIDE.md](docs/18_UI_COMPONENT_GUIDE.md) | Design tokens, shared components, accessibility |
| 19 | [PACKAGE_CONFIGURATION.md](docs/19_PACKAGE_CONFIGURATION.md) | Per-package install + native config + gotchas |
| 20 | [ANDROID_CONFIGURATION.md](docs/20_ANDROID_CONFIGURATION.md) | Gradle, manifest, permissions, signing, ProGuard |
| 21 | [IOS_CONFIGURATION.md](docs/21_IOS_CONFIGURATION.md) | Podfile, Info.plist, capabilities, signing |
| 22 | [TESTING_GUIDE.md](docs/22_TESTING_GUIDE.md) | Unit, integration, manual matrix, offline test scripts |
| 23 | [CODING_GUIDELINES.md](docs/23_CODING_GUIDELINES.md) | Naming, TypeScript rules, error handling, logging |
| 24 | [DEVELOPMENT_PHASES.md](docs/24_DEVELOPMENT_PHASES.md) | Phase-by-phase build order with STOP gates |
| 25 | [CLAUDE_MASTER_PROMPT.md](docs/25_CLAUDE_MASTER_PROMPT.md) | The prompt to paste into Claude Code |

---

## 3. How to use this with Claude Code

1. Put this whole folder at the root of your new project.
2. Open a terminal in that folder and start Claude Code.
3. Paste the contents of [docs/25_CLAUDE_MASTER_PROMPT.md](docs/25_CLAUDE_MASTER_PROMPT.md)
   as your first message.
4. Claude builds **Phase 0**, then stops and waits.
5. Verify the phase against its acceptance criteria in
   [docs/24_DEVELOPMENT_PHASES.md](docs/24_DEVELOPMENT_PHASES.md).
6. Reply `Proceed to Phase 1`. Repeat through Phase 8.

**Do not ask for the whole app in one prompt.** The phase gates exist so each
layer is verified on a real device before the next layer depends on it.

---

## 4. Non-negotiable technical decisions

These are settled. Do not re-litigate them mid-build.

| Decision | Value |
|---|---|
| Framework | React Native **CLI** — never Expo |
| Language | TypeScript, `strict: true` |
| Architecture | New Architecture (Fabric + TurboModules), Hermes enabled |
| RN project name | `DyslexiaApp` |
| Bundle / application id | `com.aksharedge.teacher` |
| Minimum Android | API 24 (Android 7.0) |
| Minimum iOS | 15.1 |
| State | Redux Toolkit |
| Navigation | React Navigation v7, native-stack |
| Local DB | `@op-engineering/op-sqlite` |
| Backend | Firebase (Auth + Firestore + Storage) via `@react-native-firebase/*` |
| Source of truth for uploads | The **SQLite queue**, not Redux and not Firestore |

---

## 5. Glossary

| Term | Meaning |
|---|---|
| **Teacher** | The only authenticated user. Owns students and uploads. |
| **Student** | A record created by a teacher. Has no credentials, never signs in. |
| **Learning material** | Any uploaded artefact: scanned page, gallery image, or PDF. |
| **Upload** | One file + its metadata, tracked from capture to Firebase. |
| **Queue item** | A row in `upload_queue`. Exists from capture until upload succeeds. |
| **Sync engine** | The background worker that drains `upload_queue`. |
| **Local URI** | Absolute path to a file inside app-private storage. |
| **Remote URL** | Firebase Storage download URL, only present after a successful upload. |

---

## 6. Reading shortcuts

- *"What do I build first?"* → [24_DEVELOPMENT_PHASES.md](docs/24_DEVELOPMENT_PHASES.md)
- *"I've never used Firebase"* → [08_FIREBASE_SETUP_GUIDE.md](docs/08_FIREBASE_SETUP_GUIDE.md)
- *"How does offline actually work?"* → [15_OFFLINE_SYNC_ENGINE.md](docs/15_OFFLINE_SYNC_ENGINE.md)
- *"What goes where in `src/`?"* → [05_FOLDER_STRUCTURE.md](docs/05_FOLDER_STRUCTURE.md)
- *"The build is broken on iOS"* → [21_IOS_CONFIGURATION.md](docs/21_IOS_CONFIGURATION.md)
