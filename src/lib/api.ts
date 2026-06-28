// NOTE: the direct-to-n8n WEBHOOK_URL is no longer used here. submitAssessment
// now saves the assessment straight to FastAPI/Postgres (fast, no AI/report
// generation yet). The actual report (via your "Executive Summary" n8n flow)
// is only generated AFTER successful payment, triggered by the Stripe webhook
// workflow — this avoids paying for report generation for users who never pay.

// ─── FastAPI backend (Stripe session create/verify) ───
// Set this in your .env.local / Vite env config, e.g.:
//   VITE_API_BASE_URL=https://api.franchisemiddleeast.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | "https://faleh-faleh-payment-api.qvyj0e.easypanel.host/";

if (!API_BASE_URL) {
    // Don't throw — just warn loudly, so the rest of the app (assessment wizard etc.)
    // still works even before this env var is configured.
    console.warn(
        "[api.ts] VITE_API_BASE_URL is not set. Submission/payment endpoints " +
        "will fail until this is configured."
    );
}

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

// ─── Submission ───

export interface AssessmentPayload {
    businessDetails: {
        bizName: string;
        sector: string;
        locations: string;
        years: string;
    };
    contactInfo: {
        fullName: string;
        email: string;
        phone: string;
        role: string;
    };
    wizardAnswers: { question: string; selectedAnswer: string }[];
    assessmentResults: {
        totalScore: number;
        brandScore: number;
        opsScore: number;
        finScore: number;
        category: unknown;
        criticalGaps: unknown;
    };
    timestamp: string;
}

export interface AssessmentSubmitResponse {
    // FastAPI saves the raw answers to Postgres and hands back an id —
    // no report is generated at this point. The actual report only gets
    // generated after payment, by the Stripe webhook calling your
    // Executive Summary n8n flow.
    submission_id: string;
}

export async function submitAssessment(
    data: AssessmentPayload
): Promise<AssessmentSubmitResponse> {
    if (!API_BASE_URL) {
        throw new Error(
            "API_BASE_URL is not configured (set VITE_API_BASE_URL in your .env)."
        );
    }

    const response = await fetch(`${API_BASE_URL}/api/assessments/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
            errBody.detail || `Assessment submission failed (${response.status})`
        );
    }

    return response.json();
}

// ─── Payments (FastAPI backend → Stripe) ───
//
// IMPORTANT: these call YOUR FastAPI backend, never Stripe directly from the
// browser, and never the n8n webhook. n8n is reserved for reacting to the
// `checkout.session.completed` event asynchronously — including generating
// the actual report now, and emailing it.

export interface CreateCheckoutSessionPayload {
    email: string;
    submissionId: string;
}

export interface CreateCheckoutSessionResponse {
    checkout_url: string;
    session_id: string;
}

export async function createCheckoutSession(
    payload: CreateCheckoutSessionPayload
): Promise<CreateCheckoutSessionResponse> {
    if (!API_BASE_URL) {
        throw new Error(
            "API_BASE_URL is not configured (set VITE_API_BASE_URL in your .env)."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/api/payments/create-checkout-session`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                submission_id: payload.submissionId,
                customer_email: payload.email,
            }),
        }
    );

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
            errBody.detail || `Failed to create checkout session (${response.status})`
        );
    }

    return response.json();
}

export interface VerifySessionResponse {
    paid: boolean;
    email: string | null;
    // report_url is null until the Executive Summary flow finishes running
    // (triggered by the webhook, after payment). report_ready tells the
    // frontend explicitly whether it's safe to show the download button yet,
    // versus still being generated.
    report_url: string | null;
    report_ready: boolean;
    invoice_url: string | null;
    invoice_pdf: string | null;
}

export async function verifyPaymentSession(
    sessionId: string
): Promise<VerifySessionResponse> {
    if (!API_BASE_URL) {
        throw new Error(
            "API_BASE_URL is not configured (set VITE_API_BASE_URL in your .env)."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/api/payments/session/${encodeURIComponent(sessionId)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to verify payment session (${response.status})`);
    }

    return response.json();
}

// (Removed: unused PROCESSING_STEPS / ReportStatus — Assessment.tsx defines
// its own PROCESSING_LABELS locally instead.)