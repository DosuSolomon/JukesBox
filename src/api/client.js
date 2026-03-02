const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.42.97:3001';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Entity methods
  async list(entity, sort = '') {
    const params = new URLSearchParams();
    if (sort) params.append('sort', sort);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/entities/${entity}${query}`);
  }

  async filter(entity, filters = {}, sort = '') {
    const params = new URLSearchParams();
    if (Object.keys(filters).length > 0) {
      params.append('filter', JSON.stringify(filters));
    }
    if (sort) params.append('sort', sort);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/entities/${entity}${query}`);
  }

  async get(entity, id) {
    return this.request(`/api/entities/${entity}/${id}`);
  }

  async create(entity, data) {
    return this.request(`/api/entities/${entity}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(entity, id, data) {
    return this.request(`/api/entities/${entity}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(entity, id) {
    return this.request(`/api/entities/${entity}/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth methods
  async login(email, password) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async register(email, password, name) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Logging
  async logUserActivity(pageName) {
    try {
      await this.request('/api/logs/user-activity', {
        method: 'POST',
        body: JSON.stringify({ action: pageName }),
      });
    } catch (e) {
      // Silently fail - logging shouldn't break the app
    }
  }
}

export const api = new ApiClient();
export default api;
