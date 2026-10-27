# oqto-openui

The Oqto OpenUI profile: one component vocabulary, envelope format and set of
conformance fixtures shared by every Oqto host, so agent-generated UI looks and
behaves the same in **Web (OqtoUI), the Pi TUI (`pi-openui`), oqt, GPUI desktop
and mobile**. Decision: Oqto [ADR-0074](https://github.com/byteowlz/oqto/blob/main/docs/adr/0074-openui-lang-cross-host-generative-ui.md). Epic `oqto-8qse`.

Agents write [OpenUI Lang](https://www.openui.com/docs/openui-lang/specification).
This repo pins `@openuidev/lang-core` exactly and defines which components exist;
hosts register their own native implementations under these names.

## Contents (v0.2)

The catalog is **OpenUI's full component vocabulary** (82 components: layout, tabs,
accordion, steps, carousel, cards, galleries, metrics, tables incl. editable,
bar/line/area/radar/pie/radial/scatter charts, forms with select/radio/chips/
option cards/slider/date picker, follow-up lists) plus Oqto's `@Answer` action and
Oqto prompt rules. Models already know this vocabulary from OpenUI's docs.

| Path | What |
|---|---|
| `tools/sync-upstream.ts` | Build-time only: derives `schema/` from the pinned upstream library + Oqto actions/rules (`bun run sync`). |
| `schema/library.json` | Parser schema. Every host parses with `@openuidev/lang-core` from this JSON: **no React at runtime**. |
| `schema/prompt.txt` | Model instructions (~37k chars, ~9k tokens). Inject only while OpenUI is enabled for the Session. |
| `schema/catalog.json` | Components: signature, description, groups; actions. For non-TS renderers. |
| `schema/envelope.json` | `oqto.openui.part.v1`: stable id, profile version, body, **required text fallback**, optional answer schema + timeout. |
| `schema/profile.json` | Profile id/version and pinned upstream versions. |
| `src/` | TS runtime: `createOqtoParser()`, `systemPrompt()`, `Envelope`, `renderFallback()`. |
| `fixtures/<name>/` | Rich `input.oui` (dashboard, plan approval, option comparison, editable table, gallery + follow-ups, unknown component), golden `fallback.txt`, optional `errors.json`. |

## Hosts render everything, at their best capability

No component is demoted per host. Each host declares capabilities and renders the
whole catalog as well as it can:

- **Web, GPUI, mobile:** native components from Oqto's design tokens.
- **Terminals (`pi-openui`):** (1) cells in any terminal: real layout, keyboard
  tabs/accordion, Braille/block charts, sparklines, editable tables, inputs;
  (2) Kitty graphics / Sixel / iTerm2 images for charts, images and galleries when
  supported (Rex supports Kitty graphics even over remote sessions);
  (3) native surface protocols when present (Tern Surface Protocol). Waiting
  parts report `blocked` via OSC 7501 where supported.
- **Headless/logs:** `renderFallback()` text.

`@Answer(value)` returns the user's answer; the **runner** validates it against
the envelope's answer schema. `Query`/`Mutation`/`@OpenUrl`/`@ToAssistant` go
through the runner and Oqto's permission gate; hosts never call tools, MCP servers
or URLs directly.

## Telemetry

`@openuidev/lang-core` sends install telemetry from its postinstall script by
default and has opt-in runtime telemetry. This repo:

- installs with lifecycle scripts disabled (`bunfig.toml: ignoreScripts`),
- runs everything with `OPENUI_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1`,
- has a test (`test/telemetry.test.ts`) that fails if parsing or prompt generation
  makes any network call, even with runtime telemetry explicitly requested. It was
  verified to fail when the disable flags are removed.

Every consumer must set the same environment and disable install scripts.
The OpenUI Gateway/cloud is never used.

## Look and feel

Visual design is not defined here yet: the Design Studio provides the target for
the core components; platform token exports (CSS, TUI palette, Rust, Swift/Kotlin)
will be added under `tokens/` from that target. Do not adopt upstream
`@openuidev/react-ui` styling.

## Develop

```sh
bun install          # scripts are ignored by bunfig.toml
bun run check        # typecheck, tests, re-sync schema, fail if schema changed
UPDATE_GOLDEN=1 bun run test   # refresh fallback goldens after reviewed changes
```

Profile changes bump `version` in package.json (semver) and require `bun run sync`.
