import { render, screen } from '@testing-library/react'
import ChatMessage from '../components/ChatMessage'

describe('ChatMessage 컴포넌트', () => {
  const mockMessage = {
    role: 'user',
    content: 'ETF 투자에 대해 조언해주세요'
  }

  test('사용자 메시지가 올바르게 렌더링됩니다', () => {
    render(<ChatMessage message={mockMessage} />)
    
    expect(screen.getByText('ETF 투자에 대해 조언해주세요')).toBeInTheDocument()
    expect(screen.getByText('나')).toBeInTheDocument()
  })

  test('AI 메시지가 올바르게 렌더링됩니다', () => {
    const aiMessage = {
      role: 'assistant',
      content: 'ETF 투자에 대한 조언입니다.'
    }
    
    render(<ChatMessage message={aiMessage} />)
    
    expect(screen.getByText('ETF 투자에 대한 조언입니다.')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  test('빈 메시지가 처리됩니다', () => {
    const emptyMessage = {
      role: 'user',
      content: ''
    }
    
    render(<ChatMessage message={emptyMessage} />)
    
    expect(screen.getByText('나')).toBeInTheDocument()
  })

  test('긴 메시지가 올바르게 표시됩니다', () => {
    const longMessage = {
      role: 'assistant',
      content: '이것은 매우 긴 메시지입니다. ' + '반복 '.repeat(50)
    }
    
    render(<ChatMessage message={longMessage} />)
    
    expect(screen.getByText(/이것은 매우 긴 메시지입니다/)).toBeInTheDocument()
  })
}) 