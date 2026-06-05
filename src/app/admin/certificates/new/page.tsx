'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader } from '@/components/admin/admin-header'
import { CertificateForm } from '@/components/forms/certificate-form'
import { type CertificateFormValues } from '@/lib/validations/certificate'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Award } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminNewCertificatePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const onSubmit = async (values: CertificateFormValues) => {
    setIsLoading(true)
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('certificates')
        .insert([
          {
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
          },
        ])
        .select()

      if (error) {
        if (error.code === '23505') {
          // Unique key constraint violation code
          toast.error('The Barcode Number already exists. Please choose a unique barcode number.')
        } else {
          toast.error(`Database error: ${error.message}`)
        }
      } else {
        toast.success('Certificate created successfully!')
        router.push('/admin/certificates')
        router.refresh()
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminHeader />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/admin/certificates">
              <Button variant="ghost" size="sm" className="text-xs font-semibold flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Registry
              </Button>
            </Link>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
            Create Document Entry
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Register New Certificate
          </h1>
          <p className="text-xs text-slate-500">
            Provide the required details to create an authentic verification entry in the MahaOnline database.
          </p>
        </div>

        {/* Certificate Form */}
        <CertificateForm 
          onSubmit={onSubmit} 
          isLoading={isLoading} 
          submitButtonText="Issue Certificate" 
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
