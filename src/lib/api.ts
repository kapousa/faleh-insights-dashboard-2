// Modular API layer — swap WEBHOOK_URL easily
const WEBHOOK_URL = "https://your-n8n-instance.com/webhook/faleh";

export interface OnboardingData {
  name: string;
  email: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
  interests: string[];
}

export async function submitOnboarding(data: OnboardingData): Promise<{ success: boolean; sessionId: string }> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Webhook failed");
    const result = await response.json();
    return { success: true, sessionId: result.sessionId || "mock-session-123" };
  } catch {
    // Mock fallback for demo
    console.log("Using mock mode — webhook not connected");
    return { success: true, sessionId: "mock-session-" + Date.now() };
  }
}

export interface FranchiseMatch {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  investmentRange: string;
  estimatedROI: number;
  breakEvenMonths: number;
  yearlyProfit: number[];
  logo: string;
  description: string;
}

export const MOCK_MATCHES: FranchiseMatch[] = [
  {
    id: "1",
    name: "BurgerFuel",
    category: "Food & Beverage",
    matchScore: 95,
    investmentRange: "SAR 500K - 800K",
    estimatedROI: 32,
    breakEvenMonths: 18,
    yearlyProfit: [120000, 280000, 420000, 510000, 580000],
    logo: "🍔",
    description: "Premium gourmet burger chain with strong brand recognition across the Gulf region.",
  },
  {
    id: "2",
    name: "CloudKitchen Pro",
    category: "Cloud Kitchen",
    matchScore: 88,
    investmentRange: "SAR 200K - 400K",
    estimatedROI: 45,
    breakEvenMonths: 12,
    yearlyProfit: [80000, 190000, 310000, 400000, 460000],
    logo: "☁️",
    description: "Low-overhead cloud kitchen model with multi-brand capability and delivery optimization.",
  },
  {
    id: "3",
    name: "FitZone",
    category: "Health & Fitness",
    matchScore: 82,
    investmentRange: "SAR 300K - 600K",
    estimatedROI: 28,
    breakEvenMonths: 24,
    yearlyProfit: [60000, 150000, 270000, 380000, 450000],
    logo: "💪",
    description: "Boutique fitness studio franchise with recurring membership revenue model.",
  },
  {
    id: "4",
    name: "EduSpark Academy",
    category: "Education",
    matchScore: 76,
    investmentRange: "SAR 150K - 350K",
    estimatedROI: 38,
    breakEvenMonths: 15,
    yearlyProfit: [50000, 130000, 220000, 300000, 360000],
    logo: "📚",
    description: "After-school STEM education franchise with proven curriculum and high parent demand.",
  },
];

export const PROCESSING_STEPS = [
  { label: "Analyzing your investment profile...", duration: 2000 },
  { label: "Searching local market opportunities...", duration: 2500 },
  { label: "Calculating ROI projections...", duration: 2000 },
  { label: "Reviewing legal & regulatory terms...", duration: 1500 },
  { label: "Generating personalized recommendations...", duration: 2000 },
];
