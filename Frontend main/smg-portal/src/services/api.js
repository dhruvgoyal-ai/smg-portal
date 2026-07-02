import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("smg_token");
      localStorage.removeItem("smg_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
};
// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  logout: () => {
    localStorage.removeItem("smg_token");
    localStorage.removeItem("smg_user");
  },
};

// ── Shipments ─────────────────────────────────────────
export const shipmentAPI = {
  getAll: (params) => api.get("/shipments", { params }),
  getById: (id) => api.get(`/shipments/${id}`),
  getTracking: (trackingNo) => api.get(`/tracking/${trackingNo}`),
  create: (data) => api.post("/shipments", data),
  update: (id, data) => api.put(`/shipments/${id}`, data),
  delete: (id) => api.delete(`/shipments/${id}`),
};

// ── Customers ─────────────────────────────────────────
export const customerAPI = {
  getAll: () => api.get("/customers"),
  update: (id, data) => api.put(`/customers/${id}`, data),
};

// ── Partners ──────────────────────────────────────────
export const partnerAPI = {
  getAll: (params) => api.get("/partners", { params }),
  getById: (id) => api.get(`/partners/${id}`),
  create: (data) => api.post("/partners", data),
  update: (id, data) => api.put(`/partners/${id}`, data),
  delete: (id) => api.delete(`/partners/${id}`),
  // Backend resolves the partner from the JWT — no id in the URL
  getAssignedShipments: () => api.get('/partners/shipments'),
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
    getAdminStats:()=>api.get("/admin/dashboard")
}
export default api;
