import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { catalog, componentNames, createOqtoParser, PROFILE_VERSION, renderFallback, systemPrompt } from "../src/index.js";

const parser = createOqtoParser();
const fixtures = readdirSync("fixtures");

describe("profile", () => {
	test("full upstream catalog plus Oqto @Answer", async () => {
		expect(componentNames.length).toBe(82);
		for (const c of ["Tabs", "AreaChart", "EditableTable", "OptionCards", "ImageGallery", "Steps", "OverviewCardBlock"]) expect(componentNames).toContain(c);
		expect(catalog.actions).toContain("Answer");
		const prompt = await systemPrompt();
		expect(prompt).toContain("@Answer");
		expect(prompt).toContain("Oqto");
		expect(PROFILE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});

describe.each(fixtures)("fixture %s", (name) => {
	const result = parser.parse(readFileSync(`fixtures/${name}/input.oui`, "utf8"));
	test("parses with exactly the expected errors", () => {
		expect(result.meta.incomplete).toBe(false);
		const expected = existsSync(`fixtures/${name}/errors.json`) ? JSON.parse(readFileSync(`fixtures/${name}/errors.json`, "utf8")) : [];
		expect(result.meta.errors.map((e: { code: string }) => e.code).sort()).toEqual(expected);
	});
	test("text fallback matches golden and is never empty", () => {
		const text = `${renderFallback(result.root)}\n`;
		expect(text.trim().length).toBeGreaterThan(0);
		const golden = `fixtures/${name}/fallback.txt`;
		if (process.env.UPDATE_GOLDEN) writeFileSync(golden, text);
		expect(text).toBe(readFileSync(golden, "utf8"));
	});
});
