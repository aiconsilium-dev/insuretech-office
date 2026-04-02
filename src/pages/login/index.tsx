import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock login — just navigate to dashboard
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="w-full max-w-[360px] p-8">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-text-heading tracking-[-0.02em]">
            InsureTech Office
          </h1>
          <p className="text-sm text-text-muted mt-2">관리사무소 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-body mb-2">이메일</label>
            <input
              type="email"
              className="input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-body mb-2">비밀번호</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full !rounded-full !py-4 !text-base !font-bold mt-6">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
