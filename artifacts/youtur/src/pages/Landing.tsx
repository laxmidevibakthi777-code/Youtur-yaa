import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ChevronRight, PlaySquare, TrendingUp, Cpu, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_-5px_rgba(255,0,51,0.6)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-white leading-none">YOUTUR</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">Sign In</Link>
            <Link href="/signup" className="h-10 px-6 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors">
                Get Started
              </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>YOUTUR AI 2.0 is now live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-tight mb-8"
          >
            The AI Operating System for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              YouTube Creators
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing. Start growing. YOUTUR analyzes your channel, predicts trends, and generates viral concepts with elite precision. This is your command center.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg flex items-center gap-2 transition-all shadow-[0_0_30px_-5px_rgba(255,0,51,0.6)]">
                Start Free Trial <ChevronRight className="w-5 h-5" />
              </Link>
            <button className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-lg transition-all">
              View Demo
            </button>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-20 relative z-10"
        >
          <div className="glass-panel rounded-2xl border border-white/10 p-2 shadow-2xl">
            <div className="bg-background rounded-xl border border-white/5 overflow-hidden">
              <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
              <div className="aspect-video bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                 <div className="flex gap-6 relative z-10">
                   {/* Mockup elements */}
                   <div className="w-64 h-80 rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                     <div className="w-12 h-12 rounded-lg bg-primary/20 mb-4" />
                     <div className="space-y-3">
                       <div className="h-4 bg-white/20 rounded w-3/4" />
                       <div className="h-4 bg-white/10 rounded w-1/2" />
                     </div>
                     <div className="h-8 bg-white/10 rounded-full mt-auto" />
                   </div>
                   <div className="w-64 h-80 rounded-xl bg-primary border border-primary/50 p-6 flex flex-col justify-between shadow-[0_0_30px_-5px_rgba(255,0,51,0.4)] scale-110">
                     <div className="w-12 h-12 rounded-lg bg-white/20 mb-4" />
                     <div className="space-y-3">
                       <div className="h-4 bg-white/80 rounded w-full" />
                       <div className="h-4 bg-white/50 rounded w-2/3" />
                     </div>
                     <div className="h-8 bg-white/20 rounded-full mt-auto" />
                   </div>
                   <div className="w-64 h-80 rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
                     <div className="w-12 h-12 rounded-lg bg-primary/20 mb-4" />
                     <div className="space-y-3">
                       <div className="h-4 bg-white/20 rounded w-5/6" />
                       <div className="h-4 bg-white/10 rounded w-1/3" />
                     </div>
                     <div className="h-8 bg-white/10 rounded-full mt-auto" />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">We built an unfair advantage.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to scale, automated and optimized by top-tier AI models trained on millions of viral videos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predictive Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">Stop guessing what will work. YOUTUR analyzes market gaps and tells you exactly what to film next to maximize reach.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Studio Canvas</h3>
              <p className="text-muted-foreground leading-relaxed">Generate high-CTR titles, scripts, and SEO metadata in seconds. Iterate endlessly on a freeform workspace.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PlaySquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Channel Audits</h3>
              <p className="text-muted-foreground leading-relaxed">Get a deep-dive technical audit of your channel's health. We find the bottlenecks hurting your retention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-white">YOUTUR</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
