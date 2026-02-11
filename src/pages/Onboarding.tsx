import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, User, DollarSign, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { submitOnboarding, type OnboardingData } from "@/lib/api";

const BUDGET_RANGES = [
  { label: "SAR 100K – 300K", min: 100000, max: 300000 },
  { label: "SAR 300K – 500K", min: 300000, max: 500000 },
  { label: "SAR 500K – 1M", min: 500000, max: 1000000 },
  { label: "SAR 1M+", min: 1000000, max: 5000000 },
];

const INTERESTS = ["Food & Beverage", "Retail", "Health & Fitness", "Education", "Technology", "Cloud Kitchen"];
const LOCATIONS = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Other"];

const steps = [
  { icon: User, title: "About You" },
  { icon: DollarSign, title: "Budget" },
  { icon: MapPin, title: "Preferences" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budgetIdx, setBudgetIdx] = useState(1);
  const [customBudget, setCustomBudget] = useState([400000]);
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const canNext =
    step === 0 ? name.trim() && email.trim() :
    step === 1 ? true :
    location && interests.length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    const data: OnboardingData = {
      name: name.trim(),
      email: email.trim(),
      budgetMin: BUDGET_RANGES[budgetIdx]?.min ?? customBudget[0],
      budgetMax: BUDGET_RANGES[budgetIdx]?.max ?? customBudget[0],
      location,
      interests,
    };
    await submitOnboarding(data);
    navigate("/processing");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center font-bold text-primary-foreground text-sm">ف</div>
            <span className="text-xl font-bold text-foreground">Faleh</span>
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div
          className="rounded-2xl gradient-card border border-border shadow-card p-8"
          layout
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-1">Let's get started</h2>
                <p className="text-muted-foreground text-sm mb-8">Tell us a bit about yourself.</p>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Ahmed Al-Rashid" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="ahmed@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-1">Investment Budget</h2>
                <p className="text-muted-foreground text-sm mb-8">Select a range that fits your investment capacity.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {BUDGET_RANGES.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setBudgetIdx(i)}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all text-left ${
                        budgetIdx === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fine-tune: SAR {customBudget[0].toLocaleString()}</Label>
                  <Slider
                    value={customBudget}
                    onValueChange={setCustomBudget}
                    min={50000}
                    max={5000000}
                    step={50000}
                    className="mt-3"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-1">Your Preferences</h2>
                <p className="text-muted-foreground text-sm mb-8">Where and what are you interested in?</p>
                <div className="mb-6">
                  <Label className="mb-3 block">Location</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          location === loc
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Industries of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((int) => (
                      <button
                        key={int}
                        onClick={() => toggleInterest(int)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          interests.includes(int)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {int}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => step === 0 ? navigate("/") : setStep(step - 1)}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canNext || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Submitting..." : "Start Analysis"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
