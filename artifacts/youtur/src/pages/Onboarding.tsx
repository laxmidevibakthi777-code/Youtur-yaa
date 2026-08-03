import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gamepad2, Laptop, GraduationCap, Camera, Code, Music, Briefcase, Zap } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  
  const niches = [
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'tech', label: 'Tech & Reviews', icon: Laptop },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'lifestyle', label: 'Lifestyle & Vlogs', icon: Camera },
    { id: 'coding', label: 'Software Dev', icon: Code },
    { id: 'music', label: 'Music & Audio', icon: Music },
    { id: 'business', label: 'Business & Finance', icon: Briefcase },
    { id: 'entertainment', label: 'Entertainment', icon: Zap },
  ];

  const finish = () => {
    setStep(4);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6 selection:bg-primary/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-4">What should we call you?</h2>
              <p className="text-lg text-muted-foreground mb-12">Let's set up your creator profile.</p>
              
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full max-w-md mx-auto block h-16 bg-white/5 border border-white/10 rounded-xl px-6 text-center text-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-8"
                placeholder="Your Name or Channel"
                onKeyDown={(e) => e.key === 'Enter' && name && setStep(2)}
              />
              
              <button 
                onClick={() => setStep(2)}
                disabled={!name}
                className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,0,51,0.5)]"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Select your primary niche</h2>
                <p className="text-lg text-muted-foreground">This helps our AI understand your audience and calibrate predictions.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {niches.map((niche) => {
                  const Icon = niche.icon;
                  return (
                    <button 
                      key={niche.id}
                      onClick={() => setStep(3)}
                      className="glass-card aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group youtur-glow"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="font-medium text-white">{niche.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center"
            >
              <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Experience Level</h2>
              <p className="text-lg text-muted-foreground mb-12">How long have you been creating content?</p>

              <div className="grid gap-4 max-w-md mx-auto mb-10">
                {['Just starting out (< 1k subs)', 'Growing (1k - 50k subs)', 'Established (50k - 500k subs)', 'Elite (500k+ subs)'].map((lvl) => (
                  <button 
                    key={lvl}
                    onClick={finish}
                    className="w-full p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary transition-all text-left font-medium text-white group"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-white/10 border-t-primary mx-auto mb-8"
              />
              <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Hello, {name}</h2>
              <p className="text-xl text-primary font-medium">Initializing your workspace...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-white/20'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
