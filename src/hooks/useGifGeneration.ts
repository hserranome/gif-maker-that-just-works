import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { useGifStore } from "../store/gifStore";

export const useGifGeneration = () => {
	const frames = useGifStore((state) => state.frames);
	const settings = useGifStore((state) => state.settings);
	const isGenerating = useGifStore((state) => state.isGenerating);
	const progress = useGifStore((state) => state.progress);
	const generatedGif = useGifStore((state) => state.generatedGif);
	const setGenerationState = useGifStore((state) => state.setGenerationState);
	const setGeneratedGif = useGifStore((state) => state.setGeneratedGif);

	const generateGif = async () => {
		if (frames.length === 0) return;

		setGenerationState(true, 0);
		setGeneratedGif(null);

		try {
			const gif = GIFEncoder();

			for (let i = 0; i < frames.length; i++) {
				const frame = frames[i];
				setGenerationState(true, (i / frames.length) * 80);

				const img = new Image();
				await new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = reject;
					img.src = frame.image;
				});

				// Create canvas
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = settings.imageSmoothingQuality;
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

			setGenerationState(true, 90);

			// Finish and get bytes
			gif.finish();
			const buffer = gif.bytes();

			console.log("GIF created, size:", buffer.length);

			// Create blob
			const blob = new Blob([buffer], { type: "image/gif" });
			const url = URL.createObjectURL(blob);
			setGeneratedGif(url);
			setGenerationState(false, 100);
		} catch (error) {
			console.error("Error generating GIF:", error);
			setGenerationState(false, 0);
		}
	};

	const downloadGif = () => {
		if (generatedGif) {
			const link = document.createElement("a");
			link.href = generatedGif;
			link.download = `animated-gif-${Date.now()}.gif`;
			link.click();
		}
	};

	return {
		generateGif,
		downloadGif,
		isGenerating,
		progress,
		generatedGif,
		framesCount: frames.length,
	};
};
