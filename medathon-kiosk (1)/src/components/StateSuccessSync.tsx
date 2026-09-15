import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Clock, 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  MapPin, 
  Share2, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';
import { Patient, VitalLog, KioskLanguage } from '../types';
import { CalculatedVitals, getPatientAvatarHue } from '../lib/vitals-engine';
import { KIOSK_CONFIG } from '../lib/config';

interface StateSuccessSyncProps {
  patient: Patient;
  vitals: CalculatedVitals;
  vitalLogId: string;
  language: KioskLanguage;
  onNextPatient: () => void;
  onViewDigitalTwin: () => void;
}

export const StateSuccessSync: React.FC<StateSuccessSyncProps> = ({
  patient,
  vitals,
  vitalLogId,
  language,
  onNextPatient,
  onViewDigitalTwin
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(KIOSK_CONFIG.autoResetDurationSec);
  const avatarHue = getPatientAvatarHue(patient.ageYears);

  // Auto-reset countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNextPatient();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNextPatient]);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-10 bg-[#0f172a] text-slate-100 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Digital Twin Sync Confirmation */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>DIGITAL TWIN LIVE SYNC CONFIRMED ✓</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span>Log ID:</span>
          <span className="text-teal-400 font-bold">{vitalLogId}</span>
        </div>
      </div>

      {/* Center Success Card */}
      <div className="my-auto max-w-3xl w-full mx-auto relative z-10">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md text-center">
          {/* Animated Success Checkmark */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {language === 'ta' ? 'முக்கிய அளவீடுகள் பதிவு செய்யப்பட்டன' : 'Vitals Synced to Digital Twin'}
          </h2>
          <p className="text-base md:text-lg text-emerald-300 font-medium mb-6">
            {language === 'ta'
              ? 'தயவுசெய்து காத்திருப்பு பகுதிக்கு செல்லவும். மருத்துவர் உங்கள் அளவீடுகளைக் காண்பார்.'
              : 'Please proceed to the waiting area. The doctor will see your vitals instantly.'}
          </p>

          {/* Patient Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3.5">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ backgroundColor: `hsl(${avatarHue}, 65%, 25%)` }}
              >
                {patient.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-white">{patient.name}</p>
                <p className="text-xs text-slate-400 font-mono">
                  {patient.patientNo} · {patient.ageYears}y {patient.gender} · {patient.district}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Token #{patient.visits?.[0]?.tokenNo || '14'}
              </span>
            </div>
          </div>

          {/* Recorded Vitals Summary Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* BPM */}
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-1.5 text-rose-400 text-xs font-semibold mb-1">
                <Heart className="w-4 h-4" />
                <span>Heart Rate</span>
              </div>
              <span className="text-3xl md:text-4xl font-black font-mono text-white">
                {vitals.bpm}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">BPM</span>
            </div>

            {/* SpO2 */}
            <div className="bg-slate-950/80 border border-teal-900/40 rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-1.5 text-teal-400 text-xs font-semibold mb-1">
                <Activity className="w-4 h-4" />
                <span>SpO₂</span>
              </div>
              <span className="text-3xl md:text-4xl font-black font-mono text-white">
                {vitals.spo2}%
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Saturation</span>
            </div>

            {/* Temperature */}
            <div className="bg-slate-950/80 border border-amber-900/40 rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-1.5 text-amber-400 text-xs font-semibold mb-1">
                <Thermometer className="w-4 h-4" />
                <span>Temp</span>
              </div>
              <span className="text-3xl md:text-4xl font-black font-mono text-white">
                {vitals.temperature}°C
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Axillary</span>
            </div>
          </div>

          {/* Blood Pressure and Respiration */}
          <div className="flex items-center justify-around py-3 px-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 font-mono mb-6">
            <div>BP: <strong className="text-white">{vitals.systolic}/{vitals.diastolic} mmHg</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div>Resp: <strong className="text-white">{vitals.respiratoryRate} bpm</strong></div>
            <div className="h-3 w-px bg-slate-800" />
            <div>Status: <strong className="text-emerald-400">{vitals.status}</strong></div>
          </div>

          {/* Primary Action Button: Next Patient */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-next-patient"
              onClick={onNextPatient}
              className="flex-1 w-full min-h-[58px] rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white text-lg font-bold shadow-xl shadow-teal-900/30 border-2 border-teal-400/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{language === 'ta' ? 'அடுத்த நோயாளி' : 'Next Patient'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="btn-view-digital-twin"
              onClick={onViewDigitalTwin}
              className="h-[58px] px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Verify Digital Twin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto Reset Countdown Footer */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-teal-400" />
          <span>
            {language === 'ta' 
              ? `${secondsRemaining} வினாடிகளில் தானாக ரீசெட் ஆகும்` 
              : `Auto-resetting to welcome screen in ${secondsRemaining}s`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Node: {KIOSK_CONFIG.deviceId}</span>
        </div>
      </div>
    </div>
  );
};
