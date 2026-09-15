import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Thermometer, 
  Wind, 
  Activity, 
  ShieldAlert, 
  Gauge, 
  CheckCircle2, 
  Radio 
} from 'lucide-react';
import { Patient, KioskLanguage } from '../types';
import { calculateVitals, CalculatedVitals } from '../lib/vitals-engine';

// TODO: WebSocket ws://server:8000/ws/vitals - Hardware hook for real MAX30102 sensor data

interface StateCaptureProps {
  patient: Patient;
  language: KioskLanguage;
  onCaptureComplete: (vitals: CalculatedVitals) => void;
}

export const StateCapture: React.FC<StateCaptureProps> = ({
  patient,
  language,
  onCaptureComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Target vitals strictly derived from formula
  const targetVitals = calculateVitals(patient.ageYears, patient.gender);

  const [progress, setProgress] = useState<number>(0);
  const [currentBpm, setCurrentBpm] = useState<number>(0);
  const [currentSpo2, setCurrentSpo2] = useState<number>(0);
  const [currentTemp, setCurrentTemp] = useState<number>(0);
  const [currentSystolic, setCurrentSystolic] = useState<number>(0);
  const [currentDiastolic, setCurrentDiastolic] = useState<number>(0);
  const [currentResp, setCurrentResp] = useState<number>(0);
  const [sensorStatus, setSensorStatus] = useState<string>('Initializing optical PPG sensor...');

  // 3-second animated progression 0 -> 100%
  useEffect(() => {
    const duration = 3000;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      // Phase status updates
      if (pct < 25) {
        setSensorStatus(language === 'ta' 
          ? 'ஆப்டிகல் பிங்கர் சென்சார் சரிபார்க்கப்படுகிறது...' 
          : 'Calibrating MAX30102 optical finger sensor...');
      } else if (pct < 60) {
        setSensorStatus(language === 'ta' 
          ? 'PPG அலைவடிவம் மற்றும் SpO2 அளவீடுகள் பகுப்பாய்வு...' 
          : 'Acquiring continuous PPG waveform & infrared SpO2...');
      } else if (pct < 90) {
        setSensorStatus(language === 'ta' 
          ? 'உடல் வெப்பநிலை மற்றும் இரத்த அழுத்தம் கணக்கிடப்படுகிறது...' 
          : 'Calibrating body temperature & arterial pressure...');
      } else {
        setSensorStatus(language === 'ta' 
          ? 'அளவீடுகள் உறுதி செய்யப்பட்டன. ஒத்திசைக்கிறது...' 
          : 'Readings verified. Syncing to Digital Twin node...');
      }

      // Easing animation for vitals
      const ratio = pct / 100;
      setCurrentBpm(Math.round(targetVitals.bpm * ratio));
      setCurrentSpo2(Math.round(targetVitals.spo2 * ratio));
      setCurrentTemp(Number((targetVitals.temperature * ratio).toFixed(1)));
      setCurrentSystolic(Math.round(targetVitals.systolic * ratio));
      setCurrentDiastolic(Math.round(targetVitals.diastolic * ratio));
      setCurrentResp(Math.round(targetVitals.respiratoryRate * ratio));

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onCaptureComplete(targetVitals);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [patient, language]);

  // Animated hospital ECG trace on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Draw faint grid lines
    ctx.strokeStyle = '#0f2922';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let t = 0;
    const drawTrace = () => {
      t += 1;
      x = (x + 3) % width;

      // Clear thin trailing slice ahead of scan head
      ctx.fillStyle = '#090d16';
      ctx.fillRect(x, 0, 18, height);

      // Re-draw grid in that slice
      ctx.strokeStyle = '#0f2922';
      ctx.beginPath();
      for (let gy = 0; gy < height; gy += 20) {
        ctx.moveTo(x, gy);
        ctx.lineTo(x + 18, gy);
      }
      ctx.stroke();

      // Synthesize ECG heartbeat spike pattern periodically
      const cycle = t % 60;
      let y = centerY;

      if (cycle >= 20 && cycle <= 23) {
        // P-wave
        y = centerY - 8;
      } else if (cycle === 28) {
        // Q dip
        y = centerY + 12;
      } else if (cycle === 30) {
        // R high spike
        y = centerY - 55;
      } else if (cycle === 32) {
        // S drop
        y = centerY + 28;
      } else if (cycle >= 36 && cycle <= 42) {
        // T wave
        y = centerY - 14;
      }

      // Draw glowing ECG line
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(Math.max(0, x - 3), centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      animId = requestAnimationFrame(drawTrace);
    };

    drawTrace();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-8 bg-[#090e1a] text-slate-100 select-none relative overflow-hidden">
      {/* Top Patient Telemetry Strip */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-teal-950/80 border border-teal-700/60">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400">
              LIVE TELEMETRY
            </span>
          </div>
          <span className="text-base font-bold text-white tracking-wide">
            {patient.name}
          </span>
          <span className="text-xs font-mono text-slate-400">
            [{patient.patientNo}]
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">
            {language === 'ta' ? 'அளவீடு முன்னேற்றம்' : 'Sensor Acquisition'}:
          </span>
          <span className="text-sm font-bold font-mono text-teal-400">
            {progress}%
          </span>
        </div>
      </div>

      {/* Hospital Telemetry ECG Waveform Bar */}
      <div className="my-2 relative rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#090d16] shadow-inner">
        <canvas 
          ref={canvasRef} 
          width={900} 
          height={110} 
          className="w-full h-24 md:h-28 object-cover" 
        />
        <div className="absolute top-2 left-3 flex items-center space-x-2 text-[11px] font-mono text-emerald-500/80 bg-slate-950/60 px-2 py-0.5 rounded">
          <span>LEAD II (PPG Derived)</span>
          <span>•</span>
          <span>1.0 mV/cm</span>
          <span>•</span>
          <span>25 mm/s</span>
        </div>
      </div>

      {/* Main Center Gauges (BPM, SpO2, Temperature) - Font Size 64px+ as mandated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        {/* Gauge 1: Heart Rate (BPM) */}
        <div className="rounded-3xl bg-slate-900/90 border-2 border-rose-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  {language === 'ta' ? 'இதய துடிப்பு' : 'Heart Rate'}
                </span>
                <span className="text-[10px] text-slate-400">BPM (Beats/Min)</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Norm: 60-100</span>
          </div>

          <div className="my-4 text-center">
            <span className="text-6xl md:text-7xl font-black font-mono tracking-tight text-white group-hover:text-rose-300 transition-colors">
              {currentBpm || '--'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rhythm: Normal Sinus</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {progress >= 100 ? 'LOCKED ✓' : 'Sensing...'}
            </span>
          </div>
        </div>

        {/* Gauge 2: SpO2 (%) */}
        <div className="rounded-3xl bg-slate-900/90 border-2 border-teal-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  {language === 'ta' ? 'ஆக்ஸிஜன் அளவு' : 'Blood Oxygen'}
                </span>
                <span className="text-[10px] text-slate-400">SpO₂ (%)</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Norm: 95-99%</span>
          </div>

          <div className="my-4 text-center">
            <span className="text-6xl md:text-7xl font-black font-mono tracking-tight text-white group-hover:text-teal-300 transition-colors">
              {currentSpo2 ? `${currentSpo2}%` : '--'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Perfusion Index: 4.8%</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {progress >= 100 ? 'OPTIMAL ✓' : 'Sensing...'}
            </span>
          </div>
        </div>

        {/* Gauge 3: Temperature (°C) */}
        <div className="rounded-3xl bg-slate-900/90 border-2 border-amber-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  {language === 'ta' ? 'உடல் வெப்பநிலை' : 'Body Temperature'}
                </span>
                <span className="text-[10px] text-slate-400">Celsius (°C)</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Norm: 36.1-37.2</span>
          </div>

          <div className="my-4 text-center">
            <span className="text-6xl md:text-7xl font-black font-mono tracking-tight text-white group-hover:text-amber-300 transition-colors">
              {currentTemp ? `${currentTemp.toFixed(1)}°` : '--'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Infrared Thermopile</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {progress >= 100 ? 'STABLE ✓' : 'Sensing...'}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Telemetry: Blood Pressure & Respiration */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between px-5">
          <span className="text-xs text-slate-400">
            {language === 'ta' ? 'இரத்த அழுத்தம் (கணக்கிடப்பட்டது)' : 'Arterial Pressure (BP)'}
          </span>
          <span className="text-xl font-bold font-mono text-slate-200">
            {currentSystolic && currentDiastolic ? `${currentSystolic} / ${currentDiastolic} mmHg` : '-- / --'}
          </span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between px-5">
          <span className="text-xs text-slate-400">
            {language === 'ta' ? 'சுவாச வீதம்' : 'Respiratory Rate'}
          </span>
          <span className="text-xl font-bold font-mono text-slate-200">
            {currentResp ? `${currentResp} breaths/min` : '--'}
          </span>
        </div>
      </div>

      {/* Progress Bar & Real-time Status */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-teal-300 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            {sensorStatus}
          </span>
          <span className="font-mono text-slate-400">3.0s Sensor Cycle</span>
        </div>

        {/* High contrast animated bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 transition-all duration-100 ease-out shadow-lg shadow-teal-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
