// Modular API layer — swap WEBHOOK_URL easily
// n8n
// Render
//Testing
//const WEBHOOK_URL = "https://my-n8n-automation-r7si.onrender.com/webhook-test/9546ae5f-93cc-49b3-8806-881f3627c808";
//Production
//const WEBHOOK_URL = "https://my-n8n-automation-r7si.onrender.com/webhook/9546ae5f-93cc-49b3-8806-881f3627c808";

// n8n webhook url
//Testing
//const WEBHOOK_URL = "http://localhost:5678/webhook-test/9546ae5f-93cc-49b3-8806-881f3627c808";
//Production
const WEBHOOK_URL = "https://faleh-faleh-n8n.qvyj0e.easypanel.host/webhook/9546ae5f-93cc-49b3-8806-881f3627c808";
// End n8n

// ─── Assessment Questions ───

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
    weight: number; // percentage
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
        description: "This phase evaluates your brand's market presence, the uniqueness of your concept within the UAE competitive landscape, and the legal protection of your intellectual property.",
        questions: [
            {
                id: "A1",
                question: "How long has your business been continuously operating under the current brand name/concept?",
                type: "select",
                maxPoints: 5,
                options: [
                    {label: "Less than 2 years", value: "lt2", points: 1},
                    {label: "2–5 years", value: "2to5", points: 3},
                    {label: "More than 5 years", value: "gt5", points: 5},
                ],
            },
            {
                id: "A2",
                question: "How many units/locations (including the original) are currently operating under your full control?",
                type: "select",
                maxPoints: 5,
                options: [
                    {label: "1 unit", value: "1", points: 1},
                    {label: "2–3 units", value: "2to3", points: 3},
                    {label: "4 or more units", value: "4plus", points: 5},
                ],
            },
            {
                id: "A3",
                question: "Describe your unique selling proposition (USP). What makes your brand distinctly different from competitors in the UAE?",
                type: "text",
                maxPoints: 8,
            },
            {
                id: "A4",
                question: "Is your brand trademarked/registered in the UAE?",
                type: "select",
                maxPoints: 7,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "In Progress", value: "in_progress", points: 4},
                    {label: "Yes", value: "yes", points: 7},
                ],
            },
            {
                id: "A5",
                question: "How adaptable is your business model to the diverse demographics and consumer behaviors found across the UAE?",
                type: "select",
                maxPoints: 5,
                options: [
                    {label: "Difficult", value: "difficult", points: 1},
                    {label: "Moderate", value: "moderate", points: 3},
                    {label: "Easy", value: "easy", points: 5},
                ],
            },
        ],
    },
    {
        id: "B",
        title: "Systems & Operations",
        subtitle: "Operational Readiness & Scalability",
        icon: "⚙️",
        weight: 40,
        description: "The core of franchising is replicability. We review your documentation, training systems, and the ease of transferring operational knowledge to third parties to ensure consistent quality.",
        questions: [
            {
                id: "B1",
                question: "Do you have a documented, comprehensive Operations Manual (covering daily procedures, service standards, and key recipes/processes)?",
                type: "select",
                maxPoints: 8,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "Partial", value: "partial", points: 4},
                    {label: "Yes", value: "yes", points: 8},
                ],
            },
            {
                id: "B2",
                question: "How standardized are your core ingredients, supplies, or inventory? Can a franchisee easily source items that meet quality standards?",
                type: "select",
                maxPoints: 7,
                options: [
                    {label: "Difficult / Inconsistent", value: "difficult", points: 1},
                    {label: "Needs Refinement", value: "needs_refinement", points: 4},
                    {label: "Fully Standardized / Identified", value: "fully", points: 7},
                ],
            },
            {
                id: "B3",
                question: "Do you have a structured training program for new employees/managers that can be taught to a franchisee's team?",
                type: "select",
                maxPoints: 7,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "Developing", value: "developing", points: 4},
                    {label: "Yes", value: "yes", points: 7},
                ],
            },
            {
                id: "B4",
                question: "What is the typical time required to open a new unit from the moment a location is secured?",
                type: "select",
                maxPoints: 6,
                options: [
                    {label: "More than 6 months", value: "gt6m", points: 2},
                    {label: "3–6 months", value: "3to6m", points: 4},
                    {label: "Less than 3 months", value: "lt3m", points: 6},
                    {label: "NOT APPLICABLE", value: "na", points: 0},
                ],
            },
            {
                id: "B5",
                question: "Are your Point-of-Sale (POS) and inventory systems easily transferable/replicable across multiple locations?",
                type: "select",
                maxPoints: 6,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "With Minor Adjustments", value: "minor", points: 3},
                    {label: "Yes", value: "yes", points: 6},
                ],
            },
            {
                id: "B6",
                question: "Do you have detailed financial reporting templates (e.g., P&L, Cost of Goods Sold tracking) that are consistently used across all your units?",
                type: "select",
                maxPoints: 6,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "Yes", value: "yes", points: 6},
                ],
            },
        ],
    },
    {
        id: "C",
        title: "Financial Health",
        subtitle: "Financial Performance & Infrastructure",
        icon: "💰",
        weight: 30,
        description: "A successful franchise must be profitable for both parties. This section validates your financial model, ROI timelines, and compliance with UAE business licensing and regulations.",
        questions: [
            {
                id: "C1",
                question: "What is the average Net Profit Margin of your best-performing unit(s) over the last 12 months?",
                type: "select",
                maxPoints: 8,
                options: [
                    {label: "Less than 10%", value: "lt10", points: 2},
                    {label: "10%–19%", value: "10to19", points: 5},
                    {label: "20% or more", value: "gte20", points: 8},
                    {label: "NOT APPLICABLE", value: "na", points: 0},
                ],
            },
            {
                id: "C2",
                question: "How much initial capital (AED) is typically required to open and operate a new unit before it becomes profitable?",
                type: "select",
                maxPoints: 7,
                options: [
                    {label: "More than AED 1M", value: "gt1m", points: 2},
                    {label: "AED 500K – 1M", value: "500kto1m", points: 4},
                    {label: "Less than AED 500K", value: "lt500k", points: 7},
                ],
            },
            {
                id: "C3",
                question: "How long does it typically take a new unit to reach break-even (in months)?",
                type: "select",
                maxPoints: 7,
                options: [
                    {label: "More than 12 months", value: "gt12", points: 2},
                    {label: "6–12 months", value: "6to12", points: 5},
                    {label: "Less than 6 months", value: "lt6", points: 7},
                    {label: "NOT APPLICABLE", value: "na", points: 0},
                ],
            },
            {
                id: "C4",
                question: "Do you have the necessary cash reserves/capital to fund the franchise development process (legal fees, documentation, marketing)?",
                type: "select",
                maxPoints: 5,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "Partially", value: "partial", points: 3},
                    {label: "Yes", value: "yes", points: 5},
                ],
            },
            {
                id: "C5",
                question: "Are all business licenses and permits—including Department of Economy and Tourism (DET), Municipality, and Health/Safety approvals—current, in good standing, and compliant with both Federal and Emirate-specific regulations?",
                type: "select",
                maxPoints: 3,
                options: [
                    {label: "No", value: "no", points: 0},
                    {label: "Yes", value: "yes", points: 3},
                ],
            },
        ],
    },
];

// ─── Scoring Logic ───

export interface AssessmentAnswers {
    [questionId: string]: string; // value for select, text for text
}

export interface ScoreResult {
    totalScore: number; // 0–100
    phaseScores: { phaseId: string; title: string; score: number; maxScore: number; percentage: number }[];
    category: ScoreCategory;
}

export interface ScoreCategory {
    range: string;
    label: string;
    emoji: string;
    description: string;
    color: string;
}

const SCORE_CATEGORIES: ScoreCategory[] = [
    {
        range: "80–100",
        label: "Ready to Franchise",
        emoji: "✅",
        description: "High Priority: Concept is proven, scalable, and financially attractive. Initiate detailed due diligence and contract discussion immediately.",
        color: "hsl(160, 84%, 39%)",
    },
    {
        range: "60–79",
        label: "Needs Improvement",
        emoji: "⚠️",
        description: "Medium Priority: Strong foundation, but significant gaps exist (likely in Operations). Requires consulting to develop manuals, standardization, and systems.",
        color: "hsl(45, 93%, 47%)",
    },
    {
        range: "40–59",
        label: "Not Ready",
        emoji: "❌",
        description: "Low Priority: Concept may be viable, but the business lacks operational maturity. Recommend a 12–18 month Franchise Preparation Plan.",
        color: "hsl(25, 95%, 53%)",
    },
    {
        range: "< 40",
        label: "Not Valid / Viable",
        emoji: "🛑",
        description: "Hold: Business is too new, unprofitable, or unsuited for replication. Focus on building a single, profitable unit first. Revisit in 2+ years.",
        color: "hsl(0, 84%, 60%)",
    },
];

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
                // For text answers, give points based on length/quality (simple heuristic)
                const len = answers[q.id].trim().length;
                if (len > 100) earned += q.maxPoints;
                else if (len > 40) earned += Math.round(q.maxPoints * 0.7);
                else if (len > 10) earned += Math.round(q.maxPoints * 0.4);
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

    // Weighted total
    const totalScore = Math.round(
        phaseScores.reduce((sum, ps) => {
            const phase = ASSESSMENT_PHASES.find((p) => p.id === ps.phaseId)!;
            return sum + (ps.percentage * phase.weight) / 100;
        }, 0)
    );

    let category: ScoreCategory;
    if (totalScore >= 80) category = SCORE_CATEGORIES[0];
    else if (totalScore >= 60) category = SCORE_CATEGORIES[1];
    else if (totalScore >= 40) category = SCORE_CATEGORIES[2];
    else category = SCORE_CATEGORIES[3];

    return {totalScore, phaseScores, category};
}

// ─── AI Recommendations (mock based on score) ───

export function getRecommendations(result: ScoreResult): string[] {
    const recs: string[] = [];
    result.phaseScores.forEach((ps) => {
        if (ps.phaseId === "A" && ps.percentage < 60) {
            recs.push("Strengthen your brand identity by completing trademark registration and clearly documenting your USP.");
        }
        if (ps.phaseId === "A" && ps.percentage >= 60 && ps.percentage < 80) {
            recs.push("Consider expanding to at least 2–3 locations to demonstrate brand replicability before franchising.");
        }
        if (ps.phaseId === "B" && ps.percentage < 50) {
            recs.push("Develop a comprehensive Operations Manual covering daily procedures, service standards, and supply chain.");
            recs.push("Invest in a structured training program that can be easily taught to franchisee teams.");
        }
        if (ps.phaseId === "B" && ps.percentage >= 50 && ps.percentage < 80) {
            recs.push("Standardize your POS/inventory systems and ensure they're easily replicable across new locations.");
        }
        if (ps.phaseId === "C" && ps.percentage < 50) {
            recs.push("Focus on improving net profit margins to at least 15% before pursuing franchise expansion.");
            recs.push("Secure adequate capital reserves for franchise development costs (legal, marketing, documentation).");
        }
        if (ps.phaseId === "C" && ps.percentage >= 50 && ps.percentage < 80) {
            recs.push("Ensure all licenses and permits are current and work on reducing break-even time for new units.");
        }
    });
    if (result.totalScore >= 80) {
        recs.push("Your business shows strong franchise readiness. Consider engaging a franchise consultant to begin the formal franchising process.");
    }
    return recs.length > 0 ? recs : ["Continue building operational consistency and document all your processes."];
}

// ─── Submission ───

export interface AssessmentSubmission {
    businessName: string;
    contactName: string;
    email: string;
    totalScore: number;
    categoryLabel: string;
    brandScore: number;
    opsScore: number;
    finScore: number;
    answers: AssessmentAnswers;
    score: ScoreResult;
}

export async function submitAssessment(data: any): Promise<any> {
    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

// ─── Processing Steps ───

export const PROCESSING_STEPS = [
    {label: "Evaluating brand viability...", duration: 2000},
    {label: "Auditing operational readiness...", duration: 2500},
    {label: "Analyzing financial performance...", duration: 2000},
    {label: "Checking regulatory compliance...", duration: 1500},
    {label: "Generating your readiness report...", duration: 2000},
];

// ─── Report Status ───
export type ReportStatus = "draft" | "analyzing" | "ready";