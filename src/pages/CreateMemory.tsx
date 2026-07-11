import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, MapPin, Sparkles } from 'lucide-react';
import './CreateMemory.css';
import { createMemory } from '../services/createMemory';
import type { VoiceStyle } from '../types/memory';

const creationMessages = [
  'Reading the light...',
  'Finding the emotion...',
  'Writing your story...',
];

const voiceStyles: {
  value: VoiceStyle;
  label: string;
  description: string;
}[] = [
  {
    value: 'documentary',
    label: 'Documentary',
    description: 'Clear, grounded, and observant.',
  },
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Atmospheric, emotional, and immersive.',
  },
  {
    value: 'poetic',
    label: 'Poetic',
    description: 'Expressive, lyrical, and reflective.',
  },
  {
    value: 'travel-journal',
    label: 'Travel journal',
    description: 'Personal, curious, and conversational.',
  },
];

export const CreateMemoryPage = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [location, setLocation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('cinematic');
  const [isCreating, setIsCreating] = useState(false);
  const [creationMessageIndex, setCreationMessageIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCreating) {
      return;
    }

    const messageInterval = window.setInterval(() => {
      setCreationMessageIndex(
        (currentIndex) => (currentIndex + 1) % creationMessages.length,
      );
    }, 2000);

    return () => window.clearInterval(messageInterval);
  }, [isCreating]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image || !imagePreview || isCreating) {
      return;
    }

    setCreationMessageIndex(0);
    setIsCreating(true);
    setError('');

    try {
      const generatedMemory = await createMemory({
        image,
        location,
        meaning,
        voiceStyle,
      });

      navigate('/story/generated', {
        state: {
          imageUrl: imagePreview,
          location,
          meaning,
          voiceStyle,
          generatedMemory,
        },
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Your memory could not be created.',
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="create-memory-page">
      <section aria-labelledby="create-memory-title">
        <header className="create-memory-page__header">
          <p className="create-memory-page__eyebrow">Create a memory</p>

          <h1 className="create-memory-page__title">
            Start with a moment that mattered.
          </h1>

          <p className="create-memory-page__description">
            Choose a photograph, share what it means to you, and decide how your
            story should feel.
          </p>
        </header>

        <form className="create-memory-form" onSubmit={handleSubmit}>
          <section
            className="memory-form-section"
            aria-labelledby="photo-title"
          >
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
              {imagePreview ? (
                <img
                  className="upload-zone__preview"
                  src={imagePreview}
                  alt="Preview of the selected memory"
                />
              ) : (
                <span className="upload-zone__content">
                  <ImagePlus aria-hidden="true" size={36} />

                  <strong>Upload a photograph</strong>

                  <span>JPEG, PNG, or WebP</span>
                </span>
              )}

              <input
                className="upload-zone__input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
            </label>

            {image && <p className="upload-zone__filename">{image.name}</p>}
          </section>

          <section
            className="memory-form-section"
            aria-labelledby="details-title"
          >
            <header className="memory-form-section__header">
              <p className="memory-form-section__step">Step 02</p>

              <h2 id="details-title" className="memory-form-section__title">
                Share what only you remember
              </h2>

              <p className="memory-form-section__description">
                The image shows what happened. Your words explain why it
                mattered.
              </p>
            </header>

            <div className="form-field">
              <label className="form-field__label" htmlFor="location">
                <MapPin aria-hidden="true" size={18} />
                Location
              </label>

              <input
                className="form-field__control"
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Lisbon, Portugal"
              />
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="meaning">
                What does this moment mean to you?
              </label>

              <textarea
                className="form-field__control form-field__textarea"
                id="meaning"
                name="meaning"
                value={meaning}
                onChange={(event) => setMeaning(event.target.value)}
                placeholder="It was the first morning of my solo trip..."
                rows={5}
              />

              <p className="form-field__hint">
                A few honest words are enough. Passion Lens will build around
                them.
              </p>
            </div>
          </section>

          <fieldset className="memory-form-section voice-selector">
            <p className="memory-form-section__step">Step 03</p>

            <h2 id="details-title" className="memory-form-section__title">
              Choose your photographer&apos;s voice
            </h2>

            <p className="memory-form-section__description">
              How should this memory feel when it becomes a story?
            </p>

            <div className="voice-selector__options">
              {voiceStyles.map((style) => (
                <label
                  className={`voice-option ${
                    voiceStyle === style.value ? 'voice-option--selected' : ''
                  }`}
                  key={style.value}
                >
                  <input
                    className="voice-option__input"
                    type="radio"
                    name="voiceStyle"
                    value={style.value}
                    checked={voiceStyle === style.value}
                    onChange={() => setVoiceStyle(style.value)}
                  />

                  <span className="voice-option__content">
                    <strong>{style.label}</strong>
                    <span>{style.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="create-memory-form__error" role="alert">
              {error}
            </p>
          )}

          <button
            className={`create-memory-form__submit ${
              isCreating ? 'create-memory-form__submit--creating' : ''
            }`}
            type="submit"
            disabled={!image || isCreating}
            aria-busy={isCreating}
          >
            <Sparkles aria-hidden="true" size={18} />
            <span aria-live="polite">
              {isCreating
                ? creationMessages[creationMessageIndex]
                : 'Create my memory'}
            </span>
          </button>
        </form>
      </section>
    </main>
  );
};
