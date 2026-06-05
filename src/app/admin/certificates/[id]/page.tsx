import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { CertificateDetails } from '@/components/certificates/certificate-details'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, QrCode, FileCheck } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface AdminViewParams {
  params: Promise<{ id: string }>
}

export default async function AdminCertificateViewPage({ params }: AdminViewParams) {
  const { id } = await params
  const supabase = await createClient()

  // Query database for this specific certificate ID
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !certificate) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminHeader />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <Link href="/admin/certificates">
            <Button variant="ghost" size="sm" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Registry
            </Button>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link href={`/admin/certificates/${certificate.id}/edit`} className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer">
                <Edit className="h-4 w-4 text-slate-400" />
                Edit Record
              </Button>
            </Link>
            <Link href={`/admin/certificates/${certificate.id}/qr`} className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer">
                <QrCode className="h-4 w-4 text-slate-400" />
                Generate QR
              </Button>
            </Link>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="relative">
          <CertificateDetails certificate={certificate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
