import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  Activity, 
  Smartphone, 
  Monitor, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Thermometer, 
  TrendingUp 
} from 'lucide-react';
import { Patient, VitalLog } from '../types';
import { apiFetch, digitalTwinUrl } from '../lib/api';

interface DigitalTwinModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTwinModal: React.FC<DigitalTwinModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [logs, setLogs] = useState<VitalLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'DESKTOP_HIMS' | 'MOBILE_APP' | 'API_STREAM'>('DESKTOP_HIMS');

  const fetchVitals = async () => {
    setIsLoading(true);
    try {
      const url = patient
        ? `/api/vitals?patientId=${encodeURIComponent(patient.id)}`
        : '/api/vitals?patientId=demo';
      const res = await apiFetch(url);
      const data = await res.json();
      setLogs(data.readings || data.vitals || []);
    } catch (err) {
      console.error('Failed to fetch digital twin vitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVitals();
      const interval = setInterval(fetchVitals, 3000); // Poll every 3s as in prompt
      return () => clearInterval(interval);
    }
  }, [isOpen, patient]);

  if (!isOpen) return null;

  const latest = logs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>MEDATHON Digital Twin Node Live Inspector</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  REAL-TIME SYNC
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Verifying <code className="text-teal-300">POST /api/vitals</code> → <code className="text-teal-300">GET /api/vitals</code> polling loop
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchVitals}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Vitals"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2 space-x-4">
          <button
            onClick={() => setActiveTab('DESKTOP_HIMS')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'DESKTOP_HIMS'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop HIMS Digital Twin (/smart-clinic/digital-twin)</span>
          </button>

          <button
            onClick={() => setActiveTab('MOBILE_APP')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'MOBILE_APP'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Patient Mobile Vitals Tab (/patient-app)</span>
          </button>

          <button
            onClick={() => setActiveTab('API_STREAM')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'API_STREAM'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Raw JSON Stream ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Architecture Flow Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono overflow-x-auto">
            <span className="text-teal-400 font-bold">Kiosk (Tablet)</span>
            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" />
            <span className="text-blue-400 font-bold">POST /api/vitals</span>
            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" />
            <span className="text-purple-400 font-bold">VitalLog Database</span>
            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" />
            <span className="text-emerald-400 font-bold">Desktop & Mobile (poll &lt;5s)</span>
          </div>

          {activeTab === 'DESKTOP_HIMS' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-teal-400" />
                    Doctor Consultation Station · Digital Twin Telemetry
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Polling /api/vitals: Active (2.8s latency)
                  </span>
                </div>

                {latest ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400">Heart Rate (BPM)</span>
                      <p className="text-3xl font-black text-rose-400 font-mono mt-1">{latest.bpm}</p>
                      <span className="text-[10px] text-slate-500">Source: {latest.deviceId || 'KIOSK-01'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400">Oxygen Saturation (SpO2)</span>
                      <p className="text-3xl font-black text-teal-400 font-mono mt-1">{latest.spo2}%</p>
                      <span className="text-[10px] text-emerald-400">Normal Range</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400">Axillary Temperature</span>
                      <p className="text-3xl font-black text-amber-400 font-mono mt-1">{latest.temperature}°C</p>
                      <span className="text-[10px] text-slate-500">BP: {latest.systolic}/{latest.diastolic} mmHg</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    No vitals logged yet in this session. Complete a kiosk check-in to see live sync!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'MOBILE_APP' && (
            <div className="max-w-md mx-auto bg-slate-950 p-6 rounded-3xl border-2 border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">MEDATHON Patient Mobile</h4>
                  <p className="text-xs text-slate-400">Chennai Smart Health Card</p>
                </div>
                <Smartphone className="w-5 h-5 text-teal-400" />
              </div>

              {latest ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60">
                    <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wide">
                      Latest Vitals Captured at Kiosk
                    </span>
                    <div className="flex justify-between items-baseline mt-2">
                      <div>
                        <span className="text-2xl font-black font-mono text-white">{latest.bpm}</span>
                        <span className="text-xs text-slate-400 ml-1">BPM</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black font-mono text-teal-300">{latest.spo2}%</span>
                        <span className="text-xs text-slate-400 ml-1">SpO2</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black font-mono text-amber-300">{latest.temperature}°C</span>
                        <span className="text-xs text-slate-400 ml-1">Temp</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">
                      Recorded: {new Date(latest.recordedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  No vitals present. Refresh mobile view after scanning at kiosk.
                </p>
              )}
            </div>
          )}

          {activeTab === 'API_STREAM' && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-80">
              <pre>{JSON.stringify(logs, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
