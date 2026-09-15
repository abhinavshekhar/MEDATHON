import React, { useState } from 'react';
import { X, Delete, Search, KeyRound } from 'lucide-react';
import { CHENNAI_PATIENTS } from '../data/patients';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientNo: string) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [value, setValue] = useState<string>('P-CHN-20260915-');

  if (!isOpen) return null;

  const handleKey = (char: string) => {
    setValue(prev => prev + char);
  };

  const handleBackspace = () => {
    setValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual Patient ID Entry</h3>
              <p className="text-xs text-slate-400">Enter registration number from receipt card</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keypad & Input */}
        <div className="p-6 space-y-5">
          {/* Display bar */}
          <div className="bg-slate-950 border-2 border-teal-500/40 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-teal-400 block mb-1">PATIENT IDENTIFIER</span>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              className="w-full bg-transparent text-center font-mono text-2xl font-black text-white focus:outline-hidden tracking-wider"
              autoFocus
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {CHENNAI_PATIENTS.slice(0, 3).map(p => (
              <button
                key={p.id}
                onClick={() => setValue(p.patientNo)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 shrink-0 cursor-pointer"
              >
                {p.patientNo.slice(-9)} ({p.name.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Numeric Touch Keypad for 11" tablet */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleKey(num)}
                className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-teal-900 border border-slate-700 text-xl font-bold font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setValue('P-CHN-20260915-')}
              className="h-14 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center justify-center cursor-pointer"
            >
              Reset Prefix
            </button>
            <button
              onClick={() => handleKey('0')}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-teal-900 border border-slate-700 text-xl font-bold font-mono text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-14 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Submit Action */}
          <button
            onClick={() => handleSubmit()}
            disabled={!value.trim()}
            className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-teal-900/30"
          >
            <Search className="w-5 h-5" />
            <span>Lookup Patient</span>
          </button>
        </div>
      </div>
    </div>
  );
};
