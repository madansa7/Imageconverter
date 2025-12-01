import React from 'react';
import { Download, X, ArrowRight, FileCheck, FileWarning, Image as ImageIcon } from 'lucide-react';
import { ProcessResult, formatFileSize } from '../utils/imageProcessor';

interface ImagePreviewProps {
  originalFile: File | null;
  processedImage: ProcessResult | null;
  originalPreviewUrl: string | null;
  onClear: () => void;
}

const getFileExtension = (mimeType: string) => {
  switch (mimeType) {
    case 'image/webp': return 'webp';
    case 'image/png': return 'png';
    case 'image/jpeg': return 'jpg';
    default: return 'img';
  }
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  originalFile, 
  processedImage,
  originalPreviewUrl,
  onClear 
}) => {
  if (!originalFile || !originalPreviewUrl) return null;

  const extension = processedImage ? getFileExtension(processedImage.blob.type) : '';
  
  // Create a nice filename: originalName_processed.ext
  const getDownloadFilename = () => {
    if (!originalFile) return `converted_image.${extension}`;
    const nameWithoutExt = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || originalFile.name;
    return `${nameWithoutExt}_processed.${extension}`;
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs" title={originalFile.name}>
              {originalFile.name}
            </h3>
            <p className="text-xs text-slate-500">
              Original: {formatFileSize(originalFile.size)}
            </p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
          title="Remove image"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900/50 relative min-h-[400px] flex items-center justify-center">
        
        {/* Grid Pattern Background for transparency check */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 z-10">
          {/* Images Comparison */}
          <div className="flex flex-col xl:flex-row gap-8 items-center w-full justify-center">
            
            {/* Original */}
            <div className="relative group max-w-full">
               <span className="absolute -top-8 left-0 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/80 px-2 py-1 rounded">Original</span>
               <img 
                 src={originalPreviewUrl} 
                 alt="Original" 
                 className="max-h-[50vh] max-w-full rounded-lg shadow-2xl border border-slate-700/50 object-contain bg-slate-800"
               />
               <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full font-mono">
                 Source
               </div>
            </div>

            {processedImage && (
              <>
                <div className="hidden xl:flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-8 h-8" />
                </div>
                
                {/* Processed */}
                <div className="relative group max-w-full">
                  <span className="absolute -top-8 left-0 text-xs font-semibold text-emerald-500 uppercase tracking-wider bg-slate-900/80 px-2 py-1 rounded flex items-center gap-1">
                    <FileCheck className="w-3 h-3" />
                    Processed Result
                  </span>
                  <img 
                    src={processedImage.url} 
                    alt="Processed" 
                    className="max-h-[50vh] max-w-full rounded-lg shadow-2xl shadow-emerald-900/20 border-2 border-emerald-500/30 object-contain bg-slate-800"
                  />
                   <div className="absolute bottom-2 right-2 bg-emerald-900/80 backdrop-blur text-emerald-100 text-[10px] px-2 py-1 rounded-full font-mono border border-emerald-500/30">
                     {processedImage.width} x {processedImage.height}
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      {processedImage && (
        <div className="p-4 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs">New Size</span>
              <span className="font-mono text-emerald-400 font-semibold">{formatFileSize(processedImage.size)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs">Dimensions</span>
              <span className="font-mono text-slate-300">{processedImage.width} × {processedImage.height}</span>
            </div>
          </div>

          <a
            href={processedImage.url}
            download={getDownloadFilename()}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-4 h-4" />
            Download {extension.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;