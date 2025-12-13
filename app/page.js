import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-md fixed w-full z-50 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap font-display bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              SmartMenu
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center pt-20 pb-16 px-4">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            v1.0 Public Beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display text-foreground">
            The Future of <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Digital Menus</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Create stunning, real-time digital menus for your restaurant, cafe, or bar in minutes. 
            No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
             <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/test-components">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                View Components
              </Button>
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
             {[
              { title: "Real-time Updates", desc: "Change prices and items instantly across all screens." },
              { title: "QR & TV Mode", desc: "One menu, optimized for both mobile phones and large displays." },
              { title: "Premium Design", desc: "Beautiful glassmorphism themes that wow your customers." }
             ].map((feature, i) => (
               <div key={i} className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                 <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                 </div>
                 <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                 <p className="text-muted-foreground">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>© 2024 SmartMenu SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
