import { writeFileSync } from "node:fs";
import { z } from "zod";
import { Envelope } from "./envelope.ts";
import { coreComponents, library, optionalComponents, PROFILE_ID, PROFILE_VERSION } from "./profile.ts";

const stable = (v: unknown) => JSON.stringify(v, null, 2) + "\n";
writeFileSync("schema/library.json", stable(library.toJSONSchema()));
writeFileSync("schema/envelope.json", stable(z.toJSONSchema(Envelope)));
writeFileSync("schema/profile.json", stable({ id: PROFILE_ID, version: PROFILE_VERSION, root: library.root, core: coreComponents, optional: optionalComponents }));
writeFileSync("schema/prompt.txt", library.prompt());
