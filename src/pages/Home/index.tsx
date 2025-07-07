import { useGifStore } from '../../store/gifStore';
import { ImageUpload } from '../../components/ImageUpload';
import { FrameManager } from '../../components/FrameManager';
import { GifSettings } from '../../components/GifSettings';
import { GifGenerator } from '../../components/GifGenerator';
import styles from './Home.module.css';
import { useState, useEffect } from 'preact/hooks';

export function Home() {
	const autoUpdate = useGifStore(state => state.autoUpdate);
	const setAutoUpdate = useGifStore(state => state.setAutoUpdate);
	const frames = useGifStore(state => state.frames);
	
	// Mobile state management
	const [isMobile, setIsMobile] = useState(false);
	const [framesPanelExpanded, setFramesPanelExpanded] = useState(false);
	const [settingsPanelExpanded, setSettingsPanelExpanded] = useState(false);
	
	// Check if we're on mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Helper function to render expandable panel
	const renderExpandablePanel = (
		title: string,
		isExpanded: boolean,
		onToggle: () => void,
		content: any
	) => (
		<div className={styles.mobileExpandablePanel}>
			<div 
				className={styles.mobileExpandableHeader}
				onClick={onToggle}
			>
				<span className={styles.mobileExpandableTitle}>{title}</span>
				<span className={`${styles.mobileExpandableToggle} ${!isExpanded ? styles.collapsed : ''}`}>
					▼
				</span>
			</div>
			<div className={`${styles.mobileExpandableContent} ${isExpanded ? styles.expanded : ''}`}>
				<div>{content}</div>
			</div>
		</div>
	);

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
			
			{isMobile ? (
				// Mobile layout with expandable panels
				<div className={styles.mainContent}>
					<div className={styles.leftPanel}>
						<ImageUpload />
					</div>
					
					{renderExpandablePanel(
						`Frames (${frames.length})`,
						framesPanelExpanded,
						() => setFramesPanelExpanded(!framesPanelExpanded),
						<FrameManager />
					)}
					
					{renderExpandablePanel(
						"Settings",
						settingsPanelExpanded,
						() => setSettingsPanelExpanded(!settingsPanelExpanded),
						<GifSettings />
					)}
					
					{/* Fixed generate button on mobile */}
					<div className={styles.mobileFixedGenerate}>
						<GifGenerator />
					</div>
				</div>
			) : (
				// Desktop layout (unchanged)
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
			)}
		</div>
	);
}