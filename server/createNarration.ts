import { Router } from 'express';

export const createNarrationRouter = Router();

type NarrationRequestBody = {
  text?: unknown;
};

const getErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return 'An unknown error occurred.';
  }

  if (error.cause instanceof Error) {
    return `${error.message}: ${error.cause.message}`;
  }

  return error.message;
};

const getElevenLabsError = (details: string) => {
  try {
    const result = JSON.parse(details) as {
      detail?: string | { message?: string };
    };

    if (typeof result.detail === 'string') {
      return result.detail;
    }

    if (result.detail?.message) {
      return result.detail.message;
    }
  } catch {
    // ElevenLabs occasionally returns plain text instead of JSON.
  }

  return details || 'ElevenLabs rejected the narration request.';
};

createNarrationRouter.post('/', async (request, response) => {
  try {
    const { text } = request.body as NarrationRequestBody;

    if (typeof text !== 'string' || text.trim().length === 0) {
      response.status(400).json({
        error: 'Story text is required.',
      });

      return;
    }

    if (text.length > 5_000) {
      response.status(400).json({
        error: 'Story text is too long.',
      });

      return;
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey) {
      response.status(503).json({
        error: 'ELEVENLABS_API_KEY is not configured on the server.',
      });

      return;
    }

    if (!voiceId) {
      response.status(503).json({
        error: 'ELEVENLABS_VOICE_ID is not configured on the server.',
      });

      return;
    }

    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!elevenLabsResponse.ok) {
      const details = await elevenLabsResponse.text();

      console.error('ElevenLabs error:', {
        status: elevenLabsResponse.status,
        details,
      });

      response.status(502).json({
        error: `ElevenLabs could not generate the narration: ${getElevenLabsError(details)}`,
      });

      return;
    }

    const audioBuffer = Buffer.from(await elevenLabsResponse.arrayBuffer());

    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader(
      'Content-Disposition',
      'inline; filename="passion-lens-memory.mp3"',
    );
    response.setHeader('Cache-Control', 'private, max-age=3600');

    response.send(audioBuffer);
  } catch (error) {
    const message = getErrorMessage(error);

    console.error('Narration generation failed:', error);

    response.status(500).json({
      error: `The narration request failed: ${message}`,
    });
  }
});
