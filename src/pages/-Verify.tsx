import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Verify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0a1d37] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-white p-8 rounded-lg text-slate-900 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Verify Your Details</h2>
        <p className="mb-4 text-slate-600">Enter your email to continue the assessment.</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded mb-6 focus:ring-2 focus:ring-[#5222dc] outline-none"
          placeholder="name@company.com"
        />

        <button
          onClick={() => email && navigate('/wizard')}
          className="w-full bg-[#5222dc] text-white py-3 font-bold rounded hover:bg-purple-700 transition"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}