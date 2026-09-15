export type InterviewAnswer = { questionId: string; question: string; answer: string };

export type InterviewQuestion = {
  id: string;
  text: string;
  options?: string[];
  voiceHint?: string;
};

const CHEST_PAIN_FLOW: InterviewQuestion[] = [
  { id: "onset", text: "When did the chest pain start?", options: ["Today", "1–3 days ago", "More than a week"] },
  { id: "character", text: "How would you describe the pain?", options: ["Crushing/heavy", "Sharp", "Burning", "Dull ache"] },
  { id: "radiation", text: "Does it spread anywhere?", options: ["Left arm", "Jaw or neck", "Back", "Stays in chest only"] },
  { id: "aggravating", text: "What makes it worse?", options: ["Exercise", "Deep breath", "Eating", "Nothing specific"] },
  { id: "relieving", text: "What makes it better?", options: ["Rest", "Medicine", "Sitting up", "Nothing helps"] },
  { id: "associated", text: "Any other symptoms?", options: ["Sweating", "Nausea", "Breathlessness", "None"] },
];

const FEVER_FLOW: InterviewQuestion[] = [
  { id: "onset", text: "When did the fever start?", options: ["Today", "2–3 days", "More than 5 days"] },
  { id: "max_temp", text: "Highest temperature noticed?", options: ["Mild", "High with chills", "Not measured"] },
  { id: "associated", text: "Associated symptoms?", options: ["Cough", "Body ache", "Rash", "None"] },
  { id: "travel", text: "Recent travel or contact with sick person?", options: ["Yes", "No", "Not sure"] },
];

const GENERIC_FLOW: InterviewQuestion[] = [
  { id: "onset", text: "When did this problem begin?", options: ["Today", "This week", "More than a month"] },
  { id: "severity", text: "How severe is it (1–10)?", options: ["1–3 Mild", "4–6 Moderate", "7–10 Severe"] },
  { id: "progress", text: "Is it getting better or worse?", options: ["Better", "Same", "Worse"] },
  { id: "treatment", text: "Any medicines taken already?", options: ["Yes", "No"] },
];

const FLOWS: Record<string, InterviewQuestion[]> = {
  chest_pain: CHEST_PAIN_FLOW,
  fever: FEVER_FLOW,
  cough: FEVER_FLOW,
  headache: GENERIC_FLOW,
  abdominal: GENERIC_FLOW,
  weakness: GENERIC_FLOW,
  other: GENERIC_FLOW,
};

export function getQuestionsForComplaint(complaintId: string): InterviewQuestion[] {
  return FLOWS[complaintId] ?? GENERIC_FLOW;
}

export function answersToNarrative(complaint: string, answers: InterviewAnswer[]): string {
  const parts = [`Chief complaint: ${complaint}.`];
  for (const a of answers) {
    parts.push(`${a.question.replace("?", "")}: ${a.answer}.`);
  }
  return parts.join(" ");
}
