'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CertificateForm } from '@/components/forms/certificate-form'
import { type Certificate } from '@/types'
import { type CertificateFormValues } from '@/lib/validations/certificate'
import { toast } from 'sonner'

interface EditCertificateClientProps {
  certificate: Certificate
}

export function EditCertificateClient({ certificate }: EditCertificateClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const onSubmit = async (values: CertificateFormValues) => {
    setIsLoading(true)
    try {
      // Update certificate in Supabase
      const { data, error } = await supabase
        .from('certificates')
        .update({
          barcode_number: values.barcode_number.trim(),
          certificate_name: values.certificate_name,
          date_applied: new Date(values.date_applied).toISOString(),
          date_digitally_signed: values.date_digitally_signed,
          applicant_name: values.applicant_name.trim(),
          beneficiary_name: values.beneficiary_name.trim(),
          designation_of_signatory: values.designation_of_signatory,
          taluka_of_signatory: values.taluka_of_signatory,
          district_of_signatory: values.district_of_signatory,
          status: values.status,
        })
        .eq('id', certificate.id)
        .select()

      if (error) {
        if (error.code === '23505') {
          // Unique key constraint violation code
          toast.error('The Barcode Number already exists. Barcode must be unique.')
        } else {
          toast.error(`Database error: ${error.message}`)
        }
      } else {
        toast.success('Certificate details updated successfully!')
        router.push(`/admin/certificates/${certificate.id}`)
        router.refresh()
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  // Map database entity to form initial values
  const initialFormValues: Partial<CertificateFormValues> = {
    barcode_number: certificate.barcode_number,
    certificate_name: certificate.certificate_name as any,
    date_applied: certificate.date_applied,
    date_digitally_signed: certificate.date_digitally_signed,
    applicant_name: certificate.applicant_name,
    beneficiary_name: certificate.beneficiary_name,
    designation_of_signatory: certificate.designation_of_signatory as any,
    taluka_of_signatory: certificate.taluka_of_signatory as any,
    district_of_signatory: certificate.district_of_signatory as any,
    status: certificate.status as any,
  }

  return (
    <CertificateForm
      initialData={initialFormValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitButtonText="Update Certificate"
    />
  )
}
