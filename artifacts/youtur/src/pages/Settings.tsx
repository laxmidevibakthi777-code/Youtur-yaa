import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = ['Account', 'Notifications', 'Billing', 'API', 'Privacy'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card rounded-2xl border border-white/5 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">{activeTab} Settings</h2>
            
            {activeTab === 'Account' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <input type="email" defaultValue="alex@youtur.ai" className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Timezone</label>
                  <select className="w-full h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-primary transition-all appearance-none">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-[0_0_15px_-3px_rgba(255,0,51,0.4)] transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'API' && (
              <div className="space-y-6">
                <p className="text-muted-foreground text-sm mb-6">Manage your API keys for custom integrations.</p>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Production Key</label>
                  <div className="flex gap-2">
                    <input type="password" value="sk_live_1234567890abcdef" readOnly className="flex-1 h-11 bg-black/40 border border-white/10 rounded-lg px-4 text-muted-foreground focus:outline-none" />
                    <button className="px-4 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">Copy</button>
                  </div>
                </div>
                <button className="text-sm font-medium text-primary hover:text-white transition-colors">
                  + Generate New Key
                </button>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white mb-1">Elite Plan</h3>
                    <p className="text-sm text-primary">$99/month</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-primary text-white text-xs font-bold tracking-wider uppercase">Active</span>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                  Manage Subscription
                </button>
              </div>
            )}

            {['Notifications', 'Privacy'].includes(activeTab) && (
              <div className="py-8 text-center text-muted-foreground">
                Preferences for {activeTab.toLowerCase()} will appear here.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
