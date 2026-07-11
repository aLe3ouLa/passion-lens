import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import { createMemoryRouter } from './createMemory';
import { createNarrationRouter } from './createNarration';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json());

app.use('/api/create-memory', createMemoryRouter);
app.use('/api/create-narration', createNarrationRouter);

app.listen(port, () => {
  console.log(`Passion Lens server running on port ${port}`);
});
