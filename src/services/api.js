import useAuthStore from '../stores/authStore';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 기본 요청 메서드
  async request(endpoint, options = {}) {
    const authStore = useAuthStore.getState();
    const headers = {
      'Content-Type': 'application/json',
      ...authStore.getAuthHeaders(),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 인증 관련 API
  async login(username, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username, password, name, email) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, email }),
    });
  }

  async getCurrentUser() {
    return this.request('/me');
  }

  // ETF 관련 API (향후 구현)
  async getUserPortfolio() {
    return this.request('/portfolio');
  }

  async deleteAllPortfolios() {
    return this.request('/portfolio', {
      method: 'DELETE',
    });
  }

  async updateInvestmentSettings(settings) {
    try {
      // 먼저 기존 설정이 있는지 확인
      const existingSettings = await this.request('/portfolio');
      
      if (existingSettings.settings) {
        // 기존 설정이 있으면 PUT
        return this.request('/settings', {
          method: 'PUT',
          body: JSON.stringify(settings),
        });
      } else {
        // 기존 설정이 없으면 POST
        return this.request('/settings', {
          method: 'POST',
          body: JSON.stringify(settings),
        });
      }
    } catch {
      // 설정이 없으면 POST
      return this.request('/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });
    }
  }

  // 챗봇 관련 API
  async sendMessage(message) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    });
  }

  async sendMessageStream(message, onChunk) {
    const authStore = useAuthStore.getState();
    const headers = {
      'Content-Type': 'application/json',
      ...authStore.getAuthHeaders(),
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed.content || '');
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream request failed:', error);
      throw error;
    }
  }
}

export default new ApiService(); 