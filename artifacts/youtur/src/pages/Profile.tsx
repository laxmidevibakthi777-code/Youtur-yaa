import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Edit2, Link as LinkIcon, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Profile</h1>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-primary/30 via-background to-black relative">
          <button className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-md">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="relative -mt-16 w-32 h-32 rounded-2xl border-4 border-background overflow-hidden bg-background mb-6 group">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-primary font-medium mb-4">{user?.handle}</p>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                Tech reviewer and software engineering advocate. Building the next generation of developer tools while documenting the journey on YouTube.
              </p>
            </div>
            <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Niche Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Software Dev', 'Productivity', 'Setup Tours'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-sm text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connected Accounts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Youtube className="w-5 h-5 text-[#FF0000]" />
                  <span className="font-medium text-white flex-1">YouTube</span>
                  <span className="text-sm text-emerald-400">Connected</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 opacity-50 grayscale">
                  <Twitter className="w-5 h-5 text-white" />
                  <span className="font-medium text-white flex-1">Twitter</span>
                  <button className="text-sm text-primary hover:text-white transition-colors">Connect</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
