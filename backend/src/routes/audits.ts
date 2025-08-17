import { Router, type Response } from 'express';
import { supaAuth, type AuthedRequest } from '../middleware/auth';
import { supaAdmin } from '../services/supabase';
import { randomUUID } from 'crypto';
export const auditsRouter = Router();
auditsRouter.post('/start', supaAuth, async (req: AuthedRequest, res: Response) => {
  const { pdvId, lat, lng } = req.body as { pdvId?: string; lat?: number; lng?: number };
  if (!pdvId) return res.status(400).json({ error: 'missing pdvId' });
  const id = randomUUID();
  const { error } = await supaAdmin.from('audits').insert({ id, user_id: req.user!.id, pdv_id: pdvId, started_at: new Date().toISOString(), start_lat: lat ?? null, start_lng: lng ?? null, status: 'open' });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ id, pdvId });
});
auditsRouter.post('/:id/finish', supaAuth, async (req: AuthedRequest, res: Response) => {
  const { lat, lng } = req.body as { lat?: number; lng?: number };
  const { error } = await supaAdmin.from('audits').update({ ended_at: new Date().toISOString(), end_lat: lat ?? null, end_lng: lng ?? null, status: 'closed' }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
});
auditsRouter.get('/:id/photos', supaAuth, async (req: AuthedRequest, res: Response) => {
  const { data, error } = await supaAdmin.from('photos').select('*').eq('audit_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});