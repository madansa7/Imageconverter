import React from 'react';
import { Settings, Maximize, FileOutput, Gauge, Wand2 } from 'lucide-react';
import { ProcessOptions } from '../utils/imageProcessor';

interface ControlPanelProps {
  options: ProcessOptions;
  onChange: (newOptions: ProcessOptions) => void;
  disabled: boolean;
  isProcessing: boolean;
  onProcess: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  options, 
  onChange, 
  disabled, 
  isProcessing,
  onProcess 
}) => {
  
  const updateOption = <K extends keyof ProcessOptions>(key: K, value: ProcessOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 w-full lg:w-80 flex-shrink-0 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6 text-indigo-400">
        <Settings className="w-5 h-5" />
        <h2 className="font-semibold tracking-wide uppercase text-xs">Configuration</h2>
      </div>

      <div className="space-y-8">
        {/* Scale Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Maximize className="w-4 h-4 text-slate-500" />
              Upscale Factor
            </label>
            <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-indigo-300 border border-slate-700">
              {Math.round(options.scale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="0.1"
            disabled={disabled}
            value={options.scale}
            onChange={(e) => updateOption('scale', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>1x</span>
            <span>2x</span>
            <span>3x</span>
            <span>4x</span>
          </div>
        </div>

        {/* Format Control */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileOutput className="w-4 h-4 text-slate-500" />
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => updateOption('format', fmt)}
                disabled={disabled}
                className={`
                  py-2 px-1 rounded-lg text-xs font-medium transition-all
                  ${options.format === fmt 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }
                  disabled:opacity-50
                `}
              >
                {fmt.split('/')[1].toUpperCase().replace('JPEG', 'JPG')}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-500" />
              Quality
            </label>
            <span className="text-xs font-mono text-slate-400">
              {Math.round(options.quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            disabled={disabled || options.format === 'image/png'}
            value={options.quality}
            onChange={(e) => updateOption('quality', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {options.format === 'image/png' && (
            <p className="text-[10px] text-amber-500/80 mt-1">
              Quality slider ignored for PNG (lossless)
            </p>
          )}
        </div>

        {/* Sharpen Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Wand2 className={`w-4 h-4 ${options.sharpen ? 'text-purple-400' : 'text-slate-600'}`} />
            <span className="text-sm font-medium text-slate-300">Smart Sharpen</span>
          </div>
          <button
            onClick={() => updateOption('sharpen', !options.sharpen)}
            disabled={disabled}
            className={`
              w-10 h-5 rounded-full relative transition-colors duration-200
              ${options.sharpen ? 'bg-purple-600' : 'bg-slate-700'}
              disabled:opacity-50
            `}
          >
            <div 
              className={`
                absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200
                ${options.sharpen ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <button
          onClick={onProcess}
          disabled={disabled || isProcessing}
          className={`
            w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
            flex items-center justify-center gap-2
            ${isProcessing 
              ? 'bg-slate-700 cursor-wait opacity-80' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            'Convert & Upscale'
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;