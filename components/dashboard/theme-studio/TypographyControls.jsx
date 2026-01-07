"use client";

/**
 * Typography Controls - Professional Typography Management
 * Complete font and text styling controls for Theme Studio
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Type, Plus, Minus } from 'lucide-react';

const GOOGLE_FONTS = [
    { family: 'Inter', category: 'sans-serif' },
    { family: 'Roboto', category: 'sans-serif' },
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Bebas Neue', category: 'display' },
    { family: 'Lato', category: 'sans-serif' },
    { family: 'Montserrat', category: 'sans-serif' },
    { family: 'Poppins', category: 'sans-serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Nunito', category: 'sans-serif' },
    { family: 'Fredoka', category: 'display' }
];

export function TypographyControls({ value, onChange }) {
    return (
        <div className="space-y-8">
            {/* Font Families */}
            <section>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Font Families</h3>

                <div className="space-y-4">
                    <FontSelector
                        label="Heading Font"
                        description="For titles and category headers"
                        value={value.fonts.heading}
                        onChange={(heading) => onChange({
                            ...value,
                            fonts: { ...value.fonts, heading }
                        })}
                    />

                    <FontSelector
                        label="Body Font"
                        description="For descriptions and general text"
                        value={value.fonts.body}
                        onChange={(body) => onChange({
                            ...value,
                            fonts: { ...value.fonts, body }
                        })}
                    />

                    <FontSelector
                        label="Accent Font"
                        description="For special emphasis"
                        value={value.fonts.accent}
                        onChange={(accent) => onChange({
                            ...value,
                            fonts: { ...value.fonts, accent }
                        })}
                    />
                </div>
            </section>

            {/* Font Sizes */}
            <section>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Font Sizes</h3>

                <div className="grid gap-4">
                    <SizeControl
                        label="Category Title"
                        value={value.sizes.categoryTitle}
                        onChange={(categoryTitle) => onChange({
                            ...value,
                            sizes: { ...value.sizes, categoryTitle }
                        })}
                        min={20}
                        max={60}
                    />

                    <SizeControl
                        label="Item Name"
                        value={value.sizes.itemName}
                        onChange={(itemName) => onChange({
                            ...value,
                            sizes: { ...value.sizes, itemName }
                        })}
                        min={14}
                        max={32}
                    />

                    <SizeControl
                        label="Item Description"
                        value={value.sizes.itemDescription}
                        onChange={(itemDescription) => onChange({
                            ...value,
                            sizes: { ...value.sizes, itemDescription }
                        })}
                        min={12}
                        max={20}
                    />

                    <SizeControl
                        label="Price"
                        value={value.sizes.price}
                        onChange={(price) => onChange({
                            ...value,
                            sizes: { ...value.sizes, price }
                        })}
                        min={14}
                        max={32}
                    />
                </div>
            </section>

            {/* Line Heights */}
            <section>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Line Heights</h3>

                <div className="grid gap-4">
                    <SliderControl
                        label="Tight"
                        description="For compact text"
                        value={value.lineHeights.tight}
                        onChange={(tight) => onChange({
                            ...value,
                            lineHeights: { ...value.lineHeights, tight }
                        })}
                        min={1.0}
                        max={2.0}
                        step={0.05}
                    />

                    <SliderControl
                        label="Normal"
                        description="Standard line spacing"
                        value={value.lineHeights.normal}
                        onChange={(normal) => onChange({
                            ...value,
                            lineHeights: { ...value.lineHeights, normal }
                        })}
                        min={1.0}
                        max={2.0}
                        step={0.05}
                    />

                    <SliderControl
                        label="Relaxed"
                        description="For better readability"
                        value={value.lineHeights.relaxed}
                        onChange={(relaxed) => onChange({
                            ...value,
                            lineHeights: { ...value.lineHeights, relaxed }
                        })}
                        min={1.0}
                        max={2.5}
                        step={0.05}
                    />
                </div>
            </section>

            {/* Live Preview */}
            <TypographyPreview typography={value} />
        </div>
    );
}

function FontSelector({ label, description, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
                {label}
            </label>
            <p className="text-xs text-zinc-500 mb-3">{description}</p>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-zinc-200 hover:border-zinc-300 transition-colors"
                    style={{ fontFamily: value.family }}
                >
                    <span className="font-medium">{value.family}</span>
                    <Type className="w-4 h-4 text-zinc-400" />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border-2 border-zinc-200 rounded-xl shadow-xl z-10">
                        {GOOGLE_FONTS.map((font) => (
                            <button
                                key={font.family}
                                onClick={() => {
                                    onChange({ family: font.family, weight: value.weight });
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors",
                                    value.family === font.family && "bg-zinc-100"
                                )}
                                style={{ fontFamily: font.family }}
                            >
                                <div className="font-medium">{font.family}</div>
                                <div className="text-xs text-zinc-500">{font.category}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Font Weight */}
            <div className="mt-3 grid grid-cols-3 gap-2">
                {[400, 600, 700].map((weight) => (
                    <button
                        key={weight}
                        onClick={() => onChange({ family: value.family, weight })}
                        className={cn(
                            "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                            value.weight === weight
                                ? "border-zinc-900 bg-zinc-50"
                                : "border-zinc-200 hover:border-zinc-300"
                        )}
                    >
                        {weight === 400 ? 'Regular' : weight === 600 ? 'Semibold' : 'Bold'}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SizeControl({ label, value, onChange, min, max }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onChange(Math.max(min, value - 2))}
                        className="w-10 h-10 rounded-lg border-2 border-zinc-200 hover:border-zinc-300 flex items-center justify-center transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={min}
                        max={max}
                        className="flex-1 px-4 py-2 rounded-lg border-2 border-zinc-200 text-center font-mono focus:border-zinc-900 focus:outline-none"
                    />

                    <button
                        onClick={() => onChange(Math.min(max, value + 2))}
                        className="w-10 h-10 rounded-lg border-2 border-zinc-200 hover:border-zinc-300 flex items-center justify-center transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>

                    <span className="text-sm text-zinc-600 w-8">px</span>
                </div>
            </div>
        </div>
    );
}

function SliderControl({ label, description, value, onChange, min, max, step }) {
    return (
        <div>
            <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-semibold text-zinc-900">
                    {label}
                </label>
                <span className="text-xs text-zinc-600">{value.toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-3">{description}</p>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
}

function TypographyPreview({ typography }) {
    return (
        <div className="p-6 rounded-2xl border-2 border-zinc-200 bg-white">
            <h3 className="font-semibold text-zinc-900 mb-4">Live Preview</h3>

            <div className="space-y-4">
                <div>
                    <h4
                        style={{
                            fontFamily: typography.fonts.heading.family,
                            fontSize: `${typography.sizes.categoryTitle}px`,
                            lineHeight: typography.lineHeights.tight
                        }}
                        className="font-bold text-zinc-900"
                    >
                        Category Title
                    </h4>
                </div>

                <div>
                    <h5
                        style={{
                            fontFamily: typography.fonts.body.family,
                            fontSize: `${typography.sizes.itemName}px`,
                            lineHeight: typography.lineHeights.normal
                        }}
                        className="font-semibold text-zinc-900"
                    >
                        Menu Item Name
                    </h5>
                    <p
                        style={{
                            fontFamily: typography.fonts.body.family,
                            fontSize: `${typography.sizes.itemDescription}px`,
                            lineHeight: typography.lineHeights.relaxed
                        }}
                        className="text-zinc-600 mt-1"
                    >
                        This is a sample description to preview how your text will look with the selected typography settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
