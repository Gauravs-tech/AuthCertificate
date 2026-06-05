import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { EditCertificateClient } from './edit-client'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface AdminEditParams {
  params: Promise<{ id: string }>
}

export default async function AdminEditCertificatePage({ params }: AdminEditParams) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch certificate details
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
        
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/admin/certificates/${certificate.id}`}>
              <Button variant="ghost" size="sm" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Cancel & Go Back
              </Button>
            </Link>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
            Modify Document Entry
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Certificate Registry Entry
          </h1>
          <p className="text-xs text-slate-500">
            Updating barcode: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{certificate.barcode_number}</span>
          </p>
        </div>

        {/* Edit Form Wrapper */}
        <EditCertificateClient certificate={certificate} />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
