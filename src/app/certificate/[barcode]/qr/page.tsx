import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { QRCodeView } from '@/components/qr/qr-code-view'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, Award } from 'lucide-react'
import Link from 'next/link'

interface PublicQRParams {
  params: Promise<{ barcode: string }>
}

export default async function PublicQRPage({ params }: PublicQRParams) {
  const { barcode } = await params
  const decodedBarcode = decodeURIComponent(barcode).trim()

  const supabase = await createClient()
  const { data: certificate } = await supabase
    .from('certificates')
    .select('*')
    .eq('barcode_number', decodedBarcode)
    .maybeSingle()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Top Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 shadow-sm" />

      {/* Mini header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/admin/login" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow">
              <Award className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-slate-950 dark:text-white text-sm leading-tight">
                MahaOnline Verification
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Govt. of Maharashtra
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {certificate ? (
            <QRCodeView
              barcodeNumber={certificate.barcode_number}
              certificateName={certificate.certificate_name}
              applicantName={certificate.applicant_name}
            />
          ) : (
            <Card className="border-rose-200 dark:border-rose-900/50 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-1.5 w-full bg-rose-500" />
              <CardHeader className="text-center pt-8 pb-4">
                <div className="mx-auto h-12 w-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-full flex items-center justify-center mb-2 border border-rose-100 dark:border-rose-900">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-rose-800 dark:text-rose-400">
                  QR Code Unavailable
                </CardTitle>
                <CardDescription className="text-xs">
                  We cannot generate a QR code for a non-existent certificate.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No certificate is registered under barcode: <br />
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded inline-block mt-2 text-xs">
                    {decodedBarcode}
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Mini footer */}
      <footer className="py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white/45 dark:bg-slate-950/20">
        MahaOnline Verification Portal. Government of Maharashtra.
      </footer>
    </div>
  )
}
