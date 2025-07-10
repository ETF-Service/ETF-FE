import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      {/* 고정된 사이드바 */}
      <Sidebar />
      {/* 사이드바 너비만큼 padding-left 적용 */}
      <div className="pl-72">
        <MainContent />
      </div>
    </div>
  );
}

export default App;
