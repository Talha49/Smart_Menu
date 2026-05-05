"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, CheckCircle2, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/marketing/Navbar";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";
import { Footer } from "@/components/marketing/Footer";

export default function Home({ user }) {
  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">v2.0 Intelligence Platform Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-zinc-900 leading-[0.9] mb-8"
          >
            The Smarter Way to <br />
            <span className="text-zinc-300">Run Your Menu</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 font-medium leading-relaxed mb-12"
          >
            Create stunning digital menus that increase sales and save you time. From real-time price updates to AI-driven popularity tracking, SmartMenu is the ultimate tool for modern restaurants.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 group">
                Build Your Experience <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <button className="h-16 px-10 rounded-2xl bg-zinc-50 border-2 border-zinc-100 text-[12px] font-black uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-3 hover:bg-zinc-100 transition-all">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <Play className="w-3 h-3 text-white ml-0.5" />
              </div>
              Watch Showreel
            </button>
          </motion.div>

          {/* Video / Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 relative max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[12px] border-zinc-50 bg-zinc-900 group"
          >
            <div className="aspect-video relative overflow-hidden">
               <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-contain"
               >
                 <source src="/inro.mp4" type="video/mp4" />
               </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Simple Workflow</h2>
            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-zinc-900 leading-none">
              How SmartMenu <br />
              <span className="text-zinc-400">works for you</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Categories",
                desc: "Organize your menu into logical sections like Starters, Mains, and Drinks. Simply name them and set their order.",
                icon: "📋"
              },
              {
                step: "02",
                title: "Add Menu Items",
                desc: "Upload photos, set prices, and add descriptions. You can update these instantly whenever your kitchen makes a change.",
                icon: "🍔"
              },
              {
                step: "03",
                title: "Design Your Brand",
                desc: "Use our Design Studio to pick colors, fonts, and layouts that match your restaurant's unique personality.",
                icon: "🎨"
              },
              {
                step: "04",
                title: "Optimize with AI",
                desc: "Activate AI heatmaps to highlight popular items and set 'Happy Hour' rules to automatically adjust prices.",
                icon: "⚡"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border-2 border-zinc-100 relative group hover:border-primary/20 transition-all">
                <div className="text-4xl mb-6">{item.icon}</div>
                <div className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-primary/30">{item.step}</div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-zinc-900">{item.title}</h4>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-10 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <h4 className="text-2xl font-black italic tracking-tighter uppercase">Why Optimize Your Menu?</h4>
                   <p className="text-sm text-white/60 font-medium leading-relaxed">
                     A well-organized digital menu doesn't just look good—it sells more. By using our **AI Heatmap** and **Category Optimization**, you can guide your customers toward your highest-margin items automatically.
                   </p>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Real-time Dashboard Control</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Instant QR Code Generation</span>
                      </div>
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Feature</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">Category Management</span>
                      <span className="text-[9px] font-black uppercase px-2 py-1 bg-primary text-white rounded-md">Live</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">AI Item Highlighting</span>
                      <span className="text-[9px] font-black uppercase px-2 py-1 bg-primary text-white rounded-md">Live</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">Dynamic Price Rules</span>
                      <span className="text-[9px] font-black uppercase px-2 py-1 bg-primary text-white rounded-md">Live</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-xl font-black italic tracking-tighter uppercase">Marriott</div>
          <div className="text-xl font-black italic tracking-tighter uppercase">Hilton</div>
          <div className="text-xl font-black italic tracking-tighter uppercase">Four Seasons</div>
          <div className="text-xl font-black italic tracking-tighter uppercase">Ritz-Carlton</div>
          <div className="text-xl font-black italic tracking-tighter uppercase">Nobu</div>
        </div>
      </section>

      <Features />

      {/* Visual DNA Showcase */}
      <section className="py-24 px-4 bg-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Intelligent Automation</h2>
            <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-[0.9]">
              Automatic Seasonal <br />
              <span className="text-white/20">Themes & Pricing</span>
            </h3>
            <p className="text-lg text-white/50 font-medium leading-relaxed">
              Stop worrying about updating your menu for every holiday. SmartMenu automatically changes your themes and atmosphere effects to match the season, and optimizes your prices for Happy Hour.
            </p>
            <ul className="space-y-4">
              {[
                "12 Pre-configured Monthly Overlays",
                "Automated Lighting & Color Transitions",
                "Dynamic Background Particle Engines",
                "Manual Preview Dashboard Toggles"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ rotate: -5 }}
              whileInView={{ rotate: 0 }}
              className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white/5"
            >
              <img 
                src="/seasonal-showcase.png" 
                alt="Seasonal Engine Showcase" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Floaties */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-10 top-20 p-6 bg-white rounded-3xl shadow-2xl z-20"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* Trust Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-primary fill-primary" />)}
          </div>
          <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-zinc-900">
            "The design studio is a game-changer. We've seen a 22% increase in average order value through AI heatmaps."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 overflow-hidden" />
            <div className="text-left">
                <p className="font-black uppercase tracking-widest text-sm">Marcus Sterling</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Director, Gastronomy Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-zinc-900 p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-white">
                Ready to elevate <br /> your experience?
              </h2>
              <p className="max-w-xl mx-auto text-white/50 text-lg font-medium">
                Join thousands of world-class restaurants transforming their digital presence today.
              </p>
              <div className="flex justify-center gap-4">
                 <Link href="/signup">
                   <Button size="lg" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
                     Get Started Now
                   </Button>
                 </Link>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8">
                  <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> 14-Day Free Trial
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> No Credit Card Required
                  </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
