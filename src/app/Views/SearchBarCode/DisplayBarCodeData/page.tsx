import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { CertificateDetails } from '@/components/certificates/certificate-details'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface DisplayBarCodeDataParams {
  searchParams: Promise<{
    deptName?: string
    serviceId?: string
    barCode?: string
  }>
}

export const metadata = {
  title: 'MahaOnline Certificate Verification',
  description: 'Official online certificate verification and authentication portal. Verify certificate authenticity instantly.',
}

export default async function DisplayBarCodeDataPage({ searchParams }: DisplayBarCodeDataParams) {
  const { barCode } = await searchParams
  const decodedBarcode = (barCode || '').trim()

  if (!decodedBarcode) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 shadow-sm" />
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-4xl">
            <Card className="max-w-md mx-auto border-rose-250 dark:border-rose-900/50 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-1.5 w-full bg-rose-500" />
              <CardHeader className="text-center pt-8 pb-4">
                <div className="mx-auto h-12 w-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-full flex items-center justify-center mb-2 border border-rose-100 dark:border-rose-900">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-rose-800 dark:text-rose-400">
                  Invalid Request
                </CardTitle>
                <CardDescription className="text-xs px-4">
                  No barcode was supplied for verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please provide a valid `barCode` query parameter in the URL.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <footer className="py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-250 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20">
          MahaOnline Verification Portal. Government of Maharashtra.
        </footer>
      </div>
    )
  }

  const supabase = await createClient()
  
  // Lookup certificate by barcode number
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('barcode_number', decodedBarcode)
    .maybeSingle()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:from-slate-950 dark:to-slate-900">
      
      {/* Tricolor stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 shadow-sm" />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          {certificate ? (
            // Certificate found - show details
            <CertificateDetails certificate={certificate} />
          ) : (
            // Certificate not found - show empty state
            <Card className="max-w-md mx-auto border-rose-250 dark:border-rose-900/50 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-1.5 w-full bg-rose-500" />
              <CardHeader className="text-center pt-8 pb-4">
                <div className="mx-auto h-12 w-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-full flex items-center justify-center mb-2 border border-rose-100 dark:border-rose-900">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-rose-800 dark:text-rose-400">
                  Certificate Not Found
                </CardTitle>
                <CardDescription className="text-xs px-4">
                  The certificate verification request could not be authenticated.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 text-center space-y-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We could not find any certificate associated with barcode number: <br />
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded inline-block mt-2 select-all text-xs border border-slate-200 dark:border-slate-700">
                    {decodedBarcode}
                  </span>
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg border border-slate-150 dark:border-slate-800/80 text-xs text-left text-slate-500 dark:text-slate-400 space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-355">Possible Reasons:</div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>The barcode number was typed incorrectly.</li>
                    <li>The certificate has not yet been processed or digitally uploaded.</li>
                    <li>The certificate barcode is invalid or has been revoked.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Mini footer */}
      <footer className="py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-250 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20">
        MahaOnline Verification Portal. Government of Maharashtra.
      </footer>
    </div>
  )
}
