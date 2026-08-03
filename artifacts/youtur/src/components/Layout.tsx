import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  PlaySquare, 
  Sparkles, 
  History, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

function SidebarItem({ icon: Icon, label, href, active }: { icon: React.ElementType, label: string, href: string, active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-white transition-colors'}`} />
      <span className="font-medium text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Channel Search", href: "/channel-search" },
    { icon: Users, label: "My Channels", href: "/channel-selection" },
    { icon: PlaySquare, label: "Channel Audit", href: "/channel/1" },
    { icon: Sparkles, label: "AI Studio", href: "/ai-studio" },
    { icon: History, label: "History", href: "/history" },
    { icon: FileText, label: "Saved Reports", href: "/saved-reports" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col justify-between shrink-0 relative z-20">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-border/50">
            <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-white leading-none">YOUTUR</h1>
                <p className="text-[10px] text-primary font-medium tracking-widest mt-1 uppercase">AI Creator Hub</p>
              </div>
            </Link>
          </div>
          
          <div className="p-4 space-y-1 relative">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.href} 
                {...item} 
                active={location === item.href || (location.startsWith('/channel/') && item.href === '/channel/1' && location !== '/channel-selection' && location !== '/channel-search')} 
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <SidebarItem icon={Settings} label="Settings" href="/settings" active={location === "/settings"} />
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between px-2">
            <Link href="/profile" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-none mb-1 group-hover:text-primary transition-colors">{user?.name}</span>
                <span className="text-xs text-muted-foreground leading-none">{user?.handle}</span>
              </div>
            </Link>
            <button onClick={logout} className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search commands, channels, or insights..." 
                className="w-full h-11 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-4">
            <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background"></span>
            </button>
            <button className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_-3px_rgba(255,0,51,0.4)] hover:shadow-[0_0_20px_-3px_rgba(255,0,51,0.6)]">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
