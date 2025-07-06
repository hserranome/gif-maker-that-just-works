import { useEffect, useRef } from 'preact/hooks';
import { useGifStore } from '../store/gifStore';

export const useAutoGeneration = (generateGif: () => void) => {
  const frames = useGifStore(state => state.frames);
  const settings = useGifStore(state => state.settings);
  const autoUpdate = useGifStore(state => state.autoUpdate);
  const debounceRef = useRef<number | null>(null);

  const triggerAutoGeneration = () => {
    if (!autoUpdate || frames.length === 0) return;
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      generateGif();
    }, 1000);
  };

  // Auto-generate when settings or frames change
  useEffect(() => {
    triggerAutoGeneration();
  }, [settings, frames, autoUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    triggerAutoGeneration
  };
};