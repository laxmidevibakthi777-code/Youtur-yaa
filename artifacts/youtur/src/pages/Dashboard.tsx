import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp, PlaySquare, FileText, CheckCircle, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard, ActionCard, AuditItem } from '@/components/Cards';
import { PerformanceChart } from '@/components/Charts';
import { Link } from 'wouter';

export default function Dashboard() {
  const { user } = useAuth();

  const chartData = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 5000 },
    { name: 'Thu', views: 8000 },
    { name: 'Fri', views: 6000 },
    { name: 'Sat', views: 9000 },
    { name: 'Sun', views: 12000 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white tracking-tight mb-2"
        >
          Good morning, {user?.name}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Your channel is growing 8.4% faster than your niche average.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Subscribers" value="1.24M" trend="up" trendValue="+4.2%" icon={Users} delay={0.1} />
        <StatCard title="Monthly Views" value="24.8M" trend="up" trendValue="+18%" icon={Eye} delay={0.2} />
        <StatCard title="Growth Rate" value="8.4%" trend="neutral" trendValue="Stable" icon={TrendingUp} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts and Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Performance Analytics</h3>
              <div className="flex gap-2">
                {['7D', '30D', '90D'].map((range, i) => (
                  <button key={range} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${i === 0 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'}`}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <PerformanceChart data={chartData} />
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionCard 
                title="AI Studio" 
                description="Generate hooks, titles, and scripts optimized for your audience." 
                icon={FileText} 
                delay={0.5}
                onClick={() => window.location.href = '/ai-studio'}
              />
              <ActionCard 
                title="Channel Audit" 
                description="Run a deep technical analysis on your latest uploads." 
                icon={PlaySquare} 
                delay={0.6}
                onClick={() => window.location.href = '/channel/1'}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Feed and Insights */}
        <div className="space-y-8">
          {/* AI Insight Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-background border border-primary/20 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-white">Elite AI Insight</h3>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Your last 3 videos with the word "Secret" in the title had a 14% higher CTR. We recommend leaning into mystery-driven hooks for your next tech review.
              </p>
              <Link href="/ai-studio" className="text-sm font-semibold text-primary hover:text-white transition-colors">
                  Generate Hooks →
                </Link>
            </div>
          </motion.div>

          {/* Recent Audits */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Audits</h3>
              <Link href="/history" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors">View All</Link>
            </div>
            <div className="space-y-2">
              <AuditItem title="Video SEO Check" status="SUCCESS" time="2 hours ago" delay={0.7} />
              <AuditItem title="Thumbnail Health" status="WARNING" time="5 hours ago" delay={0.8} />
              <AuditItem title="Audience Retention" status="SUCCESS" time="1 day ago" delay={0.9} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
