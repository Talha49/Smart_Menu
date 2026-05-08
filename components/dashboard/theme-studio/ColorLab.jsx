"use client";

/**
 * Color Lab - Professional Color Palette Designer
 * Complete color management system for Theme Studio
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle, Palette, Info } from 'lucide-react';

export function ColorLab({ value, onChange }) {
    // Expose only the most essential colors to prevent overwhelming the user
    return (
        <div className="space-y-8">
            <div className="mb-6 border-b border-zinc-100 pb-4">
                <p className="text-sm text-zinc-600">
                    Customize the 4 main colors of your live menu. We automatically calculate the perfect borders, hover states, and subtle shades based on your choices.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ColorInput
                    label="Primary Brand Color"
                    description="Category buttons, active states, and highlights."
                    value={value.brand.primary}
                    onChange={(primary) => onChange({ ...value, brand: { ...value.brand, primary, secondary: primary } })}
                />
                
                <ColorInput
                    label="Main Page Background"
                    description="The background behind everything on your menu."
                    value={value.backgrounds.page}
                    onChange={(page) => onChange({ ...value, backgrounds: { ...value.backgrounds, page } })}
                />
                
                <ColorInput
                    label="Menu Item Card"
                    description="The background color of the food item cards."
                    value={value.backgrounds.card}
                    onChange={(card) => onChange({ ...value, backgrounds: { ...value.backgrounds, card, elevated: card } })}
                />
                
                <ColorInput
                    label="Main Text Color"
                    description="Item names, category titles, and descriptions."
                    value={value.text.primary}
                    onChange={(primary) => onChange({ ...value, text: { ...value.text, primary, secondary: primary } })}
                />
            </div>

            {/* Live Preview */}
            <ColorPreview colors={value} />
        </div>
    );
}

function ColorInput({ label, description, value, onChange }) {
    const [tempValue, setTempValue] = useState(value || '#000000');
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
        <div className="flex items-start gap-4 p-4 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 transition-colors">
            {/* Color Preview & Picker */}
            <div className="relative flex-shrink-0 mt-1">
                <div
                    className="w-12 h-12 rounded-xl border-2 border-zinc-200 cursor-pointer shadow-sm overflow-hidden"
                    style={{ backgroundColor: isValid ? tempValue : '#CCCCCC' }}
                >
                    <input
                        type="color"
                        value={isValid ? tempValue : '#CCCCCC'}
                        onChange={(e) => handleChange(e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Label & Input */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-bold text-zinc-900">
                        {label}
                    </label>
                    <div className="group relative flex items-center justify-center">
                        <Info className="w-4 h-4 text-zinc-400 hover:text-zinc-600 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-center pointer-events-none">
                            {description}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-zinc-900" />
                        </div>
                    </div>
                </div>

                <div className="relative max-w-[120px]">
                    <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="#000000"
                        className={cn(
                            "w-full px-3 py-1.5 rounded-lg border-2 font-mono text-xs font-bold transition-colors uppercase tracking-wider",
                            isValid
                                ? "border-zinc-200 focus:border-zinc-900"
                                : "border-red-300 focus:border-red-500"
                        )}
                    />
                    {!isValid && (
                        <div className="absolute right-2 top-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </div>
                    )}
                </div>
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
