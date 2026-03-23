// ============================================
// CodConnect API Client (for VPS deployment)
// ============================================
// When migrating to self-hosted, replace Supabase imports
// with this API client throughout the app.
// ============================================

const API_URL = import.meta.env.VITE_API_URL || "https://codconnect.ma/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      window.location.href = "/login";
      throw new Error("غير مصرح");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "حدث خطأ");
    }

    return data;
  }

  // ---- Auth ----
  async signup(data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    password: string;
    role: string;
    username?: string;
    store_name?: string;
  }) {
    const result = await this.request<{ token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async login(identifier: string, password: string) {
    const result = await this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    this.setToken(result.token);
    return result;
  }

  async getMe() {
    return this.request<{ user: any }>("/auth/me");
  }

  async checkUsername(username: string) {
    return this.request<{ available: boolean }>(`/auth/check-username/${username}`);
  }

  logout() {
    this.clearToken();
    window.location.href = "/login";
  }

  // ---- Users ----
  async getUsers() {
    return this.request<{ users: any[] }>("/users");
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // ---- Products ----
  async getProducts() {
    return this.request<{ products: any[] }>("/products");
  }

  async getMyProducts() {
    return this.request<{ products: any[] }>("/products/mine");
  }

  async createProduct(data: any) {
    return this.request<{ product: any }>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request<{ product: any }>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async approveProduct(id: string, status: string) {
    return this.request(`/products/${id}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ approval_status: status }),
    });
  }

  async getAllProducts() {
    return this.request<{ products: any[] }>("/products/admin/all");
  }

  // ---- Orders ----
  async createOrder(data: any) {
    return this.request<{ order: any }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyOrders() {
    return this.request<{ orders: any[] }>("/orders/mine");
  }

  async getMerchantOrders() {
    return this.request<{ orders: any[] }>("/orders/merchant");
  }

  async getAllOrders() {
    return this.request<{ orders: any[] }>("/orders/admin/all");
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // ---- Training ----
  async getTrainingContent() {
    return this.request<{ content: any[] }>("/training");
  }

  async getAllTraining() {
    return this.request<{ content: any[] }>("/training/admin/all");
  }

  async createTraining(data: any) {
    return this.request<{ content: any }>("/training", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTraining(id: string, data: any) {
    return this.request<{ content: any }>(`/training/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTraining(id: string) {
    return this.request(`/training/${id}`, { method: "DELETE" });
  }

  async trackView(contentId: string) {
    return this.request(`/training/${contentId}/view`, { method: "POST" });
  }

  // ---- Services ----
  async submitServiceRequest(data: any) {
    return this.request<{ request: any }>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAllServiceRequests() {
    return this.request<{ requests: any[] }>("/services/admin/all");
  }

  async updateServiceStatus(id: string, status: string) {
    return this.request(`/services/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // ---- Distribution ----
  async distribute(data: any) {
    return this.request<{ sheet_index: number }>("/distribution/distribute", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getDistributionState() {
    return this.request<{ state: any }>("/distribution/state");
  }

  async getDistributionLogs() {
    return this.request<{ logs: any[] }>("/distribution/logs");
  }

  // ---- Health ----
  async healthCheck() {
    return this.request<{ status: string }>("/health");
  }
}

export const api = new ApiClient();
export default api;
