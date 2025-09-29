import { useGifGeneration } from "../../hooks/useGifGeneration";
import { useAutoGeneration } from "../../hooks/useAutoGeneration";
import { useGifStore } from "../../store/gifStore";
import styles from "./GifGenerationControls.module.css";

export function GifGenerationControls() {
  const autoUpdate = useGifStore((state) => state.autoUpdate);
  const setAutoUpdate = useGifStore((state) => state.setAutoUpdate);
  const { generateGif, isGenerating, progress, framesCount } =
    useGifGeneration();

  // Keep auto-generation behavior tied to the generate button
  useAutoGeneration(generateGif);

  return (
    <div className={styles.container}>
      <div className={styles.generatorContent}>
        <div className={styles.autoUpdateControl}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.currentTarget.checked)}
            />
            Auto-generate
          </label>
        </div>
        <button
          className={styles.generateButton}
          onClick={generateGif}
          disabled={framesCount === 0 || isGenerating}
        >
          {isGenerating ? `Generating... ${progress}%` : "Generate GIF"}
        </button>
      </div>
    </div>
  );
}
