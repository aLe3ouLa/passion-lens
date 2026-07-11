import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { GenerationControls } from '../components/create-memory/GenerationControls';
import { CreateMemoryHero } from '../components/create-memory/Hero';
import { MemoryDetails } from '../components/create-memory/MemoryDetails';
import { PhotoUpload } from '../components/create-memory/PhotoUpload';
import { VoiceSelector } from '../components/create-memory/VoiceSelector';
import { useImageUpload } from '../hooks/useImageUpload';
import { createMemory } from '../services/createMemory';
import type { VoiceStyle } from '../types/memory';
import './CreateMemory.css';

const creationMessages = [
  'Reading the light...',
  'Finding the emotion...',
  'Writing your story...',
];

export const CreateMemoryPage = () => {
  const navigate = useNavigate();
  const imageUpload = useImageUpload();

  const [location, setLocation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('cinematic');
  const [isCreating, setIsCreating] = useState(false);
  const [creationMessageIndex, setCreationMessageIndex] = useState(0);
  const [requestError, setRequestError] = useState('');

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !imageUpload.image ||
      !imageUpload.previewUrl ||
      imageUpload.isPreparing ||
      isCreating
    ) {
      return;
    }

    setCreationMessageIndex(0);
    setIsCreating(true);
    setRequestError('');

    try {
      const generatedMemory = await createMemory({
        image: imageUpload.image,
        location,
        meaning,
        voiceStyle,
      });

      navigate('/story/generated', {
        state: {
          imageUrl: imageUpload.previewUrl,
          location,
          meaning,
          voiceStyle,
          generatedMemory,
        },
      });
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Your memory could not be created.',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const isBusy = imageUpload.isPreparing || isCreating;
  const creationMessage = isCreating
    ? creationMessages[creationMessageIndex]
    : 'Create my memory';

  return (
    <main className="create-memory-page">
      <section aria-labelledby="create-memory-title">
        <CreateMemoryHero />

        <form className="create-memory-form" onSubmit={handleSubmit}>
          <PhotoUpload
            image={imageUpload.image}
            previewUrl={imageUpload.previewUrl}
            disabled={isBusy}
            onChange={imageUpload.handleChange}
          />

          <MemoryDetails
            location={location}
            meaning={meaning}
            onLocationChange={setLocation}
            onMeaningChange={setMeaning}
          />

          <VoiceSelector value={voiceStyle} onChange={setVoiceStyle} />

          <GenerationControls
            disabled={!imageUpload.image || isBusy}
            isPreparing={imageUpload.isPreparing}
            isCreating={isCreating}
            message={creationMessage}
            error={imageUpload.error || requestError}
          />
        </form>
      </section>
    </main>
  );
};
