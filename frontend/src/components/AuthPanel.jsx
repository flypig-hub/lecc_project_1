import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token, setToken } = useAuth();

  const register = async () => {
    try {
      setError('');
      await api.post('/api/auth/register', { email, password });
      setMessage('회원가입 완료. 로그인하세요.');
    } catch (e) {
      setError(e.response?.data?.message || '회원가입 실패');
    }
  };

  const login = async () => {
    try {
      setError('');
      const { data } = await api.post('/api/auth/login', { email, password });
      setToken(data.token);
      setMessage('로그인 완료');
    } catch (e) {
      setError(e.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <section className="card">
      <h2>인증</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="row">
        <button onClick={register}>회원가입</button>
        <button onClick={login}>로그인</button>
        <button onClick={() => setToken(null)} disabled={!token}>
          로그아웃
        </button>
      </div>
      {message && <p>{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
