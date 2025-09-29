import { FrameManager } from "../../components/FrameManager";
import { GifGenerationControls } from "../../components/GifGenerationControls";
import { GifGenerator } from "../../components/GifGenerator";
import { GifSettings } from "../../components/GifSettings";
import { ImageUpload } from "../../components/ImageUpload";
import styles from "./Home.module.css";

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
					<GifSettings />
					<GifGenerationControls />
				</div>

				<div className={styles.rightPanel}>
					<GifGenerator />
				</div>
			</div>
		</div>
	);
}
