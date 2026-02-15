import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
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

const sendOtp = async () => {
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address");
    return;
  }

  setLoading(true);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setGeneratedOtp(otp);

  // templateParams must match the {{variables}} in your EmailJS dashboard
  const templateParams = {
    to_email: email.trim(), // Used in the 'To Email' setting box
    passcode: otp,         // Used as {{passcode}} in your email body
  };

  try {
    const response = await emailjs.send(
      "service_ppose92",
      "template_1s1ftkl",
      templateParams,
      "bkbQWaudkDXwfH4xb"
    );

    if (response.status === 200) {
      setStep(2);
    }
  } catch (error) {
    console.error("EmailJS Error:", error);
    alert("Check EmailJS: Ensure the 'To Email' field in settings is {{to_email}}");
  } finally {
    setLoading(false);
  }
};

  const verifyOtp = () => {
    if (userOtp === generatedOtp) {
      sessionStorage.setItem("faleh_verified_email", email);
      navigate("/onboarding");
    } else {
      alert("Invalid Code");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1d37] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 shadow-2xl border-t-8 border-[#5222dc]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-3xl font-black uppercase italic mb-2 text-[#0a1d37]">Access Faleh</h2>
              <p className="text-slate-500 mb-6 text-sm font-medium">Verify your email to start the audit.</p>
              <Input
                type="email"
                className="h-14 mb-4 rounded-none border-2 focus:border-[#5222dc] transition-all"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={sendOtp}
                disabled={loading}
                className="w-full h-14 bg-[#0a1d37] hover:bg-[#5222dc] text-white rounded-none font-black italic tracking-wider transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "SEND CODE"}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-3xl font-black uppercase italic mb-2 text-[#0a1d37]">Verify Code</h2>
              <p className="text-slate-500 mb-6 text-sm font-medium">Enter the 6-digit code sent to <br/><span className="text-[#5222dc] font-bold">{email}</span></p>
              <Input
                className="h-14 mb-4 rounded-none border-2 text-center text-2xl font-bold tracking-[0.5em] focus:border-[#5222dc]"
                maxLength={6}
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
              />
              <Button
                onClick={verifyOtp}
                className="w-full h-14 bg-[#5222dc] hover:bg-[#0a1d37] text-white rounded-none font-black italic tracking-wider transition-all"
              >
                START AUDIT
              </Button>
              <button onClick={() => setStep(1)} className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 hover:text-[#0a1d37]">
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