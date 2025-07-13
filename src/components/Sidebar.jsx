import React, { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import apiService from "../services/api";

const ETF_LIST = [
  "미국 S&P500(SPY)",
  "미국 나스닥(QQQ)",
  "한국(EWY)",
  "일본(EWJ)",
  "중국(MCHI)",
  "유럽(VGK)",
];

const Sidebar = () => {
  const [selectedETFs, setSelectedETFs] = useState([]);
  const [userName, setUserName] = useState("");
  const [riskLevel, setRiskLevel] = useState("5");
  const [apiKey, setApiKey] = useState("");
  const [modelType, setModelType] = useState("gpt-4o");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuthStore();

  const handleETFChange = (etf) => {
    if (selectedETFs.includes(etf)) {
      setSelectedETFs(selectedETFs.filter((item) => item !== etf));
    } else {
      setSelectedETFs([...selectedETFs, etf]);
    }
  };

  const handleRemoveETF = (etf) => {
    setSelectedETFs(selectedETFs.filter((item) => item !== etf));
  };

  // 컴포넌트 마운트 시 기존 설정 로드
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        // ETF 초기 데이터 생성 (없는 경우)
        try {
          await apiService.request('/init-etfs', { method: 'POST' });
        } catch {
          console.log('ETF 데이터가 이미 존재합니다.');
        }

        const response = await apiService.getUserPortfolio();
        if (response.settings) {
          setUserName(response.settings.name || user?.name || "");
          setRiskLevel(response.settings.risk_level?.toString() || "5");
          setApiKey(response.settings.api_key || "");
          setModelType(response.settings.model_type || "gpt-4o");
        }
        if (response.portfolios) {
          const etfSymbols = response.portfolios.map(p => `${p.etf.name}(${p.etf.symbol})`);
          setSelectedETFs(etfSymbols);
        }
      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    };

    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const handleSave = async () => {
    if (!userName.trim()) {
      setMessage("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // ETF 심볼 추출 (예: "미국 S&P500(SPY)" -> "SPY")
      const etfSymbols = selectedETFs.map(etf => {
        const match = etf.match(/\(([^)]+)\)/);
        return match ? match[1] : etf;
      });

      // 먼저 ETF 데이터를 가져와서 ID를 찾기
      const etfsResponse = await apiService.request('/etfs');
      const etfMap = {};
      etfsResponse.forEach(etf => {
        etfMap[etf.symbol] = etf.id;
      });

      // 포트폴리오 데이터 준비
      const portfolioData = etfSymbols.map(symbol => ({
        etf_id: etfMap[symbol],
        monthly_investment: 100000 // 기본값 10만원, 추후 입력 필드 추가 가능
      }));

      // 설정 저장
      await apiService.updateInvestmentSettings({
        risk_level: parseInt(riskLevel),
        api_key: apiKey,
        model_type: modelType
      });

      // 기존 포트폴리오 모두 삭제
      await apiService.deleteAllPortfolios();

      // 새로운 포트폴리오 생성
      for (const portfolio of portfolioData) {
        await apiService.request('/portfolio', {
          method: 'POST',
          body: JSON.stringify(portfolio)
        });
      }

      setMessage("설정이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setMessage("설정 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white flex flex-col z-40">
      {/* 스크롤 가능한 컨테이너 */}
      <div className="flex flex-col h-full overflow-y-auto p-6">
        {/* 모델 선택 및 API 키 입력 */}
        <div className="mb-6">
        <div className="mb-2 font-semibold">모델 선택 및 API 키 입력</div>
        <label className="block text-sm mb-1" htmlFor="api-key">API KEY</label>
        <input 
          id="api-key" 
          type="text" 
          placeholder="API 키를 입력하세요" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm mb-3" 
        />
        <label className="block text-sm mb-1" htmlFor="model">사용할 모델</label>
        <select 
          id="model" 
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm"
        >
          <option value="clova-x">Clova X</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o-mini</option>
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
      
      {/* 스페이서 - 남은 공간을 차지 */}
      <div className="flex-1"></div>
      
      {/* 메시지 표시 */}
      {message && (
        <div className={`text-sm p-2 rounded mb-2 ${
          message.includes('성공') 
            ? 'bg-green-900 text-green-300' 
            : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}
      
      {/* 저장 버튼 */}
      <button 
        className={`py-2 rounded font-semibold transition-colors ${
          isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-700 hover:bg-blue-600 text-white'
        }`}
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? '저장 중...' : '저장'}
      </button>
      </div>
    </aside>
  );
};

export default Sidebar; 