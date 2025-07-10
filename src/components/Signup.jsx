import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // 회원가입 처리 로직 (추후 구현)
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">회원가입</h2>
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
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded"
        >
          회원가입
        </button>
        <div className="text-sm text-gray-400 mt-2 text-center">
          이미 계정이 있으신가요? <a href="/login" onClick={handleLoginClick} className="hover:underline text-blue-400">로그인</a>
        </div>
      </form>
    </div>
  );
};

export default Signup; 