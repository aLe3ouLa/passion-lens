import type { GeneratedMemory } from '../types/memory';

type CreateMemoryInput = {
  image: File;
  location: string;
  meaning: string;
  voiceStyle: string;
};

export const createMemory = async ({
  image,
  location,
  meaning,
  voiceStyle,
}: CreateMemoryInput): Promise<GeneratedMemory> => {
  const formData = new FormData();

  formData.append('image', image);
  formData.append('location', location);
  formData.append('meaning', meaning);
  formData.append('voiceStyle', voiceStyle);

  const response = await fetch('/api/create-memory', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error ?? 'Your memory could not be created.');
  }

  return response.json() as Promise<GeneratedMemory>;
};
