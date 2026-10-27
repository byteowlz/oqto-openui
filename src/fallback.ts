/**
 * Deterministic plain-text rendering of a parsed tree. Used as the reference
 * text fallback and by hosts (TUI/headless) for components they do not draw.
 */
type Node = { type?: string; typeName?: string; props?: Record<string, unknown> } | unknown;

export function renderFallback(node: Node, depth = 0): string {
	if (node == null) return "";
	if (Array.isArray(node)) return node.map((n) => renderFallback(n, depth)).filter(Boolean).join("\n");
	if (typeof node !== "object") return String(node);
	const { typeName, props = {} } = node as { typeName?: string; props?: Record<string, unknown> };
	const p = props as Record<string, any>;
	const text = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : typeof v === "object" ? "…" : String(v));
	switch (typeName) {
		case "Card":
			return [p.title ? `== ${p.title} ==` : "", renderFallback(p.children, depth)].filter(Boolean).join("\n");
		case "Stack":
			return renderFallback(p.children, depth);
		case "Heading":
			return `${"#".repeat(p.level ?? 1)} ${p.text}`;
		case "Text":
			return text(p.text);
		case "Status":
			return `[${(p.tone ?? "info").toUpperCase()}] ${p.text}`;
		case "KeyValue":
			return (p.items ?? []).map((i: any) => `${i.label}: ${i.value}`).join("\n");
		case "List":
			return (p.items ?? []).map((i: string, n: number) => `${p.ordered ? `${n + 1}.` : "-"} ${i}`).join("\n");
		case "Table":
			return [(p.columns ?? []).join(" | "), ...(p.rows ?? []).map((r: string[]) => r.join(" | "))].join("\n");
		case "Code":
			return "```" + (p.language ?? "") + "\n" + p.code + "\n```";
		case "Chart":
			return `${p.title ? p.title + ": " : ""}${(p.labels ?? []).map((l: string, i: number) => `${l}=${p.values?.[i]}`).join(", ")}`;
		case "Image":
			return `[image: ${p.alt}]`;
		case "Button":
			return `[${p.label}]`;
		case "TextInput":
			return `${p.label}: ____`;
		case "Choice":
			return `${p.label}: ${(p.options ?? []).join(" / ")}`;
		case "Toggle":
			return `${p.label}: [ ]`;
		case "Form":
			return [`== ${p.title} ==`, renderFallback(p.fields, depth), `[${p.submitLabel}]`].join("\n");
		default:
			return "";
	}
}
