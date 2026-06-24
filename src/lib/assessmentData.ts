export interface WizardQuestion {
  text: string;
  options: string[]; // index 0 = best, last = worst (scored accordingly)
}

export interface WizardPhase {
  id: number;
  phaseLabel: string;
  name: string;
  objective: string;
  desc: string;
  questions: WizardQuestion[];
}

export const WIZARD_PHASES: WizardPhase[] = [
  {
    id: 0,
    phaseLabel: "PHASE 01",
    name: "Brand Power",
    objective: "Brand Power Evaluation",
    desc: "A strong franchise begins with a brand people recognise and trust. This section evaluates your market presence, differentiation, and customer loyalty — the foundation every franchisee will build on.",
    questions: [
      { text: "How recognisable is your brand name in your primary market?", options: ["Highly recognised — customers seek us out by name", "Known within our local area", "Building awareness — still relatively new", "Minimal brand recognition currently"] },
      { text: "How clearly differentiated is your brand from competitors?", options: ["Strongly differentiated — a unique concept", "Somewhat different with clear advantages", "Similar to competitors with minor differences", "We compete primarily on price"] },
      { text: "Do you have a registered trademark for your brand name and logo?", options: ["Fully registered in the UAE and GCC", "Registered in UAE only", "Application in progress", "Not yet registered"] },
      { text: "What is your average customer repeat visit or purchase rate?", options: ["Very high — majority of customers return regularly", "Above average — strong repeat business", "Average — some repeat customers", "Low — primarily one-time customers"] },
      { text: "How consistent is your brand experience across all locations?", options: ["Highly consistent — same experience everywhere", "Mostly consistent with minor variations", "Noticeable variations between locations", "Significant inconsistencies"] },
      { text: "What is your online presence and digital footprint?", options: ["Strong — high followers, active reviews, strong SEO", "Moderate — decent presence but room to grow", "Limited — basic social media and website", "Minimal online presence"] },
      { text: "Do you have documented brand standards and visual identity guidelines?", options: ["Comprehensive brand book covering all touchpoints", "Basic guidelines covering logo and colours", "Informal guidelines, not fully documented", "No formal brand documentation"] },
      { text: "How would you describe customer sentiment about your brand?", options: ["Extremely positive — strong advocates and referrals", "Generally positive with few complaints", "Mixed — some positive, some negative", "Mostly neutral or negative feedback"] },
      { text: "Have you received any awards, press coverage, or industry recognition?", options: ["Multiple awards and regular media coverage", "Some press coverage or recognition", "Occasional mentions but no formal recognition", "No external recognition yet"] },
      { text: "Is your brand concept replicable in new markets without losing its essence?", options: ["Yes — the concept works universally", "Yes, with minor local adaptations", "Possibly, with significant adaptation needed", "Uncertain — highly location-dependent"] },
    ],
  },
  {
    id: 1,
    phaseLabel: "PHASE 02",
    name: "Systems & Operations",
    objective: "Systems & Operations Evaluation",
    desc: "A successful franchise must be operable by someone other than the founder. This section validates whether your systems, processes, and training infrastructure can be replicated and handed to a franchisee.",
    questions: [
      { text: "Do you have a documented Operations Manual covering all key processes?", options: ["Comprehensive — covers every operational procedure", "Partially documented — key processes covered", "Minimal documentation — mostly in our heads", "No operations manual exists"] },
      { text: "How standardised are your daily operating procedures?", options: ["Fully standardised — checklists and SOPs for everything", "Mostly standardised with some flexibility", "Partly standardised — varies by staff/location", "Not standardised — every team does it differently"] },
      { text: "Do you have a structured training programme for new staff?", options: ["Full programme with training manual and certification", "Informal training with some documentation", "On-the-job training only, no formal programme", "No training programme"] },
      { text: "What POS, inventory, or management systems do you use?", options: ["Integrated digital systems across all operations", "Some digital tools with manual processes", "Primarily manual or basic systems", "No formal systems in place"] },
      { text: "How quickly can you onboard and train a new location team?", options: ["Under 2 weeks with full training kit", "2–4 weeks", "1–2 months", "More than 2 months"] },
      { text: "Do you have a defined supply chain and approved supplier list?", options: ["Fully documented with multiple backup suppliers", "Defined but not fully documented", "Informal supplier relationships", "No formal supply chain structure"] },
      { text: "Have you successfully managed multiple locations simultaneously?", options: ["Yes — operating 4+ locations efficiently", "Yes — 2–3 locations", "One location only, no multi-site experience", "Not yet tested at any scale"] },
      { text: "Do you have quality control systems and regular audits?", options: ["Formal QC system with regular documented audits", "Informal quality checks but not systematic", "Owner-dependent quality management", "No formal quality control processes"] },
      { text: "How dependent is your business on your personal involvement to operate?", options: ["Runs well independently — I could step away for a month", "Mostly independent with a strong management team", "Somewhat dependent — key decisions need my input", "Highly dependent — struggles without me daily"] },
      { text: "Is your concept scalable within UAE regulatory and labour requirements?", options: ["Fully compliant and scalable", "Compliant with some areas to address", "Uncertain — needs legal review", "Known compliance gaps"] },
    ],
  },
  {
    id: 2,
    phaseLabel: "PHASE 03",
    name: "Financial Health",
    objective: "Financial Health Evaluation",
    desc: "A profitable franchise must be financially viable for both parties. This section validates your financial model, ROI timeline, and compliance with UAE business licensing and regulations.",
    questions: [
      { text: "What is the average Net Profit Margin of your best-performing unit over the last 12 months?", options: ["20% or more", "10%–19%", "Less than 10%", "Currently not profitable"] },
      { text: "How much initial capital (AED) is typically required to open and operate a new unit before it becomes profitable?", options: ["Under AED 250,000", "AED 250,000 – 500,000", "AED 500,000 – 1,000,000", "Over AED 1,000,000"] },
      { text: "What is the average payback period for a franchisee's initial investment?", options: ["Under 18 months", "18–30 months", "30–48 months", "Over 4 years or uncertain"] },
      { text: "Do you maintain regular, audited financial statements?", options: ["Yes — monthly management accounts and annual audit", "Basic financial records but no formal audit", "Minimal financial tracking", "No formal financial records"] },
      { text: "Is your pricing model and royalty structure defined for franchisees?", options: ["Yes — fully modelled with scenarios", "Partially defined, needs refinement", "Concept only, not modelled", "Not yet considered"] },
      { text: "What is your current revenue trajectory?", options: ["Strong growth — YoY revenue increasing 20%+", "Moderate growth — 5–20% annually", "Stable — flat revenue", "Declining revenue"] },
      { text: "Are your financials structured to clearly separate per-unit performance?", options: ["Yes — full P&L per unit", "Partially — some unit tracking", "Combined financials only", "No financial tracking by unit"] },
      { text: "Have you modelled the economics of franchising (franchise fees, royalties, franchisor costs)?", options: ["Yes — detailed franchise financial model completed", "High-level estimates only", "No modelling done yet", "Unfamiliar with franchise economics"] },
      { text: "Do you have sufficient working capital to support franchise development costs?", options: ["Yes — well-capitalised with headroom", "Adequate but limited buffer", "Tight — would need external funding", "Capital constrained"] },
      { text: "Are all UAE business licences, municipality approvals, and permits current and transferable?", options: ["All current and documented", "Mostly current with minor gaps", "Some lapses or pending renewals", "Significant compliance issues"] },
    ],
  },
];

export type WizardAnswers = Record<number, Record<number, number>>; // phaseId -> qIndex -> optionIndex

export interface WizardScore {
  totalScore: number;
  pillarScores: { name: string; percentage: number; color: string }[];
  category: { label: string; color: string };
}

// Each question has 4 options; option index 0 = best (3pts), 3 = worst (0pts)
export function scoreOption(optionIndex: number) {
  return [3, 2, 1, 0][optionIndex] ?? 0;
}

export function calculateWizardScore(answers: WizardAnswers): WizardScore {
  const pillarColors = ["#5c21ff", "#ffcc00", "#22c55e"];
  const pillarScores = WIZARD_PHASES.map((phase, i) => {
    const qAnswers = answers[phase.id] || {};
    const earned = Object.values(qAnswers).reduce((s, oi) => s + scoreOption(oi), 0);
    const max = phase.questions.length * 3;
    return {
      name: phase.name,
      percentage: max > 0 ? Math.round((earned / max) * 100) : 0,
      color: pillarColors[i],
    };
  });

  const totalScore = Math.round(
    pillarScores.reduce((sum, p) => sum + p.percentage, 0) / pillarScores.length
  );

  let category;
  if (totalScore >= 80) category = { label: "Ready to Franchise", color: "#22c55e" };
  else if (totalScore >= 60) category = { label: "Growth Ready", color: "#ffcc00" };
  else if (totalScore >= 40) category = { label: "Needs Improvement", color: "#f97316" };
  else category = { label: "Not Yet Ready", color: "#ef4444" };

  return { totalScore, pillarScores, category };
}

export const TOTAL_QUESTIONS = WIZARD_PHASES.reduce((s, p) => s + p.questions.length, 0);