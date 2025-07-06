interface GifSettingsType {
	width: number;
	height: number;
	quality: number;
	globalDelay: number;
	repeat: number;
	transparencyMode: string;
}

interface GifSettingsProps {
	settings: GifSettingsType;
	onSettingsChange: (settings: GifSettingsType) => void;
	onGlobalDelayChange: (delay: number) => void;
}

export function GifSettings({ settings, onSettingsChange, onGlobalDelayChange }: GifSettingsProps) {
	const updateSetting = (key: keyof GifSettingsType, value: number) => {
		onSettingsChange({
			...settings,
			[key]: value
		});
	};

	const presetSizes = [
		{ label: '400x400', width: 400, height: 400 },
		{ label: '480x480', width: 480, height: 480 },
		{ label: '640x640', width: 640, height: 640 },
		{ label: '800x600', width: 800, height: 600 },
		{ label: '1024x768', width: 1024, height: 768 }
	];

	return (
		<div class="gif-settings">
			<h2>GIF Settings</h2>
			
			<div class="setting-group">
				<h3>Canvas Size</h3>
				<div class="preset-buttons">
					{presetSizes.map(preset => (
						<button
							key={preset.label}
							class={settings.width === preset.width && settings.height === preset.height ? 'active' : ''}
							onClick={() => {
								updateSetting('width', preset.width);
								updateSetting('height', preset.height);
							}}
						>
							{preset.label}
						</button>
					))}
				</div>
				<div class="custom-size">
					<div class="size-input">
						<label>Width:</label>
						<input
							type="number"
							value={settings.width}
							min="100"
							max="1920"
							onChange={(e) => updateSetting('width', parseInt(e.currentTarget.value))}
						/>
					</div>
					<div class="size-input">
						<label>Height:</label>
						<input
							type="number"
							value={settings.height}
							min="100"
							max="1080"
							onChange={(e) => updateSetting('height', parseInt(e.currentTarget.value))}
						/>
					</div>
				</div>
			</div>

			<div class="setting-group">
				<h3>Quality</h3>
				<div class="quality-control">
					<input
						type="range"
						min="1"
						max="20"
						value={settings.quality}
						onChange={(e) => updateSetting('quality', parseInt(e.currentTarget.value))}
					/>
					<span>{settings.quality} (lower = better quality)</span>
				</div>
			</div>

			<div class="setting-group">
				<h3>Global Frame Delay</h3>
				<p class="setting-description">Changes all frames using global delay</p>
				<div class="delay-control">
					<input
						type="number"
						value={settings.globalDelay}
						min="50"
						max="5000"
						step="50"
						onChange={(e) => onGlobalDelayChange(parseInt(e.currentTarget.value))}
					/>
					<span>ms</span>
				</div>
			</div>

			<div class="setting-group">
				<h3>Transparency Mode</h3>
				<p class="setting-description">Optimize for different platforms</p>
				<select
					value={settings.transparencyMode}
					onChange={(e) => onSettingsChange({...settings, transparencyMode: e.currentTarget.value})}
				>
					<option value="discord">Discord Optimized</option>
					<option value="standard">Standard Quality</option>
				</select>
			</div>

			<div class="setting-group">
				<h3>Repeat</h3>
				<select
					value={settings.repeat}
					onChange={(e) => updateSetting('repeat', parseInt(e.currentTarget.value))}
				>
					<option value={0}>Loop forever</option>
					<option value={1}>Play once</option>
					<option value={2}>Play twice</option>
					<option value={3}>Play 3 times</option>
					<option value={-1}>No repeat</option>
				</select>
			</div>
		</div>
	);
}