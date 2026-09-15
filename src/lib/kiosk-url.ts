/** Standalone kiosk tablet website URL (separate deploy from main HIMS). */
export function getKioskWebUrl() {
  return (
    process.env.NEXT_PUBLIC_KIOSK_URL?.replace(/\/$/, "") ??
    "https://medathon-kiosk.vercel.app"
  );
}
