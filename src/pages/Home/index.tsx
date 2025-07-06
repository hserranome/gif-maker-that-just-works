import { useState, useEffect, useRef } from 'preact/hooks';
import { ImageUpload } from '../../components/ImageUpload';
import { FrameManager } from '../../components/FrameManager';
import { GifSettings } from '../../components/GifSettings';
import { GifGenerator } from '../../components/GifGenerator';
import './style.css';

export function Home() {
	const [frames, setFrames] = useState([]);
	const [settings, setSettings] = useState({
		width: 400,
		height: 400,
		quality: 10,
		globalDelay: 500,
		repeat: 0,
		transparencyMode: 'discord' // 'discord' or 'standard'
	});
	const [autoUpdate, setAutoUpdate] = useState(false);
	const debounceRef = useRef(null);
	const gifGeneratorRef = useRef(null);

	const addFrame = (imageData) => {
		setFrames(prev => {
			const newFrame = {
				id: Date.now(),
				image: imageData,
				delay: settings.globalDelay,
				useGlobalDelay: true
			};
			
			// If this is the first frame, auto-set canvas size to match image
			if (prev.length === 0) {
				const img = new Image();
				img.onload = () => {
					setSettings(currentSettings => ({
						...currentSettings,
						width: img.width,
						height: img.height
					}));
				};
				img.src = imageData;
			}
			
			return [...prev, newFrame];
		});
	};

	const updateFrame = (id, updates) => {
		setFrames(prev => prev.map(frame => 
			frame.id === id ? { ...frame, ...updates } : frame
		));
	};

	const removeFrame = (id) => {
		setFrames(prev => prev.filter(frame => frame.id !== id));
	};

	const reorderFrames = (newFrames) => {
		setFrames(newFrames);
	};

	const updateGlobalDelay = (newDelay) => {
		setSettings(prev => ({ ...prev, globalDelay: newDelay }));
		// Update all frames that are using global delay
		setFrames(prev => prev.map(frame => 
			frame.useGlobalDelay ? { ...frame, delay: newDelay } : frame
		));
	};

	const triggerAutoGeneration = () => {
		if (!autoUpdate || frames.length === 0) return;
		
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
		
		debounceRef.current = setTimeout(() => {
			if (gifGeneratorRef.current?.generateGif) {
				gifGeneratorRef.current.generateGif();
			}
		}, 1000);
	};

	const setGifGeneratorRef = (ref) => {
		gifGeneratorRef.current = ref;
	};

	// Auto-generate when settings or frames change
	useEffect(() => {
		triggerAutoGeneration();
	}, [settings, frames, autoUpdate]);

	return (
		<div class="gif-maker">
			<h1>GIF Maker That Just Works</h1>
			
			<div class="auto-update-control">
				<label class="checkbox-label">
					<input
						type="checkbox"
						checked={autoUpdate}
						onChange={(e) => setAutoUpdate(e.currentTarget.checked)}
					/>
					Auto-generate GIF on changes (1s delay)
				</label>
			</div>
			
			<div class="main-content">
				<div class="left-panel">
					<ImageUpload onImageAdd={addFrame} />
					<FrameManager 
						frames={frames}
						onUpdateFrame={updateFrame}
						onRemoveFrame={removeFrame}
						onReorderFrames={reorderFrames}
						globalDelay={settings.globalDelay}
					/>
				</div>
				
				<div class="middle-panel">
					<GifSettings 
						settings={settings}
						onSettingsChange={setSettings}
						onGlobalDelayChange={updateGlobalDelay}
					/>
				</div>
				
				<div class="right-panel">
					<GifGenerator 
						onRef={setGifGeneratorRef}
						frames={frames}
						settings={settings}
						autoUpdate={autoUpdate}
					/>
				</div>
			</div>
		</div>
	);
}
