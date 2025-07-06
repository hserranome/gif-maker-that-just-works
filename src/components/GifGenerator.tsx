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
				workerScript: '/gif.worker.js'
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
					// Clear canvas with transparent background to preserve PNG transparency
					ctx.clearRect(0, 0, canvas.width, canvas.height);

					// Calculate aspect ratio to fit image
					const aspectRatio = img.width / img.height;
					const canvasAspectRatio = canvas.width / canvas.height;

					let drawWidth, drawHeight, drawX, drawY;

					if (aspectRatio > canvasAspectRatio) {
						// Image is wider than canvas
						drawWidth = canvas.width;
						drawHeight = canvas.width / aspectRatio;
						drawX = 0;
						drawY = (canvas.height - drawHeight) / 2;
					} else {
						// Image is taller than canvas
						drawHeight = canvas.height;
						drawWidth = canvas.height * aspectRatio;
						drawX = (canvas.width - drawWidth) / 2;
						drawY = 0;
					}

					ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
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