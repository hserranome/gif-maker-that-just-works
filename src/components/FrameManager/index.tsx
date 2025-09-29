import { useEffect, useState } from "react";
import { useFrameManagement } from "../../hooks/useFrameManagement";
import { SettingsGroup } from "../SettingsGroup";
import styles from "./FrameManager.module.css";

export function FrameManager() {
	const { frames, moveFrame, resetFrameDelay, setCustomDelay, removeFrame } =
		useFrameManagement();

	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [tempFrames, setTempFrames] = useState(frames);

	useEffect(() => {
		if (draggedIndex === null) {
			setTempFrames(frames);
		}
	}, [frames, draggedIndex]);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		index: number,
	) => {
		setDraggedIndex(index);
		setTempFrames(frames);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (
		e: React.DragEvent<HTMLDivElement>,
		index: number,
	) => {
		e.preventDefault();
		if (draggedIndex === null) return;

		if (index !== dragOverIndex) {
			setDragOverIndex(index);
			// Create temporary reordered array for visual feedback
			const newFrames = [...frames];
			const [movedFrame] = newFrames.splice(draggedIndex, 1);
			newFrames.splice(index, 0, movedFrame);
			setTempFrames(newFrames);
		}
	};

	const handleDragEnd = () => {
		if (
			draggedIndex !== null &&
			dragOverIndex !== null &&
			draggedIndex !== dragOverIndex
		) {
			moveFrame(draggedIndex, dragOverIndex);
		}
		setDraggedIndex(null);
		setDragOverIndex(null);
		setTempFrames(frames);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		handleDragEnd();
	};

	const currentFrames = draggedIndex !== null ? tempFrames : frames;

	return (
		<div className={styles.container}>
			<SettingsGroup title={`Frames (${frames.length})`}>
				{frames.length === 0 ? (
					<p className={styles.noFrames}>No frames added yet</p>
				) : (
					<div className={styles.framesList}>
						{currentFrames.map((frame, index) => {
							const originalIndex = frames.findIndex((f) => f.id === frame.id);
							const isDragging = draggedIndex === originalIndex;
							const isDragOver = dragOverIndex === index;

							return (
								<div
									key={frame.id}
									className={`${styles.frameItem} ${
										isDragging ? styles.dragging : ""
									} ${isDragOver ? styles.dragOver : ""}`}
									onDragOver={(e) => handleDragOver(e, index)}
									onDrop={handleDrop}
								>
									<div
										className={styles.dragHandle}
										draggable
										onDragStart={(e) => handleDragStart(e, originalIndex)}
										onDragEnd={handleDragEnd}
									>
										<div className={styles.dragHandleLines}></div>
									</div>
									<button
										type="button"
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
												<label for={`delay-${frame.id}`}>Delay (ms):</label>
												<input
													id={`delay-${frame.id}`}
													type="number"
													value={frame.delay}
													min="50"
													max="5000"
													step="50"
													disabled={frame.useGlobalDelay}
													onChange={(e) =>
														setCustomDelay(
															frame.id,
															parseInt(e.currentTarget.value, 10),
														)
													}
												/>
												<label
													for={`global-${frame.id}`}
													className={styles.delayCheckbox}
												>
													<input
														type="checkbox"
														id={`global-${frame.id}`}
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
							);
						})}
					</div>
				)}
			</SettingsGroup>
		</div>
	);
}
