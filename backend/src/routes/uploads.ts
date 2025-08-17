import { Router, type Response } from 'express';
import multer from 'multer';
import { supaAuth, type AuthedRequest } from '../middleware/auth';
import { uploadBufferToStorage } from '../services/storage';
import { supaAdmin } from '../services/supabase';
import { randomUUID } from 'crypto';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
export const uploadsRouter = Router();
uploadsRouter.post('/image', supaAuth, upload.single('file'), async (req: AuthedRequest, res: Response) => {
  try {
    const { auditId, field, width, height } = (req.body as { auditId?: string; field?: string; width?: string; height?: string });
    if (!auditId || !field) return res.status(400).json({ error: 'missing auditId or field' });
    if (!req.file) return res.status(400).json({ error: 'missing file' });
    const mimetype = req.file.mimetype || 'image/jpeg';
    const ext = mimetype.split('/')[1] || 'jpg';
    const filePath = `audits/${auditId}/${field}/${randomUUID()}.${ext}`;
    const publicUrl = await uploadBufferToStorage(filePath, req.file.buffer, mimetype);
    const id = randomUUID();
    const { error } = await supaAdmin.from('photos').insert({ id, audit_id: auditId, field, url: publicUrl, width: width ? Number(width) : null, height: height ? Number(height) : null });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ id, url: publicUrl });
  } catch (e:any) { return res.status(500).json({ error: e?.message || 'upload error' }); }
});