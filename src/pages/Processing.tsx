import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PROCESSING_STEPS } from "@/lib/api";

const Processing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= PROCESSING_STEPS.length) {
      const timeout = setTimeout(() => navigate("/dashboard"), 1200);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCompleted((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, PROCESSING_STEPS[currentStep].duration);

    return () => clearTimeout(timeout);
  }, [currentStep, navigate]);

  const allDone = currentStep >= PROCESSING_STEPS.length;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Pulse ring */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full gradient-emerald flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {allDone ? "✓" : "ف"}
            </div>
          </div>
        </div>

        <motion.h2 className="text-2xl font-bold text-foreground mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {allDone ? "Assessment Complete!" : "Evaluating Your Business"}
        </motion.h2>
        <p className="text-muted-foreground text-sm mb-10">
          {allDone ? "Redirecting to your readiness report..." : "Faleh is auditing your franchise readiness."}
        </p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {PROCESSING_STEPS.map((step, i) => {
            const isDone = completed.includes(i);
            const isActive = currentStep === i;

            return (
              <motion.div
                key={step.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isDone
                    ? "border-primary/30 bg-primary/5"
                    : isActive
                    ? "border-border bg-secondary/50"
                    : "border-transparent opacity-40"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isActive || isDone ? 1 : 0.4, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : isActive ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-border flex-shrink-0" />
                )}
                <span className={`text-sm ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Processing;
