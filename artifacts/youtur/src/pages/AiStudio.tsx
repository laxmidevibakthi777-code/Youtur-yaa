import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Copy, Hash, Check, Loader2, AlertCircle, RefreshCw,
  FileText, Tag, Key, AtSign, BookOpen, Users, Zap, Film, Type, MessageSquare,
  List, MousePointerClick, CheckSquare, Layers, AlignLeft, Anchor, ChevronRight,
} from 'lucide-react';
import { api, type StudioContentType } from '@/lib/api';

// ── Content type definitions ─────────────────────────────────────────────────

interface ContentTypeDef {
  id: StudioContentType;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const CONTENT_TYPES: ContentTypeDef[] = [
  { id: 'titles',               label: 'Titles',               icon: Type,             description: '5 high-CTR title ideas',       color: 'text-primary' },
  { id: 'titleVariations',      label: 'Title Variations',     icon: Layers,           description: '8 angle variations',           color: 'text-primary' },
  { id: 'hookIdeas',            label: 'Hook Ideas',           icon: Anchor,           description: '5 opening hooks',              color: 'text-orange-400' },
  { id: 'descriptions',        label: 'Description',           icon: FileText,         description: 'Full optimized description',   color: 'text-blue-400' },
  { id: 'descriptionVariations', label: 'Desc Variations',    icon: AlignLeft,        description: '3 style variations',           color: 'text-blue-400' },
  { id: 'tags',                 label: 'Tags',                 icon: Tag,              description: '15 SEO-optimized tags',        color: 'text-emerald-400' },
  { id: 'keywords',             label: 'Keywords',             icon: Key,              description: 'Primary & secondary keywords', color: 'text-emerald-400' },
  { id: 'hashtags',             label: 'Hashtags',             icon: Hash,             description: '10 trending hashtags',         color: 'text-purple-400' },
  { id: 'scripts',              label: 'Script',               icon: BookOpen,         description: 'Full video script',           color: 'text-yellow-400' },
  { id: 'communityPosts',       label: 'Community Posts',      icon: Users,            description: '3 post ideas',                 color: 'text-pink-400' },
  { id: 'shortIdeas',           label: 'Short Ideas',          icon: Zap,              description: '5 YouTube Shorts concepts',    color: 'text-cyan-400' },
  { id: 'longVideoIdeas',       label: 'Long Video Ideas',     icon: Film,             description: '5 long-form concepts',         color: 'text-indigo-400' },
  { id: 'thumbnailText',        label: 'Thumbnail Text',       icon: Type,             description: '5 punchy thumbnail options',   color: 'text-red-400' },
  { id: 'pinnedComment',        label: 'Pinned Comment',       icon: MessageSquare,    description: '3 engagement-driving comments', color: 'text-teal-400' },
  { id: 'videoChapters',        label: 'Video Chapters',       icon: List,             description: 'Timestamped chapters',         color: 'text-violet-400' },
  { id: 'cta',                  label: 'CTA Scripts',          icon: MousePointerClick, description: '5 end-card CTAs',            color: 'text-amber-400' },
  { id: 'seoChecklist',         label: 'SEO Checklist',        icon: CheckSquare,      description: '10-point SEO checklist',       color: 'text-lime-400' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function CopyBtn({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={`rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors ${small ? 'p-1.5' : 'p-2'}`}>
      {copied ? <Check className={`${small ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-400`} /> : <Copy className={small ? 'w-3 h-3' : 'w-4 h-4'} />}
    </button>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-white/[0.06] rounded animate-pulse ${className ?? ''}`} />;
}

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="glass-card rounded-2xl border border-white/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs text-primary ml-auto">Generating…</span>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

// ── Result renderers ──────────────────────────────────────────────────────────

function StringList({ items, prefix }: { items: string[]; prefix?: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start justify-between gap-3 bg-white/[0.03] rounded-lg p-3 group hover:bg-white/[0.05] transition-colors">
          <p className="text-sm text-white/80 leading-snug">{prefix ? <span className="text-primary font-semibold mr-2">{prefix}{i + 1}.</span> : null}{item}</p>
          <CopyBtn text={item} small />
        </div>
      ))}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <div className="relative">
      <textarea
        readOnly
        value={text}
        className="w-full min-h-[160px] bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white/80 text-sm leading-relaxed resize-none focus:outline-none"
      />
      <div className="absolute top-3 right-3">
        <CopyBtn text={text} small />
      </div>
    </div>
  );
}

function renderResult(type: StudioContentType, result: Record<string, unknown>) {
  if (result.error) return <p className="text-sm text-red-400">{String(result.error)}</p>;

  switch (type) {
    case 'titles':
    case 'titleVariations':
      return <StringList items={(result.titles ?? result.variations ?? []) as string[]} />;
    case 'hookIdeas':
      return <StringList items={(result.hooks ?? []) as string[]} />;
    case 'descriptions':
      return <TextBlock text={String(result.description ?? '')} />;
    case 'descriptionVariations':
      return <StringList items={(result.variations ?? []) as string[]} />;
    case 'tags': {
      const tags = (result.tags ?? []) as string[];
      return (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-1">
                <Hash className="w-3 h-3 text-primary" /> {t}
              </span>
            ))}
          </div>
          <button onClick={() => navigator.clipboard.writeText(tags.join(', '))}
            className="text-xs text-primary hover:text-white flex items-center gap-1 transition-colors">
            <Copy className="w-3 h-3" /> Copy all
          </button>
        </div>
      );
    }
    case 'keywords': {
      const primary = (result.primary ?? []) as string[];
      const secondary = (result.secondary ?? []) as string[];
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Primary</p>
            <div className="space-y-1">
              {primary.map(k => <div key={k} className="text-xs text-white/75 bg-white/[0.03] rounded px-2 py-1">{k}</div>)}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Secondary</p>
            <div className="space-y-1">
              {secondary.map(k => <div key={k} className="text-xs text-white/75 bg-white/[0.03] rounded px-2 py-1">{k}</div>)}
            </div>
          </div>
        </div>
      );
    }
    case 'hashtags': {
      const ht = (result.hashtags ?? []) as string[];
      return (
        <div className="flex flex-wrap gap-2">
          {ht.map(h => (
            <span key={h} className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">{h.startsWith('#') ? h : `#${h}`}</span>
          ))}
        </div>
      );
    }
    case 'scripts':
      return <TextBlock text={String(result.script ?? '')} />;
    case 'communityPosts':
      return <StringList items={(result.posts ?? []) as string[]} />;
    case 'shortIdeas':
    case 'longVideoIdeas':
      return <StringList items={(result.ideas ?? []) as string[]} />;
    case 'thumbnailText':
      return (
        <div className="flex flex-wrap gap-3">
          {((result.options ?? []) as string[]).map((opt, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="font-bold text-white">{opt}</span>
              <CopyBtn text={opt} small />
            </div>
          ))}
        </div>
      );
    case 'pinnedComment':
      return <StringList items={(result.comments ?? []) as string[]} />;
    case 'videoChapters':
      return (
        <div className="space-y-1.5 font-mono">
          {((result.chapters ?? []) as string[]).map((c, i) => (
            <div key={i} className="text-sm text-white/75 flex items-center justify-between bg-white/[0.03] rounded px-3 py-1.5">
              <span>{c}</span>
              <CopyBtn text={c} small />
            </div>
          ))}
        </div>
      );
    case 'cta':
      return <StringList items={(result.ctas ?? []) as string[]} />;
    case 'seoChecklist':
      return (
        <div className="space-y-2">
          {((result.checklist ?? []) as string[]).map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-white/[0.03] rounded-lg px-3 py-2.5">
              <CheckSquare className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <span className="text-sm text-white/75">{item}</span>
            </div>
          ))}
        </div>
      );
    default:
      return <pre className="text-xs text-white/60 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AiStudio() {
  const [prompt, setPrompt] = useState('');
  const [loadingTypes, setLoadingTypes] = useState<Set<StudioContentType>>(new Set());
  const [results, setResults] = useState<Partial<Record<StudioContentType, Record<string, unknown>>>>({});
  const [errors, setErrors] = useState<Partial<Record<StudioContentType, string>>>({});
  const [generatingAll, setGeneratingAll] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const validPrompt = prompt.trim().length > 0;

  const generateOne = useCallback(async (type: StudioContentType) => {
    if (!validPrompt) return;
    setLoadingTypes(prev => new Set([...prev, type]));
    setErrors(prev => { const n = { ...prev }; delete n[type]; return n; });
    try {
      const res = await api.ai.studio(type, prompt);
      setResults(prev => ({ ...prev, [type]: res.result }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [type]: err.message ?? 'Generation failed.' }));
    } finally {
      setLoadingTypes(prev => { const n = new Set(prev); n.delete(type); return n; });
    }
  }, [prompt, validPrompt]);

  const generateAll = useCallback(async () => {
    if (!validPrompt) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setGeneratingAll(true);
    setResults({});
    setErrors({});
    const allTypes = CONTENT_TYPES.map(c => c.id);
    setLoadingTypes(new Set(allTypes));

    try {
      const res = await api.ai.studioAll(prompt, undefined, controller.signal);
      setResults(res.results as Partial<Record<StudioContentType, Record<string, unknown>>>);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errMap: Partial<Record<StudioContentType, string>> = {};
        allTypes.forEach(t => { errMap[t] = err.message ?? 'Generation failed.'; });
        setErrors(errMap);
      }
    } finally {
      setLoadingTypes(new Set());
      setGeneratingAll(false);
    }
  }, [prompt, validPrompt]);

  const hasResults = Object.keys(results).length > 0;
  const orderedResults = CONTENT_TYPES.filter(c => results[c.id] || loadingTypes.has(c.id) || errors[c.id]);

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8">
      {/* ── Left Panel ── */}
      <div className="w-[380px] border-r border-white/5 bg-black/20 p-5 flex flex-col h-full shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-primary" />
          YOUTUR AI Studio
        </h2>

        {/* Prompt */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Video Concept</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your video concept, topic, or paste a rough script idea…"
            className="w-full h-28 bg-white/[0.04] border border-white/10 rounded-xl p-3.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-sm"
          />
        </div>

        {/* Quick commands */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'How AI is changing coding',
              'My 30-day fitness challenge results',
              'Top 5 budget tech picks 2025',
              'Day in my life as a creator',
            ].map(cmd => (
              <button key={cmd} type="button" onClick={() => setPrompt(cmd)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-muted-foreground hover:text-white transition-colors">
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Generate All */}
        <button
          onClick={generateAll}
          disabled={generatingAll || !validPrompt}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_-3px_rgba(255,0,51,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mb-5"
        >
          {generatingAll ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating All…</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate All</>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-muted-foreground">or generate individually</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Content type buttons */}
        <div className="space-y-1 flex-1">
          {CONTENT_TYPES.map(ct => {
            const Icon = ct.icon;
            const isLoading = loadingTypes.has(ct.id);
            const isDone = !!results[ct.id];
            const hasError = !!errors[ct.id];
            return (
              <button key={ct.id} onClick={() => generateOne(ct.id)}
                disabled={isLoading || generatingAll || !validPrompt}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDone ? 'bg-white/[0.06] border border-white/10' : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10'}
                  ${hasError ? 'border-red-500/20 bg-red-500/5' : ''}
                `}>
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                  : <Icon className={`w-4 h-4 shrink-0 ${ct.color}`} />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-none mb-0.5">{ct.label}</p>
                  <p className="text-xs text-muted-foreground leading-none">{ct.description}</p>
                </div>
                {isDone && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {hasError && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                {!isLoading && !isDone && !hasError && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: Canvas ── */}
      <div className="flex-1 bg-background overflow-y-auto">
        {/* Empty state */}
        {!hasResults && !generatingAll && loadingTypes.size === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-50">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Studio Canvas</h3>
            <p className="text-muted-foreground max-w-sm">Enter your video concept and click "Generate All" or pick individual content types to begin.</p>
          </div>
        )}

        {/* Generating all loader */}
        {generatingAll && loadingTypes.size > 0 && !hasResults && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 relative mb-4">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </div>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm">Generating All Content</p>
            <p className="text-muted-foreground text-xs mt-2">This may take 20–30 seconds…</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {(hasResults || orderedResults.length > 0) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6 max-w-4xl mx-auto">
              {orderedResults.map(ct => {
                const Icon = ct.icon;
                const isLoading = loadingTypes.has(ct.id);
                const result = results[ct.id];
                const err = errors[ct.id];

                return (
                  <motion.div key={ct.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    {isLoading ? (
                      <LoadingCard label={ct.label} />
                    ) : (
                      <div className="glass-card rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center ${ct.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            {ct.label}
                          </h3>
                          <button onClick={() => generateOne(ct.id)} disabled={generatingAll}
                            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50">
                            <RefreshCw className="w-3 h-3" /> Regenerate
                          </button>
                        </div>
                        <div className="p-5">
                          {err
                            ? <p className="text-sm text-red-400 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{err}</p>
                            : result ? renderResult(ct.id, result) : null
                          }
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
