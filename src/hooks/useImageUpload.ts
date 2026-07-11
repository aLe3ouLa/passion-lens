import { useState, type ChangeEvent } from 'react';

const prepareImageForUpload = (file: File) =>
  new Promise<File>((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file);
    const sourceImage = new Image();

    sourceImage.onload = () => {
      URL.revokeObjectURL(sourceUrl);

      const maxDimension = 1600;
      const scale = Math.min(
        1,
        maxDimension /
          Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight),
      );
      const canvas = document.createElement('canvas');

      canvas.width = Math.round(sourceImage.naturalWidth * scale);
      canvas.height = Math.round(sourceImage.naturalHeight * scale);

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('This photograph could not be prepared for upload.'));
        return;
      }

      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error('This photograph could not be prepared for upload.'),
            );
            return;
          }

          const filename = `${file.name.replace(/\.[^.]+$/, '') || 'memory'}.jpg`;

          resolve(
            new File([blob], filename, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }),
          );
        },
        'image/jpeg',
        0.82,
      );
    };

    sourceImage.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(
        new Error(
          'This photo format is not supported by your browser. Try exporting it as a JPEG.',
        ),
      );
    };

    sourceImage.src = sourceUrl;
  });

export const useImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    try {
      setIsPreparing(true);
      setError('');

      const preparedImage = await prepareImageForUpload(selectedImage);

      setImage(preparedImage);
      setPreviewUrl(URL.createObjectURL(preparedImage));
    } catch (imageError) {
      setImage(null);
      setPreviewUrl('');
      setError(
        imageError instanceof Error
          ? imageError.message
          : 'This photograph could not be prepared for upload.',
      );
    } finally {
      setIsPreparing(false);
    }
  };

  return {
    image,
    previewUrl,
    isPreparing,
    error,
    handleChange,
  };
};
