import axios from 'axios';
import { getToken } from './auth';
export const API_BASE = 'https://trade-mvp-api.onrender.com';
export const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});