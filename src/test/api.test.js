import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiService from '../services/api';

// Mock fetch
const { global } = globalThis;
global.fetch = vi.fn();

// Mock authStore
vi.mock('../stores/authStore', () => ({
  default: {
    getState: () => ({
      getAuthHeaders: () => ({})
    })
  }
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 설정', () => {
    it('API 서비스가 올바르게 초기화됩니다', () => {
      expect(apiService.baseURL).toBe('http://localhost:8000');
    });
  });

  describe('기본 설정', () => {
    it('API 서비스가 올바르게 초기화됩니다', () => {
      expect(apiService.baseURL).toBe('http://localhost:8000');
    });
  });

  describe('로그인', () => {
    it('로그인이 성공적으로 처리됩니다', async () => {
      const mockResponse = {
        message: '로그인 성공',
        access_token: 'test-token',
        name: 'Test User'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.login('testuser', 'testpass');

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass'
        })
      });

      expect(result).toEqual(mockResponse);
    });

    it('로그인 실패 시 에러가 발생합니다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: '아이디 또는 비밀번호가 올바르지 않습니다.' })
      });

      await expect(apiService.login('wronguser', 'wrongpass')).rejects.toThrow('아이디 또는 비밀번호가 올바르지 않습니다.');
    });
  });

  describe('회원가입', () => {
    it('회원가입이 성공적으로 처리됩니다', async () => {
      const mockResponse = {
        message: '회원가입 성공'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.signup('newuser', 'newpass123', 'New User');

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'newuser',
          password: 'newpass123',
          name: 'New User'
        })
      });

      expect(result).toEqual(mockResponse);
    });

    it('회원가입 실패 시 에러가 발생합니다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: '이미 존재하는 아이디입니다.' })
      });

      await expect(apiService.signup('existinguser', 'pass123', 'User')).rejects.toThrow('이미 존재하는 아이디입니다.');
    });
  });

  describe('사용자 정보 조회', () => {
    it('사용자 정보를 성공적으로 가져옵니다', async () => {
      const mockResponse = {
        username: 'testuser',
        name: 'Test User'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.getCurrentUser();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/me', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockResponse);
    });

    it('인증되지 않은 사용자는 에러가 발생합니다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Not authenticated' })
      });

      await expect(apiService.getCurrentUser()).rejects.toThrow('Not authenticated');
    });
  });

  describe('포트폴리오 관리', () => {
    it('포트폴리오를 성공적으로 가져옵니다', async () => {
      const mockResponse = {
        portfolios: [],
        settings: null
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.getUserPortfolio();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/portfolio', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockResponse);
    });

    it('모든 포트폴리오를 삭제합니다', async () => {
      const mockResponse = {
        message: '모든 포트폴리오가 삭제되었습니다.'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.deleteAllPortfolios();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/portfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('투자 설정 관리', () => {
    it('투자 설정을 업데이트합니다', async () => {
      const mockResponse = {
        id: 1,
        risk_level: 7,
        api_key: 'test-key',
        model_type: 'gpt-4o'
      };

      // 첫 번째 호출: 포트폴리오 조회 (설정이 없는 경우)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ portfolios: [], settings: null })
      });

      // 두 번째 호출: 설정 생성
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const settings = {
        risk_level: 7,
        api_key: 'test-key',
        model_type: 'gpt-4o'
      };

      const result = await apiService.updateInvestmentSettings(settings);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('채팅 관련 API', () => {
    it('메시지를 성공적으로 전송합니다', async () => {
      const mockResponse = {
        content: 'AI 응답 메시지'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.sendMessage('사용자 메시지');

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: '사용자 메시지' })
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('에러 처리', () => {
    it('API 에러 처리', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: '서버 오류가 발생했습니다.' })
      });

      await expect(apiService.login('testuser', 'testpass')).rejects.toThrow('서버 오류가 발생했습니다.');
    });

    it('네트워크 에러 처리', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.login('testuser', 'testpass')).rejects.toThrow('Network error');
    });
  });
}); 