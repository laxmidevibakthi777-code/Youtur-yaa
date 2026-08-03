import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ title, value, trend, trendValue, icon: Icon, delay = 0 }: any) {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 youtur-glow relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 relative z-10">
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 
          isNeutral ? 'bg-blue-500/10 text-blue-400' : 
          'bg-primary/10 text-primary'
        }`}>
          {trendValue}
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
}

export function ActionCard({ title, description, icon: Icon, delay = 0, onClick }: any) {
  return (
    <motion.button 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-left w-full glass-card rounded-2xl p-6 youtur-glow group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
        <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.button>
  );
}

export function AuditItem({ title, status, time, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : status === 'WARNING' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(255,0,51,0.5)]'}`} />
        <div>
          <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${
        status === 'SUCCESS' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 
        status === 'WARNING' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 
        'border-primary/20 text-primary bg-primary/5'
      }`}>
        {status}
      </span>
    </motion.div>
  );
}
