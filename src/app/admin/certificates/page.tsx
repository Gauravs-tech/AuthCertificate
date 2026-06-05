'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { type Certificate } from '@/types'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  QrCode,
  ArrowUpDown,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCertificatesListPage() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  // State Management
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'date_applied' | 'applicant_name' | 'barcode_number'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch Certificates Query
  const { data: certificates = [], isLoading, error } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data || []
    },
  })

  // Delete Certificate Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success('Certificate deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
    },
    onError: (err: any) => {
      toast.error(`Error deleting certificate: ${err.message}`)
    },
  })

  // Event Handlers
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
      setDeleteId(null)
    }
  }

  // Filter & Sort Logic
  const filteredCertificates = certificates
    .filter((cert) => {
      const matchSearch =
        cert.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
        cert.barcode_number.toLowerCase().includes(search.toLowerCase()) ||
        cert.beneficiary_name.toLowerCase().includes(search.toLowerCase())
      
      const matchStatus = statusFilter === 'all' || cert.status === statusFilter

      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let valA = a[sortBy] || ''
      let valB = b[sortBy] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }
      return 0
    })

  // Pagination Logic
  const totalItems = filteredCertificates.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-250 flex items-center gap-1 w-fit rounded-full font-medium text-xs px-2.5 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            Approved
          </Badge>
        )
      case 'Pending':
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-250 flex items-center gap-1 w-fit rounded-full font-medium text-xs px-2.5 py-0.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Pending
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-250 flex items-center gap-1 w-fit rounded-full font-medium text-xs px-2.5 py-0.5">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title and Topbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Certificates Registry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage, search, edit, delete, and view QR verification links.
            </p>
          </div>
          <Link href="/admin/certificates/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm">
              <PlusCircle className="h-4.5 w-4.5" />
              New Certificate
            </Button>
          </Link>
        </div>

        {/* Main Card Wrapper */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by barcode, applicant, or beneficiary..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 text-xs border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Filters & Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/50 dark:bg-slate-950/40">
                  {['all', 'Approved', 'Pending', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status)
                        setCurrentPage(1)
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        statusFilter === status
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-950 dark:hover:text-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              // Loading State Skeletal
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : error ? (
              // Error Alert State
              <div className="p-8 text-center text-rose-500 text-xs font-semibold">
                Error loading certificates: {error.message}
              </div>
            ) : paginatedCertificates.length === 0 ? (
              // Empty Search Result
              <div className="p-16 text-center text-slate-500 text-xs">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                No certificates found matching the search criteria.
              </div>
            ) : (
              // Data Table
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                      <TableHead 
                        className="cursor-pointer hover:text-slate-950 dark:hover:text-slate-100"
                        onClick={() => handleSort('barcode_number')}
                      >
                        <div className="flex items-center gap-1 font-bold text-xs">
                          Barcode Number
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <span className="font-bold text-xs">Certificate Name</span>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-slate-950 dark:hover:text-slate-100"
                        onClick={() => handleSort('applicant_name')}
                      >
                        <div className="flex items-center gap-1 font-bold text-xs">
                          Applicant Name
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <span className="font-bold text-xs">Status</span>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-slate-950 dark:hover:text-slate-100"
                        onClick={() => handleSort('date_applied')}
                      >
                        <div className="flex items-center gap-1 font-bold text-xs">
                          Date Applied
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px] text-right">
                        <span className="font-bold text-xs">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCertificates.map((cert) => (
                      <TableRow key={cert.id} className="border-slate-100 dark:border-slate-800">
                        <TableCell className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                          {cert.barcode_number}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {cert.certificate_name}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          {cert.applicant_name}
                        </TableCell>
                        <TableCell>{getStatusBadge(cert.status)}</TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                          {formatDate(cert.date_applied)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer outline-hidden">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                              <Link href={`/admin/certificates/${cert.id}`}>
                                <DropdownMenuItem className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                  <Eye className="h-4 w-4 text-slate-400" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/certificates/${cert.id}/edit`}>
                                <DropdownMenuItem className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                  <Edit className="h-4 w-4 text-slate-400" />
                                  Edit Record
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/certificates/${cert.id}/qr`}>
                                <DropdownMenuItem className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                  <QrCode className="h-4 w-4 text-slate-400" />
                                  Generate QR
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator className="border-slate-100 dark:border-slate-850" />
                              <DropdownMenuItem
                                onClick={() => setDeleteId(cert.id)}
                                className="flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
            <div>
              Showing <span className="font-bold">{startIndex + 1}</span> to{' '}
              <span className="font-bold">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-bold">{totalItems}</span> certificates
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-8 border-slate-200 dark:border-slate-800 text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="flex items-center gap-1 px-2 font-semibold">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-8 border-slate-200 dark:border-slate-800 text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              This action cannot be undone. This will permanently delete the certificate record from the verification database registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 dark:border-slate-800 font-semibold cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
            >
              Delete Certificate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-855 bg-white/40 dark:bg-slate-950/20 mt-auto">
        MahaOnline Admin Console. Government of Maharashtra.
      </footer>
    </div>
  )
}
