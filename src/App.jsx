import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MainContent from "./components/MainContent";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <div className="flex">
            <Sidebar />
            <div className="flex-1 pl-72">
              <MainContent />
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
