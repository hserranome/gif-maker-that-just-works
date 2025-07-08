import { useFrameManagement } from '../../hooks/useFrameManagement';
import styles from './FrameManager.module.css';

export function FrameManager() {
	const {
		frames,
		globalDelay,
		resetFrameDelay,
		setCustomDelay,
		removeFrame
	} = useFrameManagement();

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Frames ({frames.length})</h2>
			{frames.length === 0 ? (
				<p className={styles.noFrames}>No frames added yet</p>
			) : (
				<div className={styles.framesList}>
					{frames.map((frame, index) => (
						<div key={frame.id} className={styles.frameItem}>
							<button 
								className={styles.removeButton}
								onClick={() => removeFrame(frame.id)}
								aria-label={`Remove frame ${index + 1}`}
							>
								×
							</button>
							<div className={styles.framePreview}>
								<img src={frame.image} alt={`Frame ${index + 1}`} />
							</div>
							<div className={styles.frameControls}>
								<div className={styles.frameInfo}>
									<span>#{index + 1}</span>
								</div>
								<div className={styles.delayControl}>
									<div className={styles.delayInputGroup}>
										<label>Delay (ms):</label>
										<input
											type="number"
											value={frame.delay}
											min="50"
											max="5000"
											step="50"
											disabled={frame.useGlobalDelay}
											onChange={(e) => setCustomDelay(frame.id, parseInt(e.currentTarget.value))}
										/>
										<label className={styles.delayCheckbox}>
											<input
												type="checkbox"
												checked={frame.useGlobalDelay}
												onChange={(e) => {
													if (e.currentTarget.checked) {
														resetFrameDelay(frame.id);
													} else {
														setCustomDelay(frame.id, frame.delay);
													}
												}}
											/>
											Global
										</label>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}