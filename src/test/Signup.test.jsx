import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../components/Signup';

// Mock API service
vi.mock('../services/api', () => ({
  default: {
    signup: vi.fn()
  }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Signup 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('회원가입 폼이 렌더링됩니다', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByRole('heading', { name: /회원가입/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/아이디/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/이름/i)).toBeInTheDocument();
  });

  it('사용자명 입력이 정상적으로 작동합니다', () => {
    renderWithRouter(<Signup />);
    const usernameInput = screen.getByPlaceholderText(/아이디/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });

  it('비밀번호 입력이 정상적으로 작동합니다', () => {
    renderWithRouter(<Signup />);
    const passwordInput = screen.getByPlaceholderText(/비밀번호/i);
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });
    expect(passwordInput.value).toBe('testpass123');
  });

  it('이름 입력이 정상적으로 작동합니다', () => {
    renderWithRouter(<Signup />);
    const nameInput = screen.getByPlaceholderText(/이름/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput.value).toBe('Test User');
  });

  it('회원가입 성공 시 로그인 페이지로 이동합니다', async () => {
    const mockSignup = vi.fn().mockResolvedValue({ success: true });
    const apiModule = await import('../services/api');
    apiModule.default.signup = mockSignup;
    
    renderWithRouter(<Signup />);
    
    const usernameInput = screen.getByPlaceholderText(/아이디/i);
    const passwordInput = screen.getByPlaceholderText(/비밀번호/i);
    const nameInput = screen.getByPlaceholderText(/이름/i);
    const submitButton = screen.getByRole('button', { name: /회원가입/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('testuser', 'testpass123', 'Test User');
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('회원가입 실패 시 에러 메시지가 표시됩니다', async () => {
    const mockSignup = vi.fn().mockRejectedValue(new Error('이미 존재하는 사용자명입니다'));
    const apiModule = await import('../services/api');
    apiModule.default.signup = mockSignup;
    
    renderWithRouter(<Signup />);
    
    const usernameInput = screen.getByPlaceholderText(/아이디/i);
    const passwordInput = screen.getByPlaceholderText(/비밀번호/i);
    const nameInput = screen.getByPlaceholderText(/이름/i);
    const submitButton = screen.getByRole('button', { name: /회원가입/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/이미 존재하는 사용자명입니다/i)).toBeInTheDocument();
    });
  });

  it('로그인 페이지 링크가 정상적으로 작동합니다', () => {
    renderWithRouter(<Signup />);
    const loginLink = screen.getByText(/이미 계정이 있으신가요?/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('로그인 링크 클릭 시 로그인 페이지로 이동합니다', () => {
    renderWithRouter(<Signup />);
    const loginLink = screen.getByText(/로그인/i);
    fireEvent.click(loginLink);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 