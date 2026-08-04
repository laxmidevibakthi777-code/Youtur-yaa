import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Users, PlaySquare, Eye, Globe, Calendar, RefreshCw, BadgeCheck, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { api, fmtNumber, type ChannelSummary, addTrackedChannel } from '@/lib/api';

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
      {/* Banner */}
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
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-bold text-white text-base leading-tight truncate">{ch.name}</h3>
            {ch.verified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{ch.handle}</p>
        {ch.description && (
          <p className="text-xs text-white/50 line-clamp-2 mb-4">{ch.description}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] mb-1">
              <Users className="w-3 h-3" /> Subs
            </div>
            <div className="font-bold text-white text-sm">{fmtNumber(ch.subscriberCount)}</div>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] mb-1">
              <PlaySquare className="w-3 h-3" /> Videos
            </div>
            <div className="font-bold text-white text-sm">{fmtNumber(ch.videoCount)}</div>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] mb-1">
              <Eye className="w-3 h-3" /> Views
            </div>
            <div className="font-bold text-white text-sm">{fmtNumber(ch.viewCount)}</div>
          </div>
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
          {[0,1,2].map(i => <div key={i} className="h-14 bg-white/[0.04] rounded-lg" />)}
        </div>
        <div className="h-10 bg-white/[0.04] rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function ChannelSearch() {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState<ChannelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, navigate] = useLocation();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setChannels([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    // Cancel previous
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await api.youtube.search(q, controller.signal);
      if (res.type === 'direct') {
        // Direct match — go straight to channel page
        addTrackedChannel(res.channel);
        navigate(`/channel/${res.channel.id}`);
        return;
      }
      setChannels(res.channels);
      setHasSearched(true);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message ?? 'Search failed. Please try again.');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const handleRetry = () => doSearch(query);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Find Any Channel</h1>
        <p className="text-muted-foreground text-lg">Enter a channel name, @handle, URL, or Channel ID</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-12">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            placeholder="e.g. MrBeast, @mkbhd, youtube.com/channel/..."
            className="w-full h-14 pl-14 pr-36 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        {/* Hints */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {['@MrBeast', 'MKBHD', 'youtube.com/c/veritasium', 'UCBcRF18a7Qf58cCRy5xuWwQ'].map(hint => (
            <button
              key={hint}
              type="button"
              onClick={() => { setQuery(hint); doSearch(hint); }}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-muted-foreground hover:text-white transition-all"
            >
              {hint}
            </button>
          ))}
        </div>
      </form>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Search failed</p>
              <p className="text-muted-foreground text-sm max-w-sm">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {!loading && !error && channels.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-5">{channels.length} channel{channels.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {channels.map((ch, i) => (
              <ChannelCard key={ch.id} ch={ch} delay={i * 0.07} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && hasSearched && channels.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">No channels found</p>
            <p className="text-muted-foreground text-sm">Try a different name or paste the channel URL directly.</p>
          </div>
        </div>
      )}

      {/* Idle state */}
      {!loading && !error && !hasSearched && (
        <div className="flex flex-col items-center gap-6 py-16 text-center opacity-60">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Search className="w-10 h-10 text-primary" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-2">Discover Any YouTube Channel</p>
            <p className="text-muted-foreground text-sm max-w-sm">Search by name to see matching channels, or paste a URL / handle / channel ID for a direct match.</p>
          </div>
        </div>
      )}
    </div>
  );
}
