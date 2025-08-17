import { Router, type Response } from 'express';
import { supaAuth, type AuthedRequest } from '../middleware/auth';
import { supaAdmin } from '../services/supabase';
export const pdvRouter = Router();
pdvRouter.get('/route', supaAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const dateStr = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);
    const { data: route } = await supaAdmin.from('routes').select('id, date, user_id').eq('user_id', req.user!.id).eq('date', dateStr).maybeSingle();
    if (!route) return res.json({ stops: [] });
    const { data: stops } = await supaAdmin.from('route_stops').select('id, position, pdv:pdvs(id, name, address, lat, lng)').eq('route_id', route.id).order('position', { ascending: true });
    return res.json({ id: route.id, date: route.date, stops: stops ?? [] });
  } catch (e:any) { return res.status(500).json({ error: e?.message || 'error' }); }
});