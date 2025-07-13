import { create } from 'zustand';

const useChatStore = create((set) => ({
  // 상태
  messages: [],
  isLoading: false,
  isStreaming: false,
  
  // 액션
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  
  updateLastMessage: (content) => {
    set((state) => {
      const newMessages = [...state.messages];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: content
        };
      }
      return { messages: newMessages };
    });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setStreaming: (streaming) => {
    set({ isStreaming: streaming });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  // 초기 메시지 설정
  initializeChat: () => {
    const initialMessage = {
      id: Date.now(),
      role: 'assistant',
      content: '안녕하세요! ETF 알림 챗봇입니다. 궁금한 점이나 투자 관련 질문을 입력해 주세요.',
      timestamp: new Date().toISOString()
    };
    set({ messages: [initialMessage] });
  }
}));

export default useChatStore; 