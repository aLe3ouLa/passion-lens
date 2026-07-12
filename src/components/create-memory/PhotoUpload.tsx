import { ImagePlus } from 'lucide-react';
import type { ChangeEventHandler } from 'react';

import './PhotoUpload.css';

type PhotoUploadProps = {
  image: File | null;
  previewUrl: string;
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const PhotoUpload = ({
  image,
  previewUrl,
  disabled,
  onChange,
}: PhotoUploadProps) => (
  <section className="memory-form-section" aria-labelledby="photo-title">
    <header className="memory-form-section__header">
      <p className="memory-form-section__step">Step 01</p>
      <h2 id="photo-title" className="memory-form-section__title">
        Choose your photograph
      </h2>
      <p className="memory-form-section__description">
        Select an image that carries a memory, emotion, or story.
      </p>
    </header>

    <label className="upload-zone">
      {previewUrl ? (
        <img
          className="upload-zone__preview"
          src={previewUrl}
          alt="Preview of the selected memory"
        />
      ) : (
        <span className="upload-zone__content">
          <ImagePlus aria-hidden="true" size={36} />
          <strong>Upload a photograph</strong>
          <span>JPEG, PNG, WebP, HEIC, or HEIF</span>
        </span>
      )}

      <input
        className="upload-zone__input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={onChange}
        disabled={disabled}
      />
    </label>

    {image && <p className="upload-zone__filename">{image.name}</p>}

    <p className="upload-zone__privacy">
      Passion Lens doesn’t save your photo; it is temporarily processed by
      Google Gemini to create your memory. Please don’t upload sensitive images.
    </p>
  </section>
);
