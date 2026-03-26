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
  let apiKey = import.meta.env.VITE_AI_API_KEY;

  if (config.url === '/plan-trip' || config.url === '/modify-itinerary') {
    apiKey = import.meta.env.VITE_GROQ_API_KEY_PLAN || apiKey;
  } else if (config.url === '/estimate-budget') {
    apiKey = import.meta.env.VITE_GROQ_API_KEY_BUDGET || apiKey;
  } else if (config.url && config.url.startsWith('/packing-list')) {
    apiKey = import.meta.env.VITE_GROQ_API_KEY_PACKING || apiKey;
  }

  if (apiKey) {
    config.headers['x-openrouter-api-key'] = apiKey;
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

// ─── Itinerary Modification APIs ──────────────────────
export const modifyItinerary = (data) =>
  api.post('/modify-itinerary', data);

export default api;
