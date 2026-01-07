"use client";

/**
 * Card Designer - Professional Menu Item Card Customization
 * Complete control over menu item card appearance
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image, Layout, Palette, Sparkles, Settings } from 'lucide-react';

export function CardDesigner({ value, onChange }) {
    const [activeTab, setActiveTab] = useState('layout');

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
                {[
                    { id: 'layout', label: 'Layout', icon: Layout },
                    { id: 'image', label: 'Image', icon: Image },
                    { id: 'styling', label: 'Styling', icon: Palette },
                    { id: 'effects', label: 'Effects', icon: Sparkles }
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-600 hover:text-zinc-900"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'layout' && (
                <LayoutSettings value={value} onChange={onChange} />
            )}

            {activeTab === 'image' && (
                <ImageSettings value={value} onChange={onChange} />
            )}

            {activeTab === 'styling' && (
                <StylingSettings value={value} onChange={onChange} />
            )}

            {activeTab === 'effects' && (
                <EffectsSettings value={value} onChange={onChange} />
            )}

            {/* Live Preview */}
            <CardPreview config={value} />
        </div>
    );
}

/**
 * Layout Settings Tab
 */
function LayoutSettings({ value, onChange }) {
    const layouts = [
        {
            id: 'horizontal',
            name: 'Horizontal',
            emoji: '➡️',
            description: 'Image left, content right'
        },
        {
            id: 'vertical',
            name: 'Vertical',
            emoji: '⬇️',
            description: 'Image top, content bottom'
        },
        {
            id: 'overlay',
            name: 'Overlay',
            emoji: '🎨',
            description: 'Content over image'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            emoji: '📝',
            description: 'Text-only compact'
        }
    ];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Card Layout</h3>
                <p className="text-sm text-zinc-600 mb-4">Choose how menu items are displayed</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layouts.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => onChange({ ...value, layout: layout.id })}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left",
                            value.layout === layout.id
                                ? "border-zinc-900 bg-zinc-50 shadow-lg"
                                : "border-zinc-200 hover:border-zinc-300"
                        )}
                    >
                        <div className="text-3xl">{layout.emoji}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-zinc-900">{layout.name}</div>
                            <p className="text-xs text-zinc-500 mt-1">{layout.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Content Alignment */}
            <div className="mt-6">
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Content Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map((align) => (
                        <button
                            key={align}
                            onClick={() => onChange({
                                ...value,
                                content: { ...value.content, alignment: align }
                            })}
                            className={cn(
                                "px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                                value.content?.alignment === align
                                    ? "border-zinc-900 bg-zinc-50"
                                    : "border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            {align}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Position */}
            <div className="mt-4">
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Price Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: 'inline', label: 'Inline', emoji: '—' },
                        { value: 'badge', label: 'Badge', emoji: '🏷️' }
                    ].map((pos) => (
                        <button
                            key={pos.value}
                            onClick={() => onChange({
                                ...value,
                                content: { ...value.content, pricePosition: pos.value }
                            })}
                            className={cn(
                                "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 justify-center",
                                value.content?.pricePosition === pos.value
                                    ? "border-zinc-900 bg-zinc-50"
                                    : "border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            <span>{pos.emoji}</span>
                            {pos.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Image Settings Tab
 */
function ImageSettings({ value, onChange }) {
    return (
        <div className="space-y-6">
            {/* Enable Images */}
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={value.image?.enabled !== false}
                    onChange={(e) => onChange({
                        ...value,
                        image: { ...value.image, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-2 border-zinc-300 cursor-pointer"
                />
                <div>
                    <div className="font-semibold text-zinc-900">Show Images</div>
                    <p className="text-xs text-zinc-500">Display item images on cards</p>
                </div>
            </label>

            {value.image?.enabled !== false && (
                <>
                    {/* Image Shape */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-900 mb-3">
                            Image Shape
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: 'rounded', label: 'Rounded', radius: 'lg' },
                                { value: 'circle', label: 'Circle', radius: 'full' },
                                { value: 'square', label: 'Square', radius: 'none' }
                            ].map((shape) => (
                                <button
                                    key={shape.value}
                                    onClick={() => onChange({
                                        ...value,
                                        image: { ...value.image, shape: shape.value, borderRadius: shape.radius }
                                    })}
                                    className={cn(
                                        "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                        value.image?.shape === shape.value
                                            ? "border-zinc-900 bg-zinc-50"
                                            : "border-zinc-200 hover:border-zinc-300"
                                    )}
                                >
                                    {shape.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-900 mb-3">
                            Aspect Ratio
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['1/1', '4/3', '16/9'].map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => onChange({
                                        ...value,
                                        image: { ...value.image, aspectRatio: ratio }
                                    })}
                                    className={cn(
                                        "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                        value.image?.aspectRatio === ratio
                                            ? "border-zinc-900 bg-zinc-50"
                                            : "border-zinc-200 hover:border-zinc-300"
                                    )}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Object Fit */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-900 mb-3">
                            Image Fit
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'cover', label: 'Cover', desc: 'Fill area' },
                                { value: 'contain', label: 'Contain', desc: 'Fit inside' }
                            ].map((fit) => (
                                <button
                                    key={fit.value}
                                    onClick={() => onChange({
                                        ...value,
                                        image: { ...value.image, objectFit: `object-${fit.value}` }
                                    })}
                                    className={cn(
                                        "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left",
                                        value.image?.objectFit === `object-${fit.value}`
                                            ? "border-zinc-900 bg-zinc-50"
                                            : "border-zinc-200 hover:border-zinc-300"
                                    )}
                                >
                                    <div>{fit.label}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{fit.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Styling Settings Tab
 */
function StylingSettings({ value, onChange }) {
    return (
        <div className="space-y-6">
            {/* Border Radius */}
            <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Border Radius
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'sm', label: 'Small', px: '4px' },
                        { value: 'md', label: 'Medium', px: '8px' },
                        { value: 'lg', label: 'Large', px: '16px' },
                        { value: 'xl', label: 'X-Large', px: '24px' },
                        { value: 'xxl', label: '2X-Large', px: '32px' },
                        { value: 'full', label: 'Full', px: '9999px' }
                    ].map((radius) => (
                        <button
                            key={radius.value}
                            onClick={() => onChange({
                                ...value,
                                card: { ...value.card, borderRadius: radius.value }
                            })}
                            className={cn(
                                "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                value.card?.borderRadius === radius.value
                                    ? "border-zinc-900 bg-zinc-50"
                                    : "border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            <div>{radius.label}</div>
                            <div className="text-[10px] text-zinc-500">{radius.px}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Shadow */}
            <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Card Shadow
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {['none', 'sm', 'md', 'lg', 'xl'].map((shadow) => (
                        <button
                            key={shadow}
                            onClick={() => onChange({
                                ...value,
                                card: { ...value.card, shadow }
                            })}
                            className={cn(
                                "px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                                value.card?.shadow === shadow
                                    ? "border-zinc-900 bg-zinc-50"
                                    : "border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            {shadow}
                        </button>
                    ))}
                </div>
            </div>

            {/* Padding */}
            <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Card Padding: {value.card?.padding || 20}px
                </label>
                <input
                    type="range"
                    min="8"
                    max="48"
                    step="4"
                    value={value.card?.padding || 20}
                    onChange={(e) => onChange({
                        ...value,
                        card: { ...value.card, padding: Number(e.target.value) }
                    })}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <span>8px</span>
                    <span>48px</span>
                </div>
            </div>

            {/* Border */}
            <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Border Width
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { value: 'none', label: 'None', px: '0' },
                        { value: 'thin', label: 'Thin', px: '1px' },
                        { value: 'medium', label: 'Medium', px: '2px' },
                        { value: 'thick', label: 'Thick', px: '4px' }
                    ].map((border) => (
                        <button
                            key={border.value}
                            onClick={() => onChange({
                                ...value,
                                card: {
                                    ...value.card,
                                    border: { ...value.card?.border, width: border.value }
                                }
                            })}
                            className={cn(
                                "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                value.card?.border?.width === border.value
                                    ? "border-zinc-900 bg-zinc-50"
                                    : "border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            <div>{border.label}</div>
                            <div className="text-[10px] text-zinc-500">{border.px}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Effects Settings Tab
 */
function EffectsSettings({ value, onChange }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Hover Effects</h3>
                <p className="text-sm text-zinc-600 mb-4">Animation when hovering over cards</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { value: 'lift', label: 'Lift', emoji: '⬆️', desc: 'Moves up' },
                    { value: 'scale', label: 'Scale', emoji: '🔍', desc: 'Grows larger' },
                    { value: 'glow', label: 'Glow', emoji: '✨', desc: 'Shadow glow' },
                    { value: 'none', label: 'None', emoji: '—', desc: 'No effect' }
                ].map((effect) => (
                    <button
                        key={effect.value}
                        onClick={() => onChange({
                            ...value,
                            card: { ...value.card, hoverEffect: effect.value }
                        })}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left",
                            value.card?.hoverEffect === effect.value
                                ? "border-zinc-900 bg-zinc-50 shadow-lg"
                                : "border-zinc-200 hover:border-zinc-300"
                        )}
                    >
                        <div className="text-2xl">{effect.emoji}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-zinc-900">{effect.label}</div>
                            <p className="text-xs text-zinc-500 mt-1">{effect.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

/**
 * Live Card Preview
 */
function CardPreview({ config }) {
    const sampleItem = {
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and our special sauce",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    };

    return (
        <div className="mt-8 p-6 rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
            <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Live Preview
            </h3>

            <div className="max-w-md mx-auto">
                {config.layout === 'horizontal' && <HorizontalPreview item={sampleItem} config={config} />}
                {config.layout === 'vertical' && <VerticalPreview item={sampleItem} config={config} />}
                {config.layout === 'overlay' && <OverlayPreview item={sampleItem} config={config} />}
                {config.layout === 'minimal' && <MinimalPreview item={sampleItem} config={config} />}
            </div>
        </div>
    );
}

function HorizontalPreview({ item, config }) {
    const showImage = config.image?.enabled !== false;

    return (
        <div
            className="flex items-center gap-4 transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: config.card?.borderRadius === 'full' ? '9999px' : `${getBorderRadiusPx(config.card?.borderRadius)}px`,
                boxShadow: getShadow(config.card?.shadow),
                padding: `${config.card?.padding || 20}px`,
                borderWidth: `${getBorderWidth(config.card?.border?.width)}px`,
                borderColor: '#E5E7EB'
            }}
        >
            {showImage && (
                <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: getBorderRadiusPx(config.image?.borderRadius) + 'px'
                    }}
                >
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={cn("w-full h-full", config.image?.objectFit || 'object-cover')}
                    />
                </div>
            )}

            <div className="flex-1 min-w-0" style={{ textAlign: config.content?.alignment || 'left' }}>
                <h3 className="font-bold text-zinc-900">{item.name}</h3>
                <p className="text-sm text-zinc-600 mt-1">{item.description}</p>
            </div>

            <div className="flex-shrink-0 font-bold text-zinc-900">
                ${item.price}
            </div>
        </div>
    );
}

function VerticalPreview({ item, config }) {
    const showImage = config.image?.enabled !== false;

    return (
        <div
            className="overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: `${getBorderRadiusPx(config.card?.borderRadius)}px`,
                boxShadow: getShadow(config.card?.shadow),
                borderWidth: `${getBorderWidth(config.card?.border?.width)}px`,
                borderColor: '#E5E7EB'
            }}
        >
            {showImage && (
                <div
                    className="overflow-hidden"
                    style={{
                        aspectRatio: config.image?.aspectRatio || '4/3'
                    }}
                >
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={cn("w-full h-full", config.image?.objectFit || 'object-cover')}
                    />
                </div>
            )}

            <div style={{ padding: `${config.card?.padding || 20}px`, textAlign: config.content?.alignment || 'left' }}>
                <h3 className="font-bold text-zinc-900">{item.name}</h3>
                <p className="text-sm text-zinc-600 mt-2">{item.description}</p>
                <div className="font-bold text-zinc-900 mt-3">${item.price}</div>
            </div>
        </div>
    );
}

function OverlayPreview({ item, config }) {
    return (
        <div
            className="relative overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
                borderRadius: `${getBorderRadiusPx(config.card?.borderRadius)}px`,
                boxShadow: getShadow(config.card?.shadow),
                aspectRatio: '4/3',
                minHeight: '250px'
            }}
        >
            <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p className="text-sm text-white/90 mt-1">{item.description}</p>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full font-bold self-start mt-3 bg-white text-zinc-900">
                    ${item.price}
                </div>
            </div>
        </div>
    );
}

function MinimalPreview({ item, config }) {
    return (
        <div
            className="border-b transition-all duration-200 py-4"
            style={{ borderColor: '#E5E7EB' }}
        >
            <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{item.description}</p>
                </div>
                <div className="flex-shrink-0 font-bold text-zinc-900">${item.price}</div>
            </div>
        </div>
    );
}

// Helper functions
function getBorderRadiusPx(value) {
    const map = { none: 0, sm: 4, md: 8, lg: 16, xl: 24, xxl: 32, full: 9999 };
    return map[value] || 16;
}

function getBorderWidth(value) {
    const map = { none: 0, thin: 1, medium: 2, thick: 4 };
    return map[value] || 1;
}

function getShadow(value) {
    const map = {
        none: 'none',
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)'
    };
    return map[value] || map.sm;
}
