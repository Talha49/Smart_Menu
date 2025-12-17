"use client";

import { useThemeStore } from "@/hooks/use-theme-store";
import { BuilderAccordion } from "./BuilderAccordion";
import { ColorControl } from "./ColorControl";
import { RangeControl } from "./RangeControl";
import { FontControl } from "./FontControl";
import { Palette, Type, Layout, PaintBucket } from "lucide-react";

export function ThemeBuilder() {
    const { theme, updateField } = useThemeStore();

    // Safety check for initialization
    if (!theme) return null;

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar pb-24">

            {/* 1. BRAND COLORS */}
            <BuilderAccordion title="Brand Identity" icon={PaintBucket} defaultOpen={true}>
                <ColorControl
                    label="Primary Color"
                    value={theme.primaryColor}
                    onChange={(v) => updateField('primaryColor', v)}
                />
                <ColorControl
                    label="Accent Color"
                    value={theme.accentColor}
                    onChange={(v) => updateField('accentColor', v)}
                />
            </BuilderAccordion>

            {/* 2. HEADER & BACKGROUND */}
            <BuilderAccordion title="Surface Colors" icon={Palette}>
                <ColorControl
                    label="Background"
                    value={theme.backgroundColor}
                    onChange={(v) => updateField('backgroundColor', v)}
                />
                <ColorControl
                    label="Header Bar"
                    value={theme.headerColor}
                    onChange={(v) => updateField('headerColor', v)}
                />
                <ColorControl
                    label="Text Color"
                    value={theme.textColor}
                    onChange={(v) => updateField('textColor', v)}
                />
            </BuilderAccordion>

            {/* 3. TYPOGRAPHY */}
            <BuilderAccordion title="Typography" icon={Type}>
                <FontControl
                    value={theme.fontFamily}
                    onChange={(v) => updateField('fontFamily', v)}
                />
                <div className="pt-4 border-t border-dashed">
                    <RangeControl
                        label="Base Text Size"
                        value={theme.baseFontSize}
                        min={14} max={20} unit="px"
                        onChange={(v) => updateField('baseFontSize', v)}
                    />
                </div>
            </BuilderAccordion>

            {/* 4. LAYOUT & SHAPES */}
            <BuilderAccordion title="Shapes & Layout" icon={Layout}>
                <RangeControl
                    label="Corner Radius"
                    value={theme.borderRadius}
                    min={0} max={32} step={4} unit="px"
                    onChange={(v) => updateField('borderRadius', v)}
                />
            </BuilderAccordion>

        </div>
    );
}
