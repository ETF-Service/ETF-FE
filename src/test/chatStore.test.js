import { describe, it, expect, vi, beforeEach } from 'vitest';
import useChatStore from '../stores/chatStore';

// Mock API service
vi.mock('../services/api', () => ({
  default: {
    sendMessage: vi.fn(),
    sendMessageStream: vi.fn()
  }
}));

describe('chatStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({
      messages: [],
      isLoading: false,
      isStreaming: false
    });
  });

  it('초기 상태가 올바르게 설정됩니다', () => {
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.isStreaming).toBe(false);
  });

  it('메시지를 추가할 수 있습니다', () => {
    const message = {
      id: 1,
      content: '테스트 메시지',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message);
    const state = useChatStore.getState();

    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(message);
  });

  it('여러 메시지를 추가할 수 있습니다', () => {
    const message1 = {
      id: 1,
      content: '첫 번째 메시지',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    const message2 = {
      id: 2,
      content: '두 번째 메시지',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message1);
    useChatStore.getState().addMessage(message2);
    const state = useChatStore.getState();

    expect(state.messages).toHaveLength(2);
    expect(state.messages[0]).toEqual(message1);
    expect(state.messages[1]).toEqual(message2);
  });

  it('마지막 메시지를 업데이트할 수 있습니다', () => {
    const message = {
      id: 1,
      content: '초기 메시지',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message);
    useChatStore.getState().updateLastMessage('업데이트된 메시지');
    const state = useChatStore.getState();

    expect(state.messages[0].content).toBe('업데이트된 메시지');
  });

  it('모든 메시지를 삭제할 수 있습니다', () => {
    const message1 = {
      id: 1,
      content: '첫 번째 메시지',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    const message2 = {
      id: 2,
      content: '두 번째 메시지',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message1);
    useChatStore.getState().addMessage(message2);
    expect(useChatStore.getState().messages).toHaveLength(2);

    useChatStore.getState().clearMessages();
    expect(useChatStore.getState().messages).toHaveLength(0);
  });

  it('로딩 상태를 설정할 수 있습니다', () => {
    expect(useChatStore.getState().isLoading).toBe(false);

    useChatStore.getState().setLoading(true);
    expect(useChatStore.getState().isLoading).toBe(true);

    useChatStore.getState().setLoading(false);
    expect(useChatStore.getState().isLoading).toBe(false);
  });

  it('스트리밍 상태를 설정할 수 있습니다', () => {
    expect(useChatStore.getState().isStreaming).toBe(false);

    useChatStore.getState().setStreaming(true);
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().setStreaming(false);
    expect(useChatStore.getState().isStreaming).toBe(false);
  });

  it('채팅 초기화가 정상적으로 작동합니다', () => {
    useChatStore.getState().initializeChat();
    const state = useChatStore.getState();

    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('assistant');
    expect(state.messages[0].content).toContain('안녕하세요! ETF 알림 챗봇입니다');
  });

  it('메시지 ID가 자동으로 생성됩니다', () => {
    const message1 = {
      id: Date.now(),
      content: '첫 번째 메시지',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    const message2 = {
      id: Date.now() + 1,
      content: '두 번째 메시지',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message1);
    useChatStore.getState().addMessage(message2);
    const state = useChatStore.getState();

    expect(state.messages[0].id).toBeDefined();
    expect(state.messages[1].id).toBeDefined();
    expect(state.messages[0].id).not.toBe(state.messages[1].id);
  });

  it('메시지 타임스탬프가 자동으로 설정됩니다', () => {
    const beforeAdd = new Date();
    const message = {
      id: Date.now(),
      content: '테스트 메시지',
      role: 'user',
      timestamp: new Date().toISOString()
    };

    useChatStore.getState().addMessage(message);
    const afterAdd = new Date();
    const state = useChatStore.getState();

    expect(state.messages[0].timestamp).toBeDefined();
    const messageTime = new Date(state.messages[0].timestamp);
    expect(messageTime.getTime()).toBeGreaterThanOrEqual(beforeAdd.getTime());
    expect(messageTime.getTime()).toBeLessThanOrEqual(afterAdd.getTime());
  });
}); 