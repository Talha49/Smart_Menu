"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
    LayoutGrid, 
    Type, 
    Palette, 
    Layers,
    Check
} from 'lucide-react';

const GOOGLE_FONTS = [
    { name: 'Inter', value: 'Inter', category: 'Modern' },
    { name: 'Playfair Display', value: 'Playfair Display', category: 'Elegant' },
    { name: 'Outfit', value: 'Outfit', category: 'Playful' },
    { name: 'Montserrat', value: 'Montserrat', category: 'Bold' },
    { name: 'Roboto Mono', value: 'Roboto Mono', category: 'Technical' }
];

const LAYOUTS = [
    { id: 'grid', name: 'Classic Grid', icon: LayoutGrid, description: 'Visual-first with high density' },
    { id: 'list', name: 'Minimal List', icon: Layers, description: 'Clean, text-focused readability' },
    { id: 'masonry', name: 'Luxury Masonry', icon: Layers, description: 'Elegant brick-style for premium brands' },
    { id: 'orbital', name: 'Orbital Wheel', icon: Layers, description: 'Futuristic interactive navigation' }
];

export function BrandStyleTab({ config, onChange }) {
    const [activeSection, setActiveSection] = useState('colors');

    // HSL PALETTE GENERATOR (Solid Math)
    const generateSmartPalette = (baseHex) => {
        // Convert hex to HSL (helper function)
        const hexToHsl = (hex) => {
            let r = parseInt(hex.slice(1, 3), 16) / 255;
            let g = parseInt(hex.slice(3, 5), 16) / 255;
            let b = parseInt(hex.slice(5, 7), 16) / 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) { h = s = 0; } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h * 360, s * 100, l * 100];
        };

        const [h, s, l] = hexToHsl(baseHex);

        const hslToHex = (h, s, l) => {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        };

        return {
            brand: {
                primary: baseHex,
                secondary: hslToHex(h, Math.min(100, s + 10), Math.min(100, l + 15)),
                tertiary: hslToHex(h, s, Math.max(0, l - 15))
            },
            backgrounds: {
                page: l > 50 ? '#FFFFFF' : '#0F172A',
                card: l > 50 ? '#F8FAFC' : '#1E293B',
                elevated: l > 50 ? '#FFFFFF' : '#1E293B'
            },
            text: {
                primary: l > 50 ? '#0F172A' : '#F8FAFC',
                secondary: l > 50 ? '#475569' : '#94A3B8',
                inverse: '#FFFFFF'
            }
        };
    };

    const updateColor = (newHex) => {
        onChange({
            ...config,
            colors: generateSmartPalette(newHex)
        });
    };

    const sections = [
        { id: 'colors', name: 'Colors', icon: Palette },
        { id: 'typography', name: 'Typography', icon: Type },
        { id: 'layout', name: 'Layout', icon: LayoutGrid }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-64 space-y-2">
                {sections.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                            activeSection === s.id 
                                ? "bg-zinc-900 text-white shadow-xl scale-[1.02]" 
                                : "text-zinc-500 hover:bg-zinc-100"
                        )}
                    >
                        <s.icon className="w-4 h-4" />
                        {s.name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-10">
                {activeSection === 'colors' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-zinc-50 shadow-sm space-y-6">
                            <h3 className="text-xl font-black tracking-tight">Brand Identity</h3>
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <input 
                                        type="color" 
                                        value={config.colors?.brand?.primary || '#4f46e5'}
                                        onChange={(e) => updateColor(e.target.value)}
                                        className="w-24 h-24 rounded-full cursor-pointer border-8 border-zinc-50 shadow-2xl transition-transform hover:scale-110"
                                    />
                                    <div className="absolute inset-0 rounded-full border-2 border-zinc-900/10 pointer-events-none" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Primary Hex</p>
                                    <p className="text-3xl font-black text-zinc-900">{(config.colors?.brand?.primary || '#4f46e5').toUpperCase()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {['primary', 'secondary', 'tertiary'].map(key => (
                                <div key={key} className="space-y-2">
                                    <div 
                                        className="h-16 rounded-2xl shadow-inner border border-zinc-900/5"
                                        style={{ backgroundColor: config.colors?.brand?.[key] }}
                                    />
                                    <p className="text-[10px] font-black uppercase text-zinc-400 text-center">{key}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'typography' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {GOOGLE_FONTS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => onChange({
                                    ...config,
                                    typography: {
                                        ...config.typography,
                                        fonts: { 
                                            heading: { family: f.value, weight: 900 }, 
                                            body: { family: f.value, weight: 400 } 
                                        }
                                    }
                                })}
                                className={cn(
                                    "p-6 rounded-[2rem] border-2 transition-all text-left group",
                                    config.typography?.fonts?.heading?.family === f.value
                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-xl"
                                        : "border-zinc-100 bg-white hover:border-zinc-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        config.typography?.fonts?.heading?.family === f.value ? "bg-white/20" : "bg-zinc-100"
                                    )}>
                                        {f.category}
                                    </span>
                                    {config.typography?.fonts?.heading?.family === f.value && <Check className="w-4 h-4" />}
                                </div>
                                <p className="text-2xl font-bold mb-1" style={{ fontFamily: f.value }}>{f.name}</p>
                                <p className="text-xs opacity-60">The quick brown fox jumps over the lazy dog</p>
                            </button>
                        ))}
                    </div>
                )}

                {activeSection === 'layout' && (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {LAYOUTS.map(l => (
                            <button
                                key={l.id}
                                onClick={() => onChange({ ...config, layoutID: l.id })}
                                className={cn(
                                    "p-6 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6",
                                    (config.layoutID === l.id || (!config.layoutID && l.id === 'grid'))
                                        ? "border-zinc-900 bg-zinc-50 shadow-lg"
                                        : "border-zinc-100 bg-white hover:border-zinc-200"
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                                    (config.layoutID === l.id || (!config.layoutID && l.id === 'grid')) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                                )}>
                                    <l.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight">{l.name}</h4>
                                    <p className="text-xs text-zinc-500">{l.description}</p>
                                </div>
                                {(config.layoutID === l.id || (!config.layoutID && l.id === 'grid')) && <Check className="w-5 h-5 ml-auto text-zinc-900" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
