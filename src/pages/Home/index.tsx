import { ImageUpload } from '../../components/ImageUpload';
import { FrameManager } from '../../components/FrameManager';
import { GifSettings } from '../../components/GifSettings';
import { GifGenerator } from '../../components/GifGenerator';
import styles from './Home.module.css';

export function Home() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>GIF Maker That Just Works</h1>
			
			<div className={styles.mainContent}>
				<div className={styles.leftPanel}>
					<ImageUpload />
					<FrameManager />
				</div>
				
				<div className={styles.middlePanel}>
					<GifGenerator />
				</div>

				<div className={styles.rightPanel}>
					<GifSettings />
				</div>
			</div>
		</div>
	);
}