import { useGifGeneration } from "../../hooks/useGifGeneration";
import { useGifStore } from "../../store/gifStore";
import styles from "./GifGenerator.module.css";

export function GifGenerator() {
  const settings = useGifStore((state) => state.settings);
  const { downloadGif, isGenerating, generatedGif, framesCount, progress } =
    useGifGeneration();

  return (
    <div className={styles.container}>
      <div className={styles.generatedGif}>
        <h3>Generated GIF</h3>

        {!generatedGif && !isGenerating && (
          <p className={styles.placeholder}>
            Generate a GIF to preview it here.
          </p>
        )}

        {isGenerating && (
          <>
            <p className={styles.status}>Generating GIF...</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}

        {generatedGif && (
          <>
            <img src={generatedGif} alt="Generated GIF" />
            <button className={styles.downloadButton} onClick={downloadGif}>
              Download GIF
            </button>
            <div className={styles.generationInfo}>
              <p>{framesCount} frames ready</p>
              <p>
                Size: {settings.width}×{settings.height}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
