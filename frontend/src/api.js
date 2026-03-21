import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': '*',
  },
  timeout: 30000, // 30s timeout for AI-generated responses
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  if (apiKey) {
    config.headers['X-AI-Api-Key'] = apiKey;
  }
  return config;
});

// ─── Trip APIs ─────────────────────────────────────────
export const planTrip = (tripData) =>
  api.post('/plan-trip', tripData);

export const getTrip = (tripId) =>
  api.get(`/trip/${tripId}`);

export const getAllTrips = () =>
  api.get('/trips');

// ─── Expense APIs ──────────────────────────────────────
export const addExpense = (tripId, expense) =>
  api.post('/expenses', { trip_id: tripId, expense });

// ─── Budget APIs ───────────────────────────────────────
export const getBudgetSummary = (tripId) =>
  api.get(`/budget-summary/${tripId}`);

export const estimateBudget = (data) =>
  api.post('/estimate-budget', data);

// ─── Recommendation APIs ──────────────────────────────
export const getRuleBasedRecommendations = (data) =>
  api.post('/api/recommend-destination/rule-based', data);

// ─── Packing List APIs ────────────────────────────────
export const getAIPackingList = (destination, days, weather) =>
  api.get('/packing-list', { params: { destination, days, weather } });

export default api;
