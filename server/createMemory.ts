import { GoogleGenAI, Type } from '@google/genai';
import { Router } from 'express';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const model = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';

export const createMemoryRouter = Router();

createMemoryRouter.post(
  '/',
  upload.single('image'),
  async (request, response) => {
    try {
      if (!request.file) {
        response.status(400).json({
          error: 'A photograph is required.',
        });

        return;
      }

      if (request.file.size === 0) {
        response.status(400).json({
          error: 'The uploaded photograph is empty.',
        });

        return;
      }

      const supportedImageTypes = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
      ]);

      if (!supportedImageTypes.has(request.file.mimetype)) {
        response.status(400).json({
          error: 'The photograph must be a JPEG, PNG, or WebP image.',
        });

        return;
      }

      const location = String(request.body.location ?? '');
      const meaning = String(request.body.meaning ?? '');
      const voiceStyle = String(request.body.voiceStyle ?? 'cinematic');

      const prompt = `
You are Passion Lens, a thoughtful photography storyteller.

Analyze the photograph using only details that are visible.
Do not invent people, locations, events, relationships, or historical facts.

Never describe events, intentions, relationships,
or identities that cannot be directly observed.

If a person is visible:

Describe only what can be seen.

Do not assume:
- gender
- profession
- relationships
- emotions
- destination
- purpose

The photographer supplied this context:

Location: ${location || 'Not provided'}
Personal meaning: ${meaning || 'Not provided'}
Requested writing style: ${voiceStyle}

Create a story that feels like a personal memory rather than an image caption.

Requirements:
- The title must contain 3–8 words.
- Return exactly 3 single-word moods.
- Return 3–5 visual observations grounded in the photograph.
- The story must contain 90–130 words.
- The photographer insight must be one restrained sentence.
- Return a passion profile that offers a thoughtful glimpse of what this
  photograph may reveal about the photographer.
- The passion title must be a short theme of 2–5 words.
- The passion reflection and direction must each be one concise sentence.
- Use tentative language appropriate to a single photograph. Do not claim to
  know patterns across memories that have not been provided.
- Treat supplied emotional context as personal truth.
- Do not claim uncertain visual interpretations as facts.
`;

      const result = await ai.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              mimeType: request.file.mimetype,
              data: request.file.buffer.toString('base64'),
            },
          },
          {
            text: prompt,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
              },
              moods: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              visualDetails: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              story: {
                type: Type.STRING,
              },
              photographerInsight: {
                type: Type.STRING,
              },
              passionProfile: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                  },
                  reflection: {
                    type: Type.STRING,
                  },
                  direction: {
                    type: Type.STRING,
                  },
                },
                required: ['title', 'reflection', 'direction'],
              },
            },
            required: [
              'title',
              'moods',
              'visualDetails',
              'story',
              'photographerInsight',
              'passionProfile',
            ],
          },
        },
      });

      const text = result.text;

      if (!text) {
        throw new Error('Gemini returned an empty response.');
      }

      response.json(JSON.parse(text));
    } catch (error) {
      console.error(error);

      response.status(502).json({
        error:
          error instanceof Error
            ? `Gemini could not create the memory: ${error.message}`
            : 'Gemini could not create the memory.',
      });
    }
  },
);
