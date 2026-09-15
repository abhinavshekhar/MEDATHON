import { redirect } from "next/navigation";
import { getKioskWebUrl } from "@/lib/kiosk-url";

/** Legacy /kiosk path → standalone kiosk website. */
export default function KioskRedirectPage() {
  redirect(getKioskWebUrl());
}
