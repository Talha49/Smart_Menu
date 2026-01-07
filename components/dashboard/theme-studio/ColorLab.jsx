"use client";

/**
 * Color Lab - Professional Color Palette Designer
 * Complete color management system for Theme Studio
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';

export function ColorLab({ value, onChange }) {
    const [activeTab, setActiveTab] = useState('brand');

    return (
        <div className="space-y-6">
            {/* Color Groups Tabs */}
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
                {['brand', 'backgrounds', 'text', 'borders'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all",
                            activeTab === tab
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-600 hover:text-zinc-900"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Color Groups */}
            {activeTab === 'brand' && (
                <BrandColors value={value.brand} onChange={(brand) => onChange({ ...value, brand })} />
            )}

            {activeTab === 'backgrounds' && (
                <BackgroundColors value={value.backgrounds} onChange={(backgrounds) => onChange({ ...value, backgrounds })} />
            )}

            {activeTab === 'text' && (
                <TextColors value={value.text} onChange={(text) => onChange({ ...value, text })} />
            )}

            {activeTab === 'borders' && (
                <BorderColors value={value.borders} onChange={(borders) => onChange({ ...value, borders })} />
            )}

            {/* Live Preview */}
            <ColorPreview colors={value} />
        </div>
    );
}

function BrandColors({ value, onChange }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900">Brand Colors</h3>
            <p className="text-sm text-zinc-600">Define your brand's primary color palette</p>

            <div className="grid gap-4">
                <ColorInput
                    label="Primary"
                    description="Main brand color (buttons, links)"
                    value={value.primary}
                    onChange={(primary) => onChange({ ...value, primary })}
                />
                <ColorInput
                    label="Secondary"
                    description="Supporting brand color"
                    value={value.secondary}
                    onChange={(secondary) => onChange({ ...value, secondary })}
                />
                <ColorInput
                    label="Tertiary"
                    description="Accent color for highlights"
                    value={value.tertiary}
                    onChange={(tertiary) => onChange({ ...value, tertiary })}
                />
            </div>
        </div>
    );
}

function BackgroundColors({ value, onChange }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900">Background Colors</h3>
            <p className="text-sm text-zinc-600">Set background colors for different surfaces</p>

            <div className="grid gap-4">
                <ColorInput
                    label="Page Background"
                    description="Main page background"
                    value={value.page}
                    onChange={(page) => onChange({ ...value, page })}
                />
                <ColorInput
                    label="Card Background"
                    description="Menu item cards"
                    value={value.card}
                    onChange={(card) => onChange({ ...value, card })}
                />
                <ColorInput
                    label="Elevated Background"
                    description="Modals, dropdowns"
                    value={value.elevated}
                    onChange={(elevated) => onChange({ ...value, elevated })}
                />
            </div>
        </div>
    );
}

function TextColors({ value, onChange }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900">Text Colors</h3>
            <p className="text-sm text-zinc-600">Configure text hierarchy colors</p>

            <div className="grid gap-4">
                <ColorInput
                    label="Primary Text"
                    description="Headings, important text"
                    value={value.primary}
                    onChange={(primary) => onChange({ ...value, primary })}
                />
                <ColorInput
                    label="Secondary Text"
                    description="Body text, descriptions"
                    value={value.secondary}
                    onChange={(secondary) => onChange({ ...value, secondary })}
                />
                <ColorInput
                    label="Tertiary Text"
                    description="Subtle text, captions"
                    value={value.tertiary}
                    onChange={(tertiary) => onChange({ ...value, tertiary })}
                />
                <ColorInput
                    label="Inverse Text"
                    description="Text on dark backgrounds"
                    value={value.inverse}
                    onChange={(inverse) => onChange({ ...value, inverse })}
                />
            </div>
        </div>
    );
}

function BorderColors({ value, onChange }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900">Border Colors</h3>
            <p className="text-sm text-zinc-600">Set border and divider colors</p>

            <div className="grid gap-4">
                <ColorInput
                    label="Light Border"
                    description="Subtle borders, dividers"
                    value={value.light}
                    onChange={(light) => onChange({ ...value, light })}
                />
                <ColorInput
                    label="Medium Border"
                    description="Standard borders"
                    value={value.medium}
                    onChange={(medium) => onChange({ ...value, medium })}
                />
                <ColorInput
                    label="Dark Border"
                    description="Emphasized borders"
                    value={value.dark}
                    onChange={(dark) => onChange({ ...value, dark })}
                />
            </div>
        </div>
    );
}

function ColorInput({ label, description, value, onChange }) {
    const [tempValue, setTempValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    const handleChange = (newValue) => {
        setTempValue(newValue);

        // Validate hex color
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (hexRegex.test(newValue)) {
            setIsValid(true);
            onChange(newValue);
        } else {
            setIsValid(false);
        }
    };

    return (
        <div className="flex items-start gap-3">
            {/* Color Preview */}
            <div className="relative flex-shrink-0">
                <div
                    className="w-16 h-16 rounded-xl border-2 border-zinc-200 cursor-pointer"
                    style={{ backgroundColor: isValid ? tempValue : '#CCCCCC' }}
                >
                    <input
                        type="color"
                        value={isValid ? tempValue : '#CCCCCC'}
                        onChange={(e) => handleChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                {isValid && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            {/* Label & Input */}
            <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-zinc-900 mb-1">
                    {label}
                </label>
                <p className="text-xs text-zinc-500 mb-2">{description}</p>

                <div className="relative">
                    <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="#000000"
                        className={cn(
                            "w-full px-3 py-2 rounded-lg border-2 font-mono text-sm transition-colors",
                            isValid
                                ? "border-zinc-200 focus:border-zinc-900"
                                : "border-red-300 focus:border-red-500"
                        )}
                    />
                    {!isValid && (
                        <div className="absolute right-3 top-2.5">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                    )}
                </div>
                {!isValid && (
                    <p className="text-xs text-red-500 mt-1">Invalid hex color</p>
                )}
            </div>
        </div>
    );
}

function ColorPreview({ colors }) {
    return (
        <div className="mt-6 p-6 rounded-2xl border-2 border-zinc-200 bg-white">
            <h3 className="font-semibold text-zinc-900 mb-4">Live Preview</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Brand Colors */}
                <div>
                    <p className="text-xs font-medium text-zinc-600 mb-2">Brand</p>
                    <div className="flex gap-2">
                        <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: colors.brand.primary }} />
                        <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: colors.brand.secondary }} />
                        <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: colors.brand.tertiary }} />
                    </div>
                </div>

                {/* Background Colors */}
                <div>
                    <p className="text-xs font-medium text-zinc-600 mb-2">Backgrounds</p>
                    <div className="flex gap-2">
                        <div className="flex-1 h-12 rounded-lg border border-zinc-200" style={{ backgroundColor: colors.backgrounds.page }} />
                        <div className="flex-1 h-12 rounded-lg border border-zinc-200" style={{ backgroundColor: colors.backgrounds.card }} />
                        <div className="flex-1 h-12  rounded-lg border border-zinc-200" style={{ backgroundColor: colors.backgrounds.elevated }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
