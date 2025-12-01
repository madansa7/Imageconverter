export interface ProcessOptions {
  scale: number; // 1 to 4
  format: 'image/webp' | 'image/png' | 'image/jpeg';
  quality: number; // 0 to 1
  sharpen: boolean;
}

export interface ProcessResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
}

// Simple convolution kernel for sharpening
const sharpenKernel = [
  0, -1, 0,
  -1, 5, -1,
  0, -1, 0
];

const applyConvolution = (ctx: CanvasRenderingContext2D, width: number, height: number, kernel: number[]) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const buff = new Uint8ClampedArray(data.length); // buffer for original data
  buff.set(data);
  
  const w = width;
  const h = height;
  const mix = (v: number) => Math.min(255, Math.max(0, v));

  // Convolve
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      
      let r = 0, g = 0, b = 0;
      
      // 3x3 kernel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const kIdx = ((y + ky) * w + (x + kx)) * 4;
          const weight = kernel[(ky + 1) * 3 + (kx + 1)];
          
          r += buff[kIdx] * weight;
          g += buff[kIdx + 1] * weight;
          b += buff[kIdx + 2] * weight;
        }
      }
      
      data[idx] = mix(r);
      data[idx + 1] = mix(g);
      data[idx + 2] = mix(b);
      // Alpha remains unchanged
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const processImage = async (
  file: File, 
  options: ProcessOptions
): Promise<ProcessResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Calculate new dimensions
      const targetWidth = Math.floor(img.width * options.scale);
      const targetHeight = Math.floor(img.height * options.scale);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // High quality smoothing settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw resized image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Apply sharpening if requested and if scaling up significantly
      // (Sharpening helps counteract the blur from bicubic upscaling)
      if (options.sharpen && options.scale > 1) {
        applyConvolution(ctx, targetWidth, targetHeight, sharpenKernel);
      }

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url); // Clean up original object URL
          
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"));
            return;
          }

          const resultUrl = URL.createObjectURL(blob);
          
          resolve({
            blob,
            url: resultUrl,
            width: targetWidth,
            height: targetHeight,
            size: blob.size
          });
        },
        options.format,
        options.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};