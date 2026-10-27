# oqto-openui

The Oqto OpenUI profile: one component vocabulary, envelope format and set of
conformance fixtures shared by every Oqto host, so agent-generated UI looks and
behaves the same in **Web (OqtoUI), the Pi TUI (`pi-openui`), oqt, GPUI desktop
and mobile**. Decision: Oqto [ADR-0074](https://github.com/byteowlz/oqto/blob/main/docs/adr/0074-openui-lang-cross-host-generative-ui.md). Epic `oqto-8qse`.

Agents write [OpenUI Lang](https://www.openui.com/docs/openui-lang/specification).
This repo pins `@openuidev/lang-core` exactly and defines which components exist;
hosts register their own native implementations under these names.

## Contents

| Path | What |
|---|---|
| `src/profile.ts` | Component library (Zod), tiers, `@Answer` action, `PROFILE_VERSION` |
| `src/envelope.ts` | `oqto.openui.part.v1` envelope: stable id, profile version, body, **required text fallback**, optional answer schema + timeout |
| `src/fallback.ts` | Reference plain-text renderer (TUI/headless fallback) |
| `schema/` | Generated, committed: `library.json` (parser schema), `envelope.json`, `profile.json` (tiers), `prompt.txt` (model instructions). Non-TS hosts (Rust runner, Swift, Kotlin, GPUI) consume these. |
| `fixtures/<name>/` | `input.oui`, golden `fallback.txt`, optional `errors.json`. Every renderer must pass all fixtures. |

## Tiers

- **core** — every host MUST render natively: Card, Stack, Form, Text, Heading,
  Status, KeyValue, List, Table, Code, Button, TextInput, Choice, Toggle.
- **optional** — Chart, Image. Hosts that cannot draw them show the text fallback.

Answers go back with `@Answer(value)`. The **runner** validates them against the
envelope's answer schema and routes any action through the Oqto permission gate.
Hosts never call tools, MCP servers or URLs directly. `@OpenUrl`/`@ToAssistant`
are host events that also pass through the runner.

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
bun run check        # typecheck, tests, regenerate schema, fail if schema changed
UPDATE_GOLDEN=1 bun run test   # refresh fallback goldens after reviewed changes
```

Profile changes bump `PROFILE_VERSION` (semver) and require regenerated `schema/`.
