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
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [riskLevel, setRiskLevel] = useState("5");
  const [apiKey, setApiKey] = useState("");
  const [modelType, setModelType] = useState("clova-x");
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
        const responseSettings = await apiService.getUserInvestmentSettings();
        if (responseSettings.settings) {
          setMonthlyInvestment(responseSettings.settings.monthly_investment);
          setRiskLevel(responseSettings.settings.risk_level?.toString() || "5");
          setApiKey(responseSettings.settings.api_key || "");
          setModelType(responseSettings.settings.model_type || "clova-x");
        }
        const responseETF = await apiService.getUserETF();
        if (responseETF.etfs) {
          const etfSymbols = responseETF.etfs.map(p => `${p.name}(${p.symbol})`);
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
    setIsLoading(true);
    setMessage("");

    try {
      // ETF 심볼 추출 (예: "미국 S&P500(SPY)" -> "SPY")
      const etfSymbols = selectedETFs.map(etf => {
        const match = etf.match(/\(([^)]+)\)/);
        return match ? match[1] : etf;
      });

      // 먼저 ETF 데이터를 가져와서 ID를 찾기
      const etfsResponse = await apiService.getETFs();
      const etfMap = {};
      etfsResponse.forEach(etf => {
        etfMap[etf.symbol] = etf.id;
      });

      // 포트폴리오 데이터 준비
      const etfsData = etfSymbols.map(symbol => ({
        etf_id: etfMap[symbol],
      }));

      // 설정 저장
      await apiService.updateInvestmentSettings({
        risk_level: parseInt(riskLevel),
        api_key: apiKey,
        model_type: modelType,
        monthly_investment: parseInt(monthlyInvestment),
      });

      // ETF 데이터 저장
      for (const etf of etfsData) {
        console.log(etf.etf_id);
        await apiService.updateETF(etf);
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
    <aside className="fixed top-0 left-0 h-screen w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col z-40 border-r border-gray-700/50 shadow-2xl">
      {/* 스크롤 가능한 컨테이너 */}
      <div className="flex flex-col h-full overflow-y-auto p-6">
        {/* 헤더 */}
        <div className="mb-8 pb-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">⚙️</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              설정
            </h2>
          </div>
          <p className="text-xs text-gray-400">AI 모델과 투자 설정을 관리하세요</p>
        </div>

        {/* 모델 선택 및 API 키 입력 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xs">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-200">AI 모델 설정</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="api-key">
                API KEY
              </label>
              <input 
                id="api-key" 
                type="text" 
                placeholder="API 키를 입력하세요" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-600/30 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="model">
                사용할 모델
              </label>
              <select 
                id="model" 
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-600/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value="clova-x">Clova X</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o-mini</option>
              </select>
            </div>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
            <h3 className="font-semibold text-gray-200">사용자 정보</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                월 투자금액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={e => setMonthlyInvestment(e.target.value)}
                  className="w-full p-3 pr-16 rounded-xl bg-gray-800/50 border border-gray-600/30 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 font-medium">
                  만원
                </div>
              </div>
              {monthlyInvestment && (
                <p className="text-xs text-blue-400 mt-1">
                  총 {parseInt(monthlyInvestment || 0).toLocaleString()}만원 ({parseInt(monthlyInvestment || 0) * 10000}원)
                </p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  투자 성향
                </label>
                <span className="text-sm font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  {riskLevel !== "" ? riskLevel : "-"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={riskLevel}
                  onChange={e => setRiskLevel(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>보수적</span>
                  <span>공격적</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ETF 선택 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xs">📈</span>
            </div>
            <h3 className="font-semibold text-gray-200">투자 ETF</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-400">현재 투자하고 있는 ETF를 선택하세요</p>
            
            <div className="space-y-2">
              {ETF_LIST.map((etf) => (
                <label key={etf} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={selectedETFs.includes(etf)}
                    onChange={() => handleETFChange(etf)}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">{etf}</span>
                </label>
              ))}
            </div>
            
            {/* 선택된 ETF 태그 */}
            {selectedETFs.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">선택된 ETF:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedETFs.map((etf) => (
                    <span key={etf} className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl px-3 py-1 text-xs text-blue-300 backdrop-blur-sm">
                      <span>{etf}</span>
                      <button
                        className="w-4 h-4 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors duration-200"
                        onClick={() => handleRemoveETF(etf)}
                        type="button"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 스페이서 - 남은 공간을 차지 */}
        <div className="flex-1"></div>
        
        {/* 메시지 표시 */}
        {message && (
          <div className={`text-sm p-4 rounded-xl mb-4 backdrop-blur-sm border ${
            message.includes('성공') 
              ? 'bg-green-900/20 text-green-300 border-green-500/30' 
              : 'bg-red-900/20 text-red-300 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {message.includes('성공') ? '✅' : '❌'}
              </span>
              <span>{message}</span>
            </div>
          </div>
        )}
        
        {/* 저장 버튼 */}
        <button 
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isLoading
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
          }`}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>저장 중...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>💾</span>
              <span>설정 저장</span>
            </div>
          )}
        </button>
      </div>

      {/* 커스텀 스타일 */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #f97316);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #f97316);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar; 