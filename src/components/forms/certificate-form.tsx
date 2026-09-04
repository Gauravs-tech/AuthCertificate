'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { certificateSchema, type CertificateFormValues } from '@/lib/validations/certificate'
import { CERTIFICATE_NAMES, DESIGNATIONS, TALUKAS, DISTRICTS, STATUSES } from '@/constants'
import { formatToDatetimeLocal } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface CertificateFormProps {
  initialData?: Partial<CertificateFormValues>
  onSubmit: (data: CertificateFormValues) => void
  isLoading?: boolean
  submitButtonText?: string
}

export function CertificateForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Certificate',
}: CertificateFormProps) {
  // Format initialData date if needed
  const formattedInitialData = initialData
    ? {
        ...initialData,
        date_applied: formatToDatetimeLocal(initialData.date_applied),
      }
    : undefined

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: (formattedInitialData || {
      barcode_number: '',
      certificate_name: '',
      date_applied: formatToDatetimeLocal(),
      date_digitally_signed: false,
      applicant_name: '',
      beneficiary_name: '',
      designation_of_signatory: '',
      taluka_of_signatory: '',
      district_of_signatory: '',
      status: 'Pending',
    }) as any,
  })

  // Watch select values to bind with Shadcn Select
  const certificate_name = watch('certificate_name')
  const designation_of_signatory = watch('designation_of_signatory')
  const taluka_of_signatory = watch('taluka_of_signatory')
  const district_of_signatory = watch('district_of_signatory')
  const status = watch('status')
  const date_digitally_signed = watch('date_digitally_signed')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Certificate Information
          </CardTitle>
          <CardDescription>
            Enter the details of the issued certificate. Ensure all fields match the physical document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Barcode Number */}
            <div className="space-y-2">
              <Label htmlFor="barcode_number" className="text-slate-700 dark:text-slate-300 font-medium">
                Barcode Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="barcode_number"
                placeholder="e.g. 2640380019113200191600"
                className={`w-full ${errors.barcode_number ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
                {...register('barcode_number')}
              />
              {errors.barcode_number && (
                <p className="text-xs text-red-500 font-medium">{errors.barcode_number.message}</p>
              )}
            </div>

            {/* Certificate Name */}
            <div className="space-y-2">
              <Label htmlFor="certificate_name" className="text-slate-700 dark:text-slate-300 font-medium">
                Certificate Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={certificate_name || ''}
                onValueChange={(value) => setValue('certificate_name', value as any, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="certificate_name"
                  className={errors.certificate_name ? 'border-red-500 focus-visible:ring-red-400' : ''}
                >
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATE_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.certificate_name && (
                <p className="text-xs text-red-500 font-medium">{errors.certificate_name.message}</p>
              )}
            </div>

            {/* Date Applied On */}
            <div className="space-y-2">
              <Label htmlFor="date_applied" className="text-slate-700 dark:text-slate-300 font-medium">
                Date Applied On <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date_applied"
                type="datetime-local"
                step="60"
                className={`w-full ${errors.date_applied ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
                {...register('date_applied')}
              />
              {errors.date_applied && (
                <p className="text-xs text-red-500 font-medium">{errors.date_applied.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-700 dark:text-slate-300 font-medium">
                Verification Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status || ''}
                onValueChange={(value) => setValue('status', value as any, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="status"
                  className={errors.status ? 'border-red-500 focus-visible:ring-red-400' : ''}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500 font-medium">{errors.status.message}</p>
              )}
            </div>

            {/* Applicant Name */}
            <div className="space-y-2">
              <Label htmlFor="applicant_name" className="text-slate-700 dark:text-slate-300 font-medium">
                Applicant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicant_name"
                placeholder="Enter applicant full name"
                className={`w-full ${errors.applicant_name ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
                {...register('applicant_name')}
              />
              {errors.applicant_name && (
                <p className="text-xs text-red-500 font-medium">{errors.applicant_name.message}</p>
              )}
            </div>

            {/* Beneficiary Name */}
            <div className="space-y-2">
              <Label htmlFor="beneficiary_name" className="text-slate-700 dark:text-slate-300 font-medium">
                Beneficiary Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="beneficiary_name"
                placeholder="Enter beneficiary full name"
                className={`w-full ${errors.beneficiary_name ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
                {...register('beneficiary_name')}
              />
              {errors.beneficiary_name && (
                <p className="text-xs text-red-500 font-medium">{errors.beneficiary_name.message}</p>
              )}
            </div>

            {/* Designation of Signatory */}
            <div className="space-y-2">
              <Label htmlFor="designation_of_signatory" className="text-slate-700 dark:text-slate-300 font-medium">
                Designation Of Signatory <span className="text-red-500">*</span>
              </Label>
              <Select
                value={designation_of_signatory || ''}
                onValueChange={(value) => setValue('designation_of_signatory', value as any, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="designation_of_signatory"
                  className={errors.designation_of_signatory ? 'border-red-500 focus-visible:ring-red-400' : ''}
                >
                  <SelectValue placeholder="Select signatory designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map((desg) => (
                    <SelectItem key={desg} value={desg}>
                      {desg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.designation_of_signatory && (
                <p className="text-xs text-red-500 font-medium">{errors.designation_of_signatory.message}</p>
              )}
            </div>

            {/* District of Signatory */}
            <div className="space-y-2">
              <Label htmlFor="district_of_signatory" className="text-slate-700 dark:text-slate-300 font-medium">
                District Of Signatory <span className="text-red-500">*</span>
              </Label>
              <Select
                value={district_of_signatory || ''}
                onValueChange={(value) => setValue('district_of_signatory', value as any, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="district_of_signatory"
                  className={errors.district_of_signatory ? 'border-red-500 focus-visible:ring-red-400' : ''}
                >
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {dist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district_of_signatory && (
                <p className="text-xs text-red-500 font-medium">{errors.district_of_signatory.message}</p>
              )}
            </div>

            {/* Taluka of Signatory */}
            <div className="space-y-2">
              <Label htmlFor="taluka_of_signatory" className="text-slate-700 dark:text-slate-300 font-medium">
                Taluka Of Signatory <span className="text-red-500">*</span>
              </Label>
              <Select
                value={taluka_of_signatory || ''}
                onValueChange={(value) => setValue('taluka_of_signatory', value as any, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="taluka_of_signatory"
                  className={errors.taluka_of_signatory ? 'border-red-500 focus-visible:ring-red-400' : ''}
                >
                  <SelectValue placeholder="Select taluka" />
                </SelectTrigger>
                <SelectContent>
                  {TALUKAS.map((tal) => (
                    <SelectItem key={tal} value={tal}>
                      {tal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taluka_of_signatory && (
                <p className="text-xs text-red-500 font-medium">{errors.taluka_of_signatory.message}</p>
              )}
            </div>

            {/* Date Digitally Signed */}
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <Label htmlFor="date_digitally_signed" className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                Digital Signature
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="date_digitally_signed"
                  checked={date_digitally_signed}
                  onChange={(e) => setValue('date_digitally_signed', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label htmlFor="date_digitally_signed" className="text-slate-600 dark:text-slate-400 cursor-pointer font-normal">
                  Certificate is digitally signed by signatory
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
