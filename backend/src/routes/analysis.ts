import { Router, type Response } from 'express';
import { supaAuth, type AuthedRequest } from '../middleware/auth';
import { supaAdmin } from '../services/supabase';
import { analyzeMixBatch, analyzePlanogramBatch, analyzePricesBatch } from '../services/ai';
import { randomUUID } from 'crypto';
export const analysisRouter = Router();
analysisRouter.post('/:auditId/trigger', supaAuth, async (req: AuthedRequest, res: Response) => {
  const auditId = req.params.auditId;
  const { data: photos, error } = await supaAdmin.from('photos').select('*').eq('audit_id', auditId);
  if (error) return res.status(500).json({ error: error.message });
  if (!photos || photos.length === 0) return res.status(400).json({ error: 'no photos' });
  const byField: Record<string, string[]> = {};
  for (const p of photos as any[]) { if (!byField[p.field]) byField[p.field] = []; byField[p.field].push(p.url as string); }
  if (byField['PRECO_INTEGRAL']) {
    const id = randomUUID();
    await supaAdmin.from('analyses').insert({ id, audit_id: auditId, type: 'PRECO', field: 'PRECO_INTEGRAL', status: 'RUNNING' });
    (async () => { try {
      const imgs = byField['PRECO_INTEGRAL']; const batches: string[][] = [];
      for (let i=0;i<imgs.length;i+=5) batches.push(imgs.slice(i,i+5));
      const lines: string[] = []; for (const b of batches) lines.push(await analyzePricesBatch(b, 'Integralmédica'));
      await supaAdmin.from('analyses').update({ status: 'DONE', result_json: { text: lines.join('\n') }, summary: 'Análise de Preços Integralmédica concluída.' }).eq('id', id);
    } catch(e:any){ await supaAdmin.from('analyses').update({ status: 'ERROR', summary: e?.message||'Erro' }).eq('id', id); } })();
  }
  const mixBuckets: Record<string, string[]> = {};
  if (byField['MIX_PRATELEIRAS']) mixBuckets['Prateleiras'] = byField['MIX_PRATELEIRAS'];
  if (byField['MIX_CHECKOUT']) mixBuckets['Checkout'] = byField['MIX_CHECKOUT'];
  if (byField['MIX_GELADEIRA']) mixBuckets['Geladeira'] = byField['MIX_GELADEIRA'];
  if (byField['MIX_PONTO_EXTRA']) mixBuckets['Pontos Extras'] = byField['MIX_PONTO_EXTRA'];
  if (Object.keys(mixBuckets).length) {
    const id = randomUUID();
    await supaAdmin.from('analyses').insert({ id, audit_id: auditId, type: 'MIX', status: 'RUNNING' });
    (async () => { try {
      const out = await analyzeMixBatch(mixBuckets);
      await supaAdmin.from('analyses').update({ status: 'DONE', result_json: { text: out }, summary: 'Análise de Mix concluída.' }).eq('id', id);
    } catch(e:any){ await supaAdmin.from('analyses').update({ status: 'ERROR', summary: e?.message||'Erro' }).eq('id', id); } })();
  }
  if (byField['PLANOGRAMA_PRATELEIRAS']) {
    const id = randomUUID();
    await supaAdmin.from('analyses').insert({ id, audit_id: auditId, type: 'PLANOGRAMA', field: 'PLANOGRAMA_PRATELEIRAS', status: 'RUNNING' });
    (async () => { try {
      const imgs = byField['PLANOGRAMA_PRATELEIRAS']; const batches: string[][] = [];
      for (let i=0;i<imgs.length;i+=5) batches.push(imgs.slice(i,i+5));
      const outs: string[] = []; for (const b of batches) outs.push(await analyzePlanogramBatch(b));
      await supaAdmin.from('analyses').update({ status: 'DONE', result_json: { text: outs.join('\n') }, summary: 'Análise de Planograma concluída.' }).eq('id', id);
    } catch(e:any){ await supaAdmin.from('analyses').update({ status: 'ERROR', summary: e?.message||'Erro' }).eq('id', id); } })();
  }
  return res.json({ status: 'queued' });
});
analysisRouter.get('/:auditId', supaAuth, async (req: AuthedRequest, res: Response) => {
  const { data, error } = await supaAdmin.from('analyses').select('*').eq('audit_id', req.params.auditId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data ?? []);
});