import { z } from "zod";

export const patientRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  ageYears: z.coerce.number().min(0).max(150).optional(),
  ageMonths: z.coerce.number().min(0).max(11).optional(),
  ageDays: z.coerce.number().min(0).max(30).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]),
  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "SEPARATED", "WIDOW", "WIDOWER"])
    .optional(),
  fatherSpouseName: z.string().optional(),
  ashaWorker: z.string().optional(),
  bloodGroup: z.string().optional(),
  category: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  mobile: z.string().optional(),
  aadhaarNo: z.string().optional(),
  epicNo: z.string().optional(),
  abhaAddress: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
  ward: z.string().optional(),
  village: z.string().optional(),
  pinCode: z.string().optional(),
  address: z.string().optional(),
  opdType: z.string().min(1, "OPD type is required"),
  doctorName: z.string().min(1, "Doctor is required"),
  referredBy: z.string().min(1, "Referred by is required"),
  reason: z.string().min(1, "Reason is required"),
  feeAmount: z.coerce.number().min(0).default(0),
  paymentCollected: z.boolean().default(false),
  schemePMJAY: z.boolean().default(false),
  schemeBPL: z.boolean().default(false),
});

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>;
