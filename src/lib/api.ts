// --- src/lib/api.ts ---

const WEBHOOK_URL = "/api-n8n/webhook/9546ae5f-93cc-49b3-8806-881f3627c808";

export type AssessmentAnswers = Record<string, string>;

export const ASSESSMENT_PHASES = [
  {
    id: "brand",
    title: "Brand & Concept",
    questions: [
      {
        id: "q_brand_1",
        question: "Does your brand have a clear, documented Unique Selling Proposition (USP)?",
        type: "select",
        options: [
          { label: "NO", value: "low" },
          { label: "PARTIALLY", value: "mid" },
          { label: "YES", value: "high" }
        ]
      }
    ]
  },
  {
    id: "operations",
    title: "Operations",
    questions: [
      {
        id: "q_ops_pos",
        question: "Are your Point-of-Sale (POS) and inventory systems easily transferable/replicable across multiple locations?",
        type: "select",
        options: [
          { label: "NO", value: "low" },
          { label: "WITH MINOR ADJUSTMENTS", value: "mid" },
          { label: "YES", value: "high" },
          { label: "NOT APPLICABLE (ONLY ONE UNIT)", value: "na" }
        ]
      }
    ]
  },
  {
    id: "financial",
    title: "Financial Model",
    questions: [
      {
        id: "q_fin_1",
        question: "What is the average Net Profit Margin of your best-performing unit(s) over the last 12 months?",
        type: "select",
        options: [
          { label: "LESS THAN 10%", value: "low" },
          { label: "10%-19%", value: "mid" },
          { label: "20% OR MORE", value: "high" },
          { label: "NOT APPLICABLE (SINGLE UNIT)", value: "na" }
        ]
      },
      {
        id: "q_fin_2",
        question: "How long does it typically take a new unit to reach break-even (in months)?",
        type: "select",
        options: [
          { label: "MORE THAN 12 MONTHS", value: "low" },
          { label: "6-12 MONTHS", value: "mid" },
          { label: "LESS THAN 6 MONTHS", value: "high" },
          { label: "NOT APPLICABLE (SINGLE UNIT)", value: "na" }
        ]
      }
    ]
  }
];

export const calculateScore = (answers: AssessmentAnswers) => {
  const getWeight = (val: string) => {
    if (val === "high") return 100;
    if (val === "mid") return 70;
    if (val === "na") return 85; // Neutral-high weight for N/A options
    return 30;
  };

  const sections = {
    brand: ["q_brand_1"],
    ops: ["q_ops_pos"],
    fin: ["q_fin_1", "q_fin_2"]
  };

  const calculateSection = (ids: string[]) => {
    const scores = ids.map(id => getWeight(answers[id] || "low"));
    return Math.round(scores.reduce((a, b) => a + b, 0) / ids.length);
  };

  const brandScore = calculateSection(sections.brand);
  const opsScore = calculateSection(sections.ops);
  const finScore = calculateSection(sections.fin);
  const totalScore = Math.round((brandScore + opsScore + finScore) / 3);

  let category = { label: "Bronze", color: "text-orange-500" };
  if (totalScore >= 80) category = { label: "Platinum", color: "text-blue-500" };
  else if (totalScore >= 60) category = { label: "Gold", color: "text-yellow-500" };

  return { totalScore, category, brandScore, opsScore, finScore };
};

export async function submitAssessment(data: any) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: true, mocked: true };
  }
}