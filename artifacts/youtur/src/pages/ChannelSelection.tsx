import React from 'react';
import { motion } from 'framer-motion';
import { Users, PlaySquare, Plus, Activity } from 'lucide-react';
import { Link } from 'wouter';

export default function ChannelSelection() {
  const channels = [
    { id: '1', name: 'Elite Tech Creator', handle: '@elitetech', subs: '2.4M', views: '14.2M', trend: '+12%', image: 'https://i.pravatar.cc/150?u=elitetech' },
    { id: '2', name: 'Alex Vlogs', handle: '@alexvlogs', subs: '125K', views: '800K', trend: '+5%', image: 'https://i.pravatar.cc/150?u=alexvlogs' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Channels</h1>
          <p className="text-muted-foreground">Manage and audit your tracked channels.</p>
        </div>
        <Link href="/channel-search" className="h-10 px-5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" />
            Add Channel
          </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel, i) => (
          <Link key={channel.id} href={`/channel/${channel.id}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer group youtur-glow flex flex-col"
            >
              <div className="h-24 bg-gradient-to-r from-primary/20 to-background relative">
                <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-2 border-background overflow-hidden bg-background">
                  <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="pt-10 p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{channel.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{channel.handle}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Users className="w-3.5 h-3.5" /> Subs
                    </div>
                    <div className="font-semibold text-white">{channel.subs}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <PlaySquare className="w-3.5 h-3.5" /> Monthly
                    </div>
                    <div className="font-semibold text-white">{channel.views}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                    <Activity className="w-3.5 h-3.5" /> {channel.trend} Growth
                  </div>
                  <div className="text-primary text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex items-center gap-1">
                    Audit <span className="text-lg leading-none">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}

        <Link href="/channel-search">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: channels.length * 0.1 }}
            className="glass-card rounded-2xl border border-white/5 hover:border-primary/50 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px] gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Track New Channel</h3>
              <p className="text-sm text-muted-foreground mt-1">Add a competitor or secondary channel</p>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
