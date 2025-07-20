import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login";
import MainContent from "./components/MainContent";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import apiService from "./services/api";

function App() {
  // 앱 시작 시 ETF 데이터 초기화 (한 번만 실행)
  useEffect(() => {
    const initializeETFs = async () => {
      try {
        console.log("ETF 데이터 초기화 중...");
        await apiService.request('/init-etfs', { method: 'POST' });
        console.log("ETF 데이터 초기화 완료");
      } catch (error) {
        console.log("ETF 데이터가 이미 존재하거나 초기화 실패:", error);
      }
    };

    // 앱이 처음 로드될 때 한 번만 실행
    initializeETFs();
  }, []); // 빈 의존성 배열로 한 번만 실행

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 pl-80">
              <MainContent />
            </div>
          </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
