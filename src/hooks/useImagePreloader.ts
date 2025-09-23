import { useState, useEffect } from 'react';

interface ImagePreloaderOptions {
  onLoad?: (src: string) => void;
  onError?: (src: string) => void;
}

export const useImagePreloader = (imageUrls: string[], options: ImagePreloaderOptions = {}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        if (loadedImages.has(url) || loadingImages.has(url) || failedImages.has(url)) {
          return Promise.resolve();
        }

        setLoadingImages(prev => new Set(prev).add(url));

        return new Promise<void>((resolve) => {
          const img = new Image();
          
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(url));
            setLoadingImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(url);
              return newSet;
            });
            options.onLoad?.(url);
            resolve();
          };

          img.onerror = () => {
            setFailedImages(prev => new Set(prev).add(url));
            setLoadingImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(url);
              return newSet;
            });
            options.onError?.(url);
            resolve();
          };

          img.src = url;
        });
      });

      await Promise.all(promises);
    };

    if (imageUrls.length > 0) {
      preloadImages();
    }
  }, [imageUrls, loadedImages, loadingImages, failedImages, options]);

  return {
    loadedImages,
    loadingImages,
    failedImages,
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageLoading: (url: string) => loadingImages.has(url),
    isImageFailed: (url: string) => failedImages.has(url),
  };
};
