import OpenAI from 'openai';
import { env } from '../env';
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
export async function analyzePricesBatch(imageUrls: string[], industryLabel: string) {
  const system = `Você é um analista de trade. Leia rótulos e etiquetas...`;
  const userText = `Analise fotos do campo de preços da indústria ${industryLabel}.`;
  const content: any[] = [{ type: 'text', text: userText }];
  for (const url of imageUrls) content.push({ type: 'image_url', image_url: { url } });
  const resp = await openai.chat.completions.create({ model: env.OPENAI_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content }], temperature: 0.2 });
  return resp.choices[0]?.message?.content ?? '';
}
export async function analyzeMixBatch(imageUrlsByBucket: Record<string, string[]>) {
  const system = `Classifique o MIX considerando categorias...`;
  const buckets = Object.entries(imageUrlsByBucket).flatMap(([name, urls]) => [{ type: 'text', text: `Bucket: ${name}` }, ...urls.map(url => ({ type: 'image_url', image_url: { url } }))]);
  const resp = await openai.chat.completions.create({ model: env.OPENAI_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: buckets as any }], temperature: 0.1 });
  return resp.choices[0]?.message?.content ?? '';
}
export async function analyzePlanogramBatch(imageUrls: string[]) {
  const system = `Avalie o PLANOGRAMA...`;
  const content: any[] = [{ type: 'text', text: 'Verifique as prateleiras principais.' }];
  for (const url of imageUrls) content.push({ type: 'image_url', image_url: { url } });
  const resp = await openai.chat.completions.create({ model: env.OPENAI_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content }], temperature: 0.1 });
  return resp.choices[0]?.message?.content ?? '';
}