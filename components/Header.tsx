import React from 'react';
import { Layers, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
              <Layers className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PixelLift
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Local Processing</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 inline-block rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            No Server Uploads
          </div>
          <a href="#" className="p-2 text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;