import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { createOqtoParser, createOqtoStreamingParser } from "../src/index.js";

test("parsing never touches the network, even if runtime telemetry is requested", async () => {
	const calls: unknown[] = [];
	const original = globalThis.fetch;
	globalThis.fetch = ((...args: unknown[]) => {
		calls.push(args);
		return Promise.reject(new Error("blocked"));
	}) as typeof fetch;
	process.env.OPENUI_RUNTIME_TELEMETRY_ENABLED = "1"; // hostile opt-in must still be overridden
	try {
		expect(process.env.OPENUI_TELEMETRY_DISABLED).toBe("1");
		// Upstream samples 10% of parses and sends asynchronously: exercise enough calls to detect a send.
		const parser = createOqtoParser();
		const sources = readdirSync("fixtures").map((n) => readFileSync(`fixtures/${n}/input.oui`, "utf8"));
		for (let i = 0; i < 200; i++) parser.parse(sources[i % sources.length] ?? "");
		const stream = createOqtoStreamingParser();
		for (const chunk of (sources[0] ?? "").match(/.{1,40}/gs) ?? []) stream.push(chunk);
		await new Promise((r) => setTimeout(r, 300));
	} finally {
		globalThis.fetch = original;
		delete process.env.OPENUI_RUNTIME_TELEMETRY_ENABLED;
	}
	expect(calls).toEqual([]);
});
