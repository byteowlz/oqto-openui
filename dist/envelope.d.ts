/** Oqto envelope around one OpenUI Lang part. Hosts and the runner validate the same shape. */
import { z } from "zod";
export declare const MAX_BODY_BYTES: number;
export declare const MAX_FALLBACK_CHARS = 4000;
export declare const Envelope: z.ZodObject<{
    schema: z.ZodLiteral<"oqto.openui.part.v1">;
    partId: z.ZodString;
    profile: z.ZodObject<{
        id: z.ZodLiteral<"oqto">;
        version: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodString;
    fallback: z.ZodString;
    answer: z.ZodOptional<z.ZodObject<{
        schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        timeoutSeconds: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Envelope = z.infer<typeof Envelope>;
