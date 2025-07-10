import React, { useState } from "react";

const ETF_LIST = [
  "미국 S&P500(SPY)",
  "미국 나스닥(QQQ)",
  "한국(EWY)",
  "유럽(VGK)",
  "중국(MCHI)"
];

const Sidebar = () => {
  const [selectedETFs, setSelectedETFs] = useState([]);
  const [userName, setUserName] = useState("");
  const [riskLevel, setRiskLevel] = useState("5");

  const handleETFChange = (etf) => {
    if (selectedETFs.includes(etf)) {
      setSelectedETFs(selectedETFs.filter((item) => item !== etf));
    } else if (selectedETFs.length < 5) {
      setSelectedETFs([...selectedETFs, etf]);
    }
  };

  const handleRemoveETF = (etf) => {
    setSelectedETFs(selectedETFs.filter((item) => item !== etf));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white flex flex-col p-6 gap-8 z-40">
      {/* 모델 선택 및 API 키 입력 */}
      <div className="mb-6">
        <div className="mb-2 font-semibold">모델 선택 및 API 키 입력</div>
        <label className="block text-sm mb-1" htmlFor="api-key">API KEY</label>
        <input id="api-key" type="text" placeholder="API 키를 입력하세요" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm mb-3" />
        <label className="block text-sm mb-1" htmlFor="model">사용할 모델</label>
        <select id="model" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm">
          <option>Clova X</option>
          <option>GPT-4o</option>
          <option>GPT-4o-mini</option>
        </select>
      </div>
      {/* 사용자 정보 */}
      <div className="mb-6">
        <div className="font-semibold mb-2">사용자 정보</div>
        <div className="mb-4">
          <div className="text-sm mb-1">이름</div>
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm"
            placeholder="이름을 입력하세요"
          />
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>투자 성향(0 보수적~10 공격적)</span>
            <span className="font-bold text-red-400">{riskLevel !== "" ? riskLevel : "-"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={riskLevel}
            onChange={e => setRiskLevel(e.target.value)}
            className="w-full accent-red-500"
          />
        </div>
        <div>
          <div className="text-sm mb-1">현재 투자하고 있는 ETF</div>
          <div className="flex flex-col gap-1 mb-2">
            {ETF_LIST.map((etf) => (
              <label key={etf} className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedETFs.includes(etf)}
                  onChange={() => handleETFChange(etf)}
                  className="accent-blue-700"
                  disabled={!selectedETFs.includes(etf) && selectedETFs.length >= 5}
                />
                {etf}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedETFs.map((etf) => (
              <span key={etf} className="flex items-center bg-blue-700 rounded px-2 py-1 text-xs text-white">
                {etf}
                <button
                  className="ml-1 text-white hover:text-gray-200"
                  onClick={() => handleRemoveETF(etf)}
                  type="button"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* 저장 버튼 */}
      <button className="mt-auto bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-semibold">저장</button>
    </aside>
  );
};

export default Sidebar; 