interface Frame {
	id: number;
	image: string;
	delay: number;
}

interface FrameManagerProps {
	frames: Frame[];
	onUpdateFrame: (id: number, updates: Partial<Frame>) => void;
	onRemoveFrame: (id: number) => void;
	onReorderFrames: (frames: Frame[]) => void;
}

export function FrameManager({ frames, onUpdateFrame, onRemoveFrame, onReorderFrames }: FrameManagerProps) {
	const moveFrame = (fromIndex: number, toIndex: number) => {
		const newFrames = [...frames];
		const [movedFrame] = newFrames.splice(fromIndex, 1);
		newFrames.splice(toIndex, 0, movedFrame);
		onReorderFrames(newFrames);
	};

	return (
		<div class="frame-manager">
			<h2>Frames ({frames.length})</h2>
			{frames.length === 0 ? (
				<p class="no-frames">No frames added yet</p>
			) : (
				<div class="frames-list">
					{frames.map((frame, index) => (
						<div key={frame.id} class="frame-item">
							<div class="frame-preview">
								<img src={frame.image} alt={`Frame ${index + 1}`} />
							</div>
							<div class="frame-controls">
								<div class="frame-info">
									<span>Frame {index + 1}</span>
								</div>
								<div class="delay-control">
									<label>Delay (ms):</label>
									<input
										type="number"
										value={frame.delay}
										min="50"
										max="5000"
										step="50"
										onChange={(e) => onUpdateFrame(frame.id, { delay: parseInt(e.currentTarget.value) })}
									/>
								</div>
								<div class="frame-actions">
									{index > 0 && (
										<button onClick={() => moveFrame(index, index - 1)}>
											↑
										</button>
									)}
									{index < frames.length - 1 && (
										<button onClick={() => moveFrame(index, index + 1)}>
											↓
										</button>
									)}
									<button 
										class="remove-button"
										onClick={() => onRemoveFrame(frame.id)}
									>
										×
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}