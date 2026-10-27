import { expect, test } from "bun:test";
import { createParser, createStreamingParser } from "@openuidev/lang-core";
import { library } from "../src/index.ts";

test("parsing and prompt generation never touch the network, even if runtime telemetry is requested", async () => {
	const calls: unknown[] = [];
	const original = globalThis.fetch;
	globalThis.fetch = ((...args: unknown[]) => { calls.push(args); return Promise.reject(new Error("blocked")); }) as typeof fetch;
	process.env.OPENUI_RUNTIME_TELEMETRY_ENABLED = "1"; // hostile opt-in must still be overridden
	try {
		expect(process.env.OPENUI_TELEMETRY_DISABLED).toBe("1");
		// Upstream samples 10% of calls and sends asynchronously: exercise enough calls to detect a send.
		const parser = createParser(library.toJSONSchema(), library.root);
		for (let i = 0; i < 200; i++) {
			library.prompt();
			parser.parse(`root = Card([Text("hi ${i}")])`);
		}
		const s = createStreamingParser(library.toJSONSchema(), library.root);
		s.push('root = Card([Text("h'); s.push('i")])');
		await new Promise((r) => setTimeout(r, 300));
	} finally {
		globalThis.fetch = original;
		delete process.env.OPENUI_RUNTIME_TELEMETRY_ENABLED;
	}
	expect(calls).toEqual([]);
});
