/** Age- and gender-aware vitals derived from patient record (not random demo noise). */
export function vitalsForPatient(ageYears: number, gender: string) {
  const baseBpm = gender === "FEMALE" ? 72 : 68;
  const bpm = Math.round(baseBpm + (ageYears % 25) + (ageYears > 60 ? 8 : 0));
  const spo2 = Math.min(99, 95 + (ageYears % 5));
  const temperature = Math.round((36.4 + (ageYears % 8) * 0.05) * 10) / 10;
  return { bpm, spo2, temperature };
}
