"use client";

import { motion } from 'framer-motion';
import { Zap, Sparkles, Layout, BarChart3, Clock, Smartphone } from 'lucide-react';

export function Features() {
    const features = [
        {
            title: "Visual Design Studio",
            desc: "Customizable high-end aesthetics with premium fonts, colors, and layouts that match your brand perfectly.",
            icon: Layout,
            color: "indigo"
        },
        {
            title: "AI 'Hot' Badges",
            desc: "Automatically highlight your top-selling and trending items to help customers make faster, better choices.",
            icon: BarChart3,
            color: "emerald"
        },
        {
            title: "Auto-Magic Themes",
            desc: "Your menu changes with the calendar. Automatic atmosphere effects for Winter, Spring, Summer, and Autumn.",
            icon: Clock,
            color: "orange"
        },
        {
            title: "Happy Hour Engine",
            desc: "Schedule discounts and dynamic pricing rules that update instantly on your customers' phones.",
            icon: Zap,
            color: "purple"
        },
        {
            title: "Atmosphere Effects",
            desc: "Add immersive snowfall, flower petals, or stars to your background to create a unique dining mood.",
            icon: Sparkles,
            color: "blue"
        },
        {
            title: "Live Price Sync",
            desc: "Change a price in your dashboard and see it update across all customer devices in less than a second.",
            icon: Smartphone,
            color: "rose"
        }
    ];

    return (
        <section id="features" className="py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl space-y-4">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Powerful Features</h2>
                        <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-zinc-900 leading-none">
                            Everything you need to <br />
                            <span className="text-zinc-400">grow your sales</span>
                        </h3>
                    </div>
                    <p className="max-w-md text-lg text-zinc-500 font-medium leading-relaxed pb-2">
                        We've built a complete set of tools to help you manage your restaurant's digital presence effortlessly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-8 rounded-[3rem] border-2 border-zinc-50 bg-zinc-50/30 hover:bg-white hover:border-zinc-200 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <f.icon className="w-6 h-6 text-zinc-900" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-zinc-900">{f.title}</h4>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
