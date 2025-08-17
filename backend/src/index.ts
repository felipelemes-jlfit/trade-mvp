import express from 'express';
import cors from 'cors';
import { env } from './env';
import { uploadsRouter } from './routes/uploads';
import { auditsRouter } from './routes/audits';
import { pdvRouter } from './routes/pdvs';
import { analysisRouter } from './routes/analysis';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/pdvs', pdvRouter);
app.use('/audits', auditsRouter);
app.use('/uploads', uploadsRouter);
app.use('/analysis', analysisRouter);

const PORT = env.PORT || 4000;
app.listen(PORT, () => console.log(`API on :${PORT}`));