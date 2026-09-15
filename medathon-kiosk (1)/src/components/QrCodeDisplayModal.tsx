import React, { useState, useEffect } from 'react';
import { X, QrCode, Sparkles, Copy, Check, Download } from 'lucide-react';
import { CHENNAI_PATIENTS } from '../data/patients';
import { generatePatientQrCode } from '../lib/patient-qr';
import { Patient } from '../types';

interface QrCodeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForKiosk: (patient: Patient) => void;
}

export const QrCodeDisplayModal: React.FC<QrCodeDisplayModalProps> = ({
  isOpen,
  onClose,
  onSelectForKiosk
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(CHENNAI_PATIENTS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPatient) {
      generatePatientQrCode({
        type: 'medathon-patient',
        patientNo: selectedPatient.patientNo,
        patientId: selectedPatient.id,
        name: selectedPatient.name,
        abha: selectedPatient.abhaAddress
      }).then(setQrDataUrl);
    }
  }, [selectedPatient]);

  if (!isOpen) return null;

  const copyPayload = () => {
    const payload = JSON.stringify({
      type: 'medathon-patient',
      patientNo: selectedPatient.patientNo,
      patientId: selectedPatient.id,
      name: selectedPatient.name,
      abha: selectedPatient.abhaAddress
    }, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Patient ABDM QR Codes</h3>
              <p className="text-xs text-slate-400">Point tablet camera here or simulate direct scan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Patient Selector Pills */}
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-2 block">
              Select Chennai Patient Record:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CHENNAI_PATIENTS.slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPatient.id === p.id
                      ? 'bg-teal-950/80 border-teal-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{p.name.split(' ')[0]}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{p.patientNo.slice(-9)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* QR Display Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-300">
                <img src={qrDataUrl} alt="Patient QR" className="w-56 h-56 object-contain" />
              </div>
            ) : (
              <div className="w-56 h-56 bg-slate-900 animate-pulse rounded-2xl" />
            )}

            <div className="mt-4">
              <h4 className="text-base font-bold text-white">{selectedPatient.name}</h4>
              <p className="text-xs font-mono text-teal-400 mt-0.5">{selectedPatient.patientNo}</p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedPatient.ageYears}y · {selectedPatient.gender} · {selectedPatient.district}
              </p>
              {selectedPatient.abhaAddress && (
                <p className="text-[11px] font-mono text-slate-400 mt-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 inline-block">
                  {selectedPatient.abhaAddress}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 w-full max-w-sm">
              <button
                onClick={() => {
                  onSelectForKiosk(selectedPatient);
                  onClose();
                }}
                className="flex-1 h-12 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Scan on Kiosk</span>
              </button>

              <button
                onClick={copyPayload}
                className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
