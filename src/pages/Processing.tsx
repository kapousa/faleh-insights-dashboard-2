import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PartyPopper, Sparkles } from "lucide-react";
import { PROCESSING_STEPS } from "@/lib/api";

const Processing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // إذا انتهت جميع الخطوات، نفعل حالة "الانتهاء" بدلاً من الانتقال الفوري
    if (currentStep >= PROCESSING_STEPS.length) {
      setIsFinished(true);
      const timeout = setTimeout(() => navigate("/dashboard"), 3000); // 3 ثوانٍ لمشاهدة رسالة النجاح
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCompleted((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, PROCESSING_STEPS[currentStep].duration);

    return () => clearTimeout(timeout);
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Pulse ring - التصميم الحالي الخاص بك */}
              <div className="relative w-24 h-24 mx-auto mb-10">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full gradient-emerald flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    ف
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2 text-foreground">Analyzing Your Strategy</h2>
              <p className="text-muted-foreground mb-8 text-sm">Faleh AI is evaluating your franchise readiness...</p>

              <div className="space-y-3 text-left">
                {PROCESSING_STEPS.map((step, i) => {
                  const isDone = completed.includes(i);
                  const isActive = currentStep === i;

                  return (
                    <motion.div
                      key={step.label}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        isDone ? "border-primary/30 bg-primary/5 shadow-sm" : isActive ? "border-border bg-secondary/50" : "border-transparent opacity-40"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : isActive ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border flex-shrink-0" />
                      )}
                      <span className={`text-sm ${isDone || isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // شاشة النجاح الجديدة
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10"
            >
              <div className="relative inline-block mb-6">
                <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", damping: 12 }}
  className="w-20 h-20 bg-[#5c21ff] rounded-full flex items-center justify-center shadow-xl shadow-[#5c21ff]/20"
>
  <CheckCircle2 className="text-white w-10 h-10" />
</motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-yellow-500"
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-3">Analysis Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Your readiness report will be generated shortly.
                <br />
                <span className="text-primary font-medium">We will send a detailed copy to your email.</span>
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-xs text-muted-foreground animate-pulse">
                Redirecting to dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Processing;