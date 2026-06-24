import { useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a1d37] p-8 text-white">
      <div className="max-w-4xl mx-auto bg-white text-[#0a1d37] p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-black mb-6">Assessment Results</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-100 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Readiness Score</h3>
            <p className="text-4xl font-black text-[#5222dc]">85%</p>
          </div>
          <div className="bg-slate-100 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Next Steps</h3>
            <p className="text-sm">Your business model shows high viability. We recommend reviewing the regulatory requirements for the UAE market.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-10 w-full bg-[#0a1d37] text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition"
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}