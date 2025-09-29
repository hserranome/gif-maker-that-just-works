import { useGifStore } from "../../store/gifStore";
import type { SizePreset } from "../../types";
import { SettingsGroup } from "../SettingsGroup";
import styles from "./GifSettings.module.css";

const presetSizes: SizePreset[] = [
	{ label: "28x28", width: 28, height: 28 },
	{ label: "56x56", width: 56, height: 56 },
	{ label: "112x112", width: 112, height: 112 },
	{ label: "500x500", width: 500, height: 500 },
];

export function GifSettings() {
	const settings = useGifStore((state) => state.settings);
	const updateSettings = useGifStore((state) => state.updateSettings);
	const updateGlobalDelay = useGifStore((state) => state.updateGlobalDelay);

	const updateSetting = (
		key: keyof typeof settings,
		value: number | string,
	) => {
		updateSettings({ [key]: value });
	};

	const setPresetSize = (preset: SizePreset) => {
		updateSettings({
			width: preset.width,
			height: preset.height,
		});
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>GIF Settings</h2>

			<SettingsGroup title="Canvas Size">
				<div className={styles.presetButtons}>
					{presetSizes.map((preset) => (
						<button
							type="button"
							key={preset.label}
							className={[
								styles.presetButton,
								settings.width === preset.width &&
								settings.height === preset.height
									? styles.presetButtonActive
									: "",
							]
								.filter(Boolean)
								.join(" ")}
							onClick={() => setPresetSize(preset)}
						>
							{preset.label}
						</button>
					))}
				</div>
				<div className={styles.customSize}>
					<div className={styles.sizeInput}>
						<label for="width">Width:</label>
						<input
							id="width"
							type="number"
							value={settings.width}
							min="100"
							max="1920"
							onChange={(e) =>
								updateSetting("width", parseInt(e.currentTarget.value, 10))
							}
						/>
					</div>
					<div className={styles.sizeInput}>
						<label for="height">Height:</label>
						<input
							id="height"
							type="number"
							value={settings.height}
							min="100"
							max="1080"
							onChange={(e) =>
								updateSetting("height", parseInt(e.currentTarget.value, 10))
							}
						/>
					</div>
				</div>
			</SettingsGroup>

			<SettingsGroup title="Image Smoothing Quality">
				<div className={styles.qualityControl}>
					<select
						className={styles.select}
						value={settings.imageSmoothingQuality}
						onChange={(e) =>
							updateSetting(
								"imageSmoothingQuality",
								e.currentTarget.value as ImageSmoothingQuality,
							)
						}
					>
						<option value="high">High</option>
						<option value="medium">Medium</option>
						<option value="low">Low</option>
					</select>
				</div>
			</SettingsGroup>

			<SettingsGroup title="Global Frame Delay">
				<div className={styles.delayControl}>
					<input
						type="number"
						value={settings.globalDelay}
						min="50"
						max="5000"
						step="50"
						onChange={(e) =>
							updateGlobalDelay(parseInt(e.currentTarget.value, 10))
						}
					/>
					<span>ms</span>
				</div>
			</SettingsGroup>
		</div>
	);
}
