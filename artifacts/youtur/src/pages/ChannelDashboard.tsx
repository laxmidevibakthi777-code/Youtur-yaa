import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Users, Clock, DollarSign, Activity, Target } from 'lucide-react';

export default function ChannelDashboard() {
  const [projectionType, setProjectionType] = useState<'linear'|'predictive'>('predictive');

  const growthData = [
    { month: 'Jan', subs: 1.8, target: 1.8 },
    { month: 'Feb', subs: 1.9, target: 1.95 },
    { month: 'Mar', subs: 2.1, target: 2.1 },
    { month: 'Apr', subs: 2.2, target: 2.4 },
    { month: 'May', subs: 2.4, target: 2.8 },
    { month: 'Jun', subs: null, target: 3.1 },
    { month: 'Jul', subs: null, target: 3.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Channel Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-background/5 z-0" />
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-t from-background via-background/80 to-transparent pt-32">
          <div className="w-24 h-24 rounded-2xl bg-black border-2 border-white/20 overflow-hidden shrink-0 shadow-xl">
            <img src="https://i.pravatar.cc/150?u=elitetech" alt="Channel" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-1">Elite Tech Creator</h1>
            <p className="text-lg text-primary font-medium">@elitetech • 2.4M Subscribers • 412 Videos</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors backdrop-blur-sm border border-white/10">
              Refresh Data
            </button>
            <button className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-[0_0_15px_-3px_rgba(255,0,51,0.5)] transition-all">
              New Audit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Growth Roadmap */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">Growth Roadmap: Target 3.5M</h3>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setProjectionType('linear')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${projectionType === 'linear' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
              >
                Linear
              </button>
              <button 
                onClick={() => setProjectionType('predictive')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${projectionType === 'predictive' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                Predictive AI
              </button>
            </div>
          </div>
          
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} domain={[1.5, 4]} tickFormatter={(val) => `${val}M`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(18, 18, 18, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <ReferenceLine y={3.5} stroke="rgba(255,0,51,0.3)" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal: 3.5M', fill: 'rgba(255,0,51,0.8)', fontSize: 12 }} />
                <Line type="monotone" dataKey="subs" stroke="#fff" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" stroke="hsl(350, 100%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-muted-foreground mb-1">MOM Growth</p>
              <p className="text-lg font-bold text-emerald-400">+12.4%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Watch Time (30d)</p>
              <p className="text-lg font-bold text-white">1.2M hrs</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg Retention</p>
              <p className="text-lg font-bold text-white">64.2%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Est. RPM</p>
              <p className="text-lg font-bold text-primary">$12.45</p>
            </div>
          </div>
        </div>

        {/* Audience Bio */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white">Audience Bio</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Age Demographics</span>
                <span className="text-white font-medium">18-24 Dominant</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                <div className="h-full bg-white/20 w-[15%]" title="13-17" />
                <div className="h-full bg-primary w-[45%]" title="18-24" />
                <div className="h-full bg-white/40 w-[25%]" title="25-34" />
                <div className="h-full bg-white/10 w-[15%]" title="35+" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Top Geographies</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">US</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                  <span className="text-xs text-muted-foreground">65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">UK</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-white/40 w-[15%]" />
                  </div>
                  <span className="text-xs text-muted-foreground">15%</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Top Interests</p>
              <div className="flex flex-wrap gap-2">
                {['PC Builds', 'Mechanical Keyboards', 'Tech News', 'Setup Tours'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Efficiency Matrix */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white">Content Efficiency Breakdown</h3>
          <p className="text-sm text-muted-foreground">Recent performance analyzed by production effort vs return.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider">
                <th className="p-4 font-medium">Video Title</th>
                <th className="p-4 font-medium">Total Views</th>
                <th className="p-4 font-medium">Retention</th>
                <th className="p-4 font-medium">Est Revenue</th>
                <th className="p-4 font-medium">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { title: "I Built the Ultimate $10,000 Setup", views: "3.2M", ret: "71%", rev: "$42k", eff: "ELITE" },
                { title: "M2 Mac Mini Review: Don't Buy Until...", views: "1.4M", ret: "65%", rev: "$18k", eff: "HIGH" },
                { title: "Why Your PC is Running Slow", views: "850k", ret: "58%", rev: "$9k", eff: "GOOD" },
                { title: "My Top 5 Desk Accessories", views: "420k", ret: "45%", rev: "$3k", eff: "LOW" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white text-sm max-w-xs truncate">{row.title}</td>
                  <td className="p-4 text-sm text-white/80">{row.views}</td>
                  <td className="p-4 text-sm text-white/80">{row.ret}</td>
                  <td className="p-4 text-sm text-primary font-medium">{row.rev}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded border ${
                      row.eff === 'ELITE' ? 'bg-primary/10 border-primary/30 text-primary' :
                      row.eff === 'HIGH' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      row.eff === 'GOOD' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      'bg-white/5 border-white/10 text-muted-foreground'
                    }`}>
                      {row.eff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
