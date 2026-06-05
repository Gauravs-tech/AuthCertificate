'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Award, LayoutDashboard, ListTodo, PlusCircle, LogOut, Menu, X, User } from 'lucide-react'
import { toast } from 'sonner'

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || 'Admin')
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Logged out successfully.')
        router.push('/admin/login')
        router.refresh()
      }
    } catch (err) {
      toast.error('Error logging out.')
    }
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/certificates', label: 'Certificates List', icon: ListTodo },
    { href: '/admin/certificates/new', label: 'Create Certificate', icon: PlusCircle },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow">
              <Award className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-slate-950 dark:text-white text-sm tracking-tight leading-none">
                Admin Console
              </div>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                MahaOnline System
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 transition-colors ${
                      isActive 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Stats & Logout */}
        <div className="hidden md:flex items-center gap-4">
          {userEmail && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[180px]">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate select-all">{userEmail}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-1.5 flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-600 dark:text-slate-350"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 shadow-inner">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  <span
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          
          <div className="border-t border-slate-150 dark:border-slate-800 pt-3 flex flex-col gap-2.5">
            {userEmail && (
              <div className="flex items-center gap-1.5 px-3 text-xs text-slate-500 dark:text-slate-400">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate font-mono">{userEmail}</span>
              </div>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center justify-center gap-1.5 font-bold"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
