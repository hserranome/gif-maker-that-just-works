import { create } from 'zustand';
import { Frame, GifSettings } from '../types';

interface GifStore {
  // State
  frames: Frame[];
  settings: GifSettings;
  autoUpdate: boolean;
  isGenerating: boolean;
  progress: number;
  generatedGif: string | null;

  // Frame actions
  addFrame: (imageData: string) => void;
  updateFrame: (id: number, updates: Partial<Frame>) => void;
  removeFrame: (id: number) => void;
  reorderFrames: (newFrames: Frame[]) => void;

  // Settings actions
  updateSettings: (settings: Partial<GifSettings>) => void;
  updateGlobalDelay: (delay: number) => void;

  // UI actions
  setAutoUpdate: (enabled: boolean) => void;
  setGenerationState: (isGenerating: boolean, progress?: number) => void;
  setGeneratedGif: (url: string | null) => void;

  // Auto canvas sizing helper
  setCanvasSizeFromFirstFrame: (imageData: string) => void;
}

export const useGifStore = create<GifStore>((set, get) => ({
  // Initial state
  frames: [],
  settings: {
    width: 400,
    height: 400,
    quality: 10,
    globalDelay: 500,
    repeat: 0,
    transparencyMode: 'discord'
  },
  autoUpdate: false,
  isGenerating: false,
  progress: 0,
  generatedGif: null,

  // Frame actions
  addFrame: (imageData: string) => {
    const { frames, settings } = get();
    const newFrame: Frame = {
      id: Date.now(),
      image: imageData,
      delay: settings.globalDelay,
      useGlobalDelay: true
    };

    set({ frames: [...frames, newFrame] });

    // Auto-set canvas size for first frame
    if (frames.length === 0) {
      get().setCanvasSizeFromFirstFrame(imageData);
    }
  },

  updateFrame: (id: number, updates: Partial<Frame>) => {
    set(state => ({
      frames: state.frames.map(frame =>
        frame.id === id ? { ...frame, ...updates } : frame
      )
    }));
  },

  removeFrame: (id: number) => {
    set(state => ({
      frames: state.frames.filter(frame => frame.id !== id)
    }));
  },

  reorderFrames: (newFrames: Frame[]) => {
    set({ frames: newFrames });
  },

  // Settings actions
  updateSettings: (newSettings: Partial<GifSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  updateGlobalDelay: (delay: number) => {
    // Update settings
    set(state => ({
      settings: { ...state.settings, globalDelay: delay }
    }));

    // Update all frames that use global delay
    set(state => ({
      frames: state.frames.map(frame =>
        frame.useGlobalDelay ? { ...frame, delay } : frame
      )
    }));
  },

  // UI actions
  setAutoUpdate: (enabled: boolean) => {
    set({ autoUpdate: enabled });
  },

  setGenerationState: (isGenerating: boolean, progress = 0) => {
    set({ isGenerating, progress });
  },

  setGeneratedGif: (url: string | null) => {
    set({ generatedGif: url });
  },

  // Helper for auto canvas sizing
  setCanvasSizeFromFirstFrame: (imageData: string) => {
    const img = new Image();
    img.onload = () => {
      get().updateSettings({
        width: img.width,
        height: img.height
      });
    };
    img.src = imageData;
  }
}));