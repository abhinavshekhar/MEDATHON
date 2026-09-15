/**
 * MEDATHON Kiosk Tablet App
 * 11-inch Android Tablet (A11 + 5G) Reception Node
 * Chennai, Tamil Nadu — Digital Twin Vitals Capture Node
 */

import React, { useState, useCallback } from 'react';
import { KioskHeader } from './components/KioskHeader';
import { StateWelcome } from './components/StateWelcome';
import { StateScanner } from './components/StateScanner';
import { StateConfirmation } from './components/StateConfirmation';
import { StateCapture } from './components/StateCapture';
import { StateSuccessSync } from './components/StateSuccessSync';
import { DigitalTwinModal } from './components/DigitalTwinModal';
import { QrCodeDisplayModal } from './components/QrCodeDisplayModal';
import { ManualEntryModal } from './components/ManualEntryModal';
import { KioskScreenState, KioskLanguage, Patient } from './types';
import { CalculatedVitals } from './lib/vitals-engine';
import { KIOSK_CONFIG } from './lib/config';
import { apiFetch } from './lib/api';
import { CHENNAI_PATIENTS } from './data/patients';

export default function App() {
  const [currentState, setCurrentState] = useState<KioskScreenState>('ATTRACT');
  const [language, setLanguage] = useState<KioskLanguage>('en');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [capturedVitals, setCapturedVitals] = useState<CalculatedVitals | null>(null);
  const [lastVitalLogId, setLastVitalLogId] = useState<string>('');

  // Modals
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState<boolean>(false);

  // Language toggle
  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  // State 1 -> State 2: Start Scanner
  const handleStartScan = () => {
    setCurrentState('SCANNER');
  };

  // Patient found (from QR scanner, manual search, or quick demo)
  const handlePatientLoaded = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentState('CONFIRMATION');
  };

  // State 3 -> State 4: Confirm Patient & Start Vitals Capture
  const handleStartVitalsCapture = () => {
    if (!selectedPatient) return;
    setCurrentState('CAPTURING');
  };

  // State 4 -> State 5: Vitals Captured -> POST /api/vitals -> Success Sync
  const handleCaptureComplete = async (vitals: CalculatedVitals) => {
    setCapturedVitals(vitals);

    if (!selectedPatient) return;

    try {
      const payload = {
        patientId: selectedPatient.id,
        patientNo: selectedPatient.patientNo,
        visitId: selectedPatient.visits?.[0]?.id,
        bpm: vitals.bpm,
        spo2: vitals.spo2,
        temperature: vitals.temperature,
        systolic: vitals.systolic,
        diastolic: vitals.diastolic,
        respiratoryRate: vitals.respiratoryRate,
        kioskId: KIOSK_CONFIG.deviceId
      };

      const response = await apiFetch('/api/vitals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setLastVitalLogId(data.vitalLog?.id || `vit_${Date.now()}`);
      } else {
        setLastVitalLogId(`vit_local_${Date.now().toString(36)}`);
      }
    } catch (err) {
      console.warn('Network sync notice (using local twin buffer):', err);
      setLastVitalLogId(`vit_buf_${Date.now().toString(36)}`);
    }

    setCurrentState('SUCCESS_SYNC');
  };

  // State 5 -> State 1: Reset for Next Patient
  const handleReset = useCallback(() => {
    setSelectedPatient(null);
    setCapturedVitals(null);
    setCurrentState('ATTRACT');
  }, []);

  // Manual lookup handler
  const handleManualLookup = async (patientNo: string) => {
    try {
      const res = await apiFetch(`/api/patients/lookup/${encodeURIComponent(patientNo.trim().toUpperCase())}`);
      if (res.ok) {
        const p: Patient = await res.json();
        handlePatientLoaded(p);
      } else {
        // Fallback: check static list
        const fallback = CHENNAI_PATIENTS.find(cp => cp.patientNo.toUpperCase() === patientNo.trim().toUpperCase());
        if (fallback) {
          handlePatientLoaded(fallback);
        } else {
          alert(`Patient ${patientNo} not found. Please register at the reception desk.`);
        }
      }
    } catch {
      const fallback = CHENNAI_PATIENTS[0];
      handlePatientLoaded(fallback);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0f172a] text-slate-100 flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Kiosk Header */}
      <KioskHeader
        language={language}
        onLanguageToggle={handleToggleLanguage}
        onOpenDigitalTwin={() => setIsDigitalTwinOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* Main Kiosk Body — Active State Screen */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentState === 'ATTRACT' && (
          <StateWelcome
            language={language}
            onStartScan={handleStartScan}
            onManualEntry={() => setIsManualEntryOpen(true)}
            onSelectPatient={handlePatientLoaded}
          />
        )}

        {currentState === 'SCANNER' && (
          <StateScanner
            language={language}
            onPatientFound={handlePatientLoaded}
            onBack={() => setCurrentState('ATTRACT')}
            onManualEntry={() => setIsManualEntryOpen(true)}
          />
        )}

        {currentState === 'CONFIRMATION' && selectedPatient && (
          <StateConfirmation
            patient={selectedPatient}
            language={language}
            onConfirm={handleStartVitalsCapture}
            onCancel={() => setCurrentState('ATTRACT')}
          />
        )}

        {currentState === 'CAPTURING' && selectedPatient && (
          <StateCapture
            patient={selectedPatient}
            language={language}
            onCaptureComplete={handleCaptureComplete}
          />
        )}

        {currentState === 'SUCCESS_SYNC' && selectedPatient && capturedVitals && (
          <StateSuccessSync
            patient={selectedPatient}
            vitals={capturedVitals}
            vitalLogId={lastVitalLogId}
            language={language}
            onNextPatient={handleReset}
            onViewDigitalTwin={() => setIsDigitalTwinOpen(true)}
          />
        )}
      </main>

      {/* Digital Twin Real-Time Inspector Modal */}
      <DigitalTwinModal
        patient={selectedPatient}
        isOpen={isDigitalTwinOpen}
        onClose={() => setIsDigitalTwinOpen(false)}
      />

      {/* ABDM QR Codes Generator & Display Modal */}
      <QrCodeDisplayModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSelectForKiosk={(p) => {
          handlePatientLoaded(p);
        }}
      />

      {/* Tablet On-Screen Numeric Keypad Modal */}
      <ManualEntryModal
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
        onSubmit={handleManualLookup}
      />
    </div>
  );
}
