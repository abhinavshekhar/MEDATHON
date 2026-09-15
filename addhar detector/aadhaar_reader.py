"""
Aadhaar Card Reader — QR Code + OCR fallback, using your laptop webcam.

WHAT THIS DOES
---------------
1. Opens your webcam and looks for a QR code on an Aadhaar card.
2. Decodes it. Handles both QR formats UIDAI has used:
      - "Secure QR" (cards printed ~2019 onwards): a binary payload,
        delimiter-separated (byte value 255 = 0xFF), no XML.
      - "Old QR" (cards before ~2019): plain XML text.
3. If no QR is found (damaged card, laminated glare, printed on paper
   badly, etc.), press 'o' to fall back to OCR on the card image instead.
4. Prints all extracted fields to the terminal.

REQUIREMENTS
------------
pip install opencv-python pyzbar pytesseract --break-system-packages

You also need the `zbar` shared library on your system for pyzbar to work,
and `tesseract-ocr` installed for the OCR fallback:
    Ubuntu/Debian: sudo apt install libzbar0 tesseract-ocr
    macOS:         brew install zbar tesseract
    Windows:       install tesseract from
                   https://github.com/UB-Mannheim/tesseract/wiki
                   and zbar from https://github.com/NaturalHistoryMuseum/pyzbar
                   (DLLs are bundled with the pip package on Windows, usually
                   no extra step needed)

IMPORTANT — PRIVACY / LEGAL NOTE
---------------------------------
Aadhaar data (Aadhaar number, address, biometric-linked photo, etc.) is
sensitive personal data under India's DPDP Act, 2023. If you're using this
for a real data-collection app (e.g. the farmer records project):
  - Only ever store/display the LAST 4 DIGITS of the Aadhaar number unless
    you have a specific, lawful, consented reason to store the full number
    (this script masks it by default — see MASK_AADHAAR below).
  - Get explicit consent before scanning someone's Aadhaar.
  - Don't upload raw Aadhaar images/QR data to any third-party server.
  - Store whatever you do keep encrypted at rest.
"""

import cv2
import re
import sys
import zlib
from datetime import datetime

from pyzbar.pyzbar import decode as zbar_decode

# ---- Settings you may want to tweak -----------------------------------
MASK_AADHAAR = True   # True => only last 4 digits are shown/printed
CAMERA_INDEX = 0      # 0 = default webcam; try 1, 2... if you have multiple
# -------------------------------------------------------------------------


def mask_aadhaar(number: str) -> str:
    digits = re.sub(r"\D", "", number or "")
    if not MASK_AADHAAR or len(digits) < 4:
        return number
    return "XXXX XXXX " + digits[-4:]


# -------------------------------------------------------------------------
# Old-format QR (plain XML) — e.g.
# <PrintLetterBarcodeData uid="123456789012" name="Ravi Kumar"
#   gender="M" yob="1990" ... house="12" street="Main Rd" ... />
# -------------------------------------------------------------------------
def parse_xml_qr(text: str) -> dict:
    fields = {}
    attr_pattern = re.compile(r'(\w+)="([^"]*)"')
    for key, value in attr_pattern.findall(text):
        fields[key] = value
    return fields


# -------------------------------------------------------------------------
# Secure QR (binary, delimiter = byte 255) — used on Aadhaar cards printed
# from ~2019 onward. Layout (fields separated by 0xFF), in order:
#   0 email/mobile present indicator (bit-flag, digit)
#   1 reference id (timestamp + last 4 digits of Aadhaar)
#   2 name
#   3 date of birth
#   4 gender
#   5 address fields (co/house/street/landmark/area/vtc/subdist/dist/state/pincode)
#     -> actually spread across multiple following delimited slots
#   ... last-but-one: photo (jpeg bytes, not delimiter-safe, so must be last)
# The exact slot count has changed slightly across UIDAI versions, so we
# parse defensively: split on 0xFF, decode each text slot, and detect the
# raw JPEG (starts with bytes FF D8) as the photo, wherever it lands.
# -------------------------------------------------------------------------
def parse_secure_qr(raw_bytes: bytes) -> dict:
    # Secure QR payload is zlib-compressed (raw deflate, no zlib header) in
    # most versions; try a couple of decompression strategies.
    data = raw_bytes
    for wbits in (-15, 15, 47):
        try:
            data = zlib.decompress(raw_bytes, wbits)
            break
        except zlib.error:
            continue
    else:
        # Not compressed at all (rare / very old secure QR) — use as-is.
        data = raw_bytes

    parts = data.split(b"\xff")

    def safe_text(b):
        try:
            return b.decode("utf-8", errors="ignore").strip()
        except Exception:
            return ""

    # Find where the JPEG photo starts (marks end of usable text fields).
    photo_index = None
    for i, p in enumerate(parts):
        if p[:2] == b"\xd8\xff" or p[:3] == b"\xff\xd8\xff" or p[:2] == b"\xff\xd8":
            photo_index = i
            break

    text_parts = [safe_text(p) for p in parts[: photo_index if photo_index else len(parts)]]

    # Known field order for the common v2/v3 secure QR layout.
    labels = [
        "email_mobile_flag", "reference_id", "name", "dob", "gender",
        "co", "district", "landmark", "house", "location",
        "pincode", "post_office", "state", "street", "sub_district", "vtc",
    ]

    fields = {}
    for label, value in zip(labels, text_parts):
        if value:
            fields[label] = value

    # reference_id's last 4 digits are the last 4 digits of the Aadhaar
    # number (Secure QR never exposes the full number, by design).
    ref_id = fields.get("reference_id", "")
    digits = re.sub(r"\D", "", ref_id)
    if len(digits) >= 4:
        fields["aadhaar_last4"] = digits[-4:]

    fields["_has_photo"] = photo_index is not None
    return fields


def looks_like_xml(raw: bytes) -> bool:
    return raw.strip().startswith(b"<") and b"uid=" in raw[:200].lower()


def print_fields(fields: dict, source: str):
    print("\n" + "=" * 50)
    print(f"AADHAAR DETAILS (source: {source})")
    print("=" * 50)

    # Friendly ordering + masking for known keys.
    if "uid" in fields:  # old XML format
        print(f"Aadhaar Number : {mask_aadhaar(fields.get('uid', ''))}")
        print(f"Name           : {fields.get('name', '')}")
        print(f"Gender         : {fields.get('gender', '')}")
        dob = fields.get('dob') or fields.get('yob', '')
        print(f"DOB / YOB      : {dob}")
        addr_keys = ["house", "street", "lm", "loc", "vtc", "po",
                     "dist", "subdist", "state", "pc"]
        address = ", ".join(fields[k] for k in addr_keys if fields.get(k))
        print(f"Address        : {address}")
    else:  # secure QR format
        aadhaar_display = ("XXXX XXXX " + fields["aadhaar_last4"]
                            if "aadhaar_last4" in fields else "not present in QR (by design)")
        print(f"Aadhaar Number : {aadhaar_display}")
        print(f"Name           : {fields.get('name', '')}")
        print(f"Gender         : {fields.get('gender', '')}")
        print(f"DOB            : {fields.get('dob', '')}")
        addr_keys = ["co", "house", "street", "landmark", "location",
                     "vtc", "post_office", "sub_district", "district",
                     "state", "pincode"]
        address = ", ".join(fields[k] for k in addr_keys if fields.get(k))
        print(f"Address        : {address}")
        print(f"Photo embedded : {'Yes' if fields.get('_has_photo') else 'No'}")

    print("=" * 50)
    print(f"Scanned at     : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")


def run_ocr(frame) -> dict:
    """Fallback: OCR the raw frame (used when no QR is detected/decodable)."""
    try:
        import pytesseract
    except ImportError:
        print("pytesseract not installed — run: pip install pytesseract "
              "--break-system-packages, and install the tesseract-ocr binary.")
        return {}

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    text = pytesseract.image_to_string(gray)

    fields = {"raw_ocr_text": text.strip()}

    uid_match = re.search(r"\b(\d{4}\s?\d{4}\s?\d{4})\b", text)
    if uid_match:
        fields["uid"] = uid_match.group(1)

    dob_match = re.search(r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b", text)
    if dob_match:
        fields["dob"] = dob_match.group(1)

    if re.search(r"\bmale\b", text, re.IGNORECASE) and "female" not in text.lower():
        fields["gender"] = "M"
    elif re.search(r"\bfemale\b", text, re.IGNORECASE):
        fields["gender"] = "F"

    return fields


def print_ocr_fields(fields: dict):
    print("\n" + "=" * 50)
    print("AADHAAR DETAILS (source: OCR — best-effort, verify manually)")
    print("=" * 50)
    print(f"Aadhaar Number : {mask_aadhaar(fields.get('uid', 'not detected'))}")
    print(f"DOB            : {fields.get('dob', 'not detected')}")
    print(f"Gender         : {fields.get('gender', 'not detected')}")
    print("-" * 50)
    print("Raw OCR text (for manual review):")
    print(fields.get("raw_ocr_text", ""))
    print("=" * 50 + "\n")


def main():
    cap = cv2.VideoCapture(CAMERA_INDEX)
    if not cap.isOpened():
        print(f"Could not open camera index {CAMERA_INDEX}. "
              f"Try a different CAMERA_INDEX value at the top of the script.")
        sys.exit(1)

    print("Aadhaar Reader running.")
    print("  - Hold the Aadhaar card's QR code steadily in front of the camera.")
    print("  - Press 'o' any time to try OCR on the current frame instead.")
    print("  - Press 'q' to quit.\n")

    already_printed = set()

    while True:
        ok, frame = cap.read()
        if not ok:
            print("Failed to read from camera.")
            break

        decoded_objects = zbar_decode(frame)
        for obj in decoded_objects:
            raw = obj.data  # bytes
            key = hash(raw)
            if key in already_printed:
                continue  # avoid reprinting the same QR every frame
            already_printed.add(key)

            if looks_like_xml(raw):
                text = raw.decode("utf-8", errors="ignore")
                fields = parse_xml_qr(text)
                print_fields(fields, source="Old XML QR")
            else:
                fields = parse_secure_qr(raw)
                print_fields(fields, source="Secure QR")

            # Draw a box around the detected QR for visual feedback.
            (x, y, w, h) = obj.rect
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, "QR captured - see terminal", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("Aadhaar Reader (press 'o' for OCR, 'q' to quit)", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('o'):
            fields = run_ocr(frame)
            print_ocr_fields(fields)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
