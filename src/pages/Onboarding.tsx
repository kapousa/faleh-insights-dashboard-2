// --- src/pages/Onboarding.tsx ---

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ASSESSMENT_PHASES,
    calculateScore,
    submitAssessment,
    type AssessmentAnswers,
} from "@/lib/api";

const Onboarding = () => {
    const navigate = useNavigate();
    const [phaseIndex, setPhaseIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [answers, setAnswers] = useState<AssessmentAnswers>({});

    useEffect(() => {
        const verifiedEmail = sessionStorage.getItem("faleh_verified_email");
        if (verifiedEmail) setEmail(verifiedEmail);
    }, []);

    const setAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const totalPhases = ASSESSMENT_PHASES.length;
    const currentPhase = ASSESSMENT_PHASES[phaseIndex];

    const canNext = phaseIndex === -1
        ? businessName.length > 2 && contactName.length > 2
        : currentPhase.questions.every((q) => {
            const answer = answers[q.id];
            if (q.type === "select") return !!answer; // Works with "na"
            if (q.type === "text") return !!answer && answer.length > 10;
            return false;
        });

    const handleSubmit = async () => {
        setLoading(true);
        const scoreResult = calculateScore(answers);

        const submissionData = {
            businessName,
            contactName,
            email,
            totalScore: scoreResult.totalScore,
            categoryLabel: scoreResult.category.label,
            brandScore: scoreResult.brandScore,
            opsScore: scoreResult.opsScore,
            finScore: scoreResult.finScore,
            answers
        };

        const result = await submitAssessment(submissionData);
        if (result) navigate("/dashboard", { state: { score: scoreResult } });
        setLoading(false);
    };

    // ... (UI Render logic remains as per your current file)
    return (
        <div className="min-h-screen bg-white">
            {/* Standard rendering for your Onboarding UI */}
        </div>
    );
};

export default Onboarding;