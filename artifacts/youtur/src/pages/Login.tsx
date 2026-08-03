import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, Lock, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('alex@youtur.ai');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6 selection:bg-primary/30">
      <div className="absolute top-0 w-full h-full bg-radial-glow pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_20px_-5px_rgba(255,0,51,0.6)]">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your command center</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle red line top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <button 
            onClick={handleLogin}
            className="w-full h-12 mb-6 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Or</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Email</label>
              <input 
                type="email" 
                defaultValue="alex@youtur.ai"
                className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                  <div className="w-2 h-2 rounded-sm bg-primary hidden group-hover:block" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:text-white transition-colors cursor-pointer">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full h-11 mt-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.4)]">
              Sign In
            </button>
          </form>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link href="/signup" className="text-white hover:text-primary font-medium cursor-pointer transition-colors">Create one</Link>
        </p>

        <div className="flex items-center justify-center gap-6 mt-12">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-4 h-4" /> Secure Login
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" /> End-to-End Encrypted
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="w-4 h-4" /> Trusted by Creators
          </div>
        </div>
      </div>
    </div>
  );
}
