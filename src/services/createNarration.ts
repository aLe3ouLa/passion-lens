export const createNarration = async (text: string): Promise<Blob> => {
  const response = await fetch('/api/create-narration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error ?? 'The narration could not be generated.');
  }

  return response.blob();
};
