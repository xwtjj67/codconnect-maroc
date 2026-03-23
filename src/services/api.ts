// ============================================
// CodConnect API Client (Self-Hosted Backend)
// ============================================

const API_URL = import.meta.env.VITE_API_URL || "/api";

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
    localStorage.removeItem("app_user");
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return !!this.token;
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
      throw new Error("غير مصرح");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "حدث خطأ");
    }

    return data;
  }

  // Upload file (multipart)
  async uploadFile(file: File, folder: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.url || null;
    } catch {
      return null;
    }
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
    whatsapp?: string;
  }) {
    // Signup does NOT return a token — user goes to pending page
    const result = await this.request<{ message: string; status: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
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

  async forgotPassword(email: string) {
    return this.request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  logout() {
    this.clearToken();
  }

  // ---- Users (Admin) ----
  async getUsers() {
    return this.request<{ users: any[] }>("/users");
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateUserPlan(userId: string, plan: string, planType: "plan" | "seller_plan") {
    return this.request(`/users/${userId}/plan`, {
      method: "PATCH",
      body: JSON.stringify({ [planType]: plan }),
    });
  }

  async updateUserCategory(userId: string, category: string) {
    return this.request(`/users/${userId}/category`, {
      method: "PATCH",
      body: JSON.stringify({ preferred_category: category }),
    });
  }

  // ---- Products ----
  async getProducts() {
    return this.request<{ products: any[] }>("/products");
  }

  async getApprovedProducts() {
    return this.request<{ products: any[] }>("/products/approved");
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

  async approveProduct(id: string, data: any) {
    return this.request(`/products/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async rejectProduct(id: string) {
    return this.request(`/products/${id}/reject`, {
      method: "PATCH",
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

  // ---- Referrals ----
  async getReferralCount() {
    return this.request<{ count: number }>("/referrals/count");
  }

  // ---- Dashboard Stats ----
  async getAdminStats() {
    return this.request<{ stats: any }>("/stats/admin");
  }

  async getAffiliateStats() {
    return this.request<{ stats: any }>("/stats/affiliate");
  }

  async getMerchantStats() {
    return this.request<{ stats: any }>("/stats/merchant");
  }

  // ---- Health ----
  async healthCheck() {
    return this.request<{ status: string }>("/health");
  }
}

export const api = new ApiClient();
export default api;
