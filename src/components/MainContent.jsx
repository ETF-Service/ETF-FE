import React, { useState } from "react";

const MainContent = () => {
  const [question, setQuestion] = useState("");

  const handleInputChange = (e) => setQuestion(e.target.value);
  const handleSend = () => {
    // 질문 전송 로직 (추후 구현)
    setQuestion("");
  };

  return (
    <main className="flex-1 bg-gray-950 text-white min-h-screen flex flex-col items-center p-10">
      {/* 타이틀 */}
      <h1 className="text-2xl font-semibold mb-4 w-full text-left">ETF 알림 챗봇</h1>
      {/* 챗봇 대화 영역 */}
      <div className="w-full max-w-3xl flex flex-col gap-4 bg-gray-900 rounded-lg p-6 min-h-[300px] mt-4 mb-4">
        {/* 챗봇 메시지 */}
        <div className="flex items-start gap-2">
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-base max-w-[80%]">
            안녕하세요! ETF 알림 챗봇입니다. 궁금한 점이나 투자 관련 질문을 입력해 주세요.
          </div>
        </div>
        {/* 사용자 메시지 */}
        <div className="flex items-start gap-2 justify-end">
          <div className="bg-blue-700 rounded-xl px-4 py-2 text-base max-w-[80%] text-white">
            미국 S&P500 ETF에 대해 알려줘
          </div>
        </div>
        {/* 챗봇 답변 */}
        <div className="flex items-start gap-2">
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-base max-w-[80%]">
            SPY(스파이더 S&P500) ETF는 미국 대형주에 분산 투자할 수 있는 대표적인 ETF입니다. 장기적으로 안정적인 성과를 기대할 수 있으며, 분산 투자와 낮은 수수료가 장점입니다.
          </div>
        </div>
      </div>
      {/* 질문 입력창 + 알림설정/파일업로드/전송 아이콘 */}
      <div
        className="fixed bottom-4 w-full max-w-3xl flex items-center bg-gray-900 p-2 rounded border-t border-gray-800 z-50"
        style={{ boxSizing: "border-box" }}
      >
        {/* 알림설정 아이콘 */}
        <button
          className="mr-2 bg-gray-700 hover:bg-gray-600 h-12 w-12 flex items-center justify-center rounded text-xl"
          title="알림 설정"
        >
          <span role="img" aria-label="알림">🔔</span>
        </button>
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="금융 정보에 대해 질문하세요!"
          className="h-12 w-full px-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none text-base"
        />
        {/* 파일 업로드 아이콘 */}
        <button
          className="ml-2 bg-gray-700 hover:bg-gray-600 h-12 w-12 flex items-center justify-center rounded text-xl"
          title="파일 업로드"
        >
          <span role="img" aria-label="파일 업로드">📎</span>
        </button>
        {/* 질문 전송 아이콘 */}
        <button
          className="ml-2 bg-gray-700 hover:bg-gray-600 h-12 w-12 flex items-center justify-center rounded text-xl"
          onClick={handleSend}
          title="질문 전송"
        >
          <span role="img" aria-label="질문 전송">➤</span>
        </button>
      </div>
    </main>
  );
};

export default MainContent; 