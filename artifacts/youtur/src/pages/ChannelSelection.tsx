import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, PlaySquare, Plus, Eye, X, BadgeCheck } from 'lucide-react';
import { Link } from 'wouter';
import { getTrackedChannels, removeTrackedChannel, fmtNumber, type ChannelSummary } from '@/lib/api';

export default function ChannelSelection() {
  const [channels, setChannels] = useState<ChannelSummary[]>([]);

  useEffect(() => {
    setChannels(getTrackedChannels());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeTrackedChannel(id);
    setChannels(getTrackedChannels());
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Channels</h1>
          <p className="text-muted-foreground">
            {channels.length > 0
              ? `${channels.length} channel${channels.length !== 1 ? 's' : ''} tracked`
              : 'No channels tracked yet — search and analyze a channel to add it here.'}
          </p>
        </div>
        <Link href="/channel-search"
          className="h-10 px-5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          Add Channel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/channel/${channel.id}`}>
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer group youtur-glow flex flex-col relative">
                  {/* Remove button */}
                  <button
                    onClick={e => handleRemove(channel.id, e)}
                    className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove channel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-background relative overflow-hidden">
                    {channel.banner && (
                      <img src={channel.banner} alt="" className="w-full h-full object-cover opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent" />
                    <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-2 border-[#171717] overflow-hidden bg-[#171717] shadow-lg">
                      <img src={channel.thumbnail} alt={channel.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="pt-10 p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
                      <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors truncate">
                        {channel.name}
                      </h3>
                      {channel.verified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{channel.handle}</p>

                    <div className="grid grid-cols-3 gap-3 mt-auto">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                          <Users className="w-3 h-3" /> Subs
                        </div>
                        <div className="font-semibold text-white text-sm">{fmtNumber(channel.subscriberCount)}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                          <PlaySquare className="w-3 h-3" /> Videos
                        </div>
                        <div className="font-semibold text-white text-sm">{fmtNumber(channel.videoCount)}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                          <Eye className="w-3 h-3" /> Views
                        </div>
                        <div className="font-semibold text-white text-sm">{fmtNumber(channel.viewCount)}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
                      <div className="text-primary text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex items-center gap-1">
                        Open Audit <span className="text-lg leading-none">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Channel card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: channels.length * 0.06 }}
        >
          <Link href="/channel-search">
            <div className="glass-card rounded-2xl border border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px] gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Track New Channel</h3>
                <p className="text-sm text-muted-foreground mt-1">Search and analyze any YouTube channel</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
