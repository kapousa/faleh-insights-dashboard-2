import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API processing time (3 seconds)
    const timer = setTimeout(() => {
      navigate('/results');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a1d37] flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#ffcc00] mb-8"></div>
      <h2 className="text-2xl font-bold">Analyzing your data...</h2>
      <p className="text-slate-400 mt-2">Building your customized report.</p>
    </div>
  );
}