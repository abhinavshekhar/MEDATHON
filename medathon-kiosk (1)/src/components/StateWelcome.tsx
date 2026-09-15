import React from 'react';
import { QrCode, Sparkles, KeyRound, ShieldAlert, HeartPulse, UserCheck, ArrowRight } from 'lucide-react';
import { KioskLanguage, Patient } from '../types';
import { CHENNAI_PATIENTS } from '../data/patients';

interface StateWelcomeProps {
  language: KioskLanguage;
  onStartScan: () => void;
  onManualEntry: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const StateWelcome: React.FC<StateWelcomeProps> = ({
  language,
  onStartScan,
  onManualEntry,
  onSelectPatient
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-8 md:p-12 relative overflow-hidden bg-[#0f172a] select-none">
      {/* Background ambient radial glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Location Callout */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Chennai Reception Tablet · Zone 09</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Device: A11-5G-KIOSK</span>
        </div>

        {/* Manual entry button */}
        <button
          id="btn-admin-manual-entry"
          onClick={onManualEntry}
          className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-teal-400" />
          <span>{language === 'ta' ? 'நோயாளி எண் உள்ளிடவும்' : 'Manual Patient ID (P-CHN-…)'}</span>
        </button>
      </div>

      {/* Main Center Content: Attract, Welcome, Radar Pulse */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 mb-6 shadow-sm">
          <HeartPulse className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            {language === 'ta' ? 'மேடத்தான் டிஜிட்டல் ட்வின் கிளினிக்' : 'MEDATHON Digital Twin Clinic'}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
          {language === 'ta' ? 'வருகைக்கு நல்வரவு' : 'Welcome to MEDATHON'}
        </h2>
        <p className="text-xl md:text-2xl text-teal-300/90 font-medium mb-10 tracking-wide">
          {language === 'ta' 
            ? 'சென்னை · உங்கள் மருத்துவ முக்கிய அளவீடுகள் பதிவு' 
            : 'Chennai · Automated Clinical Vitals Check-in'}
        </p>

        {/* Large Interactive Pulsing Scan Target Button */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pulsing Concentric Radar Rings */}
          <div className="absolute w-64 h-64 rounded-full border border-teal-500/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          <div className="absolute w-52 h-52 rounded-full border border-teal-500/30 animate-pulse pointer-events-none" />
          
          <button
            id="btn-scan-qr-start"
            onClick={onStartScan}
            className="group relative w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700 active:scale-95 border-2 border-teal-400/40 shadow-2xl shadow-teal-500/20 flex flex-col items-center justify-center p-6 text-white transition-all cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <QrCode className="w-12 h-12 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              {language === 'ta' ? 'QR ஸ்கேன் செய்ய தொடங்கு' : 'Scan QR to Begin'}
            </span>
            <span className="text-xs text-teal-200/80 mt-1">
              {language === 'ta' ? 'மொபைல் அல்லது அட்டை QR' : 'Mobile ABDM / Printed ID'}
            </span>
          </button>
        </div>

        <p className="text-slate-400 text-sm max-w-md mx-auto flex items-center justify-center gap-1.5">
          <span>{language === 'ta' ? 'உங்கள் ஸ்மார்ட்போனில் உள்ள ABDM QR குறியீட்டை கேமரா முன் காட்டவும்' : 'Show the ABDM QR code from your patient mobile app or printed registration card'}</span>
        </p>
      </div>

      {/* Bottom Tray: Quick Demo Patients for instant 1-tap testing without camera */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>
              {language === 'ta' 
                ? 'விரைவு சோதனை நோயாளிகள் (சென்னை தரவுத்தளம்):' 
                : '1-Tap Demo Check-in (Chennai Dataset):'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CHENNAI_PATIENTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                id={`btn-demo-patient-${p.patientNo}`}
                onClick={() => onSelectPatient(p)}
                className="h-10 px-3.5 rounded-lg bg-slate-800/90 hover:bg-teal-900/40 border border-slate-700/80 hover:border-teal-500/50 text-xs text-slate-200 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: `hsl(${p.ageYears * 15 % 360}, 70%, 40%)` }}
                >
                  {p.name.charAt(0)}
                </span>
                <span className="font-medium text-white">{p.name.split(' ')[0]}</span>
                <span className="text-slate-400 font-mono text-[10px]">({p.ageYears}y)</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
