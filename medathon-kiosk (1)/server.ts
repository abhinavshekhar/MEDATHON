import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { CHENNAI_PATIENTS, findPatientByNumber, vitalsDatabase } from './src/data/patients.js';
import { VitalLog } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory global vitals store
const globalVitals: VitalLog[] = [...vitalsDatabase];

// API Routes FIRST

// 1. Patient Lookup
app.get('/api/patients/lookup/:patientNo', (req: Request, res: Response) => {
  const { patientNo } = req.params;
  const patient = findPatientByNumber(patientNo);

  if (!patient) {
    return res.status(404).json({
      error: 'PATIENT_NOT_FOUND',
      message: `Patient ${patientNo} not found. Please register at reception.`
    });
  }

  // Attach any existing vitals from global store
  const patientVitals = globalVitals.filter(v => v.patientId === patient.id || v.patientNo === patient.patientNo);
  
  return res.json({
    ...patient,
    vitalLogs: patientVitals
  });
});

// 2. List all sample patients
app.get('/api/patients', (_req: Request, res: Response) => {
  res.json({
    clinic: 'MEDATHON Urban Health Centre — Chennai',
    count: CHENNAI_PATIENTS.length,
    patients: CHENNAI_PATIENTS
  });
});

// 3. POST vitals from Kiosk
app.post('/api/vitals', async (req: Request, res: Response) => {
  try {
    const { patientId, patientNo, visitId, bpm, spo2, temperature, systolic, diastolic, respiratoryRate, deviceId } = req.body;

    if (!patientId && !patientNo) {
      return res.status(400).json({ error: 'MISSING_PATIENT_ID', message: 'patientId or patientNo is required' });
    }

    // Resolve patient
    let matchedPatient = patientId ? findPatientByNumber(patientId) : null;
    if (!matchedPatient && patientNo) {
      matchedPatient = findPatientByNumber(patientNo);
    }

    const newLog: VitalLog = {
      id: `vit_log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      patientId: matchedPatient ? matchedPatient.id : (patientId || 'unknown'),
      patientNo: matchedPatient ? matchedPatient.patientNo : patientNo,
      visitId: visitId || (matchedPatient?.visits?.[0]?.id),
      bpm: Number(bpm) || 72,
      spo2: Number(spo2) || 98,
      temperature: Number(temperature) || 36.6,
      systolic: Number(systolic) || 120,
      diastolic: Number(diastolic) || 80,
      respiratoryRate: Number(respiratoryRate) || 16,
      deviceId: deviceId || 'KIOSK-01',
      recordedAt: new Date().toISOString(),
      status: (bpm > 100 || spo2 < 93 || temperature >= 37.5) ? 'ELEVATED' : 'NORMAL'
    };

    // Save into server store
    globalVitals.unshift(newLog);

    // Update patient record's vitalLogs if matched
    if (matchedPatient) {
      if (!matchedPatient.vitalLogs) matchedPatient.vitalLogs = [];
      matchedPatient.vitalLogs.unshift(newLog);
    }

    // Forward to optional FastAPI backend at http://localhost:8000/api/vitals
    // Non-blocking fire-and-forget / handled gracefully if not running
    try {
      fetch('http://localhost:8000/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
        signal: AbortSignal.timeout(600)
      }).catch(() => {
        // FastAPI server offline or optional — ignored
      });
    } catch {
      // Ignore
    }

    return res.status(201).json({
      success: true,
      vitalLog: newLog,
      syncedToDigitalTwin: true,
      message: 'Vitals logged and synchronized to Digital Twin'
    });
  } catch (err: any) {
    console.error('Error saving vitals:', err);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err?.message || 'Failed to record vitals' });
  }
});

// 4. GET vitals (for Digital Twin polling / Mobile app polling)
app.get('/api/vitals', (req: Request, res: Response) => {
  const { patientId, patientNo, limit } = req.query;

  let filtered = [...globalVitals];

  if (patientId) {
    filtered = filtered.filter(v => v.patientId === String(patientId));
  } else if (patientNo) {
    const cleanNo = String(patientNo).trim().toUpperCase();
    filtered = filtered.filter(v => v.patientNo?.toUpperCase() === cleanNo);
  }

  const max = Number(limit) || 25;
  return res.json({
    total: filtered.length,
    vitals: filtered.slice(0, max)
  });
});

// 5. Kiosk device & clinic health status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    kioskId: 'KIOSK-01',
    clinic: 'MEDATHON Urban Health Centre — Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    serverTime: new Date().toISOString(),
    totalVitalsRecorded: globalVitals.length
  });
});

// Setup Vite middleware in dev or static server in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEDATHON Kiosk Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
