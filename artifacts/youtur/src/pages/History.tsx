import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PlaySquare, Download, Clock } from 'lucide-react';

export default function History() {
  const historyData = [
    { id: 1, type: 'Title Generation', content: '"The TRUTH About AI..."', date: '2 hours ago', status: 'Completed', icon: FileText },
    { id: 2, type: 'Channel Audit', content: '@elitetech Technical Analysis', date: 'Yesterday', status: 'Completed', icon: PlaySquare },
    { id: 3, type: 'Script Outline', content: 'Gaming PC Build Guide', date: '3 days ago', status: 'Completed', icon: FileText },
    { id: 4, type: 'Competitor Analysis', content: 'Vs. Linus Tech Tips', date: '1 week ago', status: 'Exported', icon: PlaySquare },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">History</h1>
          <p className="text-muted-foreground">Your past AI generations and analyses.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex border-b border-white/5">
          {['All', 'Titles & Scripts', 'Audits'].map((tab, i) => (
            <button 
              key={tab}
              className={`px-6 py-4 text-sm font-medium transition-colors ${i === 0 ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider bg-white/[0.02]">
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Content Preview</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyData.map((row, i) => {
                const Icon = row.icon;
                return (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="font-medium text-white text-sm">{row.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white/80">{row.content}</td>
                    <td className="p-4 text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {row.date}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded bg-white/5 text-white/70 uppercase">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
