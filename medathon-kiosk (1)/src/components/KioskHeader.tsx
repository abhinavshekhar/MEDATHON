import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  BatteryCharging, 
  Maximize, 
  Minimize, 
  Globe, 
  Layers, 
  QrCode, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { KIOSK_CONFIG } from '../lib/config';
import { KioskLanguage } from '../types';

interface KioskHeaderProps {
  language: KioskLanguage;
  onLanguageToggle: () => void;
  onOpenDigitalTwin: () => void;
  onOpenQrModal: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  language,
  onLanguageToggle,
  onOpenDigitalTwin,
  onOpenQrModal
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="h-16 px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between select-none z-30">
      {/* Clinic & Kiosk Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
          <Activity className="w-6 h-6 animate-pulse text-teal-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{KIOSK_CONFIG.clinicName}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-teal-950 text-teal-400 border border-teal-800/60 font-semibold">
                CHENNAI
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>{language === 'ta' ? 'நகர்ப்புற சுகாதார மையம் · 11" தொடுதிரை முனை' : 'Digital Twin Node · 11" Reception Tablet'}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-slate-300 font-mono">{KIOSK_CONFIG.deviceId}</span>
          </p>
        </div>
      </div>

      {/* Center Online & Telemetry Status */}
      <div className="hidden md:flex items-center space-x-4 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-400 font-mono tracking-wide">
            ONLINE · 5G
          </span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time || '09:00:00 AM'} IST</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center space-x-1 text-slate-400 text-xs">
          <Wifi className="w-3.5 h-3.5 text-teal-400" />
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      {/* Right controls: Language, Digital Twin Inspector, QR Codes, Fullscreen */}
      <div className="flex items-center space-x-2">
        {/* Digital Twin live inspector button */}
        <button
          id="btn-digital-twin-monitor"
          onClick={onOpenDigitalTwin}
          className="h-10 px-3 rounded-lg bg-teal-900/30 hover:bg-teal-900/50 border border-teal-600/40 text-teal-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          title="Inspect Desktop & Mobile Digital Twin Sync"
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Digital Twin Monitor</span>
        </button>

        {/* Test QR modal */}
        <button
          id="btn-qr-sample-picker"
          onClick={onOpenQrModal}
          className="h-10 px-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
          title="View & Scan Patient ABDM QRs"
        >
          <QrCode className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Patient QRs</span>
        </button>

        {/* Language toggle */}
        <button
          id="btn-language-toggle"
          onClick={onLanguageToggle}
          className="h-10 px-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* Fullscreen toggle */}
        <button
          id="btn-kiosk-fullscreen"
          onClick={toggleFullscreen}
          className="h-10 w-10 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Tablet Kiosk Fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
