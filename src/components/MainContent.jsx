import React, { useState, useEffect, useRef } from "react";
import useAuthStore from "../stores/authStore";
import useChatStore from "../stores/chatStore";
import ChatMessage from "./ChatMessage";
import FileUpload from "./FileUpload";
import apiService from "../services/api";

const MainContent = () => {
  const [question, setQuestion] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const { logout } = useAuthStore();
  const { 
    messages, 
    isLoading, 
    isStreaming, 
    addMessage, 
    updateLastMessage, 
    setLoading, 
    setStreaming,
    initializeChat 
  } = useChatStore();

  // 컴포넌트 마운트 시 챗봇 초기화
  useEffect(() => {
    if (messages.length === 0) {
      initializeChat();
    }
  }, [initializeChat, messages.length]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => setQuestion(e.target.value);

  const handleSend = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setQuestion("");
    setLoading(true);

    try {
      // 스트리밍 응답 처리
      let assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      addMessage(assistantMessage);
      setStreaming(true);

      await apiService.sendMessageStream(question.trim(), (chunk) => {
        updateLastMessage(assistantMessage.content + chunk);
      });

      setStreaming(false);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      updateLastMessage('죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해 주세요.');
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (file) => {
    // 파일 업로드 로직 (추후 구현)
    console.log('파일 업로드:', file.name);
    setShowFileUpload(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    // 알림 설정 로직 (추후 구현)
  };

  return (
    <main className="flex-1 bg-gray-950 text-white min-h-screen flex flex-col p-6 relative">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">ETF 알림 챗봇</h1>
      <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
        onClick={handleLogout}
      >
        로그아웃
      </button>
          </div>

      {/* 파일 업로드 영역 */}
      {showFileUpload && (
        <div className="mb-4">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      )}

      {/* 챗봇 대화 영역 */}
      <div className="flex-1 bg-gray-900 rounded-lg p-6 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isStreaming={isStreaming && message.id === messages[messages.length - 1]?.id}
            />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-400">AI가 응답을 생성하고 있습니다...</span>
          </div>
        </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-3">
          {/* 알림 설정 버튼 */}
          <button
            className={`p-3 rounded-lg transition-colors ${
              isNotificationEnabled 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            onClick={toggleNotification}
            title="실시간 알림 설정"
          >
            🔔
          </button>

          {/* 파일 업로드 버튼 */}
        <button
            className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            onClick={() => setShowFileUpload(!showFileUpload)}
            title="파일 업로드"
        >
            📎
        </button>

          {/* 메시지 입력 */}
          <div className="flex-1 relative">
            <textarea
          value={question}
          onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="금융 정보에 대해 질문하세요! (Enter로 전송, Shift+Enter로 줄바꿈)"
              className="w-full p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          {/* 전송 버튼 */}
        <button
            className={`p-3 rounded-lg transition-colors ${
              question.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          onClick={handleSend}
            disabled={!question.trim() || isLoading}
            title="메시지 전송"
        >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '➤'
            )}
        </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent; 