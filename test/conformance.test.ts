import { describe, expect, test } from "bun:test";
import { createParser } from "@openuidev/lang-core";
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { library, coreComponents, optionalComponents, renderFallback } from "../src/index.ts";

const parser = createParser(library.toJSONSchema(), library.root);
const fixtures = readdirSync("fixtures");

describe("profile", () => {
	test("core and optional tiers cover every component exactly once", () => {
		const all = [...coreComponents, ...optionalComponents].sort();
		expect(all).toEqual(Object.keys(library.components).sort());
		expect(optionalComponents).toEqual(["Chart", "Image"]);
	});
});

describe.each(fixtures)("fixture %s", (name) => {
	const input = readFileSync(`fixtures/${name}/input.oui`, "utf8");
	const result = parser.parse(input);
	test("parses with expected errors", () => {
		expect(result.root?.typeName).toBe("Card");
		const codes = result.meta.errors.map((e: any) => e.code).sort();
		const expectedFile = `fixtures/${name}/errors.json`;
		expect(codes).toEqual(existsSync(expectedFile) ? JSON.parse(readFileSync(expectedFile, "utf8")) : []);
	});
	test("text fallback matches golden", () => {
		const text = renderFallback(result.root) + "\n";
		const golden = `fixtures/${name}/fallback.txt`;
		if (process.env.UPDATE_GOLDEN) writeFileSync(golden, text);
		expect(text).toBe(readFileSync(golden, "utf8"));
	});
});
