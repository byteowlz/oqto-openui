const isElement = (v) => !!v && typeof v === "object" && v.type === "element" && typeof v.typeName === "string";
const isRef = (v) => !!v && typeof v === "object" && "k" in v;
const str = (v) => v == null || isRef(v) ? "" : typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : "";
function table(header, rows) {
    const width = header.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length)));
    const line = (cells) => cells.map((c, i) => c.padEnd(width[i] ?? 0)).join(" | ").trimEnd();
    return [line(header), width.map((w) => "-".repeat(w)).join("-|-"), ...rows.map(line)].join("\n");
}
function series(labels, s) {
    const ls = Array.isArray(labels) ? labels.map(str) : [];
    return (Array.isArray(s) ? s : [])
        .filter(isElement)
        .map((e) => {
        const values = Array.isArray(e.props.values) ? e.props.values : [];
        return `${str(e.props.category)}: ${ls.map((l, i) => `${l}=${str(values[i])}`).join(", ")}`;
    })
        .join("\n");
}
/** Props that select appearance/identity, never user-facing text. */
const PRESENTATION = new Set(["id", "name", "variant", "size", "layout", "type", "direction", "align", "justify", "gap", "wrap", "appearance", "icon", "iconVariant", "iconSize", "subtextVariant", "rightVariant", "responsive", "orientation", "decorative", "category", "mode", "rules", "value", "defaultValue", "defaultChecked", "disabled", "src"]);
export function renderFallback(node) {
    if (node == null)
        return "";
    if (Array.isArray(node))
        return node.map(renderFallback).filter(Boolean).join("\n");
    if (!isElement(node))
        return typeof node === "object" ? "" : str(node);
    const p = node.props;
    const kids = (v) => renderFallback(v);
    switch (node.typeName) {
        case "CardHeader":
            return [p.title ? `== ${str(p.title)} ==` : "", str(p.subtitle)].filter(Boolean).join("\n");
        case "InlineHeader":
            return [`## ${str(p.heading)}`, str(p.description)].filter(Boolean).join("\n");
        case "TextContent":
            return str(p.text);
        case "MarkDownRenderer":
            return str(p.textMarkdown);
        case "Callout":
        case "TextCallout":
            return `[${str(p.variant || "info").toUpperCase()}] ${[str(p.title), str(p.description)].filter(Boolean).join(": ")}`;
        case "CodeBlock":
            return `\`\`\`${str(p.language)}\n${str(p.codeString)}\n\`\`\``;
        case "Tabs":
        case "Accordion":
            return (Array.isArray(p.items) ? p.items : [])
                .filter(isElement)
                .map((i) => `-- ${str(i.props.trigger)} --\n${kids(i.props.content)}`)
                .join("\n");
        case "Steps":
            return (Array.isArray(p.items) ? p.items : [])
                .filter(isElement)
                .map((i, n) => `${n + 1}. ${str(i.props.title)}${i.props.details ? ` - ${str(i.props.details)}` : ""}`)
                .join("\n");
        case "Table": {
            const cols = (Array.isArray(p.columns) ? p.columns : []).filter(isElement);
            const data = cols.map((c) => (Array.isArray(c.props.data) ? c.props.data.map(str) : []));
            const n = Math.max(0, ...data.map((d) => d.length));
            return table(cols.map((c) => str(c.props.label)), Array.from({ length: n }, (_, r) => data.map((d) => d[r] ?? "")));
        }
        case "EditableTable": {
            const cols = Array.isArray(p.columns) ? p.columns : [];
            const rows = Array.isArray(p.data) ? p.data : [];
            return [p.name ? str(p.name) : "", table(cols.map((c) => str(c.header ?? c.key)), rows.map((r) => (r.values ?? []).map(str)))]
                .filter(Boolean)
                .join("\n");
        }
        case "BarChart":
        case "LineChart":
        case "AreaChart":
        case "HorizontalBarChart":
        case "RadarChart":
            return series(p.labels, p.series);
        case "PieChart":
        case "RadialChart": {
            const ls = Array.isArray(p.labels) ? p.labels : [];
            const vs = Array.isArray(p.values) ? p.values : [];
            return ls.map((l, i) => `${str(l)}=${str(vs[i])}`).join(", ");
        }
        case "EntityList": {
            const row = (r) => {
                const o = (r ?? {});
                return [str(o.left), str(o.right)];
            };
            const rows = (Array.isArray(p.rows) ? p.rows : []).map(row);
            return table(p.header ? row(p.header) : ["", ""], p.footer ? [...rows, row(p.footer)] : rows);
        }
        case "ListBlock":
            return (Array.isArray(p.items) ? p.items : [])
                .filter(isElement)
                .map((i, n) => `${p.variant === "number" ? `${n + 1}.` : "-"} ${str(i.props.title)}${i.props.subtitle ? ` - ${str(i.props.subtitle)}` : ""}`)
                .join("\n");
        case "ImageGallery":
            return (Array.isArray(p.images) ? p.images : []).map((i) => `[image: ${str(i.alt ?? i.details)}]`).join("\n");
        case "ImageBlock":
        case "Image":
            return `[image: ${str(p.alt)}]`;
        case "TagBlock":
            return (Array.isArray(p.tags) ? p.tags.map(str) : []).map((t) => `#${t}`).join(" ");
        case "Tag":
            return `#${str(p.text)}`;
        case "MetricIndicatorInline":
            return [str(p.value), str(p.subtext), p.trend ? `(${p.trend.direction === "up" ? "+" : "-"}${str(p.trend.value)}%)` : ""]
                .filter(Boolean)
                .join(" ");
        case "Button":
            return `[${str(p.label)}]`;
        case "Buttons":
            return (Array.isArray(p.buttons) ? p.buttons : []).map(renderFallback).join(" ");
        case "Form":
            return [`== ${str(p.name)} ==`, kids(p.fields), kids(p.buttons)].filter(Boolean).join("\n");
        case "FormControl":
            return `${str(p.label)}: ${kids(p.input) || "____"}`;
        case "Select":
        case "RadioGroup":
        case "Chips":
        case "OptionCards":
        case "CheckBoxGroup":
            return (Array.isArray(p.items) ? p.items : [])
                .filter(isElement)
                .map((i) => str(i.props.label ?? i.props.title))
                .join(" / ");
        case "SwitchGroup":
            return (Array.isArray(p.items) ? p.items : [])
                .filter(isElement)
                .map((i) => `[ ] ${str(i.props.label ?? i.props.name)}`)
                .join("\n");
        case "Input":
        case "TextArea":
        case "DatePicker":
        case "Slider":
            return "____";
        case "Text":
        case "BoldText":
            return [str(p.value), str(p.subtext)].filter(Boolean).join(" ");
        case "IconText":
        case "ImageText":
        case "ImageTextLarge":
            return [str(p.title), str(p.subtitle)].filter(Boolean).join(" ");
        case "OverviewCardItem":
            return [kids(p.top), kids(p.bottom)].filter(Boolean).join(": ");
        case "Separator":
            return "---";
        case "Icon":
            return "";
        default: {
            // Generic: strings and nested elements in declaration order.
            const parts = [];
            for (const [k, v] of Object.entries(p)) {
                if (PRESENTATION.has(k))
                    continue;
                if (typeof v === "string")
                    parts.push(v);
                else if (isElement(v) || Array.isArray(v))
                    parts.push(kids(v));
            }
            return parts.filter(Boolean).join(node.typeName.endsWith("Item") ? " · " : "\n");
        }
    }
}
