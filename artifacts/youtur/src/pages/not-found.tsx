import { Link } from "wouter";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-md mx-auto px-6"
      >
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
          <Search className="w-10 h-10 text-primary relative z-10" />
        </div>
        
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
          Lost in the algorithm
        </h1>
        
        <p className="text-muted-foreground mb-10 text-lg">
          We couldn't find the page you're looking for. It might have been deleted, moved, or never existed.
        </p>
        
        <Link href="/dashboard" className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-[0_0_20px_-5px_rgba(255,0,51,0.5)] hover:shadow-[0_0_30px_-5px_rgba(255,0,51,0.7)]">
            Back to Dashboard
          </Link>
      </motion.div>
    </div>
  );
}
