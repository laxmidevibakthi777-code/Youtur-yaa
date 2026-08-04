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
  Plus,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLLAPSED_W = 72;
const EXPANDED_W  = 280;
const LS_KEY      = "youtur_sidebar_expanded";
const EASE        = "cubic-bezier(0.4,0,0.2,1)";
const DUR_MS      = 300;
const DUR         = `${DUR_MS}ms`;
const WTrans      = `width ${DUR} ${EASE}, min-width ${DUR} ${EASE}`;
const MLTrans     = `margin-left ${DUR} ${EASE}`;

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",       href: "/dashboard"         },
  { icon: Search,          label: "Channel Search", href: "/channel-search"    },
  { icon: Users,           label: "My Channels",    href: "/channel-selection" },
  { icon: PlaySquare,      label: "Channel Audit",  href: "/channel/1"         },
  { icon: Sparkles,        label: "AI Studio",      href: "/ai-studio"         },
  { icon: BarChart2,       label: "Analytics",      href: "/dashboard"         },
  { icon: History,         label: "History",        href: "/history"           },
  { icon: FileText,        label: "Saved Reports",  href: "/saved-reports"     },
];

const GLASS: React.CSSProperties = {
  background:           "rgba(9,9,9,0.94)",
  backdropFilter:       "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRight:          "1px solid rgba(255,255,255,0.055)",
  boxShadow:            "4px 0 40px rgba(0,0,0,0.5)",
};

// ─── Tooltip (collapsed mode) ─────────────────────────────────────────────────
function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, x: -6, scale: 0.94 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{   opacity: 0, x: -6, scale: 0.94 }}
            transition={{ duration: 0.13 }}
            className="pointer-events-none absolute left-full ml-3 z-[100] whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
            style={{
              background: "rgba(18,18,18,0.97)",
              border:     "1px solid rgba(255,23,68,0.2)",
              boxShadow:  "0 8px 28px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,23,68,0.07)",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({
  icon: Icon,
  label,
  href,
  active,
  expanded,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  expanded: boolean;
  onClick?: () => void;
}) {
  const button = (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`
        relative flex items-center gap-3 cursor-pointer select-none
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/50
        ${expanded
          ? "px-3.5 py-2.5 rounded-[18px] mx-2 w-auto"
          : "w-11 h-11 justify-center rounded-[18px] mx-auto"}
        ${active ? "text-white" : "text-[#5a5a5a] hover:text-white"}
        group
      `}
      style={active ? {
        background: "linear-gradient(135deg,rgba(255,23,68,.17) 0%,rgba(255,23,68,.07) 100%)",
        boxShadow:  "0 0 24px -6px rgba(255,23,68,.38),inset 0 1px 0 rgba(255,255,255,.04)",
      } : undefined}
    >
      {/* Active left pill */}
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{
            width: 3,
            height: "56%",
            background: "linear-gradient(180deg,#FF1744 0%,#FF6080 100%)",
            boxShadow:  "0 0 10px 2px rgba(255,23,68,0.55)",
          }}
          initial={false}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}

      {/* Icon */}
      <motion.span
        whileHover={{ scale: 1.12, rotate: active ? 0 : 4 }}
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.15 }}
        className="shrink-0"
        style={{ filter: active ? "drop-shadow(0 0 6px rgba(255,23,68,0.65))" : "none" }}
      >
        <Icon
          className={`w-5 h-5 transition-colors duration-200 ${
            active ? "text-[#FF1744]" : "text-[#5a5a5a] group-hover:text-white"
          }`}
        />
      </motion.span>

      {/* Label – fades in when expanded */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.span
            key="lbl"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1,  x: 0   }}
            exit={{   opacity: 0,  x: -10  }}
            transition={{ duration: 0.18, delay: 0.05 }}
            className="text-sm font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  return expanded ? button : <NavTooltip label={label}>{button}</NavTooltip>;
}

// ─── SidebarBody ──────────────────────────────────────────────────────────────
function SidebarBody({
  expanded,
  onNavClick,
}: {
  expanded: boolean;
  onNavClick?: () => void;
}) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    location === href ||
    (location.startsWith("/channel/") &&
      href === "/channel/1" &&
      location !== "/channel-selection" &&
      location !== "/channel-search");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={isActive(item.href)}
            expanded={expanded}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Footer */}
      <div
        className="shrink-0 pt-1 pb-3 border-t space-y-0.5"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <NavItem
          icon={Settings}
          label="Settings"
          href="/settings"
          active={location === "/settings"}
          expanded={expanded}
          onClick={onNavClick}
        />

        {/* Profile */}
        <div
          className={`flex items-center gap-3 mx-2 px-2 py-2 rounded-[18px] cursor-pointer group hover:bg-white/5 transition-colors duration-200 ${
            !expanded ? "justify-center" : ""
          }`}
        >
          <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150"}
              alt={user?.name || "User"}
              className="w-9 h-9 rounded-full object-cover shrink-0 border transition-colors duration-200 group-hover:border-[#FF1744]/50"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="uinfo"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1,  x: 0  }}
                  exit={{   opacity: 0,  x: -8  }}
                  transition={{ duration: 0.17, delay: 0.05 }}
                  className="flex flex-col min-w-0"
                >
                  <span className="text-sm font-semibold text-white leading-none mb-1 truncate group-hover:text-[#FF1744] transition-colors duration-200">
                    {user?.name}
                  </span>
                  <span className="text-xs text-[#4a4a4a] leading-none truncate">
                    {user?.handle}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.button
                key="logout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.14 }}
                onClick={logout}
                aria-label="Log out"
                className="p-1.5 shrink-0 text-[#4a4a4a] hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/50"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── useIsDesktop ─────────────────────────────────────────────────────────────
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isDesktop;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export function Layout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_KEY) === "true"; }
    catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop   = useIsDesktop();
  const touchStartX = useRef<number | null>(null);

  const sidebarW = expanded ? EXPANDED_W : COLLAPSED_W;

  // Persist
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, String(expanded)); }
    catch {}
  }, [expanded]);

  const toggleDesktop = useCallback(() => setExpanded(p => !p), []);
  const closeMobile   = useCallback(() => setMobileOpen(false), []);

  // ESC key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeMobile]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Swipe left to close
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && touchStartX.current - e.changedTouches[0].clientX > 55) {
      closeMobile();
    }
    touchStartX.current = null;
  };

  return (
    <div className="flex h-screen bg-[#090909] text-white overflow-hidden selection:bg-[#FF1744]/30">

      {/* ══ Desktop sidebar (position: fixed) ═══════════════════════════════ */}
      <aside
        aria-label="Sidebar navigation"
        className="hidden lg:flex flex-col shrink-0 fixed top-0 left-0 h-full z-30 overflow-hidden"
        style={{ width: sidebarW, transition: WTrans, ...GLASS }}
      >
        {/* Sidebar header with toggle */}
        <div
          className="h-[72px] flex items-center shrink-0 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.055)" }}
        >
          {/* Toggle — always 72px wide, always centered */}
          <button
            onClick={toggleDesktop}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            className="w-[72px] h-full flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#FF1744]/40 group"
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:bg-[#FF1744]/12"
            >
              <AnimatePresence mode="wait" initial={false}>
                {expanded ? (
                  <motion.span key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-[18px] h-[18px] text-[#555] group-hover:text-[#FF1744] transition-colors" />
                  </motion.span>
                ) : (
                  <motion.span key="m"
                    initial={{ rotate:  90, opacity: 0 }}
                    animate={{ rotate:  0,  opacity: 1 }}
                    exit={{   rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-[18px] h-[18px] text-[#555] group-hover:text-[#FF1744] transition-colors" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </button>

          {/* Logo (only when expanded) */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1,  x: 0   }}
                exit={{   opacity: 0,  x: -14  }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 overflow-hidden pr-4 pointer-events-none"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#FF1744 0%,#FF6080 100%)",
                    boxShadow:  "0 0 18px rgba(255,23,68,0.45)",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[17px] tracking-tight text-white leading-none">YOUTUR</p>
                  <p className="text-[9px] text-[#FF1744] font-bold tracking-[0.22em] mt-0.5 uppercase">
                    AI Creator Hub
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-0">
          <SidebarBody expanded={expanded} />
        </div>
      </aside>

      {/* ══ Mobile backdrop ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
            aria-hidden="true"
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)" }}
          />
        )}
      </AnimatePresence>

      {/* ══ Mobile drawer ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: -EXPANDED_W }}
            animate={{ x: 0           }}
            exit={{   x: -EXPANDED_W  }}
            transition={{ type: "spring", stiffness: 370, damping: 38 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
            className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
            style={{ width: EXPANDED_W, ...GLASS }}
          >
            <div
              className="h-[72px] flex items-center justify-between px-4 shrink-0 border-b"
              style={{ borderColor: "rgba(255,255,255,0.055)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#FF1744 0%,#FF6080 100%)",
                    boxShadow:  "0 0 18px rgba(255,23,68,0.45)",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[17px] tracking-tight text-white leading-none">YOUTUR</p>
                  <p className="text-[9px] text-[#FF1744] font-bold tracking-[0.22em] mt-0.5 uppercase">
                    AI Creator Hub
                  </p>
                </div>
              </div>
              <button
                onClick={closeMobile}
                aria-label="Close navigation"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-white/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <SidebarBody expanded={true} onNavClick={closeMobile} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══ Main content area ════════════════════════════════════════════════ */}
      {/*
        The sidebar is position:fixed on desktop — it doesn't push sibling
        elements. We therefore apply marginLeft equal to sidebarW on desktop
        only, and animate it in sync with the sidebar width transition.
      */}
      <div
        className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden"
        style={{
          marginLeft: isDesktop ? sidebarW : 0,
          transition: MLTrans,
        }}
      >
        {/* Topbar */}
        <header
          className="h-[72px] flex items-center gap-3 px-4 lg:px-6 shrink-0 z-20 border-b"
          style={{
            borderColor:          "rgba(255,255,255,0.055)",
            background:           "rgba(9,9,9,0.88)",
            backdropFilter:       "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-white/5 transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/50"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            <button
              aria-label="Notifications"
              className="relative p-2 text-[#555] hover:text-white rounded-xl hover:bg-white/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/50"
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full ring-2 ring-[#090909]"
                style={{ background: "#FF1744" }}
              />
            </button>
            <CreateButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 lg:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <Search
        className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
          focused ? "text-[#FF1744]" : "text-[#4a4a4a]"
        }`}
      />
      <input
        type="search"
        placeholder="Search channels, insights, or commands…"
        aria-label="Search"
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        className="w-full h-10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-[#4a4a4a] focus:outline-none transition-all duration-200"
        style={{
          background:  focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border:      focused ? "1px solid rgba(255,23,68,0.35)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow:   focused ? "0 0 0 3px rgba(255,23,68,0.08)" : "none",
        }}
      />
    </div>
  );
}

// ─── CreateButton ─────────────────────────────────────────────────────────────
function CreateButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="h-9 px-4 rounded-full text-white font-semibold text-sm flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]/60"
      style={{
        background: "linear-gradient(135deg,#FF1744 0%,#FF6080 100%)",
        boxShadow:  "0 0 18px -5px rgba(255,23,68,0.55)",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px -4px rgba(255,23,68,0.8)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px -5px rgba(255,23,68,0.55)"; }}
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Create</span>
    </motion.button>
  );
}
