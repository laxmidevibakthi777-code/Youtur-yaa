import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, PlaySquare } from 'lucide-react';
import { Link } from 'wouter';

export default function ChannelSearch() {
  const trendingChannels = [
    { id: '1', name: 'Elite Tech Creator', handle: '@elitetech', subs: '2.4M', category: 'Tech' },
    { id: '2', name: 'Gaming Legends', handle: '@gaminglegends', subs: '8.1M', category: 'Gaming' },
    { id: '3', name: 'Finance Bro', handle: '@financebro', subs: '1.2M', category: 'Finance' },
    { id: '4', name: 'Code Masters', handle: '@codemasters', subs: '950K', category: 'Education' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6"
        >
          <Search className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white tracking-tight mb-4"
        >
          Analyze Any Channel
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Enter a YouTube handle or URL to instantly generate a comprehensive audit and competitive analysis.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-16 relative group"
      >
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-2 group-focus-within:border-primary/50 transition-colors bg-background">
          <div className="pl-6 pr-4">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Paste channel URL or @handle..." 
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-white/20 h-12 text-lg"
          />
          <button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_0_15px_-3px_rgba(255,0,51,0.5)] transition-all">
            Analyze
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-white text-lg">Trending Channels</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingChannels.map((channel, i) => (
            <Link key={channel.id} href={`/channel/${channel.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="glass-card p-4 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4 group youtur-glow"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border border-white/10">
                  <img src={`https://i.pravatar.cc/150?u=${channel.handle}`} alt={channel.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors">{channel.name}</h4>
                  <p className="text-sm text-muted-foreground">{channel.handle}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    {channel.subs}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-2 py-0.5 rounded-md bg-white/5 inline-block">
                    {channel.category}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
