import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import ControlPanel from './components/ControlPanel';
import ImagePreview from './components/ImagePreview';
import { processImage, ProcessOptions, ProcessResult } from './utils/imageProcessor';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default options
  const [options, setOptions] = useState<ProcessOptions>({
    scale: 1,
    format: 'image/webp',
    quality: 0.9,
    sharpen: false,
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (processedImage) URL.revokeObjectURL(processedImage.url);
    };
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    // Cleanup previous
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (processedImage) {
      URL.revokeObjectURL(processedImage.url);
      setProcessedImage(null);
    }

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setOriginalPreviewUrl(url);
    setError(null);
    
    // Auto-reset scale to 1 on new file for safety, or keep preference?
    // Let's keep preference but maybe reset if needed. keeping preference is better UX.
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    // Small timeout to allow UI to update to "Processing" state before heavy canvas ops block the thread
    setTimeout(async () => {
      try {
        const result = await processImage(file, options);
        setProcessedImage((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return result;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to process image. It might be too large for browser memory.");
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setFile(null);
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    setOriginalPreviewUrl(null);
    if (processedImage) URL.revokeObjectURL(processedImage.url);
    setProcessedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      <Header />

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        {!file ? (
          <div className="max-w-2xl mx-auto mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Transform your images <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Instantly & Securely</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                Convert to WebP, upscale up to 400%, and optimize quality. <br/>
                All processing happens locally in your browser.
              </p>
            </div>
            
            <DropZone onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {[
                { title: 'Local Processing', desc: 'Your photos never leave your device.', icon: '🔒' },
                { title: 'Smart Upscaling', desc: 'Increase resolution up to 400%.', icon: '🚀' },
                { title: 'Modern Formats', desc: 'Convert PNG/JPG to efficient WebP.', icon: '⚡' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-slate-800/20 border border-slate-700/50 p-4 rounded-xl backdrop-blur-sm hover:bg-slate-800/40 transition-colors">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-200">{feature.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
            {/* Sidebar Controls */}
            <ControlPanel 
              options={options} 
              onChange={setOptions} 
              disabled={isProcessing}
              isProcessing={isProcessing}
              onProcess={handleProcess}
            />

            {/* Main Preview Area */}
            <div className="flex-1 min-w-0 space-y-4">
              {error && (
                 <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                   {error}
                 </div>
              )}
              
              <ImagePreview 
                originalFile={file}
                processedImage={processedImage}
                originalPreviewUrl={originalPreviewUrl}
                onClear={handleClear}
              />
              
              {!processedImage && !isProcessing && (
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-6 text-center text-indigo-200">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-indigo-400 opacity-80" />
                  <p className="font-medium">Ready to transform</p>
                  <p className="text-sm text-indigo-300/70 mt-1">Adjust settings on the left and click 'Convert & Upscale'</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;