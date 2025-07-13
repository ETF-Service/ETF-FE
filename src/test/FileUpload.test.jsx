import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../components/FileUpload';

describe('FileUpload 컴포넌트', () => {
  const mockOnFileUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('파일 업로드 컴포넌트가 렌더링됩니다', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    expect(screen.getByText(/파일을 드래그하거나 클릭하여 업로드/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, TXT, DOCX 파일 지원/i)).toBeInTheDocument();
  });

  it('지원하는 파일 형식 선택 시 onFileUpload가 호출됩니다', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it('지원하지 않는 파일 형식 선택 시 경고가 표시됩니다', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('지원하지 않는 파일 형식입니다. PDF, TXT, DOCX 파일만 업로드 가능합니다.');
    });
    
    alertSpy.mockRestore();
  });

  it('드래그 앤 드롭으로 파일을 업로드할 수 있습니다', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const dropZone = screen.getByText(/파일을 드래그하거나 클릭하여 업로드/i).closest('div');
    
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it('업로드 중 로딩 상태가 표시됩니다', async () => {
    const slowUpload = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<FileUpload onFileUpload={slowUpload} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/업로드 중.../i)).toBeInTheDocument();
    });
  });

  it('파일 업로드 실패 시 에러가 처리됩니다', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const failingUpload = vi.fn().mockRejectedValue(new Error('업로드 실패'));
    
    render(<FileUpload onFileUpload={failingUpload} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('파일 업로드에 실패했습니다.');
    });
    
    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('여러 파일을 동시에 업로드할 수 있습니다', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    
    const file1 = new File(['test content 1'], 'test1.pdf', { type: 'application/pdf' });
    const file2 = new File(['test content 2'], 'test2.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file1, file2] } });
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledTimes(2);
      expect(mockOnFileUpload).toHaveBeenCalledWith(file1);
      expect(mockOnFileUpload).toHaveBeenCalledWith(file2);
    });
  });

  it('빈 파일 배열이 전달되면 아무것도 처리하지 않습니다', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />);
    
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [] } });
    
    expect(mockOnFileUpload).not.toHaveBeenCalled();
  });
}); 