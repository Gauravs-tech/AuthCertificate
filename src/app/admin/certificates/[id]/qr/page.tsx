import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QRCodeView } from '@/components/qr/qr-code-view'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface AdminQRParams {
  params: Promise<{ id: string }>
}

export default async function AdminCertificateQRPage({ params }: AdminQRParams) {
  const { id } = await params

  // Validate UUID format before querying
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!id || !uuidRegex.test(id)) {
    notFound()
  }

  const supabase = await createClient()

  // Query database for this specific certificate ID
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[QR Page] Supabase error for id:', id, error.message)
  }

  if (error || !certificate) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminHeader />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between">
          <Link href={`/admin/certificates/${certificate.id}`}>
            <Button variant="ghost" size="sm" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>
          </Link>
          <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
            Cryptographic QR Code
          </span>
        </div>

        {/* QR View Wrapper */}
        <div className="py-4">
          <QRCodeView
            barcodeNumber={certificate.barcode_number}
            certificateName={certificate.certificate_name}
            applicantName={certificate.applicant_name}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
