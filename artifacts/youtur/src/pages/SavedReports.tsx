import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

export default function SavedReports() {
  const reports = [
    { id: 1, title: 'Q3 Growth Strategy', channel: '@elitetech', date: 'Oct 1, 2023', score: '94/100' },
    { id: 2, title: 'Competitor Matrix vs MKBHD', channel: '@elitetech', date: 'Sep 15, 2023', score: '88/100' },
    { id: 3, title: 'Thumbnail A/B Test Results', channel: '@elitetech', date: 'Aug 20, 2023', score: '91/100' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Saved Reports</h1>
          <p className="text-muted-foreground">Detailed PDF and presentation exports of your analyses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <motion.div 
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors">{report.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{report.channel}</p>
            
            <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5 mb-6">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4" /> {report.date}
              </div>
              <div className="font-medium text-emerald-400">
                Score: {report.score}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <Eye className="w-4 h-4" /> View
              </button>
              <button className="flex-1 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-primary/20">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
