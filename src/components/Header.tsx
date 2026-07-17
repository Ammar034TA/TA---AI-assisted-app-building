import { CloudSun, ExternalLink } from 'lucide-react';

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/90 p-4 rounded-2xl backdrop-blur-md">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <CloudSun className="h-6 w-6 text-white stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase font-display text-slate-100 flex items-center gap-1">
              SkyIntelligence<span className="text-blue-400">.ai</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
              Meteorological Intelligence Engine
            </p>
          </div>
        </div>

        {/* Source info (Open-Meteo branding) */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 tracking-widest hidden md:inline">
            SYSTEM STATUS: ONLINE
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden md:inline" />
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 dark:text-slate-500 dark:hover:text-blue-400 font-mono transition-colors border border-slate-800 rounded-xl px-3.5 py-1.5 bg-slate-950/40"
          >
            <span>Open-Meteo API</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
