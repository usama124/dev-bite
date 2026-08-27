# DevBite

DevBite is a privacy-first collection of fast, focused utilities for developers, writers, and data work. Every live tool runs entirely in the browser: input is processed locally and is not uploaded to an application server.

DevBite contains **105 fully interactive tool pages**. Phase 1 is complete with 48 Text, JSON, Developer, and Encoding tools, and Phase 2 is complete with 57 Security, SQL, and CSV/Data tools.

> **Source availability:** This repository is proprietary. Viewing the source does not grant permission to copy, modify, distribute, deploy, or commercially use it. See [LICENSE](LICENSE).

## Current Status

| Category | Live | Planned for its phase | Status |
|----------|-----:|----------------------:|--------|
| Text | 12 | 12 | Phase 1 complete |
| JSON | 14 | 14 | Phase 1 complete |
| Developer | 12 | 12 | Phase 1 complete |
| Encoding | 10 | 10 | Phase 1 complete |
| Security | 18 | 18 | Phase 2 complete |
| SQL | 15 | 15 | Phase 2 complete |
| CSV & Data | 24 | 24 | Phase 2 complete |
| **Total** | **105** | **105** | **Phases 1 and 2 complete** |

The current verified baseline is:

- 95 automated tests passing across 15 test files
- Zero TypeScript errors
- Zero ESLint warnings or errors
- 121 static pages and metadata routes generated successfully
- Responsive system, light, and dark modes
- Three selectable color palettes, font families, and text scales with local persistence
- SEO metadata, canonical URLs, sitemap, and robots.txt

Detailed implementation history and the current handoff point are maintained in [walkthrough.md](walkthrough.md). Product requirements are in [docs/Phase_1_Product_Specification_48_Tools.docx](docs/Phase_1_Product_Specification_48_Tools.docx) and [docs/Phase_2_Product_Specification.docx](docs/Phase_2_Product_Specification.docx).

## Live Tools

### Text tools — 12/12

- Word Counter
- Character Counter
- Text Statistics
- Whitespace Remover
- Text Cleaner
- Case Converter
- Find & Replace
- Find & Remove
- Remove Duplicate Lines
- Sort Lines
- Text Diff
- Text Joiner/Splitter

### JSON tools — 14/14

- JSON Formatter
- JSON Validator
- JSON Minifier
- JSON Viewer
- JSON Tree Viewer
- JSON Sorter
- JSON Flatten
- JSON Unflatten
- JSON Diff
- JSON Path Tester
- JSON Key Extractor
- JSON Key Remover
- JSON → CSV
- CSV → JSON

### Developer tools — 12/12

- UUID Generator
- UUID Validator and batch inspector
- UUID v4 Generator
- UUID v7 Generator
- Random ID Generator
- Regex Tester
- Regex Replace
- Regex Extractor
- Unix Timestamp Converter
- Timezone Converter
- URL Parser
- Cron → Human Readable

### Encoding tools — 10/10

- Base64 Encoder
- Base64 Decoder
- Base64 URL Encoder
- Base64 URL Decoder
- URL Encoder
- URL Decoder
- HTML Encoder
- HTML Decoder
- Hex Encoder
- Hex Decoder

### Security tools — 18/18

- Password Generator
- Password Strength Checker
- Hash Generator (MD5 and SHA family)
- HMAC Generator
- HMAC Validator
- JWT Decoder
- JWT Generator
- JWT Validator
- Fernet Key Generator
- Fernet Encrypt
- Fernet Decrypt
- AES Encrypt / Decrypt
- RSA Key Pair Generator
- RSA Encrypt / Decrypt
- RSA Sign / Verify
- Secret / Token Generator
- Random Bytes Generator
- Checksum Generator

### CSV & Data tools — 24/24

- CSV Viewer
- CSV Formatter
- CSV Validator
- CSV → JSON
- JSON → CSV
- CSV → TSV
- TSV → CSV
- CSV Column Extractor
- CSV Column Remover
- CSV Column Renamer
- CSV Sorter
- CSV Filter
- CSV Deduplicator
- CSV Merger
- CSV Splitter
- CSV Transpose
- CSV Statistics
- CSV → Markdown Table
- JSONL Formatter
- JSONL → JSON
- JSON → JSONL
- Delimited Text Converter
- Data Cleaner
- Column / Row Counter

### SQL tools — 15/15

- SQL Formatter
- SQL Minifier
- SQL Validator
- SQL Beautifier
- SQL → JSON
- SQL → CSV
- SQL → INSERT
- INSERT → structured SQL data
- SQL IN Clause Generator
- SQL WHERE Clause Builder
- SQL Table Generator
- SQL UPDATE Generator
- SQL DELETE Generator
- SQL JOIN Generator
- SQL Query Explainer (local deterministic structural explanation; no AI/backend or query execution)

## Product Features

- **Private by design:** live transformations run client-side in the browser.
- **Focused workspaces:** each utility has its own route, metadata, examples, instructions, FAQs, and related-tool links.
- **Reusable actions:** tools share consistent sample, clear, copy, and download controls.
- **Immediate feedback:** most outputs and statistics update as the input or options change.
- **Responsive interface:** workspaces adapt from mobile layouts to dual-pane desktop layouts; tabular data stays usable through contained horizontal scrolling.
- **Shared Phase 2 foundations:** Security uses browser cryptography and local analysis; CSV, TSV, JSON, and JSONL tools share a normalized immutable table model; SQL tools share a tokenizer, formatter, structural validator, literal/identifier safety helpers, and generators.
- **Configurable appearance:** system/light/dark modes, three palettes, three font families, and three text scales apply app-wide and persist on the device.
- **Discoverability:** the app includes a searchable tools directory, category pages, structured page metadata, a sitemap, and robots.txt.
- **Project transparency:** a dedicated, mobile-first About page introduces the project, developer, principles, support option, and forward roadmap.

## Technology

- Next.js 14 App Router
- React 18
- TypeScript 5
- Tailwind CSS 3
- `next-themes`
- Lucide React icons
- Vitest
- pnpm lockfile and workspace configuration

No database, account, API key, or runtime environment variable is currently required.

## Requirements

- Node.js 18.17 or newer
- pnpm 9+ or npm 9+

The repository includes a local toolchain under `.tools/node` in the original development workspace, but `.tools` is intentionally ignored by Git. On another machine, use your normal Node.js installation.

## Installation

Clone or open the repository, then install dependencies with one package manager.

Using pnpm:

```bash
pnpm install
```

Using npm:

```bash
npm install
```

Do not alternate package managers within the same working copy unless you intentionally want to regenerate the lockfile.

## Running Locally

Start the development server:

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Next.js will automatically reload the application as source files change.

If you are using the repository-local toolchain from the original workspace:

```bash
./.tools/node/bin/pnpm dev
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create and validate an optimized production build |
| `pnpm start` | Serve a previously generated production build |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm test` | Run all Vitest tests once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:browser` | Smoke-test representative Security, SQL, and Data workspaces against a production build (requires Chrome) |
| `pnpm lint` | Run Next.js linting after ESLint has been configured |

Equivalent `npm run <script>` commands can be used when dependencies were installed with npm.

## Production Build

```bash
pnpm build
pnpm start
```

By default, the production server listens on port 3000. Standard Next.js environment variables such as `PORT` may be used by the hosting environment.

## Main Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage and featured tools |
| `/about` | Project story, developer profile, principles, roadmap, and support section |
| `/tools` | Searchable directory of all live tools |
| `/tools/[slug]` | Dedicated product and tool workspace page |
| `/tools/category/[category]` | Text, JSON, Developer, Encoding, Security, SQL, or Data category page |
| `/sitemap.xml` | Generated sitemap for public pages |
| `/robots.txt` | Search crawler directives |

## Project Structure

```text
src/
├── app/                         # App Router pages, layout, sitemap, and global CSS
├── components/
│   ├── shared/                  # Navigation, layout, SEO-supporting sections, theme, search
│   ├── tools/                   # Interactive workspaces grouped by category
│   └── ui/                      # Reusable controls
├── config/                      # Appearance, site/profile links, and browser-safety limits
└── lib/
    ├── engines/                 # Pure processing logic grouped by category
    └── registry/                # Phase 1 and Phase 2 metadata/category registry
tests/                           # Vitest unit tests and production browser smoke tests
docs/                            # Phase 1 and Phase 2 product specifications
walkthrough.md                   # Build history, verification, and handoff state
```

Processing logic belongs in `src/lib/engines`, while React components should focus on presentation and user interaction. New routes are driven by the central tool registry and rendered through `src/components/tools/ToolRenderer.tsx`.

## Appearance Configuration

User-selectable appearance choices are defined in one typed configuration file: `src/config/appearance.ts`. Add, remove, rename, or adjust an option there to update the appearance menu and application behavior together.

- **Color mode:** System, Light, or Dark
- **Palette:** DevBite Indigo, Ocean Blue, or Emerald
- **Font family:** System Sans, Humanist Sans, or Classic Serif
- **Text scale:** Compact (15px), Default (16px), or Comfortable (18px)

Selections are stored in browser `localStorage` and applied before the first paint to avoid a visible reset during navigation or reload. `AppearanceProvider` owns runtime updates, while `ThemeProvider` continues to manage system/light/dark mode.

Base semantic colors, glass surfaces, radius, and fallback typography tokens remain in `src/app/globals.css`. `tailwind.config.ts` maps Tailwind utilities to those CSS variables. Change shared tokens or the appearance configuration instead of restyling individual tools.

## Site and Developer Configuration

Developer details and external destinations used by the About page are centralized in `src/config/site.ts`. This includes the developer name, role, profile image and alt text, technology list, GitHub, LinkedIn, personal website, Buy Me a Coffee destination, and footer navigation. The local profile asset is stored at `public/images/usama-profile.jpeg` and rendered through Next.js image optimization.

Optional links remain hidden when their value is `null`, preventing unfinished or unverified profiles from being exposed. GitHub, LinkedIn, and the personal website are configured. Add the actual Buy Me a Coffee profile URL in this file when available; its About-page button will appear automatically.

## Adding or Completing a Tool

To preserve the current modular architecture:

1. Add pure, browser-safe processing logic under `src/lib/engines/<category>/`.
2. Add unit coverage under `tests/` for normal, edge, and invalid inputs.
3. Build the workspace under `src/components/tools/<category>/` using the shared UI and tool action components.
4. Register the workspace in `src/components/tools/ToolRenderer.tsx` using the existing slug from `src/lib/registry/tools.ts`.
5. Run unit tests, type checking, linting, and a production build. Extend the browser smoke test when adding a new interaction family.
6. Update `walkthrough.md` with the new current state.

Avoid duplicating processing logic inside page components or creating a separate visual pattern for an individual tool.

## Verification

Run the complete local verification sequence:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm test:browser
```

Run `test:browser` after `build`; it starts the production server on port 3217 and requires Google Chrome at `/usr/bin/google-chrome` or a custom executable supplied through `CHROME_PATH`. The committed ESLint configuration extends Next.js Core Web Vitals, so linting runs unattended in local development and CI.

The text-diff engine protects the browser from excessive quadratic work by limiting a comparison to 2,000,000 line-pair cells. The threshold is centralized in `src/config/limits.ts`; oversized input returns an actionable message asking the user to compare smaller sections.

## Privacy and Security

The implemented tools use browser APIs and local JavaScript processing. Text, SQL, JSON, uploaded CSV/JSONL files, passwords, secrets, keys, plaintext, hashes, and generated values are not intentionally sent to a DevBite backend. JWT Decoder never implies verification; JWT Validator supports only the explicitly offered HMAC algorithms. AES uses authenticated AES-GCM, RSA is limited to OAEP/PSS with SHA-256, and generated destructive SQL displays safeguards. Browser cryptography is suitable for development utilities but is not a substitute for production key management. When adding future tools, preserve these guarantees unless the product documentation and user-facing privacy messaging are explicitly updated.

Do not commit secrets or local environment files. `.env*.local`, private keys, build output, dependencies, and the local toolchain are excluded by `.gitignore`.

## Roadmap

- **Steps 1–2:** foundation, registry, SEO routes, and four representative launch tools — complete
- **Step 3:** all 12 Text tools — complete
- **Step 4:** all 14 JSON tools — complete
- **Step 5:** all 12 Developer tools — complete
- **Step 6:** all 10 Encoding tools — complete
- **Final Phase 1 acceptance pass:** registry integrity, linting, accessibility semantics, large-input protection, appearance configuration, and production verification — complete
- **About/developer section:** project story, developer profile, principles, roadmap, support area, footer navigation, metadata, and sitemap integration — complete
- **Phase 2 milestone 1:** Security/SQL/Data engine foundations, registry/navigation/SEO expansion, 5 Security tools, and 8 CSV/Data tools — complete
- **Phase 2 completion:** all 18 Security, 15 SQL, and 24 CSV/Data workspaces, shared engines, tests, browser coverage, and responsive verification — complete
- **Query Explainer:** implemented as a limited local deterministic structural explainer; it does not use AI, execute SQL, or inspect a database query plan
- **Phase 3:** API, Image, PDF, File, Networking, and Generation tools — planned
- **Phase 4:** Data Engineering, SEO, QR/Barcode, and Advanced tools — planned

The Phase 1 and Phase 2 specification documents remain the sources of truth for their respective tool scope and acceptance criteria.

## License

Copyright © 2026 DevBite. All rights reserved.

This is proprietary software. No license is granted to use, copy, modify, distribute, sublicense, sell, host, or create derivative works from the source code except under a separate written agreement with the copyright holder. See [LICENSE](LICENSE) for the controlling terms.
