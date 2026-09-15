import React from 'react';
import { 
  UserCheck, 
  ArrowLeft, 
  Activity, 
  MapPin, 
  Calendar, 
  Fingerprint, 
  ShieldCheck, 
  ChevronRight, 
  Droplet,
  Phone,
  Sparkles
} from 'lucide-react';
import { Patient, KioskLanguage } from '../types';
import { getPatientAvatarHue } from '../lib/vitals-engine';

interface StateConfirmationProps {
  patient: Patient;
  language: KioskLanguage;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StateConfirmation: React.FC<StateConfirmationProps> = ({
  patient,
  language,
  onConfirm,
  onCancel
}) => {
  const avatarHue = getPatientAvatarHue(patient.ageYears);
  const activeVisit = patient.visits?.[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-10 bg-[#0f172a] text-slate-100 select-none relative overflow-hidden">
      {/* Background soft ambient lights */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: `hsl(${avatarHue}, 70%, 50%)` }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <button
          id="btn-confirm-back"
          onClick={onCancel}
          className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'ta' ? 'ரத்து செய்க' : 'Cancel / Scan Again'}</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-teal-950 border border-teal-700 text-teal-300 text-xs font-semibold flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>ABDM Verified Identity · Tamil Nadu HIMS</span>
        </div>
      </div>

      {/* Center Main Patient Confirmation Card */}
      <div className="my-auto max-w-3xl w-full mx-auto relative z-10">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          {/* Header Row: Large Avatar + Name & ID */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800">
            {/* Age-derived Colored Initial Avatar */}
            <div 
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex flex-col items-center justify-center shadow-xl border-4 border-slate-800/80 shrink-0 relative overflow-hidden"
              style={{
                backgroundColor: `hsl(${avatarHue}, 65%, 22%)`,
                borderColor: `hsl(${avatarHue}, 70%, 45%)`
              }}
            >
              <span 
                className="text-4xl md:text-5xl font-black text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                {patient.name.charAt(0)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 mt-1 font-bold">
                {patient.ageYears}y · {patient.gender.charAt(0)}
              </span>
            </div>

            {/* Name, Demographics, and ABHA */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-teal-950 text-teal-300 border border-teal-700">
                  {patient.patientNo}
                </span>
                {patient.bloodGroup && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-rose-400" />
                    {patient.bloodGroup}
                  </span>
                )}
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {patient.name}
              </h3>

              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-sm text-slate-300">
                <span className="font-semibold text-teal-300">
                  {patient.ageYears} {language === 'ta' ? 'வயது' : 'Years'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-semibold uppercase tracking-wide text-slate-200">
                  {patient.gender === 'FEMALE' ? (language === 'ta' ? 'பெண்' : 'Female') : (language === 'ta' ? 'ஆண்' : 'Male')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {patient.district}, {patient.state}
                </span>
              </div>

              {/* ABHA Address Chip */}
              {patient.abhaAddress && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
                  <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
                  <span>ABHA: {patient.abhaAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Today's Visit Information */}
          <div className="py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">
                {language === 'ta' ? 'இன்றைய பிரிவு / OPD' : "Today's OPD Division"}
              </span>
              <p className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                {activeVisit?.opdType || 'General OPD'}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">
                {language === 'ta' ? 'டோக்கன் எண்' : 'Queue Token Number'}
              </span>
              <p className="text-base font-bold text-amber-400 font-mono">
                Token #{activeVisit?.tokenNo || '14'}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
              <span className="text-xs text-slate-400 block mb-1">
                {language === 'ta' ? 'நிலை' : 'Admission Status'}
              </span>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {activeVisit?.status || 'REGISTERED'}
              </p>
            </div>
          </div>

          {/* Action Callout */}
          <div className="pt-2">
            <button
              id="btn-start-vitals-capture"
              onClick={onConfirm}
              className="w-full min-h-[64px] rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:scale-[0.99] text-white text-xl font-bold shadow-xl shadow-teal-900/30 border-2 border-teal-400/40 flex items-center justify-center space-x-3 transition-all cursor-pointer"
            >
              <Activity className="w-6 h-6 animate-pulse" />
              <span>
                {language === 'ta' ? 'அளவீடுகளைத் தொடங்கவும்' : 'Start Vitals Capture'}
              </span>
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-2.5">
              {language === 'ta' 
                ? 'உங்கள் விரலை சென்சாரில் வைக்க தயாராக இருங்கள்' 
                : 'Please place your index finger on the optical sensor cradle when prompted'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="relative z-10 text-center text-xs text-slate-500">
        <span>MEDATHON Kiosk v2.4 · Hardware Hook: ESP32 MAX30102 PPG ready</span>
      </div>
    </div>
  );
};
