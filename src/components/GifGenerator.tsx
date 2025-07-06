import { useState, useEffect } from "preact/hooks";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

interface Frame {
  id: number;
  image: string;
  delay: number;
  useGlobalDelay: boolean;
}

interface GifSettings {
  width: number;
  height: number;
  quality: number;
  globalDelay: number;
  repeat: number;
  transparencyMode: string;
}

interface GifGeneratorProps {
  frames: Frame[];
  settings: GifSettings;
  autoUpdate?: boolean;
  onRef?: (ref: { generateGif: () => void } | null) => void;
}

export function GifGenerator({
  frames,
  settings,
  autoUpdate,
  onRef,
}: GifGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);

  const generateGif = async () => {
    if (frames.length === 0) return;

    console.log(
      "Starting minimal GIF generation with",
      frames.length,
      "frames"
    );
    setIsGenerating(true);
    setProgress(0);
    setGeneratedGif(null);

    try {
      // Create GIF encoder
      const gif = GIFEncoder();

      // Process each frame
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        setProgress((i / frames.length) * 80);

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = frame.image;
        });

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        canvas.width = settings.width;
        canvas.height = settings.height;

        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        const canvasAspectRatio = canvas.width / canvas.height;

        let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

        if (aspectRatio > canvasAspectRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }

        // Draw image
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        // Get image data and manually replace transparent pixels with magenta
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha === 0) {
            // Replace transparent pixels with magenta
            data[i] = 255; // R
            data[i + 1] = 0; // G
            data[i + 2] = 255; // B
            data[i + 3] = 255; // A
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Quantize without alpha processing to preserve all colors
        const palette = quantize(imageData.data, 256, {
          format: "rgb444",
        });

        // Apply palette
        const indices = applyPalette(imageData.data, palette, "rgb");

        // Find magenta index in palette for transparency
        let transparentIndex = -1;
        for (let i = 0; i < palette.length; i++) {
          const [r, g, b] = palette[i];
          if (r === 255 && g === 0 && b === 255) {
            transparentIndex = i;
            break;
          }
        }

        // Write frame
        gif.writeFrame(indices, settings.width, settings.height, {
          palette,
          delay: frame.delay,
          transparent: transparentIndex >= 0,
          transparentIndex:
            transparentIndex >= 0 ? transparentIndex : undefined,
        });
      }

      setProgress(90);

      // Finish and get bytes
      gif.finish();
      const buffer = gif.bytes();

      console.log("GIF created, size:", buffer.length);

      // Create blob
      const blob = new Blob([buffer], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      setGeneratedGif(url);
      setIsGenerating(false);
      setProgress(100);
    } catch (error) {
      console.error("Error generating GIF:", error);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (onRef) {
      onRef({ generateGif });
    }
    return () => {
      if (onRef) {
        onRef(null);
      }
    };
  }, [onRef]);

  const downloadGif = () => {
    if (generatedGif) {
      const link = document.createElement("a");
      link.href = generatedGif;
      link.download = `animated-gif-${Date.now()}.gif`;
      link.click();
    }
  };

  return (
    <div class="gif-generator">
      <h2>Generate GIF</h2>

      {frames.length === 0 ? (
        <p class="no-frames">Add some frames to generate a GIF</p>
      ) : (
        <div class="generator-content">
          <div class="generation-info">
            <p>{frames.length} frames ready</p>
            <p>
              Size: {settings.width}×{settings.height}
            </p>
          </div>

          <button
            class="generate-button"
            onClick={generateGif}
            disabled={isGenerating}
          >
            {isGenerating ? `Generating... ${progress}%` : "Generate GIF"}
          </button>

          {isGenerating && (
            <div class="progress-bar">
              <div
                class="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {generatedGif && (
            <div class="generated-gif">
              <h3>Generated GIF</h3>
              <img src={generatedGif} alt="Generated GIF" />
              <button class="download-button" onClick={downloadGif}>
                Download GIF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
