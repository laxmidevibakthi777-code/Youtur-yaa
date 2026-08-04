import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Clipboard, Loader2, AlertCircle, RefreshCw,
  Users, PlaySquare, Eye, Globe, Calendar, BadgeCheck,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { api, fmtNumber, addTrackedChannel, type ChannelSummary } from '@/lib/api';

// ── Channel result card (same style as ChannelSearch) ────────────────────────
function ChannelCard({ ch, delay }: { ch: ChannelSummary; delay: number }) {
  const [, navigate] = useLocation();

  const handleAnalyze = () => {
    addTrackedChannel(ch);
    navigate(`/channel/${ch.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="glass-card rounded-2xl border border-white/5 hover:border-primary/30 transition-all overflow-hidden flex flex-col"
    >
      <div className="h-24 bg-gradient-to-r from-primary/20 via-white/5 to-background relative overflow-hidden">
        {ch.banner && (
          <img src={ch.banner} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent" />
        <div className="absolute -bottom-8 left-5 w-16 h-16 rounded-xl border-2 border-[#171717] overflow-hidden bg-[#171717] shadow-lg">
          <img src={ch.thumbnail} alt={ch.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="pt-10 px-5 pb-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
          <h3 className="font-bold text-white text-base leading-tight truncate">{ch.name}</h3>
          {ch.verified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{ch.handle}</p>
        {ch.description && (
          <p className="text-xs text-white/50 line-clamp-2 mb-4">{ch.description}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Users, label: 'Subs', value: fmtNumber(ch.subscriberCount) },
            { icon: PlaySquare, label: 'Videos', value: fmtNumber(ch.videoCount) },
            { icon: Eye, label: 'Views', value: fmtNumber(ch.viewCount) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/[0.04] rounded-lg p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] mb-1">
                <Icon className="w-3 h-3" /> {label}
              </div>
              <div className="font-bold text-white text-sm">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-5">
          {ch.country && (
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{ch.country}</span>
          )}
          {ch.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(ch.publishedAt).getFullYear()}
            </span>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          className="mt-auto w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.35)] hover:shadow-[0_0_20px_-2px_rgba(255,0,51,0.5)]"
        >
          Analyze Channel
        </button>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden animate-pulse">
      <div className="h-24 bg-white/[0.04]" />
      <div className="pt-10 px-5 pb-5 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-1/3" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => <div key={i} className="h-14 bg-white/[0.04] rounded-lg" />)}
        </div>
        <div className="h-10 bg-white/[0.04] rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<ChannelSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [pasting, setPasting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setChannels([]);

    try {
      const res = await api.youtube.search(trimmed, controller.signal);
      if (res.type === 'direct') {
        addTrackedChannel(res.channel);
        navigate(`/channel/${res.channel.id}`);
        return;
      }
      setChannels(res.channels);
      setHasSearched(true);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message ?? 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handlePaste = async () => {
    try {
      setPasting(true);
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setQuery(text.trim());
        inputRef.current?.focus();
        // If it looks like a URL, auto-analyze immediately
        const isUrl = text.includes('youtube.com') || text.includes('youtu.be') || text.startsWith('http');
        if (isUrl) {
          doSearch(text.trim());
        }
      }
    } catch {
      // Clipboard permission denied — just focus the input
      inputRef.current?.focus();
    } finally {
      setPasting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Analyze Any YouTube Channel
        </h1>
        <p className="text-muted-foreground text-lg">
          Paste a channel URL or enter a channel name to get started
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Search Box */}
        <div className="relative group">
          {/* Search icon */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Paste YouTube Channel URL or Enter Channel Name..."
            className="w-full h-16 pl-14 pr-36 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
            autoFocus
          />

          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            disabled={pasting}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm text-white font-medium transition-all disabled:opacity-50"
          >
            {pasting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Clipboard className="w-4 h-4" />
            }
            Paste
          </button>
        </div>

        {/* Analyze Button */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_-5px_rgba(255,0,51,0.5)] hover:shadow-[0_0_40px_-3px_rgba(255,0,51,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</>
            : <><Search className="w-5 h-5" /> Analyze Channel</>
          }
        </button>
      </motion.form>

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-10 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Search failed</p>
              <p className="text-muted-foreground text-sm max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => doSearch(query)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeletons */}
      {loading && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Results */}
      {!loading && !error && channels.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <p className="text-sm text-muted-foreground mb-5">
            {channels.length} channel{channels.length !== 1 ? 's' : ''} found — click to analyze
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {channels.map((ch, i) => (
              <ChannelCard key={ch.id} ch={ch} delay={i * 0.07} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state after search */}
      {!loading && !error && hasSearched && channels.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center opacity-60">
          <Search className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="text-white font-semibold mb-1">No channels found</p>
            <p className="text-muted-foreground text-sm">Try a different name or paste the channel URL directly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
