import { useGifStore } from '../../store/gifStore';
import { ImageUpload } from '../../components/ImageUpload';
import { FrameManager } from '../../components/FrameManager';
import { GifSettings } from '../../components/GifSettings';
import { GifGenerator } from '../../components/GifGenerator';
import styles from './Home.module.css';

export function Home() {
	const autoUpdate = useGifStore(state => state.autoUpdate);
	const setAutoUpdate = useGifStore(state => state.setAutoUpdate);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>GIF Maker That Just Works</h1>
			
			<div className={styles.autoUpdateControl}>
				<label className={styles.checkboxLabel}>
					<input
						type="checkbox"
						checked={autoUpdate}
						onChange={(e) => setAutoUpdate(e.currentTarget.checked)}
					/>
					Auto-generate GIF on changes (1s delay)
				</label>
			</div>
			
			<div className={styles.mainContent}>
				<div className={styles.leftPanel}>
					<ImageUpload />
					<FrameManager />
				</div>
				
				<div className={styles.middlePanel}>
					<GifSettings />
				</div>
				
				<div className={styles.rightPanel}>
					<GifGenerator />
				</div>
			</div>
		</div>
	);
}