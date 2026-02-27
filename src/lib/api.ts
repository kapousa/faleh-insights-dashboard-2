// --- src/lib/api.ts ---
const WEBHOOK_URL = "/api-n8n/webhook/9546ae5f-93cc-49b3-8806-881f3627c808";

export const PROCESSING_STEPS = [
  { label: "Evaluating brand viability...", duration: 2000 },
  { label: "Auditing operational readiness...", duration: 2500 },
  { label: "Analyzing financial performance...", duration: 2000 },
  { label: "Checking regulatory compliance...", duration: 1500 },
  { label: "Generating your readiness report...", duration: 2000 },
];

// MUST BE EXPORTED TO FIX YOUR IMPORT ERROR
export interface AssessmentAnswers {
  [questionId: string]: string;
}

export const ASSESSMENT_PHASES = [
  {
    id: "A",
    title: "Brand Power",
    weight: 30,
    questions: [
      { id: "A1", question: "How many years has your business been operating?", type: "select", maxPoints: 5, options: [
          { label: "Less than 2 years", value: "lt2", points: 1 },
          { label: "2–5 years", value: "2to5", points: 3 },
          { label: "More than 5 years", value: "gt5", points: 5 },
      ]},
      { id: "A2", question: "How many units/branches are currently active?", type: "select", maxPoints: 5, options: [
          { label: "1 unit", value: "1", points: 1 },
          { label: "2–3 units", value: "2to3", points: 3 },
          { label: "4+ units", value: "4plus", points: 5 },
      ]},
      { id: "A3", question: "What is your Unique Selling Proposition (USP)?", type: "text", maxPoints: 10 }
    ],
  },
  {
    id: "B",
    title: "Operations",
    weight: 40,
    questions: [
      { id: "B1", question: "Do you have a documented Operations Manual?", type: "select", maxPoints: 10, options: [
          { label: "No", value: "no", points: 0 },
          { label: "Partially", value: "partial", points: 5 },
          { label: "Yes, fully documented", value: "yes", points: 10 },
      ]},
      { id: "B2", question: "Is your training program standardized?", type: "select", maxPoints: 10, options: [
          { label: "No", value: "no", points: 0 },
          { label: "In progress", value: "progress", points: 5 },
          { label: "Yes", value: "yes", points: 10 },
      ]}
    ],
  },
  {
    id: "C",
    title: "Financials",
    weight: 30,
    questions: [
      { id: "C1", question: "What is your average Net Profit Margin?", type: "select", maxPoints: 10, options: [
          { label: "Below 10%", value: "lt10", points: 2 },
          { label: "10%–20%", value: "10to20", points: 6 },
          { label: "Above 20%", value: "gt20", points: 10 },
      ]}
    ],
  },
];

export function calculateScore(answers: AssessmentAnswers) {
  let totalScore = 0;
  const phaseScores = ASSESSMENT_PHASES.map(phase => {
    let earned = 0;
    let max = 0;
    phase.questions.forEach(q => {
      max += q.maxPoints;
      const ans = answers[q.id];
      if (q.type === "select") {
        const opt = q.options?.find(o => o.value === ans);
        if (opt) earned += opt.points;
      } else if (ans) earned += q.maxPoints;
    });
    const percentage = (earned / max) * 100;
    totalScore += (percentage * phase.weight) / 100;
    return { title: phase.title, percentage };
  });

  return { totalScore: Math.round(totalScore), phaseScores, category: { label: totalScore > 70 ? "Ready" : "Needs Work" } };
}

export async function submitAssessment(data: any) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}