import React, { useCallback, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert("Please drop a valid image file.");
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div 
      className={`
        w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out cursor-pointer group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
          : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-800/20'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleFileInput}
      />
      
      <div className={`p-4 rounded-full bg-slate-800 mb-4 transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'bg-indigo-600' : ''}`}>
        {isDragging ? (
          <FileImage className="w-8 h-8 text-white" />
        ) : (
          <Upload className="w-8 h-8 text-indigo-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-200 mb-2">
        {isDragging ? 'Drop it like it\'s hot!' : 'Upload an image'}
      </h3>
      <p className="text-slate-400 text-sm max-w-xs text-center">
        Drag and drop your PNG, JPG, or WebP here, or click to browse.
      </p>
    </div>
  );
};

export default DropZone;