import { useImageUpload } from "../../hooks/useImageUpload";
import { SettingsGroup } from "../SettingsGroup";
import styles from "./ImageUpload.module.css";

export function ImageUpload() {
  const {
    dragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
  } = useImageUpload();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Source</h2>
      <SettingsGroup title="Image Upload">
        <div
          className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={styles.uploadContent}>
            <p>Drag and drop images here</p>
            <p>or</p>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={handleFileInput}
              id="file-input"
              className={styles.fileInput}
            />
            <label htmlFor="file-input" className={styles.fileButton}>
              Choose Files
            </label>
          </div>
        </div>
        <p className={styles.fileInfo}>Supports PNG and JPEG files</p>
      </SettingsGroup>
    </div>
  );
}
