import { useGifStore } from "../../store/gifStore";
import { SizePreset } from "../../types";
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
    value: number | string
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

      <div className={styles.settingGroup}>
        <h3>Canvas Size</h3>
        <div className={styles.presetButtons}>
          {presetSizes.map((preset) => (
            <button
              key={preset.label}
              className={
                settings.width === preset.width &&
                settings.height === preset.height
                  ? styles.active
                  : ""
              }
              onClick={() => setPresetSize(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className={styles.customSize}>
          <div className={styles.sizeInput}>
            <label>Width:</label>
            <input
              type="number"
              value={settings.width}
              min="100"
              max="1920"
              onChange={(e) =>
                updateSetting("width", parseInt(e.currentTarget.value))
              }
            />
          </div>
          <div className={styles.sizeInput}>
            <label>Height:</label>
            <input
              type="number"
              value={settings.height}
              min="100"
              max="1080"
              onChange={(e) =>
                updateSetting("height", parseInt(e.currentTarget.value))
              }
            />
          </div>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Image Smoothing Quality</h3>
        <div className={styles.qualityControl}>
          <select
            value={settings.imageSmoothingQuality}
            onChange={(e) =>
              updateSetting(
                "imageSmoothingQuality",
                e.currentTarget.value as ImageSmoothingQuality
              )
            }
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Global Frame Delay</h3>
        <p className={styles.settingDescription}>
          Changes all frames using global delay
        </p>
        <div className={styles.delayControl}>
          <input
            type="number"
            value={settings.globalDelay}
            min="50"
            max="5000"
            step="50"
            onChange={(e) => updateGlobalDelay(parseInt(e.currentTarget.value))}
          />
          <span>ms</span>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Repeat</h3>
        <select
          value={settings.repeat}
          onChange={(e) =>
            updateSetting("repeat", parseInt(e.currentTarget.value))
          }
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
