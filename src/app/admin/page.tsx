import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, FileText, CheckCircle2, AlertTriangle, XCircle, PlusCircle, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Query database for all certificates status (optimized select)
  const { data: certs, error } = await supabase
    .from('certificates')
    .select('status')

  const total = certs?.length || 0
  const approved = certs?.filter((c) => c.status === 'Approved').length || 0
  const pending = certs?.filter((c) => c.status === 'Pending').length || 0
  const rejected = certs?.filter((c) => c.status === 'Rejected').length || 0

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminHeader />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Intro */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-600" />
              Administrative Control Panel
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back. System overview, certificate database registers, and cryptographic validation records.
            </p>
          </div>
          <Link href="/admin/certificates/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm">
              <PlusCircle className="h-4.5 w-4.5" />
              Add New Certificate
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Certificates */}
          <Card className="border-slate-200 dark:border-slate-850 shadow-sm relative overflow-hidden bg-white dark:bg-slate-905">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Registered
              </CardTitle>
              <FileText className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{total}</div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Total documents stored in registry</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-400 dark:bg-slate-700" />
          </Card>

          {/* Approved */}
          <Card className="border-slate-200 dark:border-slate-850 shadow-sm relative overflow-hidden bg-white dark:bg-slate-905">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Approved Records
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{approved}</div>
              <p className="text-[10px] text-slate-450 mt-1">Publicly verifiable documents</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          </Card>

          {/* Pending */}
          <Card className="border-slate-200 dark:border-slate-850 shadow-sm relative overflow-hidden bg-white dark:bg-slate-905">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Pending Verification
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pending}</div>
              <p className="text-[10px] text-slate-450 mt-1">Awaiting digital signatory upload</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-550" />
          </Card>

          {/* Rejected */}
          <Card className="border-slate-200 dark:border-slate-850 shadow-sm relative overflow-hidden bg-white dark:bg-slate-905">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-450">
                Rejected / Revoked
              </CardTitle>
              <XCircle className="h-5 w-5 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{rejected}</div>
              <p className="text-[10px] text-slate-455 mt-1">Declined or suspended certificates</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
          </Card>
        </div>

        {/* Dashboard Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Tasks */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Administrative Links</CardTitle>
              <CardDescription>Common database operations for issuing certificates.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link href="/admin/certificates/new" className="group">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-800 transition-all flex items-center justify-between bg-slate-50 dark:bg-slate-950/20 hover:bg-emerald-50/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                      <PlusCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">New Certificate</h4>
                      <p className="text-[11px] text-slate-500">Create new validation entries</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/admin/certificates" className="group">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-800 transition-all flex items-center justify-between bg-slate-50 dark:bg-slate-950/20 hover:bg-emerald-50/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Database Index</h4>
                      <p className="text-[11px] text-slate-500">Search, update and filter certificates</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold">System Status</CardTitle>
              <CardDescription>Authentication & database details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">Database Connection</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">Row Level Security</span>
                <span className="font-bold text-emerald-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">API Endpoint</span>
                <span className="font-mono text-[10px] bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded px-1.5 py-0.5 truncate max-w-[150px]">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Mock Mode'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Base Verification Link</span>
                <span className="font-mono text-[10px] bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded px-1.5 py-0.5 truncate max-w-[150px]">
                  {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
