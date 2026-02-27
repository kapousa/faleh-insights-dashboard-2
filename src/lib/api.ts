// --- src/lib/api.ts ---

const WEBHOOK_URL = "/api-n8n/webhook/9546ae5f-93cc-49b3-8806-881f3627c808";

export const PROCESSING_STEPS = [
  { label: "Evaluating brand viability...", duration: 2000 },
  { label: "Auditing operational readiness...", duration: 2500 },
  { label: "Analyzing financial performance...", duration: 2000 },
  { label: "Checking regulatory compliance...", duration: 1500 },
  { label: "Generating your readiness report...", duration: 2000 },
];

export interface AssessmentOption {
  label: string;
  value: string;
  points: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "select" | "text" | "number";
  options?: AssessmentOption[];
  maxPoints: number;
}

export interface AssessmentPhase {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  weight: number;
  questions: AssessmentQuestion[];
  description: string;
}

export const ASSESSMENT_PHASES: AssessmentPhase[] = [
  {
    id: "A",
    title: "Brand Power",
    subtitle: "Concept & Brand Viability",
    icon: "🏷️",
    weight: 30,
    description: "Evaluates brand market presence and USP.",
    questions: [
      {
        id: "A1",
        question: "Operating Years",
        type: "select",
        maxPoints: 5,
        options: [
          { label: "Less than 2 years", value: "lt2", points: 1 },
          { label: "2–5 years", value: "2to5", points: 3 },
          { label: "More than 5 years", value: "gt5", points: 5 },
        ],
      },
      {
        id: "A2",
        question: "Units",
        type: "select",
        maxPoints: 5,
        options: [
          { label: "1 unit", value: "1", points: 1 },
          { label: "2–3 units", value: "2to3", points: 3 },
          { label: "4 or more units", value: "4plus", points: 5 },
        ],
      },
      {
        id: "A3",
        question: "USP Description: What is your brand's unique selling proposition?",
        type: "text",
        maxPoints: 8,
      }
    ],
  },
  {
    id: "B",
    title: "Systems & Operations",
    subtitle: "Operational Readiness",
    icon: "⚙️",
    weight: 40,
    description: "Review of documentation and replicability.",
    questions: [
      {
        id: "B1",
        question: "Do you have a comprehensive Operations Manual (SOPs) for all key business functions?",
        type: "select",
        maxPoints: 10,
        options: [
          { label: "No", value: "no", points: 0 },
          { label: "In Development", value: "partial", points: 5 },
          { label: "Yes, Completed", value: "yes", points: 10 },
        ],
      },
      {
        id: "B2",
        question: "What is the typical time required to open a new unit from the moment a location is secured?",
        type: "select",
        maxPoints: 6,
        options: [
          { label: "More than 6 months", value: "gt6", points: 2 },
          { label: "3–6 months", value: "3to6", points: 4 },
          { label: "Less than 3 months", value: "lt3", points: 6 },
        ],
      },
      {
        id: "B5",
        question: "Are your Point-of-Sale (POS) and inventory systems easily transferable/replicable across multiple locations?",
        type: "select",
        maxPoints: 6,
        options: [
          { label: "No", value: "no", points: 0 },
          { label: "With Minor Adjustments", value: "minor", points: 3 },
          { label: "Yes", value: "yes", points: 6 },
          { label: "NOT APPLICABLE (SINGLE UNIT)", value: "na", points: 5 },
        ],
      }
    ],
  },
  {
    id: "C",
    title: "Financial Health",
    subtitle: "Financial Performance",
    icon: "💰",
    weight: 30,
    description: "Validation of profit margins and ROI.",
    questions: [
      {
        id: "C1",
        question: "What is the average Net Profit Margin of your best-performing unit(s) over the last 12 months?",
        type: "select",
        maxPoints: 8,
        options: [
          { label: "Less than 10%", value: "lt10", points: 2 },
          { label: "10%–19%", value: "10to19", points: 5 },
          { label: "20% or more", value: "gte20", points: 8 },
          { label: "NOT APPLICABLE (SINGLE UNIT)", value: "na", points: 7 },
        ],
      },
      {
        id: "C2",
        question: "How much initial capital (AED) is typically required to open and operate a new unit before it becomes profitable?",
        type: "select",
        maxPoints: 7,
        options: [
          { label: "More than AED 1M", value: "gt1m", points: 3 },
          { label: "AED 500K – 1M", value: "500kto1m", points: 5 },
          { label: "Less than AED 500K", value: "lt500k", points: 7 },
        ],
      },
      {
        id: "C3",
        question: "How long does it typically take a new unit to reach break-even (in months)?",
        type: "select",
        maxPoints: 7,
        options: [
          { label: "More than 12 months", value: "gt12", points: 2 },
          { label: "6–12 months", value: "6to12", points: 5 },
          { label: "Less than 6 months", value: "lt6", points: 7 },
          { label: "NOT APPLICABLE (SINGLE UNIT)", value: "na", points: 6 },
        ],
      },
      {
        id: "C4",
        question: "Do you have the necessary cash reserves/capital to fund the franchise development process (legal fees, documentation, marketing)?",
        type: "select",
        maxPoints: 8,
        options: [
          { label: "No", value: "no", points: 0 },
          { label: "Partially", value: "partial", points: 4 },
          { label: "Yes", value: "yes", points: 8 },
        ],
      }
    ],
  },
];

export interface AssessmentAnswers {
  [questionId: string]: string;
}

export interface ScoreResult {
  totalScore: number;
  phaseScores: { phaseId: string; title: string; score: number; maxScore: number; percentage: number }[];
  category: any;
}

export function calculateScore(answers: AssessmentAnswers): ScoreResult {
  const phaseScores = ASSESSMENT_PHASES.map((phase) => {
    let earned = 0;
    let max = 0;
    phase.questions.forEach((q) => {
      max += q.maxPoints;
      if (q.type === "select" && answers[q.id]) {
        const option = q.options?.find((o) => o.value === answers[q.id]);
        if (option) earned += option.points;
      } else if (q.type === "text" && answers[q.id]?.trim()) {
        const len = answers[q.id].trim().length;
        if (len > 40) earned += q.maxPoints;
        else if (len > 10) earned += Math.round(q.maxPoints * 0.5);
      }
    });
    return {
      phaseId: phase.id,
      title: phase.title,
      score: earned,
      maxScore: max,
      percentage: max > 0 ? Math.round((earned / max) * 100) : 0,
    };
  });

  const totalScore = Math.round(
    phaseScores.reduce((sum, ps) => {
      const phase = ASSESSMENT_PHASES.find((p) => p.id === ps.phaseId)!;
      return sum + (ps.percentage * phase.weight) / 100;
    }, 0)
  );

  const category = totalScore >= 80 ? { label: "Ready to Franchise" } : { label: "Improvement Needed" };

  return { totalScore, phaseScores, category };
}

export async function submitAssessment(data: any): Promise<any> {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}