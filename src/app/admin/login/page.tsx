'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Award, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message)
      } else {
        toast.success('Successfully logged in!')
        // Redirect to dashboard
        router.push('/admin/certificates')
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.')
      toast.error('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      
      {/* Tricolor Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

      {/* Back to Home Button */}
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Public Portal
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 bg-emerald-600 text-white rounded-xl items-center justify-center shadow-lg border border-emerald-500/30">
              <Award className="h-7 w-7 text-amber-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Admin Gateway</h2>
            <p className="text-xs text-slate-400 font-medium">
              Authorized personnel only. Please sign in to manage credentials.
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl text-slate-150">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-200">Sign In</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Enter your administrative email credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-rose-950/40 border border-rose-900 text-rose-300 text-xs p-3 rounded-lg font-medium">
                    {errorMsg === 'Invalid login credentials' 
                      ? 'The email or password you entered is incorrect.' 
                      : errorMsg}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-slate-355 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@mahaonline.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-950/60 border-slate-800 focus-visible:ring-emerald-500 focus-visible:ring-offset-slate-900 text-white"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs text-slate-355 font-medium">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-slate-950/60 border-slate-800 focus-visible:ring-emerald-500 focus-visible:ring-offset-slate-900 pr-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 mt-2 flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-950/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t border-slate-800/60 pt-4 flex flex-col gap-2 text-center text-[10px] text-slate-500">
              <p>IP Address & Session details are logged for auditing.</p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Portal Footer Reference */}
      <footer className="py-4 text-center text-[10px] text-slate-500 border-t border-slate-950 bg-slate-950/40">
        MahaOnline Verification Portal. Government of Maharashtra.
      </footer>
    </div>
  )
}
