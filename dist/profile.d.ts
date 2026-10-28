import { type LibraryJSONSchema } from "@openuidev/lang-core";
export declare const PROFILE_ID: "oqto";
export declare const PROFILE_VERSION: string;
export declare const ROOT: string;
export declare const librarySchema: LibraryJSONSchema;
export declare const catalog: {
    root: string;
    groups: ({
        name: string;
        components: string[];
        notes: string[];
    } | {
        name: string;
        components: string[];
        notes?: undefined;
    })[];
    components: {
        Accordion: {
            signature: string;
            description: string;
        };
        AccordionItem: {
            signature: string;
            description: string;
        };
        AreaChart: {
            signature: string;
            description: string;
        };
        BarChart: {
            signature: string;
            description: string;
        };
        BoldText: {
            signature: string;
            description: string;
        };
        Button: {
            signature: string;
            description: string;
        };
        Buttons: {
            signature: string;
            description: string;
        };
        Callout: {
            signature: string;
            description: string;
        };
        Card: {
            signature: string;
            description: string;
        };
        CardHeader: {
            signature: string;
            description: string;
        };
        Carousel: {
            signature: string;
            description: string;
        };
        CheckBoxGroup: {
            signature: string;
            description: string;
        };
        CheckBoxItem: {
            signature: string;
            description: string;
        };
        ChipItem: {
            signature: string;
            description: string;
        };
        Chips: {
            signature: string;
            description: string;
        };
        CodeBlock: {
            signature: string;
            description: string;
        };
        Col: {
            signature: string;
            description: string;
        };
        CompositeCardBlock: {
            signature: string;
            description: string;
        };
        CompositeCardItem: {
            signature: string;
            description: string;
        };
        ContextCardBlock: {
            signature: string;
            description: string;
        };
        ContextCardItem: {
            signature: string;
            description: string;
        };
        DatePicker: {
            signature: string;
            description: string;
        };
        EditableTable: {
            signature: string;
            description: string;
        };
        EntityList: {
            signature: string;
            description: string;
        };
        Form: {
            signature: string;
            description: string;
        };
        FormControl: {
            signature: string;
            description: string;
        };
        HorizontalBarChart: {
            signature: string;
            description: string;
        };
        Icon: {
            signature: string;
            description: string;
        };
        IconButton: {
            signature: string;
            description: string;
        };
        IconText: {
            signature: string;
            description: string;
        };
        Image: {
            signature: string;
            description: string;
        };
        ImageBlock: {
            signature: string;
            description: string;
        };
        ImageGallery: {
            signature: string;
            description: string;
        };
        ImageText: {
            signature: string;
            description: string;
        };
        ImageTextLarge: {
            signature: string;
            description: string;
        };
        InlineHeader: {
            signature: string;
            description: string;
        };
        Input: {
            signature: string;
            description: string;
        };
        Label: {
            signature: string;
            description: string;
        };
        LineChart: {
            signature: string;
            description: string;
        };
        ListBlock: {
            signature: string;
            description: string;
        };
        ListItem: {
            signature: string;
            description: string;
        };
        MarkDownRenderer: {
            signature: string;
            description: string;
        };
        MetricIndicatorInline: {
            signature: string;
            description: string;
        };
        MetricIndicatorWithStrikethrough: {
            signature: string;
            description: string;
        };
        Modal: {
            signature: string;
            description: string;
        };
        OptionCard: {
            signature: string;
            description: string;
        };
        OptionCards: {
            signature: string;
            description: string;
        };
        OverviewCardBlock: {
            signature: string;
            description: string;
        };
        OverviewCardItem: {
            signature: string;
            description: string;
        };
        PieChart: {
            signature: string;
            description: string;
        };
        Point: {
            signature: string;
            description: string;
        };
        RadarChart: {
            signature: string;
            description: string;
        };
        RadialChart: {
            signature: string;
            description: string;
        };
        RadioGroup: {
            signature: string;
            description: string;
        };
        RadioItem: {
            signature: string;
            description: string;
        };
        ScatterChart: {
            signature: string;
            description: string;
        };
        ScatterSeries: {
            signature: string;
            description: string;
        };
        Select: {
            signature: string;
            description: string;
        };
        SelectItem: {
            signature: string;
            description: string;
        };
        Separator: {
            signature: string;
            description: string;
        };
        Series: {
            signature: string;
            description: string;
        };
        SingleStackedBarChart: {
            signature: string;
            description: string;
        };
        Slice: {
            signature: string;
            description: string;
        };
        Slider: {
            signature: string;
            description: string;
        };
        SnippetCardBlock: {
            signature: string;
            description: string;
        };
        SnippetCardItem: {
            signature: string;
            description: string;
        };
        Stack: {
            signature: string;
            description: string;
        };
        Steps: {
            signature: string;
            description: string;
        };
        StepsItem: {
            signature: string;
            description: string;
        };
        SwitchGroup: {
            signature: string;
            description: string;
        };
        SwitchItem: {
            signature: string;
            description: string;
        };
        TabItem: {
            signature: string;
            description: string;
        };
        Table: {
            signature: string;
            description: string;
        };
        Tabs: {
            signature: string;
            description: string;
        };
        Tag: {
            signature: string;
            description: string;
        };
        TagBlock: {
            signature: string;
            description: string;
        };
        Text: {
            signature: string;
            description: string;
        };
        TextArea: {
            signature: string;
            description: string;
        };
        TextCallout: {
            signature: string;
            description: string;
        };
        TextContent: {
            signature: string;
            description: string;
        };
        VisualCardBlock: {
            signature: string;
            description: string;
        };
        VisualCardItem: {
            signature: string;
            description: string;
        };
    };
    actions: string[];
};
export declare const componentNames: string[];
/** The model instructions. Inject only when OpenUI is enabled for the Session. */
export declare function systemPrompt(): Promise<string>;
export declare const createOqtoParser: () => import("@openuidev/lang-core").Parser;
export declare const createOqtoStreamingParser: () => import("@openuidev/lang-core").StreamParser;
