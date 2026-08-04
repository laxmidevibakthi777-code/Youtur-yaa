import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid,
} from 'recharts';
import {
  Users, PlaySquare, Eye, Globe, Calendar, RefreshCw, Sparkles, BadgeCheck,
  Target, TrendingUp, AlertTriangle, CheckCircle2, Zap, Clock, ChevronDown, Loader2,
  BookOpen, Copy, Check, ExternalLink, AlertCircle,
} from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import { api, fmtNumber, parseDuration, addTrackedChannel, type ChannelData, type ChannelAnalysis } from '@/lib/api';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-white/[0.06] rounded animate-pulse ${className ?? ''}`} />;
}

function ChannelHeaderSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
      <div className="h-40 bg-white/[0.04] animate-pulse" />
      <div className="p-8 flex items-end gap-6">
        <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

// ── Copy Button ────────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── AI Analysis Panel ─────────────────────────────────────────────────────────
function AnalysisPanel({ channelId, bust }: { channelId: string; bust: boolean }) {
  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'roadmap'>('overview');

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.ai.analyze(channelId, bust);
      setAnalysis(res.analysis);
    } catch (err: any) {
      setError(err.message ?? 'AI analysis failed.');
    } finally {
      setLoading(false);
    }
  }, [channelId, bust]);

  useEffect(() => { run(); }, [run]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-white/5 p-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <motion.div
            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </div>
        <div className="text-center">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm">AI Audit Running</p>
          <p className="text-muted-foreground text-xs mt-1">Analyzing channel data with OpenRouter AI…</p>
        </div>
        <div className="w-full max-w-sm space-y-2 mt-2">
          {['Fetching video metrics…', 'Running SEO analysis…', 'Building growth roadmap…'].map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }}
              className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary shrink-0" /> {s}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl border border-red-500/20 p-8 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <div>
          <p className="text-white font-semibold mb-1">AI Audit Failed</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <button onClick={run} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
          <RefreshCw className="w-4 h-4" /> Retry Audit
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'strategy' as const, label: 'Strategy' },
    { id: 'roadmap' as const, label: 'Roadmap' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">AI Audit Report</h3>
        </div>
        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Scores */}
            <div className="flex justify-center gap-12">
              <ScoreRing value={analysis.seoScore} label="SEO Score" color="#FF0033" />
              <ScoreRing value={analysis.brandScore} label="Brand Score" color="#a78bfa" />
            </div>

            {/* Executive Summary */}
            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed">{analysis.executiveSummary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-orange-400 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" /> Weaknesses
                </h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((s, i) => (
                    <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5 shrink-0">!</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTR Suggestions */}
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-primary" /> CTR Improvement Tactics
              </h4>
              <div className="space-y-2">
                {analysis.ctrSuggestions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-white/[0.03] rounded-lg p-3 group">
                    <span className="text-xs text-white/70">{s}</span>
                    <CopyBtn text={s} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'strategy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" /> Content Strategy
              </h4>
              <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                <p className="text-sm text-white/75 leading-relaxed">{analysis.contentStrategy}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" /> Posting Schedule
              </h4>
              <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                <p className="text-sm text-white/75 leading-relaxed">{analysis.postingSchedule}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" /> Audience Analysis
              </h4>
              <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                <p className="text-sm text-white/75 leading-relaxed">{analysis.audienceAnalysis}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" /> Growth Opportunities
              </h4>
              <ul className="space-y-2">
                {analysis.growthOpportunities.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-white/[0.03] rounded-lg p-3">
                    <span className="text-xs text-white/70"><span className="text-primary font-bold mr-2">{i + 1}.</span>{s}</span>
                    <CopyBtn text={s} />
                  </div>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <ExternalLink className="w-4 h-4 text-primary" /> Competitor Channels to Study
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.competitorSuggestions.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Growth Roadmap
              </h4>
              <p className="text-sm text-white/75 leading-relaxed">{analysis.growthRoadmap}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-semibold text-primary mb-4">30-Day Action Plan</h4>
                <ol className="space-y-3">
                  {analysis.plan30Day.map((s, i) => (
                    <li key={i} className="text-xs text-white/70 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-semibold text-purple-400 mb-4">90-Day Milestones</h4>
                <ol className="space-y-3">
                  {analysis.plan90Day.map((s, i) => (
                    <li key={i} className="text-xs text-white/70 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChannelDashboard() {
  const params = useParams<{ id: string }>();
  const channelId = params.id ?? '';
  const [, navigate] = useLocation();

  const [data, setData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAudit, setShowAudit] = useState(false);
  const [auditBust, setAuditBust] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadChannel = useCallback(async (refresh = false) => {
    if (!channelId) return;
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await api.youtube.channel(channelId, refresh);
      setData(res);
      addTrackedChannel(res.channel);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load channel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [channelId]);

  useEffect(() => { loadChannel(); }, [loadChannel]);

  const handleRefresh = () => loadChannel(true);

  const handleNewAudit = () => {
    setAuditBust(true);
    setShowAudit(true);
  };

  // Build chart data from videos
  const chartData = (data?.videos ?? [])
    .slice(0, 12)
    .reverse()
    .map(v => ({
      name: v.title.length > 24 ? v.title.slice(0, 24) + '…' : v.title,
      views: parseInt(v.viewCount, 10),
    }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <ChannelHeaderSkeleton />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-80 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <p className="text-white font-semibold mb-1">Failed to load channel</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => loadChannel()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
          <button onClick={() => navigate('/channel-search')} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all">
            Search Channels
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { channel, videos } = data;

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Channel Header */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        {channel.banner ? (
          <img src={channel.banner} alt="" className="w-full h-48 object-cover opacity-50" />
        ) : (
          <div className="h-48 bg-gradient-to-r from-primary/20 via-white/5 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative z-10 px-8 pb-8 -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-24 h-24 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl shrink-0 bg-[#121212]">
            <img src={channel.thumbnail} alt={channel.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">{channel.name}</h1>
              {channel.verified && <BadgeCheck className="w-6 h-6 text-primary" />}
            </div>
            <p className="text-primary font-medium">
              {channel.handle} • {fmtNumber(channel.subscriberCount)} Subscribers • {fmtNumber(channel.videoCount)} Videos
            </p>
            {channel.country && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center md:justify-start">
                <Globe className="w-3 h-3" /> {channel.country}
                {channel.publishedAt && <> · <Calendar className="w-3 h-3 ml-1" /> Since {new Date(channel.publishedAt).getFullYear()}</>}
              </p>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={handleRefresh} disabled={refreshing}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors border border-white/10 flex items-center gap-2 disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button onClick={handleNewAudit}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.5)] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Audit
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Subscribers', value: fmtNumber(channel.subscriberCount), icon: Users, color: 'text-primary' },
          { label: 'Total Views', value: fmtNumber(channel.viewCount), icon: Eye, color: 'text-blue-400' },
          { label: 'Total Videos', value: fmtNumber(channel.videoCount), icon: PlaySquare, color: 'text-purple-400' },
          { label: 'Avg Views/Video', value: fmtNumber(Math.floor(parseInt(channel.viewCount, 10) / Math.max(parseInt(channel.videoCount, 10), 1))), icon: TrendingUp, color: 'text-emerald-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-white/5">
            <div className={`flex items-center gap-2 text-xs text-muted-foreground mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} /> {label}
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Views Chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white">Recent Video Performance</h3>
            <span className="text-xs text-muted-foreground ml-auto">Last {chartData.length} videos · Views</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  tickFormatter={v => fmtNumber(v)} width={50} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff' }}
                  formatter={(v: number) => [fmtNumber(v), 'Views']}
                />
                <Bar dataKey="views" fill="#FF0033" radius={[4, 4, 0, 0]} fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Audit toggle */}
      {!showAudit && (
        <button onClick={() => setShowAudit(true)}
          className="w-full py-4 rounded-2xl border border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 text-primary font-medium flex items-center justify-center gap-2 transition-all">
          <Sparkles className="w-5 h-5" /> Run AI Audit — Analyze strengths, SEO, growth roadmap and more
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      )}
      {showAudit && <AnalysisPanel channelId={channelId} bust={auditBust} />}

      {/* Videos Table */}
      {videos.length > 0 && (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Latest Videos</h3>
            <span className="text-xs text-muted-foreground">{videos.length} videos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 font-medium">Video</th>
                  <th className="p-4 font-medium">Views</th>
                  <th className="p-4 font-medium">Likes</th>
                  <th className="p-4 font-medium">Comments</th>
                  <th className="p-4 font-medium">Duration</th>
                  <th className="p-4 font-medium">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {videos.map(v => (
                  <tr key={v.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {v.thumbnail && (
                          <img src={v.thumbnail} alt="" className="w-20 h-12 rounded-lg object-cover shrink-0 bg-white/5" />
                        )}
                        <div className="min-w-0">
                          <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer"
                            className="text-sm text-white font-medium hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {v.title}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white/80 whitespace-nowrap">{fmtNumber(v.viewCount)}</td>
                    <td className="p-4 text-sm text-white/80 whitespace-nowrap">{fmtNumber(v.likeCount)}</td>
                    <td className="p-4 text-sm text-white/80 whitespace-nowrap">{fmtNumber(v.commentCount)}</td>
                    <td className="p-4 text-sm text-white/80 whitespace-nowrap">{parseDuration(v.duration)}</td>
                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
