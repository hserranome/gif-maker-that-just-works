export interface Frame {
  id: number;
  image: string;
  delay: number;
  useGlobalDelay: boolean;
}

export interface GifSettings {
  width: number;
  height: number;
  quality: number;
  globalDelay: number;
  repeat: number;
  transparencyMode: string;
}

export interface SizePreset {
  label: string;
  width: number;
  height: number;
}

export interface GifGenerationState {
  isGenerating: boolean;
  progress: number;
  generatedGif: string | null;
}