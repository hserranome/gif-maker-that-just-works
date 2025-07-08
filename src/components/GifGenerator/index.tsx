import { useGifGeneration } from '../../hooks/useGifGeneration';
import { useAutoGeneration } from '../../hooks/useAutoGeneration';
import { useGifStore } from '../../store/gifStore';
import styles from './GifGenerator.module.css';

export function GifGenerator() {
	const settings = useGifStore(state => state.settings);
	const autoUpdate = useGifStore(state => state.autoUpdate);
	const setAutoUpdate = useGifStore(state => state.setAutoUpdate);
	const {
		generateGif,
		downloadGif,
		isGenerating,
		progress,
		generatedGif,
		framesCount
	} = useGifGeneration();

	// Enable auto-generation
	useAutoGeneration(generateGif);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Generate GIF</h2>
			
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

			{framesCount === 0 ? (
				<p className={styles.noFrames}>Add some frames to generate a GIF</p>
			) : (
				<div className={styles.generatorContent}>
					<div className={styles.generationInfo}>
						<p>{framesCount} frames ready</p>
						<p>
							Size: {settings.width}×{settings.height}
						</p>
					</div>

					<button
						className={styles.generateButton}
						onClick={generateGif}
						disabled={isGenerating}
					>
						{isGenerating ? `Generating... ${progress}%` : "Generate GIF"}
					</button>

					{isGenerating && (
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{ width: `${progress}%` }}
							></div>
						</div>
					)}

					{generatedGif && (
						<div className={styles.generatedGif}>
							<h3>Generated GIF</h3>
							<img src={generatedGif} alt="Generated GIF" />
							<button className={styles.downloadButton} onClick={downloadGif}>
								Download GIF
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}