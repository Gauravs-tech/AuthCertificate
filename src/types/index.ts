export type CertificateStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Certificate {
  id: string;
  barcode_number: string;
  certificate_name: string;
  date_applied: string; // ISO date string
  date_digitally_signed: boolean; // Boolean flag
  applicant_name: string;
  beneficiary_name: string;
  designation_of_signatory: string;
  taluka_of_signatory: string;
  district_of_signatory: string;
  status: CertificateStatus;
  created_at: string;
  updated_at: string;
}

export type CreateCertificateInput = Omit<Certificate, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCertificateInput = Partial<CreateCertificateInput>;
