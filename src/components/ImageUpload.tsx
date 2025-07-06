import { useState } from 'preact/hooks';

interface ImageUploadProps {
	onImageAdd: (imageData: string) => void;
}

export function ImageUpload({ onImageAdd }: ImageUploadProps) {
	const [dragOver, setDragOver] = useState(false);

	const handleFiles = (files: FileList) => {
		Array.from(files).forEach(file => {
			if (file.type === 'image/png' || file.type === 'image/jpeg') {
				const reader = new FileReader();
				reader.onload = (e) => {
					onImageAdd(e.target?.result as string);
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setDragOver(false);
		if (e.dataTransfer?.files) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = () => {
		setDragOver(false);
	};

	const handleFileInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			handleFiles(target.files);
		}
	};

	return (
		<div class="image-upload">
			<h2>Add Images</h2>
			<div 
				class={`upload-area ${dragOver ? 'drag-over' : ''}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<div class="upload-content">
					<p>Drag and drop images here</p>
					<p>or</p>
					<input
						type="file"
						accept="image/png,image/jpeg"
						multiple
						onChange={handleFileInput}
						id="file-input"
					/>
					<label for="file-input" class="file-button">
						Choose Files
					</label>
				</div>
			</div>
			<p class="file-info">Supports PNG and JPEG files</p>
		</div>
	);
}