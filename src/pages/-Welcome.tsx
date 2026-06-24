import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-5xl font-black mb-6">Faleh Assessment</h1>
      <button
        onClick={() => navigate('/verify')}
        className="bg-[#ffcc00] text-[#0a1d37] px-8 py-4 font-bold"
      >
        START ASSESSMENT
      </button>
    </div>
  );
}