import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
export const errMsg = (e) => e?.response?.data?.message || e.message;
export default api;
