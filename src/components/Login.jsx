import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "로그인 실패");
        return;
      }
      navigate("/");
    } catch (err) {
      setError("서버 연결 오류");
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none"
          required
        />
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded"
        >
          로그인
        </button>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <a href="/signup" onClick={handleSignupClick} className="hover:underline">회원가입</a>
          <a href="#" className="hover:underline">비밀번호 찾기</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 