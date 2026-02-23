import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Verification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError(""); // Reset error

    // 1. Basic format validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Business Email Restriction Logic
    const forbiddenDomains = [
      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
      "icloud.com", "aol.com", "live.com", "msn.com"
    ];
    const emailDomain = email.split("@")[1]?.toLowerCase();

    if (forbiddenDomains.includes(emailDomain)) {
      setError("Free email addresses are not allowed. Please use your company's business email.");
      return;
    }

    setLoading(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    const templateParams = {
      to_email: email.trim(),
      passcode: otp,
    };

    try {
      await emailjs.send(
        "service_ppose92",
        "template_1s1ftkl",
        templateParams,
        "bkbQWaudkDXwfH4xb"
      );
      setStep(2);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("Failed to send code. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (userOtp === generatedOtp) {
      sessionStorage.setItem("faleh_verified_email", email);
      navigate("/onboarding");
    } else {
      setError("The code you entered is incorrect. Please check and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1d37] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 shadow-2xl border-t-8 border-[#5222dc]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl font-black uppercase italic mb-2 text-[#0a1d37]">Access Portal</h2>
              <p className="text-slate-500 mb-6 text-sm font-medium">Verify your business email to start the audit.</p>

              <div className="relative mb-4">
                <Input
                  className={`h-14 rounded-none border-2 transition-all ${
                    error ? "border-red-500 bg-red-50" : "focus:border-[#5222dc]"
                  }`}
                  placeholder="work@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>

              {/* Error Message Design */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 text-xs font-bold mb-4 bg-red-50 p-3 border-l-4 border-red-600"
                  >
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={sendOtp}
                disabled={loading}
                className="w-full h-14 bg-[#0a1d37] hover:bg-[#5222dc] text-white rounded-none font-black italic tracking-wider transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "SEND CODE"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-black uppercase italic mb-2 text-[#0a1d37]">Verify Code</h2>
              <p className="text-slate-500 mb-6 text-sm font-medium">
                Enter the 6-digit code sent to <br/>
                <span className="text-[#5222dc] font-bold underline">{email}</span>
              </p>

              <Input
                className={`h-14 mb-4 rounded-none border-2 text-center text-2xl font-bold tracking-[0.5em] transition-all ${
                  error ? "border-red-500 bg-red-50" : "focus:border-[#5222dc]"
                }`}
                maxLength={6}
                value={userOtp}
                onChange={(e) => {
                  setUserOtp(e.target.value);
                  if (error) setError("");
                }}
              />

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold mb-4 p-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={verifyOtp}
                className="w-full h-14 bg-[#5222dc] hover:bg-[#0a1d37] text-white rounded-none font-black italic tracking-wider transition-all"
              >
                START AUDIT
              </Button>
              <button
                onClick={() => { setStep(1); setError(""); }}
                className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 hover:text-[#0a1d37]"
              >
                Back to email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Verification;