/**
 * Oqto OpenUI profile. One component vocabulary for every Oqto host (Web,
 * Pi TUI, oqt, GPUI, mobile). Hosts register their own native implementations
 * under these names; `component` here is only the host-neutral key.
 *
 * Tier "core": every host MUST render natively.
 * Tier "optional": hosts MAY render; otherwise they show the part's text fallback.
 */
import { createLibrary, defineAction, defineComponent } from "@openuidev/lang-core";
import { z } from "zod";

export const PROFILE_ID = "oqto";
export const PROFILE_VERSION = "0.1.0";

export type Tier = "core" | "optional";
export interface HostKey {
	name: string;
	tier: Tier;
}

const tone = z.enum(["neutral", "info", "success", "warning", "danger"]);
const key = (name: string, tier: Tier): HostKey => ({ name, tier });

// Components are defined bottom-up so containers can reference children.
const Text = defineComponent({
	name: "Text",
	description: "Paragraph of plain text. Use for prose; keep it short.",
	props: z.object({ text: z.string(), muted: z.boolean().optional() }),
	component: key("Text", "core"),
});
const Heading = defineComponent({
	name: "Heading",
	description: "Section heading. level 1 is the largest.",
	props: z.object({ text: z.string(), level: z.number().int().min(1).max(3).optional() }),
	component: key("Heading", "core"),
});
const Status = defineComponent({
	name: "Status",
	description: "Short status or callout line with a tone.",
	props: z.object({ text: z.string(), tone: tone.optional() }),
	component: key("Status", "core"),
});
const KeyValue = defineComponent({
	name: "KeyValue",
	description: "Label/value pairs, e.g. metadata or a summary.",
	props: z.object({ items: z.array(z.object({ label: z.string(), value: z.string() })) }),
	component: key("KeyValue", "core"),
});
const List = defineComponent({
	name: "List",
	description: "Bulleted or numbered list of short text items.",
	props: z.object({ items: z.array(z.string()), ordered: z.boolean().optional() }),
	component: key("List", "core"),
});
const Table = defineComponent({
	name: "Table",
	description: "Tabular data. rows are arrays of cell strings in column order.",
	props: z.object({ columns: z.array(z.string()), rows: z.array(z.array(z.string())) }),
	component: key("Table", "core"),
});
const Code = defineComponent({
	name: "Code",
	description: "Preformatted code or command output.",
	props: z.object({ code: z.string(), language: z.string().optional() }),
	component: key("Code", "core"),
});
const Button = defineComponent({
	name: "Button",
	description: "Clickable button running an action, e.g. @Answer(...) or @ToAssistant(...).",
	props: z.object({ label: z.string(), action: z.any(), tone: tone.optional() }),
	component: key("Button", "core"),
});
const TextInput = defineComponent({
	name: "TextInput",
	description: "Single or multi-line text field bound to a $variable.",
	props: z.object({
		label: z.string(),
		value: z.any(),
		placeholder: z.string().optional(),
		multiline: z.boolean().optional(),
	}),
	component: key("TextInput", "core"),
});
const Choice = defineComponent({
	name: "Choice",
	description: "Pick one (or several when multiple=true) of the options, bound to a $variable.",
	props: z.object({
		label: z.string(),
		options: z.array(z.string()),
		value: z.any(),
		multiple: z.boolean().optional(),
	}),
	component: key("Choice", "core"),
});
const Toggle = defineComponent({
	name: "Toggle",
	description: "On/off switch bound to a $variable.",
	props: z.object({ label: z.string(), value: z.any() }),
	component: key("Toggle", "core"),
});
const Chart = defineComponent({
	name: "Chart",
	description: "Bar or line chart. Optional: not every host can draw charts, always also state the key numbers in text.",
	props: z.object({
		kind: z.enum(["bar", "line"]),
		labels: z.array(z.string()),
		values: z.array(z.number()),
		title: z.string().optional(),
	}),
	component: key("Chart", "optional"),
});
const Image = defineComponent({
	name: "Image",
	description: "Image by URL with required alt text. Optional tier.",
	props: z.object({ url: z.string(), alt: z.string() }),
	component: key("Image", "optional"),
});

const child = z.array(
	z.union([Text.ref, Heading.ref, Status.ref, KeyValue.ref, List.ref, Table.ref, Code.ref, Button.ref, TextInput.ref, Choice.ref, Toggle.ref, Chart.ref, Image.ref]),
);
const Stack = defineComponent({
	name: "Stack",
	description: "Vertical (default) or horizontal group of children.",
	props: z.object({ children: child, horizontal: z.boolean().optional() }),
	component: key("Stack", "core"),
});
const Card = defineComponent({
	name: "Card",
	description: "Bordered surface grouping related content, optional title. The usual top-level component.",
	props: z.object({ children: z.array(z.union([Stack.ref, ...child.element.options])), title: z.string().optional() }),
	component: key("Card", "core"),
});
const Form = defineComponent({
	name: "Form",
	description: "Group of inputs with a submit button. submit is normally @Answer({...}).",
	props: z.object({
		title: z.string(),
		fields: z.array(z.union([TextInput.ref, Choice.ref, Toggle.ref, Text.ref])),
		submitLabel: z.string(),
		submit: z.any(),
	}),
	component: key("Form", "core"),
});

/** Return the user's answer to the waiting agent. The runner validates it. */
export const Answer = defineAction({
	name: "Answer",
	description: "Submit the user's answer to the agent that asked. value is any JSON value, typically an object of the form fields.",
	params: z.object({ value: z.any() }),
});

export const components = [Card, Stack, Form, Text, Heading, Status, KeyValue, List, Table, Code, Button, TextInput, Choice, Toggle, Chart, Image];

export const library = createLibrary({
	id: `${PROFILE_ID}@${PROFILE_VERSION}`,
	root: "Card",
	components,
	actions: [Answer],
	componentGroups: [
		{ name: "Layout", components: ["Card", "Stack"] },
		{ name: "Content", components: ["Text", "Heading", "Status", "KeyValue", "List", "Table", "Code", "Chart", "Image"] },
		{ name: "Input", components: ["Form", "TextInput", "Choice", "Toggle", "Button"] },
	],
});

export const coreComponents = components.filter((c) => (c.component as HostKey).tier === "core").map((c) => c.name);
export const optionalComponents = components.filter((c) => (c.component as HostKey).tier === "optional").map((c) => c.name);
