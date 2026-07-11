import { jsPDF } from 'jspdf';

import type { GeneratedMemory } from '../types/memory';

type DownloadMemoryPdfInput = {
  imageUrl: string;
  location: string;
  memory: GeneratedMemory;
};

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The photograph could not be added to the PDF.'));
    image.src = source;
  });

const createImageData = async (source: string) => {
  const image = await loadImage(source);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');

  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('The photograph could not be prepared for download.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return {
    data: canvas.toDataURL('image/jpeg', 0.88),
    ratio: canvas.width / canvas.height,
  };
};

export const downloadMemoryPdf = async ({
  imageUrl,
  location,
  memory,
}: DownloadMemoryPdfInput) => {
  const document = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const image = await createImageData(imageUrl);
  const imageHeight = Math.min(92, contentWidth / image.ratio);
  let y = margin;

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - margin) {
      return;
    }

    document.addPage();
    y = margin;
  };

  const addHeading = (text: string) => {
    ensureSpace(16);
    document.setFont('helvetica', 'bold');
    document.setFontSize(9);
  document.setTextColor(224, 76, 56);
    document.text(text.toUpperCase(), margin, y);
    y += 8;
  };

  const addBody = (text: string, fontSize = 11) => {
    document.setFont('helvetica', 'normal');
    document.setFontSize(fontSize);
    document.setTextColor(55, 50, 47);
    const lines = document.splitTextToSize(text, contentWidth) as string[];
    const height = lines.length * fontSize * 0.48;
    ensureSpace(height);
    document.text(lines, margin, y, { lineHeightFactor: 1.55 });
    y += height + 8;
  };

  document.setFillColor(16, 13, 24);
  document.rect(0, 0, pageWidth, pageHeight, 'F');
  document.addImage(image.data, 'JPEG', margin, y, contentWidth, imageHeight);
  y += imageHeight + 12;

  document.setFont('helvetica', 'normal');
  document.setFontSize(9);
  document.setTextColor(255, 122, 77);
  document.text('PASSION LENS', margin, y);
  y += 9;

  document.setFont('times', 'normal');
  document.setFontSize(26);
  document.setTextColor(255, 247, 242);
  const titleLines = document.splitTextToSize(memory.title, contentWidth) as string[];
  document.text(titleLines, margin, y, { lineHeightFactor: 1.05 });
  y += titleLines.length * 11 + 5;

  document.setFont('helvetica', 'normal');
  document.setFontSize(10);
  document.setTextColor(180, 173, 165);
  document.text(
    [location || 'Location not provided', memory.moods.join('  ·  ')],
    margin,
    y,
    { lineHeightFactor: 1.6 },
  );

  document.addPage();
  y = margin;
  addHeading('The story behind the moment');
  addBody(memory.story, 12);
  addHeading('Moods');
  addBody(memory.moods.join('  ·  '));
  addHeading('Composition Notes');
  addBody(memory.photographerInsight);

  if (memory.passionProfile) {
    addHeading('What this photograph reveals about you');
    addBody(
      `${memory.passionProfile.title}\n\n${memory.passionProfile.reflection}\n\n${memory.passionProfile.direction}`,
    );
  }

  const filename =
    memory.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'memory';

  document.save(`${filename}-passion-lens.pdf`);
};
