import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6 selection:bg-primary/30">
      <div className="absolute top-0 w-full h-full bg-radial-glow pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_20px_-5px_rgba(255,0,51,0.6)]">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground mt-1 text-center">Enter your email and we'll send you recovery instructions</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="alex@youtur.ai"
                />
              </div>

              <button type="submit" className="w-full h-11 mt-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.4)]">
                Send Recovery Link
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent password reset instructions to your email address.
              </p>
            </div>
          )}
        </motion.div>

        <Link href="/login" className="mx-auto mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
      </div>
    </div>
  );
}
