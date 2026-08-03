import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Copy, Image as ImageIcon, Hash, Check } from 'lucide-react';

export default function AiStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState('');

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setResult({
        titles: [
          "The TRUTH About [Topic] They Are Hiding From You",
          "I Tried [Topic] For 30 Days (It Ruined My Life)",
          "[Topic] Is Dead. Here's What's Next."
        ],
        description: "In this video, we dive deep into the hidden mechanics of [Topic]. Most creators won't tell you this, but we've cracked the code.\n\nSubscribe for more elite strategies.\n\nChapters:\n0:00 - The Big Lie\n2:14 - What Actually Works\n5:30 - The Framework\n\n#CreatorTips #GrowthHack",
        tags: ["youtube growth", "algorithm secrets", "creator economy", "viral strategy", "content creation"]
      });
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8">
      {/* Left Panel: Prompt Area */}
      <div className="w-[400px] border-r border-white/5 bg-black/20 p-6 flex flex-col h-full shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          YOUTUR AI
        </h2>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-white mb-2">What's your next viral hit?</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video concept, or paste a rough script idea here..."
            className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none mb-4"
          />

          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Quick Commands</p>
            <div className="flex flex-wrap gap-2">
              {['/viral-hook', '/seo-optimize', '/title-variations'].map(cmd => (
                <button 
                  key={cmd}
                  onClick={() => setPrompt(prev => prev + cmd + ' ')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.4)] disabled:opacity-50"
            >
              {isGenerating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>Generate <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Studio Canvas */}
      <div className="flex-1 bg-background p-8 overflow-y-auto relative">
        {!result && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Sparkles className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Studio Canvas</h3>
            <p className="text-muted-foreground max-w-md">Your generated titles, scripts, and SEO metadata will appear here. Enter a prompt to begin.</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <motion.div 
                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
            <p className="mt-4 text-primary font-medium tracking-widest uppercase text-sm">Synthesizing Data</p>
          </div>
        )}

        {result && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Titles */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                High-CTR Titles
              </h3>
              <div className="grid gap-3">
                {result.titles.map((title: string, i: number) => (
                  <div key={i} className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <p className="text-lg text-white font-medium">{title}</p>
                    <button 
                      onClick={() => copyToClipboard(title, `title-${i}`)}
                      className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                      {copied === `title-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                Optimized Description
              </h3>
              <div className="glass-card p-1 rounded-xl border border-white/5 relative group">
                <textarea 
                  defaultValue={result.description}
                  className="w-full h-48 bg-transparent p-4 text-white/90 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary rounded-lg"
                />
                <button 
                  onClick={() => copyToClipboard(result.description, 'desc')}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-muted-foreground hover:text-white transition-colors backdrop-blur-md"
                >
                  {copied === 'desc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </section>

            {/* Tags */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                SEO Tags
              </h3>
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white flex items-center gap-1">
                      <Hash className="w-3 h-3 text-primary" /> {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => copyToClipboard(result.tags.join(', '), 'tags')}
                  className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  {copied === 'tags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy all tags
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
}
