import { useState, useEffect } from 'preact/hooks';
import GIF from 'gif.js';

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
}

interface GifGeneratorProps {
	frames: Frame[];
	settings: GifSettings;
	autoUpdate?: boolean;
	onRef?: (ref: { generateGif: () => void } | null) => void;
}

export function GifGenerator({ frames, settings, autoUpdate, onRef }: GifGeneratorProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [generatedGif, setGeneratedGif] = useState<string | null>(null);

	const generateGif = async () => {
		if (frames.length === 0) return;

		console.log('Starting GIF generation with', frames.length, 'frames');
		setIsGenerating(true);
		setProgress(0);
		setGeneratedGif(null);

		try {
			const gif = new GIF({
				workers: 2,
				quality: settings.quality,
				width: settings.width,
				height: settings.height,
				repeat: settings.repeat,
				workerScript: '/gif.worker.js',
				transparent: 0x00FF00 // Bright green as transparent
			});

			// Track progress
			gif.on('progress', (p) => {
				console.log('Progress:', Math.round(p * 100) + '%');
				setProgress(Math.round(p * 100));
			});

			// Handle completion
			gif.on('finished', (blob) => {
				console.log('GIF generation finished, blob size:', blob.size);
				const url = URL.createObjectURL(blob);
				setGeneratedGif(url);
				setIsGenerating(false);
			});

			// Handle errors
			gif.on('abort', () => {
				console.error('GIF generation aborted');
				setIsGenerating(false);
			});

			// Add frames to GIF
			console.log('Adding frames to GIF...');
			for (const frame of frames) {
				const img = new Image();
				await new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = reject;
					img.src = frame.image;
				});

				// Create canvas to resize image
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				canvas.width = settings.width;
				canvas.height = settings.height;

				if (ctx) {
					// Create a temporary canvas to check for transparency
					const tempCanvas = document.createElement('canvas');
					const tempCtx = tempCanvas.getContext('2d');
					tempCanvas.width = img.width;
					tempCanvas.height = img.height;
					
					let hasTransparency = false;
					if (tempCtx) {
						tempCtx.drawImage(img, 0, 0);
						const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
						const data = imageData.data;
						
						// Check if image has transparency
						for (let i = 3; i < data.length; i += 4) {
							if (data[i] < 255) {
								hasTransparency = true;
								break;
							}
						}
					}

					// Calculate aspect ratio to fit image
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

					if (hasTransparency) {
						// For transparent images: Draw on transparent canvas, then composite with green
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						
						// Enable high quality smoothing
						ctx.imageSmoothingEnabled = true;
						ctx.imageSmoothingQuality = 'high';
						
						// Draw image first on transparent background
						ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
						
						// Create a copy of the current canvas
						const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						const data = imageData.data;
						
						// Fill transparent areas with green, but preserve edges
						for (let i = 0; i < data.length; i += 4) {
							const alpha = data[i + 3];
							if (alpha === 0) { // Only fill completely transparent pixels
								data[i] = 0;     // R = 0
								data[i + 1] = 255; // G = 255 (green)
								data[i + 2] = 0;   // B = 0
								data[i + 3] = 255; // A = 255 (opaque)
							}
							// Leave semi-transparent pixels (anti-aliased edges) unchanged
						}
						
						ctx.putImageData(imageData, 0, 0);
					} else {
						// For opaque images: use white background
						ctx.fillStyle = '#FFFFFF';
						ctx.fillRect(0, 0, canvas.width, canvas.height);
						
						// Enable high quality smoothing
						ctx.imageSmoothingEnabled = true;
						ctx.imageSmoothingQuality = 'high';
						
						ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
					}
				}

				gif.addFrame(canvas, { delay: frame.delay });
			}

			console.log('All frames added, starting render...');
			gif.render();
		} catch (error) {
			console.error('Error generating GIF:', error);
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
			const link = document.createElement('a');
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
						<p>Size: {settings.width}×{settings.height}</p>
					</div>

					<button 
						class="generate-button"
						onClick={generateGif}
						disabled={isGenerating}
					>
						{isGenerating ? `Generating... ${progress}%` : 'Generate GIF'}
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
							<button 
								class="download-button"
								onClick={downloadGif}
							>
								Download GIF
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}