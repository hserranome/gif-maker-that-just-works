import { useState } from 'preact/hooks';
import { useGifStore } from '../store/gifStore';

export const useImageUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const addFrame = useGifStore(state => state.addFrame);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e) => {
          addFrame(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFiles(target.files);
    }
  };

  return {
    dragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput
  };
};