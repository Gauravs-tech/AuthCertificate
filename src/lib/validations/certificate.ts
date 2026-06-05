import { z } from 'zod'
import { CERTIFICATE_NAMES, DESIGNATIONS, TALUKAS, DISTRICTS, STATUSES } from '@/constants'

export const certificateSchema = z.object({
  barcode_number: z
    .string()
    .min(1, 'Barcode Number is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Barcode Number must be alphanumeric (can include hyphens)'),
  certificate_name: z.enum(CERTIFICATE_NAMES, {
    message: 'Invalid Certificate Name',
  }),
  date_applied: z
    .string()
    .min(1, 'Date Applied On is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid Date Applied On value',
    }),
  date_digitally_signed: z.boolean(),
  applicant_name: z
    .string()
    .min(3, 'Applicant Name must be at least 3 characters'),
  beneficiary_name: z
    .string()
    .min(3, 'Beneficiary Name must be at least 3 characters'),
  designation_of_signatory: z.enum(DESIGNATIONS, {
    message: 'Invalid Designation',
  }),
  taluka_of_signatory: z.enum(TALUKAS, {
    message: 'Invalid Taluka',
  }),
  district_of_signatory: z.enum(DISTRICTS, {
    message: 'Invalid District',
  }),
  status: z.enum(STATUSES, {
    message: 'Invalid Status',
  }),
})

export type CertificateFormValues = z.infer<typeof certificateSchema>;
