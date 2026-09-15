"use client";

import { useEffect, useState } from "react";
import { Brain, ChevronRight, AlertTriangle, Sparkles } from "lucide-react";
import {
  CHIEF_COMPLAINTS,
  getQuestionsForComplaint,
  type InterviewAnswer,
  type RedFlag,
} from "@/lib/ml";

export type IntakeResult = {
  complaintId: string;
  complaintLabel: string;
  answers: InterviewAnswer[];
  narrative: string;
  classification: { cluster: string; confidence: number; department: string };
  redFlags: RedFlag[];
};

type Props = {
  patientName: string;
  onComplete: (result: IntakeResult) => void;
  onBack?: () => void;
};

export function ClinicalIntakePanel({ patientName, onComplete, onBack }: Props) {
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [geminiOn, setGeminiOn] = useState(false);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d) => setGeminiOn(Boolean(d.gemini)))
      .catch(() => setGeminiOn(false));
  }, []);

  const complaint = CHIEF_COMPLAINTS.find((c) => c.id === complaintId);
  const questions = complaintId ? getQuestionsForComplaint(complaintId) : [];
  const currentQuestion = questions[questionIndex];

  async function finishIntake(finalAnswers: InterviewAnswer[]) {
    if (!complaint) return;
    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/ai/intake/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint: complaint.label,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      onComplete({
        complaintId: complaint.id,
        complaintLabel: complaint.label,
        answers: finalAnswers,
        narrative: data.narrative,
        classification: data.classification,
        redFlags: data.redFlags,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setAnalyzing(false);
    }
  }

  function selectAnswer(answer: string) {
    if (!currentQuestion || !complaint) return;

    const newAnswer: InterviewAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      finishIntake(updated);
    }
  }

  if (!complaintId) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-brand-400" />
          <h2 className="mt-4 text-2xl font-semibold">Clinical history interview</h2>
          <p className="mt-2 text-sm text-slate-400">
            Hi {patientName} — tap your main concern. We&apos;ll ask SOCRATES follow-up questions.
          </p>
          {geminiOn && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-200">
              <Sparkles className="h-3 w-3" /> Gemini AI enabled
            </p>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHIEF_COMPLAINTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setComplaintId(c.id)}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:border-brand-500/50 hover:bg-brand-500/10"
            >
              <span className="font-medium">{c.label}</span>
              <ChevronRight className="h-5 w-5 text-slate-500" />
            </button>
          ))}
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-slate-400 underline-offset-2 hover:underline"
          >
            Back to profile
          </button>
        )}
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Brain className="h-14 w-14 animate-pulse text-brand-400" />
        <p className="text-lg text-brand-300">
          {geminiOn ? "Gemini AI is structuring your clinical history…" : "Analyzing symptoms with ML pipeline…"}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => finishIntake(answers)}
          className="rounded-xl bg-brand-500 px-6 py-3 font-semibold"
        >
          Retry analysis
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
          {complaint?.label} · Question {questionIndex + 1} of {questions.length}
        </p>
        <h2 className="mt-3 text-xl font-semibold">{currentQuestion?.text}</h2>
        <div className="mt-6 grid gap-3">
          {currentQuestion?.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => selectAnswer(opt)}
              className="rounded-xl border border-white/10 bg-slate-900/50 px-5 py-4 text-left transition hover:border-brand-500 hover:bg-brand-500/10"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {answers.map((a, i) => (
          <div
            key={a.questionId}
            className={`h-2 flex-1 rounded-full ${i < questionIndex ? "bg-brand-500" : "bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
