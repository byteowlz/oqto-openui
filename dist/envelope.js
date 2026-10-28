/** Oqto envelope around one OpenUI Lang part. Hosts and the runner validate the same shape. */
import { z } from "zod";
import { PROFILE_ID } from "./profile.js";
export const MAX_BODY_BYTES = 32 * 1024;
export const MAX_FALLBACK_CHARS = 4000;
export const Envelope = z.object({
    schema: z.literal("oqto.openui.part.v1"),
    /** Stable id; reconciliation is by id only, never by text or position. */
    partId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
    profile: z.object({ id: z.literal(PROFILE_ID), version: z.string().regex(/^\d+\.\d+\.\d+$/) }),
    /** OpenUI Lang program. */
    body: z.string().min(1).refine((s) => new TextEncoder().encode(s).length <= MAX_BODY_BYTES, "body too large"),
    /** Required plain-text rendering for hosts or components that cannot render the body. */
    fallback: z.string().min(1).max(MAX_FALLBACK_CHARS),
    /** Present when the part waits for the user. JSON Schema the runner validates @Answer values against. */
    answer: z
        .object({ schema: z.record(z.string(), z.unknown()), timeoutSeconds: z.number().int().min(1).max(86400) })
        .optional(),
});
