import React, { useState, useEffect } from 'react';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  showLoadingState?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  draggable = false,
  onLoad,
  onError,
  placeholder,
  showLoadingState = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setIsLoading(true);

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };

    img.src = src;
  }, [src, onLoad, onError]);

  // 默认占位符
  const defaultPlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Yqg6L295aSx6LSlPC90ZXh0Pgo8L3N2Zz4K";

  if (hasError) {
    return (
      <img
        src={placeholder || defaultPlaceholder}
        alt={alt}
        className={`${className} image-error`}
        style={{
          ...style,
          opacity: 0.7,
        }}
        draggable={draggable}
      />
    );
  }

  return (
    <div className="optimized-image-container" style={style}>
      {/* 加载状态 */}
      {isLoading && showLoadingState && (
        <div 
          className="image-loading-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#999',
            zIndex: 1,
          }}
        >
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #ddd',
            borderTop: '2px solid #999',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
      
      {/* 实际图片 */}
      <img
        src={src}
        alt={alt}
        className={`${className} optimized-image`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        draggable={draggable}
      />
    </div>
  );
};

export default OptimizedImage;
