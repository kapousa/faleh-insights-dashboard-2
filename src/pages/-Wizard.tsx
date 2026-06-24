import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  { id: 1, text: "Do you have an existing business model?" },
  { id: 2, text: "Is your brand trademarked in the region?" },
];

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Assessment Complete!");
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1d37] p-6 text-white">
      <div className="max-w-2xl mx-auto mt-20">
        {/* Progress Bar */}
        <div className="mb-8 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffcc00] transition-all"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white p-10 rounded-xl text-[#0a1d37] shadow-2xl">
          <h3 className="text-sm uppercase tracking-widest text-purple-600 font-bold mb-2">
            Step {currentStep + 1}
          </h3>
          <h1 className="text-3xl font-black mb-8">{questions[currentStep].text}</h1>

          <div className="flex gap-4">
            <button className="flex-1 border-2 border-[#5222dc] py-3 rounded font-bold hover:bg-purple-50">Yes</button>
            <button className="flex-1 border-2 border-[#5222dc] py-3 rounded font-bold hover:bg-purple-50">No</button>
          </div>

          <button
            onClick={handleNext}
            className="w-full mt-6 bg-[#ffcc00] py-3 font-bold rounded hover:bg-yellow-400 transition"
          >
            {currentStep === questions.length - 1 ? "FINISH" : "NEXT QUESTION"}
          </button>
        </div>
      </div>
    </div>
  );
}