import { useState } from 'preact/hooks';
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
		repeat: 0
	});

	const addFrame = (imageData) => {
		setFrames(prev => [...prev, {
			id: Date.now(),
			image: imageData,
			delay: settings.globalDelay
		}]);
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

	return (
		<div class="gif-maker">
			<h1>GIF Maker That Just Works</h1>
			
			<div class="main-content">
				<div class="left-panel">
					<ImageUpload onImageAdd={addFrame} />
					<FrameManager 
						frames={frames}
						onUpdateFrame={updateFrame}
						onRemoveFrame={removeFrame}
						onReorderFrames={reorderFrames}
					/>
				</div>
				
				<div class="right-panel">
					<GifSettings 
						settings={settings}
						onSettingsChange={setSettings}
					/>
					<GifGenerator 
						frames={frames}
						settings={settings}
					/>
				</div>
			</div>
		</div>
	);
}
