import { expect, test } from "bun:test";
import { Envelope, PROFILE_VERSION } from "../src/index.js";

const base = { schema: "oqto.openui.part.v1", partId: "part_0123456789", profile: { id: "oqto", version: PROFILE_VERSION }, body: 'root = Card([Text("x")])', fallback: "x" };
test("accepts a valid part and rejects missing fallback, foreign profile and oversize body", () => {
	expect(Envelope.safeParse(base).success).toBe(true);
	expect(Envelope.safeParse({ ...base, fallback: "" }).success).toBe(false);
	expect(Envelope.safeParse({ ...base, profile: { id: "other", version: "1.0.0" } }).success).toBe(false);
	expect(Envelope.safeParse({ ...base, body: "x".repeat(40 * 1024) }).success).toBe(false);
	expect(Envelope.safeParse({ ...base, partId: "../x" }).success).toBe(false);
});
