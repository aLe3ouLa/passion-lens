import cors from 'cors';
import express from 'express';

import { createMemoryRouter } from './createMemory';
import { createNarrationRouter } from './createNarration';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/create-memory', createMemoryRouter);
app.use('/api/create-narration', createNarrationRouter);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
