import React, { useRef, useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  ArrowLeft, 
  AlertCircle, 
  UploadCloud, 
  Search, 
  CheckCircle2, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { parsePatientQr } from '../lib/patient-qr';
import { apiFetch } from '../lib/api';
import { Patient, KioskLanguage } from '../types';
import { CHENNAI_PATIENTS } from '../data/patients';

interface StateScannerProps {
  language: KioskLanguage;
  onPatientFound: (patient: Patient) => void;
  onBack: () => void;
  onManualEntry: () => void;
}

export const StateScanner: React.FC<StateScannerProps> = ({
  language,
  onPatientFound,
  onBack,
  onManualEntry
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingLookup, setIsLoadingLookup] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        setErrorMessage(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setCameraActive(true);
          setHasCamera(true);
          scanFrame();
        }
      } catch (err: any) {
        console.warn('Camera access denied or unavailable in current context:', err);
        setHasCamera(false);
        setCameraActive(false);
      }
    };

    const scanFrame = () => {
      if (!isScanning) return;

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });

            if (code && code.data) {
              handleRawQrScanned(code.data);
              return; // Stop loop once detected
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    startCamera();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacing, isScanning]);

  const handleRawQrScanned = async (rawCode: string) => {
    const parsed = parsePatientQr(rawCode);
    if (!parsed || !parsed.patientNo) {
      setErrorMessage(language === 'ta' 
        ? 'தவறான QR குறியீடு. மேடத்தான் நோயாளி QR மட்டுமே ஏற்கப்படும்.' 
        : 'Unrecognized QR code format. Please present a valid MEDATHON ABDM QR.');
      return;
    }

    await lookupPatient(parsed.patientNo);
  };

  const lookupPatient = async (patientNo: string) => {
    setIsLoadingLookup(true);
    setErrorMessage(null);

    try {
      const cleanNo = patientNo.trim().toUpperCase();
      const res = await apiFetch(`/api/patients/lookup/${encodeURIComponent(cleanNo)}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setErrorMessage(language === 'ta'
            ? `நோயாளி (${cleanNo}) காணப்படவில்லை. வரவேற்பறையில் பதிவு செய்யவும்.`
            : `Patient (${cleanNo}) not found. Please register at reception desk.`);
        } else {
          setErrorMessage('Error connecting to clinic server. Please check connection.');
        }
        setIsLoadingLookup(false);
        return;
      }

      const patient: Patient = await res.json();
      setIsScanning(false);
      onPatientFound(patient);
    } catch (err: any) {
      console.error('Lookup request error:', err);
      setErrorMessage('Cannot reach clinic server. Check Wi-Fi or local network.');
    } finally {
      setIsLoadingLookup(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    lookupPatient(manualInput.trim());
  };

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code && code.data) {
            handleRawQrScanned(code.data);
          } else {
            setErrorMessage(language === 'ta' ? 'படத்திலிருந்து QR குறியீட்டைக் கண்டறிய முடியவில்லை' : 'No valid QR code found in the uploaded image.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-10 bg-[#0f172a] text-slate-100 select-none relative overflow-hidden">
      {/* Hidden canvas for jsQR processing */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <button
          id="btn-scanner-back"
          onClick={onBack}
          className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'ta' ? 'பின்செல்' : 'Back to Welcome'}</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ta' ? 'நோயாளி ABDM QR ஸ்கேனர்' : 'Patient ABDM QR Scanner'}
          </h2>
          <p className="text-xs text-teal-400">
            {language === 'ta' ? 'கேமரா முன் QR குறியீட்டை காட்டவும்' : 'Hold QR code squarely in the scanning reticle'}
          </p>
        </div>

        {/* Camera flip toggle */}
        <div className="flex items-center space-x-2">
          {hasCamera && (
            <button
              onClick={() => setCameraFacing(f => f === 'user' ? 'environment' : 'user')}
              className="h-12 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
              title="Switch Front/Back Camera"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Flip Camera</span>
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-12 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            title="Upload QR Image"
          >
            <UploadCloud className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Upload QR</span>
          </button>
        </div>
      </div>

      {/* Center Scanner Viewport */}
      <div className="my-auto flex flex-col items-center justify-center relative z-10 w-full max-w-2xl mx-auto">
        {/* Scanner Container with animated HUD reticle */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-slate-950 border-2 border-teal-500/40 shadow-2xl flex items-center justify-center">
          {/* Live Video element */}
          {hasCamera ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <CameraOff className="w-12 h-12 text-slate-500 mb-3" />
              <p className="text-sm font-medium text-slate-300">
                {language === 'ta' ? 'கேமரா கிடைக்கவில்லை' : 'Camera Feed Not Available'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {language === 'ta' 
                  ? 'கீழே உள்ள விரைவு டெமோ நோயாளியைத் தேர்ந்தெடுக்கவும் அல்லது ஐடி உள்ளிடவும்.'
                  : 'Select a demo patient below or enter Patient ID manually.'}
              </p>
            </div>
          )}

          {/* Scanner Corner Brackets HUD */}
          <div className="absolute inset-4 pointer-events-none">
            {/* Top-Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
            {/* Top-Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />
          </div>

          {/* Animated Laser Scanning Line */}
          <div 
            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400/50 pointer-events-none animate-pulse"
            style={{
              animation: 'scannerLaser 2.2s ease-in-out infinite'
            }}
          />

          {/* Loading lookup overlay */}
          {isLoadingLookup && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-20">
              <RefreshCw className="w-10 h-10 text-teal-400 animate-spin mb-3" />
              <p className="text-sm font-semibold text-white">
                {language === 'ta' ? 'நோயாளி விவரங்கள் பெறப்படுகின்றன...' : 'Looking up patient record...'}
              </p>
              <p className="text-xs text-teal-300 font-mono mt-1">/api/patients/lookup</p>
            </div>
          )}
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-sm flex items-center space-x-2.5 max-w-lg shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-rose-300">
                {language === 'ta' ? 'நோயாளி கண்டறியப்படவில்லை' : 'Patient Not Found'}
              </p>
              <p className="text-xs text-rose-200/90">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-900 text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Manual Search Bar fallback */}
        <form onSubmit={handleManualSearch} className="mt-6 flex items-center space-x-2 w-full max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. P-CHN-20260915-0001"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 font-mono tracking-wider"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim() || isLoadingLookup}
            className="h-12 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>{language === 'ta' ? 'தேடு' : 'Lookup'}</span>
          </button>
        </form>
      </div>

      {/* Bottom Quick Test Patients (Direct 1-tap simulation of scanned QR) */}
      <div className="relative z-10 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {language === 'ta' ? 'உடனடி QR உருவகப்படுத்துதல் (சென்னை நோயாளிகள்):' : 'Instant 1-Click QR Simulation:'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Tap any patient to simulate camera QR capture</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHENNAI_PATIENTS.slice(0, 4).map((patient) => (
            <button
              key={patient.id}
              onClick={() => lookupPatient(patient.patientNo)}
              className="h-14 p-2.5 rounded-xl bg-slate-900 hover:bg-teal-950/40 border border-slate-800 hover:border-teal-500/50 flex items-center space-x-3 text-left transition-all cursor-pointer group"
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: `hsl(${(patient.ageYears * 15) % 360}, 65%, 35%)` }}
              >
                {patient.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate group-hover:text-teal-300">
                  {patient.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {patient.patientNo} · {patient.ageYears}y {patient.gender.charAt(0)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
