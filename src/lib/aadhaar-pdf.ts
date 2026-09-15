import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { AadhaarIdRecord } from "./aadhaar-id";
import { qrPayloadFromRecord } from "./patient-qr";

export async function downloadAadhaarIdPdf(record: AadhaarIdRecord) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [85.6, 54] });
  const w = 85.6;
  const h = 54;

  const qrPayload = qrPayloadFromRecord(record);
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), { margin: 0, width: 128 });

  doc.setFillColor(255, 248, 220);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(180, 130, 0);
  doc.setLineWidth(0.4);
  doc.rect(2, 2, w - 4, h - 4);

  doc.setFillColor(255, 153, 51);
  doc.rect(2, 2, w - 4, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("Government of India", w / 2, 7, { align: "center" });
  doc.setFontSize(5);
  doc.text("ABDM DEMO CARD · SCAN QR FOR RECORDS", w / 2, 9.5, { align: "center" });

  doc.setFillColor(220, 220, 220);
  doc.roundedRect(5, 14, 18, 22, 2, 2, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(14);
  doc.text(record.fullName.slice(0, 1).toUpperCase(), 14, 27, { align: "center" });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(record.fullName, 26, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(`DOB: ${record.dateOfBirth}`, 26, 21);
  doc.text(`Gender: ${record.gender}`, 26, 25);
  doc.text(`Mobile: ${record.mobile ?? "—"}`, 26, 29);

  const addr = doc.splitTextToSize(record.address, 40);
  doc.text(addr.slice(0, 3), 26, 34);

  doc.addImage(qrDataUrl, "PNG", w - 24, 14, 20, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(record.aadhaarMasked, w / 2 - 12, 44, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(120, 120, 120);
  doc.text(`${record.district}, Tamil Nadu — ${record.pinCode}`, w / 2, 48, { align: "center" });
  doc.text(`Scan QR → patient history & vitals`, w / 2, 51, { align: "center" });

  doc.save(`${record.id}-abdm-demo.pdf`);
}
