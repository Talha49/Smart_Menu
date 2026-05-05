"use client";

/**
 * Advanced Colors Tab - Professional Color Architecture
 * 
 * Includes contrast checking, palette generation, and deep state management.
 */

import { useState, useMemo } from 'react';
import { Palette, Droplet, FileText, Square, RefreshCcw, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_CONFIG } from './config-defaults';

export function ColorsTab({ config, onChange }) {
    if (!config) return <NoPresetMessage />;

    const colors = config.colors || DEFAULT_CONFIG.colors;
    const [activeSection, setActiveSection] = useState('brand');

    const handleColorChange = (section, key, value) => {
        const updatedColors = {
            ...colors,
            [section]: { ...colors[section], [key]: value }
        };
        onChange({ ...config, colors: updatedColors });
    };

    // Auto-generate secondary/tertiary colors based on primary
    const generatePalette = () => {
        const primary = colors.brand.primary;
        // Simple logic: tertiary is a lighter/different hue version
        const secondary = adjustColor(primary, -20); // Darker
        const tertiary = adjustColor(primary, 40);  // Lighter
        
        onChange({
            ...config,
            colors: {
                ...colors,
                brand: { ...colors.brand, secondary, tertiary }
            }
        });
    };

    const sections = [
        { id: 'brand', label: 'Identity', icon: Palette, emoji: '🎨' },
        { id: 'backgrounds', label: 'Surfaces', icon: Square, emoji: '⬜' },
        { id: 'text', label: 'Content', icon: FileText, emoji: '✍️' },
        { id: 'borders', label: 'Lines', icon: Droplet, emoji: '🔲' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header with Auto-Gen Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 p-6 rounded-[2.5rem] border-2 border-zinc-100">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight text-zinc-900">Color Architecture</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Professional Palette System</p>
                </div>
                <button 
                    onClick={generatePalette}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-zinc-200 rounded-2xl text-xs font-black hover:border-zinc-900 transition-all shadow-sm active:scale-95 group"
                >
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                    AUTO-GENERATE PALETTE
                </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2",
                            activeSection === section.id
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-xl scale-105 z-10"
                                : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                        )}
                    >
                        <span>{section.emoji}</span>
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Active Content */}
            <div className="grid grid-cols-1 gap-6">
                {activeSection === 'brand' && (
                    <ColorGroup
                        colors={colors.brand}
                        definitions={[
                            { key: 'primary', label: 'Primary', desc: 'Main brand identification' },
                            { key: 'secondary', label: 'Secondary', desc: 'Accent & emphasis' },
                            { key: 'tertiary', label: 'Tertiary', desc: 'Supporting details' }
                        ]}
                        onChange={(key, val) => handleColorChange('brand', key, val)}
                        bgContext={colors.backgrounds.page}
                    />
                )}

                {activeSection === 'backgrounds' && (
                    <ColorGroup
                        colors={colors.backgrounds}
                        definitions={[
                            { key: 'page', label: 'Canvas', desc: 'Primary application surface' },
                            { key: 'card', label: 'Component', desc: 'Default card background' },
                            { key: 'elevated', label: 'Elevated', desc: 'Modals & overlays' }
                        ]}
                        onChange={(key, val) => handleColorChange('backgrounds', key, val)}
                        textContext={colors.text.primary}
                    />
                )}

                {activeSection === 'text' && (
                    <ColorGroup
                        colors={colors.text}
                        definitions={[
                            { key: 'primary', label: 'High Priority', desc: 'Headings & primary copy' },
                            { key: 'secondary', label: 'Medium Priority', desc: 'Descriptions & meta' },
                            { key: 'tertiary', label: 'Low Priority', desc: 'Hints & disabled states' },
                            { key: 'inverse', label: 'Inverse', desc: 'Text on dark backgrounds' }
                        ]}
                        onChange={(key, val) => handleColorChange('text', key, val)}
                        bgContext={colors.backgrounds.card}
                    />
                )}

                {activeSection === 'borders' && (
                    <ColorGroup
                        colors={colors.borders}
                        definitions={[
                            { key: 'light', label: 'Subtle', desc: 'Soft separators' },
                            { key: 'medium', label: 'Standard', desc: 'Default UI borders' },
                            { key: 'dark', label: 'Defined', desc: 'High-contrast lines' }
                        ]}
                        onChange={(key, val) => handleColorChange('borders', key, val)}
                        bgContext={colors.backgrounds.page}
                    />
                )}
            </div>
        </div>
    );
}

function ColorGroup({ colors, definitions, onChange, bgContext, textContext }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {definitions.map((def) => (
                <ColorCard
                    key={def.key}
                    label={def.label}
                    desc={def.desc}
                    value={colors[def.key]}
                    onChange={(val) => onChange(def.key, val)}
                    contrastBg={bgContext}
                    contrastText={textContext}
                />
            ))}
        </div>
    );
}

function ColorCard({ label, desc, value, onChange, contrastBg, contrastText }) {
    const [inputValue, setInputValue] = useState(value);
    
    const contrastRatio = useMemo(() => {
        if (!contrastBg && !contrastText) return null;
        return calculateContrast(value, contrastBg || contrastText);
    }, [value, contrastBg, contrastText]);

    const isAccessible = contrastRatio >= 4.5;

    return (
        <div className="bg-white p-6 rounded-[2rem] border-2 border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                    <h4 className="font-black text-zinc-900 leading-tight">{label}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{desc}</p>
                </div>
                
                {contrastRatio && (
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-tighter",
                        isAccessible ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {isAccessible ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {contrastRatio.toFixed(1)}:1
                    </div>
                )}
            </div>

            <div className="relative group">
                <div 
                    className="w-full h-24 rounded-2xl border-4 border-white shadow-inner cursor-crosshair relative overflow-hidden"
                    style={{ backgroundColor: value }}
                >
                    <input 
                        type="color"
                        value={value.startsWith('#') ? value : '#000000'}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e.target.value)) {
                                onChange(e.target.value);
                            }
                        }}
                        className="w-full px-4 py-2.5 bg-zinc-50 border-2 border-transparent rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-zinc-900 transition-all outline-none"
                        placeholder="#000000"
                    />
                </div>
                <button 
                    onClick={() => {
                        const newColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                        setInputValue(newColor);
                        onChange(newColor);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-50 border-2 border-transparent hover:border-zinc-200 transition-all"
                >
                    <RefreshCcw className="w-4 h-4 text-zinc-400" />
                </button>
            </div>
        </div>
    );
}

// Helpers
function NoPresetMessage() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center animate-bounce">
                <Palette className="w-12 h-12 text-zinc-300" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black text-zinc-900">Choose a starting point</h3>
                <p className="text-zinc-500 max-w-xs mx-auto text-sm">Select a theme from <strong>Quick Start</strong> to unlock full color customization.</p>
            </div>
        </div>
    );
}

function adjustColor(hex, percent) {
    if (!hex.startsWith('#')) return hex;
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
}

function calculateContrast(c1, c2) {
    if (!c1.startsWith('#') || !c2.startsWith('#')) return 5; // Default safe value
    const lum1 = getLuminance(c1);
    const lum2 = getLuminance(c2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
