'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Printer, Check, Link2, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeViewProps {
  barcodeNumber: string
  certificateName: string
  applicantName: string
}

export function QRCodeView({ barcodeNumber, certificateName, applicantName }: QRCodeViewProps) {
  const [qrSrc, setQrSrc] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [appUrl, setAppUrl] = useState<string>('http://localhost:3000')

  useEffect(() => {
    // Get host URL dynamically
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || origin
    setAppUrl(configuredUrl)

    const verificationUrl = `${configuredUrl}/verify/${barcodeNumber}`

    // Generate QR Code
    QRCode.toDataURL(
      verificationUrl,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a', // Slate 900
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (err) {
          console.error('Error generating QR Code', err)
          return
        }
        setQrSrc(url)
      }
    )
  }, [barcodeNumber])

  const verificationLink = `${appUrl}/verify/${barcodeNumber}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const shareCertificate = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Verify Certificate - ${applicantName}`,
          text: `Verify the authenticity of the ${certificateName} for ${applicantName}.`,
          url: verificationLink,
        })
        toast.success('Shared successfully!')
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('Error sharing', err)
      }
    } else {
      copyToClipboard()
      toast.info('Sharing not supported on this device. Link copied to clipboard!')
    }
  }

  const downloadQR = () => {
    if (!qrSrc) return
    const link = document.createElement('a')
    link.href = qrSrc
    link.download = `QR_${barcodeNumber}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const printQR = () => {
    // Open a simple print window specifically for the QR
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${barcodeNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .container {
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              padding: 40px;
              max-width: 400px;
            }
            img {
              width: 250px;
              height: 250px;
              margin-bottom: 20px;
            }
            h2 {
              margin: 0 0 10px 0;
              color: #0f172a;
            }
            p {
              margin: 5px 0;
              color: #64748b;
              font-size: 14px;
            }
            .barcode {
              font-family: monospace;
              font-size: 16px;
              font-weight: bold;
              background-color: #f1f5f9;
              padding: 6px 12px;
              border-radius: 4px;
              margin-top: 10px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Certificate Verification QR</h2>
            <img src="${qrSrc}" alt="QR Code" />
            <p><strong>Certificate:</strong> ${certificateName}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <div class="barcode">${barcodeNumber}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <Card className="max-w-md mx-auto border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="text-center bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 py-6">
        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Verification QR Code
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          Scan to verify authenticity of this certificate instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
        {qrSrc ? (
          <div className="relative p-4 bg-white border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
            <img src={qrSrc} alt="Certificate Verification QR Code" className="w-56 h-56 select-none" />
          </div>
        ) : (
          <div className="w-56 h-56 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center">
            <span className="text-xs text-slate-400">Generating QR Code...</span>
          </div>
        )}

        <div className="w-full text-center space-y-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{applicantName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{certificateName}</div>
          <div className="inline-block bg-slate-100 dark:bg-slate-800 rounded px-3 py-1 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            {barcodeNumber}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadQR}
            disabled={!qrSrc}
            className="flex items-center justify-center gap-1 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">Download</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={printQR}
            disabled={!qrSrc}
            className="flex items-center justify-center gap-1 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span className="text-xs">Print</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={shareCertificate}
            className="flex items-center justify-center gap-1 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className={`flex items-center justify-center gap-1 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full mt-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
          <Link2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate select-all w-full font-mono">
            {verificationLink}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
